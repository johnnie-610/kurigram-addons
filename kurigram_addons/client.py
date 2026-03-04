# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""KurigramClient — drop-in Pyrogram Client subclass.

Replaces the legacy ``patch(app)`` approach with a clean subclass that has
middleware, FSM, routing, and FloodWait handling built-in.

Example::

    from kurigram_addons import KurigramClient, MemoryStorage, Router

    router = Router()

    @router.on_message(filters.command("start"))
    async def start(client, message):
        await message.reply("Hello!")

    app = KurigramClient(
        "my_bot",
        api_id=...,
        api_hash="...",
        bot_token="...",
        storage=MemoryStorage(),
    )
    app.include_router(router)
    app.run()
"""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING, Any, Callable, List, Optional, TypeVar

from pyrogram import Client

from pyrogram_patch import errors
from pyrogram_patch.dispatcher import PatchedDispatcher
from pyrogram_patch.patch_data_pool import PatchDataPool, initialize_global_pool

if TYPE_CHECKING:
    from pyrogram_patch.fsm.base_storage import BaseStorage
    from pyrogram_patch.router.router import Router

    MiddlewareT = TypeVar("MiddlewareT", bound=Callable)
else:
    MiddlewareT = TypeVar("MiddlewareT", bound=Any)

logger = logging.getLogger("kurigram.client")


class KurigramClient(Client):
    """Pyrogram Client subclass with built-in middleware, FSM, and routing.

    This is the recommended way to use kurigram-addons. It replaces the
    legacy ``patch(app)`` approach with a cleaner API that configures
    everything at construction time.

    Args:
        name: Session name (same as ``pyrogram.Client``).
        storage: FSM storage backend (``MemoryStorage`` or ``RedisStorage``).
        auto_flood_wait: Automatically retry on ``FloodWait`` errors.
        max_flood_wait: Maximum seconds to wait before raising (default: 60).
        **kwargs: All other arguments forwarded to ``pyrogram.Client``.
    """

    def __init__(
        self,
        name: str,
        *,
        storage: Optional["BaseStorage"] = None,
        auto_flood_wait: bool = False,
        max_flood_wait: int = 60,
        **kwargs: Any,
    ) -> None:
        super().__init__(name, **kwargs)

        # Internal state
        self._pool: Optional[PatchDataPool] = None
        self._routers: list["Router"] = []
        self._storage = storage
        self._kurigram_initialized = False

        # FloodWait config
        self.auto_flood_wait = auto_flood_wait
        self.max_flood_wait = max_flood_wait

        # Lifecycle hooks
        self._startup_hooks: List[Callable] = []
        self._shutdown_hooks: List[Callable] = []

        logger.debug("KurigramClient '%s' created", name)

    async def _initialize_kurigram(self) -> None:
        """Initialize the patching subsystem (pool, dispatcher, storage).

        Called automatically on ``start()``. Safe to call multiple times.
        """
        if self._kurigram_initialized:
            return

        # Initialize pool
        self._pool = await initialize_global_pool(self)

        # Replace dispatcher, preserving existing handlers
        original_dispatcher = self.dispatcher
        patched_dispatcher = PatchedDispatcher(self)

        if original_dispatcher:
            patched_dispatcher.groups = original_dispatcher.groups
            patched_dispatcher.update_parsers = (
                original_dispatcher.update_parsers
            )

        self.dispatcher = patched_dispatcher
        self.dispatcher.patch_data_pool = self._pool

        # Set storage if provided
        if self._storage:
            self._pool.set_fsm_storage(self._storage)

        # Register any routers that were added before start()
        for router in self._routers:
            if not router.is_registered:
                router.set_client(self)

        self._kurigram_initialized = True
        logger.info("KurigramClient '%s' initialized", self.name)

    # ── Public API ──────────────────────────────────────────────

    def include_router(self, router: "Router") -> None:
        """Register a router with this client.

        Can be called before or after ``start()``. If the client is already
        running, handlers are registered immediately.

        Args:
            router: The Router instance to register.

        Raises:
            ValidationError: If *router* is not a ``Router`` instance.
        """
        from pyrogram_patch.router.router import Router as RouterClass

        if not isinstance(router, RouterClass):
            raise errors.ValidationError(
                field="router",
                value=type(router).__name__,
                reason="Expected a Router instance",
            )

        if router in self._routers:
            logger.warning("Router %r already registered, skipping", router)
            return

        self._routers.append(router)

        # If already initialized, register immediately
        if self._kurigram_initialized:
            router.set_client(self)

        logger.debug("Router %r included", router)

    def include_middleware(
        self,
        middleware: MiddlewareT,
        *,
        kind: str = "before",
        priority: int = 0,
    ) -> str:
        """Register a middleware.

        Args:
            middleware: The middleware callable.
            kind: ``'before'``, ``'after'``, or ``'around'``.
            priority: Execution priority (higher runs first).

        Returns:
            The middleware ID.

        Raises:
            PatchError: If the pool is not yet initialized.
        """
        if not self._pool:
            raise errors.PatchError(
                "Cannot add middleware before start(). "
                "Call include_middleware() after awaiting start(), "
                "or use a Router to declare handlers before start()."
            )

        return self._pool.include_middleware(
            middleware, kind=kind, priority=priority
        )

    async def set_storage(self, storage: "BaseStorage") -> None:
        """Set or replace the FSM storage backend.

        Can be called before ``start()`` (deferred) or after (immediate).

        Args:
            storage: A ``BaseStorage`` implementation.
        """
        self._storage = storage
        if self._pool:
            self._pool.set_fsm_storage(storage)

    def _ensure_default_router(self) -> "Router":
        """Get or create a default Router for conversation/menu handlers."""
        if not hasattr(self, "_default_router") or self._default_router is None:
            from pyrogram_patch.router.router import Router

            self._default_router = Router()
            self.include_router(self._default_router)
        return self._default_router

    def include_conversation(
        self, conversation_cls: type, **kwargs: Any
    ) -> None:
        """Include a Conversation class and register its handlers.

        Instantiates the conversation and registers its state handlers
        on a default internal router.

        Args:
            conversation_cls: A :class:`Conversation` subclass.
            **kwargs: Arguments passed to the conversation constructor.

        Example::

            app.include_conversation(Registration)
        """
        from kurigram_addons.conversation import Conversation

        if not (
            isinstance(conversation_cls, type)
            and issubclass(conversation_cls, Conversation)
        ):
            raise errors.ValidationError(
                field="conversation_cls",
                value=str(conversation_cls),
                reason="Expected a Conversation subclass",
            )

        instance = conversation_cls(**kwargs)
        router = self._ensure_default_router()
        instance.register_handlers(router)
        logger.info("Conversation '%s' included", conversation_cls.__name__)

    def include_menus(self, *menus: Any) -> None:
        """Register one or more Menu instances.

        Each menu's callback handlers are registered on a default
        internal router.

        Args:
            *menus: :class:`Menu` instances to register.

        Example::

            app.include_menus(main_menu, settings_menu)
        """
        from kurigram_addons.menu import Menu

        router = self._ensure_default_router()
        for menu in menus:
            if not isinstance(menu, Menu):
                raise errors.ValidationError(
                    field="menu",
                    value=type(menu).__name__,
                    reason="Expected a Menu instance",
                )
            menu.register_handlers(router)
            logger.info("Menu '%s' included", menu.name)

    async def start(
        self,
        *args: Any,
        **kwargs: Any,
    ) -> bool:
        """Start the client, initializing kurigram subsystems first."""
        try:
            await self._initialize_kurigram()
        except Exception as e:
            raise errors.PatchError(
                "KurigramClient initialization failed", cause=e
            ) from e

        result = await super().start(*args, **kwargs)

        # Execute startup hooks
        for hook in self._startup_hooks:
            try:
                await hook()
            except Exception:
                logger.warning("Startup hook %r failed", hook, exc_info=True)

        return result

    async def stop(self, *args: Any, **kwargs: Any) -> bool:
        """Stop the client and clean up kurigram resources."""
        # Execute shutdown hooks before cleanup
        for hook in self._shutdown_hooks:
            try:
                await hook()
            except Exception:
                logger.warning("Shutdown hook %r failed", hook, exc_info=True)

        try:
            result = await super().stop(*args, **kwargs)
        finally:
            # Cleanup
            if self._pool:
                try:
                    await self._pool.clear_all()
                except Exception:
                    logger.warning(
                        "Error during pool cleanup", exc_info=True
                    )
            self._kurigram_initialized = False
            logger.info("KurigramClient '%s' stopped", self.name)

        return result

    # ── Lifecycle hook decorators ────────────────────────────────

    def on_startup(self, func: Callable) -> Callable:
        """Register an async function to run after the client starts.

        Can be used as a decorator::

            @app.on_startup
            async def init_db():
                await database.connect()

        Args:
            func: Async callable (no arguments).

        Returns:
            The original function (unmodified).
        """
        self._startup_hooks.append(func)
        return func

    def on_shutdown(self, func: Callable) -> Callable:
        """Register an async function to run before the client stops.

        Can be used as a decorator::

            @app.on_shutdown
            async def close_db():
                await database.disconnect()

        Args:
            func: Async callable (no arguments).

        Returns:
            The original function (unmodified).
        """
        self._shutdown_hooks.append(func)
        return func

    # ── Convenience properties ──────────────────────────────────

    @property
    def pool(self) -> Optional[PatchDataPool]:
        """Access the underlying PatchDataPool (or None if not started)."""
        return self._pool

    def __repr__(self) -> str:
        status = "running" if self._kurigram_initialized else "idle"
        routers = len(self._routers)
        return (
            f"<KurigramClient name={self.name!r} "
            f"status={status} routers={routers}>"
        )
