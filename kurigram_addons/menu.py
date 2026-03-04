# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Menu system — persistent navigation with auto back-button.

Build menu trees declaratively. The framework handles rendering,
callback routing, and edit-in-place navigation.

Example::

    from kurigram_addons import Menu

    main_menu = Menu("main", text="Main Menu")
    main_menu.button("👤 Profile", goto="profile")
    main_menu.button("⚙️ Settings", goto="settings")
    main_menu.button("📊 Stats", callback=show_stats)

    settings_menu = Menu("settings", text="Settings", parent=main_menu)
    settings_menu.button("🔔 Notifications", callback=toggle_notif)
    settings_menu.button("🌐 Language", callback=pick_lang)

    app.include_menus(main_menu, settings_menu)

    # Send the menu:
    @router.on_command("menu")
    async def open_menu(client, message):
        await main_menu.send(message)
"""

from __future__ import annotations

import logging
from typing import (
    TYPE_CHECKING,
    Any,
    Callable,
    Coroutine,
    Dict,
    List,
    Optional,
    Union,
)

if TYPE_CHECKING:
    from pyrogram.types import CallbackQuery, Message

logger = logging.getLogger("kurigram.menu")

# Callback data prefix for menu navigation
_MENU_PREFIX = "menu:"


class MenuButton:
    """A single button in a menu.

    Args:
        text: Button display text.
        callback: Async function called when pressed.
        goto: Name of another menu to navigate to.
        url: External URL (opens browser).
    """

    def __init__(
        self,
        text: str,
        *,
        callback: Optional[Callable[..., Coroutine]] = None,
        goto: Optional[str] = None,
        url: Optional[str] = None,
    ) -> None:
        if sum(x is not None for x in (callback, goto, url)) != 1:
            raise ValueError(
                "MenuButton must have exactly one of: callback, goto, url"
            )
        self.text = text
        self.callback = callback
        self.goto = goto
        self.url = url


class Menu:
    """A declarative menu with auto-routing and edit-in-place navigation.

    Args:
        name: Unique identifier for this menu.
        text: Message text displayed above the keyboard.
        parent: Parent menu (enables automatic "← Back" button).
        columns: Number of button columns (default: 2).
        back_text: Text for the back button (default: "← Back").
    """

    # Global registry of all menus (WeakValueDictionary so menus are
    # garbage-collected when no longer referenced, preventing cross-test leaks).
    _registry: Dict[str, "Menu"] = {}

    def __init__(
        self,
        name: str,
        *,
        text: str = "",
        parent: Optional["Menu"] = None,
        columns: int = 2,
        back_text: str = "← Back",
    ) -> None:
        # Allow overwriting if the previous entry was garbage-collected
        existing = self._registry.get(name)
        if existing is not None and existing is not self:
            raise ValueError(f"Menu with name '{name}' already exists")

        self.name = name
        self.text = text or name.title()
        self.parent = parent
        self.columns = columns
        self.back_text = back_text
        self._buttons: List[MenuButton] = []

        Menu._registry[name] = self
        logger.debug("Menu '%s' created (parent=%s)", name, parent and parent.name)

    def __del__(self) -> None:
        """Remove this menu from the registry on garbage collection."""
        try:
            if self._registry.get(self.name) is self:
                del self._registry[self.name]
        except Exception:
            pass

    def button(
        self,
        text: str,
        *,
        callback: Optional[Callable[..., Coroutine]] = None,
        goto: Optional[str] = None,
        url: Optional[str] = None,
    ) -> "Menu":
        """Add a button to this menu.

        Args:
            text: Button label.
            callback: Async handler function.
            goto: Menu name to navigate to on press.
            url: External URL to open.

        Returns:
            Self for chaining.
        """
        self._buttons.append(
            MenuButton(text, callback=callback, goto=goto, url=url)
        )
        return self

    def build_keyboard(self) -> Any:
        """Build an InlineKeyboard for this menu.

        Returns:
            An ``InlineKeyboard`` instance ready to send.
        """
        from pykeyboard import InlineButton, InlineKeyboard

        keyboard = InlineKeyboard(row_width=self.columns)
        row: List[InlineButton] = []

        for btn in self._buttons:
            if btn.goto:
                ib = InlineButton(
                    btn.text,
                    callback_data=f"{_MENU_PREFIX}{btn.goto}",
                )
            elif btn.callback:
                # Use menu:name:action pattern for callback buttons
                cb_name = getattr(btn.callback, "__name__", "action")
                ib = InlineButton(
                    btn.text,
                    callback_data=f"{_MENU_PREFIX}{self.name}:{cb_name}",
                )
            elif btn.url:
                ib = InlineButton(btn.text, url=btn.url)
            else:
                continue

            row.append(ib)

            if len(row) >= self.columns:
                keyboard.add(*row)
                row = []

        if row:
            keyboard.add(*row)

        # Auto back-button
        if self.parent:
            keyboard.add(
                InlineButton(
                    self.back_text,
                    callback_data=f"{_MENU_PREFIX}{self.parent.name}",
                )
            )

        return keyboard

    async def send(self, message: "Message", **kwargs: Any) -> "Message":
        """Send this menu as a new message.

        Args:
            message: The message to reply to.
            **kwargs: Extra arguments for ``reply``.

        Returns:
            The sent message.
        """
        return await message.reply(
            self.text,
            reply_markup=self.build_keyboard(),
            **kwargs,
        )

    async def edit(
        self, target: Union["Message", "CallbackQuery"], **kwargs: Any
    ) -> None:
        """Edit an existing message to show this menu.

        Args:
            target: A Message to edit, or a CallbackQuery (edits its message).
            **kwargs: Extra arguments for ``edit_message_text``.
        """
        from pyrogram.types import CallbackQuery as CQ

        if isinstance(target, CQ):
            await target.edit_message_text(
                self.text,
                reply_markup=self.build_keyboard(),
                **kwargs,
            )
        else:
            await target.edit_text(
                self.text,
                reply_markup=self.build_keyboard(),
                **kwargs,
            )

    def register_handlers(self, router: Any) -> None:
        """Register callback query handlers on a Router.

        Handles:
        - Navigation (goto) buttons: edit message to target menu.
        - Action (callback) buttons: call the handler function.

        Args:
            router: A ``Router`` instance.
        """
        # Navigation handler for this menu (other menus navigating TO this one)
        nav_data = f"{_MENU_PREFIX}{self.name}"
        menu_ref = self

        async def _nav_handler(client: Any, query: "CallbackQuery") -> None:
            await menu_ref.edit(query)
            await query.answer()

        router.on_callback(nav_data)(_nav_handler)

        # Action button handlers
        for btn in self._buttons:
            if btn.callback:
                cb_name = getattr(btn.callback, "__name__", "action")
                action_data = f"{_MENU_PREFIX}{self.name}:{cb_name}"
                fn = btn.callback

                async def _action_handler(
                    client: Any,
                    query: "CallbackQuery",
                    _fn: Callable = fn,
                ) -> None:
                    await _fn(client, query)

                router.on_callback(action_data)(_action_handler)

        logger.debug(
            "Menu '%s' registered %d handlers", self.name, len(self._buttons)
        )

    @classmethod
    def get(cls, name: str) -> Optional["Menu"]:
        """Look up a menu by name."""
        return cls._registry.get(name)

    @classmethod
    def clear_registry(cls) -> None:
        """Clear all registered menus (useful for testing)."""
        cls._registry.clear()

    def __repr__(self) -> str:
        return (
            f"<Menu name={self.name!r} buttons={len(self._buttons)} "
            f"parent={self.parent and self.parent.name!r}>"
        )


__all__ = ["Menu", "MenuButton"]
