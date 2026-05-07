# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


import logging
from typing import TYPE_CHECKING, Any, Callable, TypeVar

from pyrogram import Client

from pyrogram_patch import errors
from pyrogram_patch.dispatcher import PatchedDispatcher
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.patch_data_pool import PatchDataPool, initialize_global_pool, reset_global_pool
from pyrogram_patch.router import Router

if TYPE_CHECKING:
    from .middlewares.middleware_manager import MiddlewareManager

    MiddlewareT = TypeVar("MiddlewareT", bound=Callable)
else:
    MiddlewareT = TypeVar("MiddlewareT", bound=Any)

logger = logging.getLogger("pyrogram_patch.patch")


class PatchManager:
    """Manages patching of Pyrogram client with integrated pool and managers.

    This class provides an async interface to initialize the patch system,
    register middlewares via the pool manager, configure FSM storage, and
    include routers with validation.

    Example:
        >>> import asyncio
        >>> from pyrogram import Client
        >>> from pyrogram_patch import patch
        >>> from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
        >>>
        >>> async def main():
        ...     app = Client("my_account")
        ...     manager = await patch(app)
        ...     storage = MemoryStorage()
        ...     await manager.set_storage(storage)
        ...     router = Router()
        ...     manager.include_router(router)
        ...     await app.start()
    """

    def __init__(self, client: Client, pool: PatchDataPool) -> None:
        """Initialize the PatchManager with client and pool.

        Args:
            client: The Pyrogram client instance.
            pool: The initialized PatchDataPool instance.

        Raises:
            PatchError: If client or pool is invalid.
        """
        if not isinstance(client, Client):
            raise errors.PatchError("Invalid client type")
        if not isinstance(pool, PatchDataPool):
            raise errors.PatchError("Invalid pool instance")

        self.client = client
        self.dispatcher: PatchedDispatcher = client.dispatcher
        self._pool = pool

    async def include_middleware(
        self, middleware: MiddlewareT, kind: str = "before", priority: int = 0
    ) -> str:
        """Register middleware via the pool manager.

        Args:
            middleware: The middleware callable.
            kind: Middleware type ('before', 'after', 'around').
            priority: Execution priority (higher first).

        Returns:
            str: The middleware ID.

        Raises:
            MiddlewareError: If middleware is invalid or kind unsupported.
            PatchError: If pool access fails.
        """
        try:
            return await self._pool.add_middleware(
                middleware, kind=kind, priority=priority
            )
        except Exception as e:
            raise errors.MiddlewareError(
                "Failed to register middleware", cause=e
            ) from e

    # Deprecated: outer middlewares replaced by priority system
    async def include_outer_middleware(
        self, middleware: MiddlewareT, priority: int = 100
    ) -> str:
        """Register high-priority 'before' middleware (deprecated).

        Args:
            middleware: The middleware callable.
            priority: High priority value (default: 100).

        Returns:
            str: The middleware ID.

        Note:
            This method is deprecated. Use include_middleware(kind='before', priority=100) instead.
        """
        import warnings

        warnings.warn(
            "include_outer_middleware is deprecated; use include_middleware(kind='before', priority=100) instead",
            DeprecationWarning,
            stacklevel=2,
        )
        return await self.include_middleware(
            middleware, kind="before", priority=priority
        )

    async def set_storage(self, storage: BaseStorage) -> None:
        """Set the FSM storage backend via the pool.

        Args:
            storage: The BaseStorage implementation.

        Raises:
            ValidationError: If storage is not a BaseStorage subclass.
            PatchError: If pool storage setting fails.
        """
        try:
            self._pool.set_fsm_storage(storage)
        except Exception as e:
            raise errors.PatchError("Failed to set FSM storage", cause=e) from e

    def include_router(self, router: Router) -> None:
        """Register and validate a router with the client.

        Args:
            router: The Router instance to register.

        Raises:
            ValidationError: If router is not a Router instance.
            PatchError: If router already registered or client setting fails.
        """
        if not isinstance(router, Router):
            raise errors.ValidationError(
                field="router", value=type(router).__name__, expected="Router"
            )

        # Initialize routers list if it doesn't exist
        if not hasattr(self.client, "routers"):
            self.client.routers = []

        # Check if this router is already registered
        if router in self.client.routers:
            raise errors.PatchError("Router already registered")

        try:
            router.set_client(self.client)
            self.client.routers.append(router)
        except Exception as e:
            raise errors.PatchError("Failed to register router", cause=e) from e

    async def unpatch(self) -> None:
        """Unpatch the client and clean up resources."""
        await unpatch(self.client)

    async def __aenter__(self) -> "PatchManager":
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        await self.unpatch()

    def __repr__(self) -> str:
        """String representation of PatchManager."""
        return f"<PatchManager client={self.client!r} pool={self._pool!r}>"


