# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Conversation handler — declarative FSM flows.

Build multi-step conversation flows by subclassing :class:`Conversation`
and defining :class:`ConversationState` descriptors with hooks.

Example::

    from kurigram import Conversation, ConversationState

    class Registration(Conversation):
        name = ConversationState(initial=True)
        age = ConversationState()
        confirm = ConversationState()

        @name.on_enter
        async def ask_name(self, ctx):
            await ctx.message.reply("What's your name?")

        @name.on_message
        async def save_name(self, ctx):
            await ctx.helper.update_data(name=ctx.message.text)
            await self.goto(ctx, self.age)

        @age.on_enter
        async def ask_age(self, ctx):
            await ctx.message.reply("How old are you?")

        @age.on_message
        async def save_age(self, ctx):
            if not ctx.message.text.isdigit():
                await ctx.message.reply("Please enter a number.")
                return
            await ctx.helper.update_data(age=int(ctx.message.text))
            await self.goto(ctx, self.confirm)

        @confirm.on_enter
        async def ask_confirm(self, ctx):
            data = await ctx.helper.get_data()
            await ctx.message.reply(
                f"Name: {data['name']}, Age: {data['age']}. Confirm? (yes/no)"
            )

        @confirm.on_message
        async def do_confirm(self, ctx):
            if ctx.message.text.lower() == "yes":
                await ctx.message.reply("Registration complete!")
                await self.finish(ctx)
            else:
                await ctx.message.reply("Cancelled.")
                await self.finish(ctx)

Usage::

    from kurigram import KurigramClient

    app = KurigramClient(...)
    app.include_conversation(Registration)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import (
    TYPE_CHECKING,
    Any,
    Callable,
    ClassVar,
    Dict,
    List,
    Optional,
    Type,
)

from pyrogram_patch.fsm.states import State, StatesGroup

if TYPE_CHECKING:
    from pyrogram import Client
    from pyrogram.types import CallbackQuery, Message

    from pyrogram_patch.patch_helper import PatchHelper

logger = logging.getLogger("kurigram.conversation")


# ── Context passed to all conversation hooks ────────────────────


@dataclass
class ConversationContext:
    """Context object passed to every conversation hook.

    Attributes:
        client: The Pyrogram client.
        message: The incoming message (None for callback-triggered hooks).
        callback_query: The incoming callback query (None for message hooks).
        helper: The PatchHelper (FSM context) for this chat.
        data: Shortcut to ``await helper.get_data()`` result (populated lazily).
    """

    client: "Client"
    message: Optional["Message"] = None
    callback_query: Optional["CallbackQuery"] = None
    helper: Optional["PatchHelper"] = None
    _data: Optional[Dict[str, Any]] = field(default=None, repr=False)

    @property
    def update(self) -> Any:
        """The raw update (message or callback query)."""
        return self.message or self.callback_query

    @property
    def chat_id(self) -> int:
        """The chat ID from the update."""
        if self.message:
            return self.message.chat.id
        if self.callback_query and self.callback_query.message:
            return self.callback_query.message.chat.id
        raise ValueError("No chat context available")

    @property
    def user_id(self) -> int:
        """The user ID from the update."""
        if self.message:
            return self.message.from_user.id
        if self.callback_query:
            return self.callback_query.from_user.id
        raise ValueError("No user context available")


# ── State descriptor ────────────────────────────────────────────


class ConversationState:
    """Descriptor for a conversation state with hook registration.

    Args:
        initial: If True, this is the entry state for the conversation.

    Example::

        class MyConversation(Conversation):
            greeting = ConversationState(initial=True)

            @greeting.on_enter
            async def ask(self, ctx):
                await ctx.message.reply("Hello!")
    """

    def __init__(self, *, initial: bool = False) -> None:
        self.initial = initial
        self._name: Optional[str] = None
        self._owner_name: Optional[str] = None

        # Hook registrations (method names, resolved at class creation)
        self._on_enter_name: Optional[str] = None
        self._on_message_name: Optional[str] = None
        self._on_callback_name: Optional[str] = None

    def __set_name__(self, owner: type, name: str) -> None:
        self._name = name
        self._owner_name = owner.__name__

    @property
    def state_string(self) -> str:
        """The FSM state string (e.g. 'Registration:name')."""
        return f"{self._owner_name}:{self._name}"

    # ── Hook decorators ─────────────────────────────────────────

    def on_enter(self, fn: Callable) -> Callable:
        """Decorator: called when transitioning INTO this state.

        The decorated function receives ``(self, ctx: ConversationContext)``.
        """
        fn._conversation_hook = ("on_enter", self._name)
        return fn

    def on_message(self, fn: Callable) -> Callable:
        """Decorator: called when a message arrives while IN this state.

        The decorated function receives ``(self, ctx: ConversationContext)``.
        """
        fn._conversation_hook = ("on_message", self._name)
        return fn

    def on_callback(self, fn: Callable) -> Callable:
        """Decorator: called when a callback query arrives while IN this state.

        The decorated function receives ``(self, ctx: ConversationContext)``.
        """
        fn._conversation_hook = ("on_callback", self._name)
        return fn

    def __repr__(self) -> str:
        return f"<ConversationState {self.state_string}>"


# ── Conversation metaclass ──────────────────────────────────────


class ConversationMeta(type):
    """Metaclass that collects ConversationState descriptors and hooks."""

    def __new__(
        mcs,
        name: str,
        bases: tuple,
        namespace: Dict[str, Any],
    ) -> "ConversationMeta":
        cls = super().__new__(mcs, name, bases, namespace)

        if name == "Conversation":
            return cls

        # Collect states
        states: Dict[str, ConversationState] = {}
        initial_state: Optional[ConversationState] = None

        for attr_name, attr_value in namespace.items():
            if isinstance(attr_value, ConversationState):
                attr_value.__set_name__(cls, attr_name)
                states[attr_name] = attr_value
                if attr_value.initial:
                    if initial_state is not None:
                        raise TypeError(
                            f"{name}: only one state may be initial=True, "
                            f"found both '{initial_state._name}' and "
                            f"'{attr_name}'"
                        )
                    initial_state = attr_value

        if not states:
            raise TypeError(
                f"{name}: conversation must define at least one "
                f"ConversationState"
            )

        if initial_state is None:
            raise TypeError(
                f"{name}: one ConversationState must have initial=True"
            )

        # Collect hooks from methods
        hooks: Dict[str, Dict[str, str]] = {
            s: {} for s in states
        }  # state_name -> {hook_type -> method_name}

        for attr_name, attr_value in namespace.items():
            hook_info = getattr(attr_value, "_conversation_hook", None)
            if hook_info:
                hook_type, state_name = hook_info
                if state_name is None:
                    # Hook was registered before __set_name__ resolved
                    # Find it by scanning
                    for sn, sv in states.items():
                        attr_hooks = [
                            a
                            for a in namespace.values()
                            if getattr(a, "_conversation_hook", (None,))[1]
                            == sn
                        ]
                        if attr_value in attr_hooks:
                            state_name = sn
                            break

                if state_name and state_name in hooks:
                    hooks[state_name][hook_type] = attr_name

        cls._conv_states = states
        cls._conv_initial = initial_state
        cls._conv_hooks = hooks

        logger.debug(
            "Conversation '%s' defined: states=%s, initial=%s",
            name,
            list(states.keys()),
            initial_state._name,
        )

        return cls


# ── Conversation base class ─────────────────────────────────────


class Conversation(metaclass=ConversationMeta):
    """Base class for declarative conversation flows.

    Subclass this and define :class:`ConversationState` attributes with
    hooks to build multi-step conversations.

    The class is instantiated once per inclusion and shared across all
    handlers. State is managed through the FSM storage, not instance
    variables.
    """

    # Populated by metaclass
    _conv_states: ClassVar[Dict[str, ConversationState]]
    _conv_initial: ClassVar[ConversationState]
    _conv_hooks: ClassVar[Dict[str, Dict[str, str]]]

    async def goto(
        self, ctx: ConversationContext, state: ConversationState
    ) -> None:
        """Transition to a new state and call its on_enter hook.

        Args:
            ctx: The current conversation context.
            state: The target ConversationState.
        """
        if state._name not in self._conv_states:
            raise ValueError(
                f"State '{state._name}' is not defined in "
                f"{self.__class__.__name__}"
            )

        # Set FSM state
        if ctx.helper:
            await ctx.helper.set_state(state.state_string)

        logger.debug(
            "%s: transition -> %s", self.__class__.__name__, state._name
        )

        # Call on_enter hook if defined
        hooks = self._conv_hooks.get(state._name, {})
        enter_method_name = hooks.get("on_enter")
        if enter_method_name:
            method = getattr(self, enter_method_name)
            await method(ctx)

    async def finish(self, ctx: ConversationContext) -> None:
        """End the conversation and clear FSM state + data.

        Args:
            ctx: The current conversation context.
        """
        if ctx.helper:
            await ctx.helper.finish()

        logger.debug("%s: finished", self.__class__.__name__)

    async def start(self, ctx: ConversationContext) -> None:
        """Start the conversation by entering the initial state.

        Args:
            ctx: The conversation context (from trigger handler).
        """
        await self.goto(ctx, self._conv_initial)

    def register_handlers(self, router: Any) -> None:
        """Register all conversation handlers on a Router.

        This is called automatically by ``app.include_conversation()``.
        For each state with an ``on_message`` or ``on_callback`` hook, a
        handler is registered on the router with a state filter.

        Args:
            router: A ``Router`` instance.
        """
        from pyrogram_patch.fsm.filter import StateFilter

        for state_name, state_obj in self._conv_states.items():
            hooks = self._conv_hooks.get(state_name, {})

            # Register on_message handler
            msg_method_name = hooks.get("on_message")
            if msg_method_name:
                method = getattr(self, msg_method_name)
                state_str = state_obj.state_string
                instance = self

                async def _msg_handler(
                    client: Any,
                    message: Any,
                    helper: Any,
                    _method: Callable = method,
                    _instance: "Conversation" = instance,
                ) -> None:
                    ctx = ConversationContext(
                        client=client, message=message, helper=helper
                    )
                    await _method(ctx)

                # Use state filter to only trigger in this state
                router.on_message(StateFilter(state_str))(
                    _msg_handler
                )
                logger.debug(
                    "Registered on_message for %s:%s",
                    self.__class__.__name__,
                    state_name,
                )

            # Register on_callback handler
            cb_method_name = hooks.get("on_callback")
            if cb_method_name:
                method = getattr(self, cb_method_name)
                state_str = state_obj.state_string
                instance = self

                async def _cb_handler(
                    client: Any,
                    callback_query: Any,
                    helper: Any,
                    _method: Callable = method,
                    _instance: "Conversation" = instance,
                ) -> None:
                    ctx = ConversationContext(
                        client=client,
                        callback_query=callback_query,
                        helper=helper,
                    )
                    await _method(ctx)

                router.on_callback_query(StateFilter(state_str))(
                    _cb_handler
                )
                logger.debug(
                    "Registered on_callback for %s:%s",
                    self.__class__.__name__,
                    state_name,
                )


__all__ = [
    "Conversation",
    "ConversationContext",
    "ConversationState",
]