async def patch(app: Client) -> PatchManager:
    """Async apply patches to a Pyrogram client and initialize pool.

    .. deprecated::
        ``patch()`` / ``unpatch()`` are deprecated in favour of
        :class:`kurigram_addons.KurigramClient`, which handles all
        initialisation, storage lifecycle, and cleanup automatically::

            from kurigram_addons import KurigramClient, MemoryStorage

            app = KurigramClient(
                "my_bot",
                api_id=...,
                api_hash="...",
                storage=MemoryStorage(),
            )
            app.run()

        ``patch()`` will be removed in the next major version.

    Args:
        app: The Pyrogram Client instance to patch.

    Returns:
        PatchManager: Configured manager instance.

    Raises:
        TypeError: If app is not a Client.
        PatchError: If client already patched or initialization fails.
    """
    import warnings
    warnings.warn(
        "patch() is deprecated and will be removed in the next major version. "
        "Use KurigramClient instead: "
        "https://johnnie-610.github.io/kurigram-addons/getting-started",
        DeprecationWarning,
        stacklevel=2,
    )
    if not isinstance(app, Client):
        raise TypeError(f"Expected Client instance, got {type(app).__name__}")

    if getattr(app, "_patched", False):
        raise errors.PatchError("This client has already been patched")

    try:
        # Initialize pool first
        pool = await initialize_global_pool(app)

        # Replace dispatcher
        original_dispatcher = app.dispatcher
        patched_dispatcher = PatchedDispatcher(app)
        
        # Migrate existing handlers and parsers from original dispatcher
        # This ensures that handlers registered via global decorators BEFORE patch()
        # are preserved and correctly handled by the new dispatcher.
        if original_dispatcher:
            patched_dispatcher.groups = original_dispatcher.groups
            patched_dispatcher.update_parsers = original_dispatcher.update_parsers
        
        app.dispatcher = patched_dispatcher
        app.dispatcher.patch_data_pool = pool
        app._original_dispatcher = original_dispatcher
        app._patched = True
        app._pool = pool  # Store reference

        return PatchManager(app, pool)
    except Exception as e:
        raise errors.PatchError("Patch initialization failed", cause=e) from e


async def unpatch(app: Client) -> None:
    """Async revert patches and clean up pool/resources.

    .. deprecated::
        Use :class:`kurigram_addons.KurigramClient` instead of
        ``patch()`` / ``unpatch()``.  ``unpatch()`` will be removed in the
        next major version.

    Args:
        app: The Pyrogram Client to unpatch.

    Raises:
        RuntimeError: If client not patched.
        PatchError: If cleanup fails (original dispatcher missing or pool issues).
    """
    import warnings
    warnings.warn(
        "unpatch() is deprecated and will be removed in the next major version. "
        "Use KurigramClient instead.",
        DeprecationWarning,
        stacklevel=2,
    )
    if not getattr(app, "_patched", False):
        raise RuntimeError("This client has not been patched")

    if not hasattr(app, "_original_dispatcher"):
        raise errors.PatchError("Original dispatcher not found for cleanup")

    try:
        # Restore dispatcher
        app.dispatcher = app._original_dispatcher

        # Clean pool if accessible
        if hasattr(app, "_pool") and app._pool:
            await app._pool.clear_all()

        # Reset the module-level singleton so that a subsequent patch() call
        # creates a completely fresh pool rather than reusing the cleared one.
        reset_global_pool()

        # Final cleanup
        del app._original_dispatcher
        del app._patched
        if hasattr(app, "_pool"):
            del app._pool
    except Exception as e:
        raise errors.PatchError("Unpatch cleanup failed", cause=e) from e
