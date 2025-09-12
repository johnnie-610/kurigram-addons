from __future__ import annotations

import asyncio
import time
import logging
import weakref
from typing import Any, Dict, Optional

from pydantic import BaseModel

from pyrogram.types import Update
from pyrogram import Client

from pyrogram_patch.errors import PatchError, MiddlewareError
import pyrogram_patch.patch_helper as ph
from pyrogram_patch.middlewares.middleware_manager import MiddlewareManager
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.context_manager import FSMContextManager

logger = logging.getLogger("pyrogram_patch.patch_data_pool")

class PooledHelperData(BaseModel):
    """Pydantic model for pooled helper metadata validation."""
    key: str
    helper_id: int  # ID of the helper for reference
    timestamp: float


class PatchDataPool:
    """
    Singleton for managing pooled data, helpers, middlewares, and FSM storage.

    This class provides async-safe global management for update processing,
    integrating with MiddlewareManager and BaseStorage. It handles helper pooling,
    middleware registration, and storage configuration with proper locking.

    Example:
        >>> from pyrogram_patch import patch
        >>> from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
        >>> from pyrogram_patch.patch_data_pool import initialize_global_pool
        >>>
        >>> app = Client("my_account")
        >>> manager = patch(app)
        >>> storage = MemoryStorage()
        >>> manager.set_storage(storage)
        >>> pool = await initialize_global_pool()
        >>> await pool.add_middleware(my_middleware)
    """

    _instance: Optional["PatchDataPool"] = None
    _init_lock = asyncio.Lock()

    # Class attributes for basic implementation compatibility
    pyrogram_patch_outer_middlewares: list = []
    pyrogram_patch_middlewares: list = []
    pyrogram_patch_fsm_storage: Optional[BaseStorage] = None


    @classmethod
    async def get_instance(cls) -> "PatchDataPool":
        """Async get the singleton instance."""
        if cls._instance is None:
            async with cls._init_lock:
                if cls._instance is None:
                    cls._instance = PatchDataPool()
                    await cls._instance._initialize()
        return cls._instance

    async def _initialize(self) -> None:
        """Async initialization of pool structures."""
        self._helpers: Dict[str, PooledHelperData] = {}
        self._helper_refs: Dict[str, weakref.ReferenceType[PatchHelper]] = {}
        self._middleware_manager = MiddlewareManager()
        self._fsm_storage: Optional[BaseStorage] = None
        self._fsm_manager: Optional[FSMContextManager] = None
        self._lock = asyncio.Lock()
        self._initialized = True

    def __init__(self) -> None:
        """Basic sync init (full async init in _initialize)."""
        self._initialized = False

    async def include_helper_to_pool(
        self,
        update: Update,
        helper: ph.PatchHelper,
        client: Optional[Client]=None
    ) -> None:
        """
        Include a PatchHelper in the pool for the given update.

        Args:
            update: The Pyrogram update object.
            helper: The PatchHelper instance to pool.
            client: The Pyrogram client instance (can be None for basic compatibility).

        Raises:
            LockError: If pool lock cannot be acquired.
            PatchError: If helper already pooled for key.
        """
        if client is None:
            # For basic implementation compatibility, create a dummy key
            key = f"basic_{id(update)}"
        else:
            key = await ph.create_key(update, client)
        pooled_data = PooledHelperData(
            key=key,
            helper_id=id(helper),
            timestamp=time.time()
        )
        async with self._lock:
            if key in self._helpers:
                # Update existing entry instead of raising error
                self._helpers[key] = pooled_data
                self._helper_refs[key] = weakref.ref(helper)
            else:
                # Add new entry
                self._helpers[key] = pooled_data
                self._helper_refs[key] = weakref.ref(helper)

    async def exclude_helper_from_pool(self, update: Update, client: Optional[Client]=None) -> bool:
        """
        Remove a PatchHelper from the pool.

        Args:
            update: The Pyrogram update object.
            client: The Pyrogram client instance (can be None for basic compatibility).

        Returns:
            bool: True if helper was removed, False if not found.

        Raises:
            LockError: If pool lock cannot be acquired.
        """
        if client is None:
            # For basic implementation compatibility, create a dummy key
            key = f"basic_{id(update)}"
        else:
            key = await ph.create_key(update, client)
        async with self._lock:
            if key in self._helpers:
                del self._helpers[key]
                self._helper_refs.pop(key, None)
                return True
            return False

    async def get_helper_from_pool(self, update: Update, client: Client) -> ph.PatchHelper:
        """
        Get a PatchHelper from the pool or create a new one.

        Args:
            update: The Pyrogram update object.
            client: The Pyrogram client instance.

        Returns:
            PatchHelper: The pooled or new helper instance.
        """
        key = await ph.create_key(update, client)
        async with self._lock:
            ref = self._helper_refs.get(key)
            if ref and (helper := ref()) is not None:
                return helper
            # Create new helper
            new_helper = ph.PatchHelper()
            self._helper_refs[key] = weakref.ref(new_helper)
            pooled_data = PooledHelperData(
                key=key,
                helper_id=id(new_helper),
                timestamp=time.time()
            )
            self._helpers[key] = pooled_data
            return new_helper

    def set_fsm_storage(self, storage: BaseStorage) -> None:
        """
        Set the FSM storage backend.

        Args:
            storage: The BaseStorage implementation.

        Raises:
            ValidationError: If storage is not a BaseStorage subclass.
        """
        if not isinstance(storage, BaseStorage):
            raise ValidationError(
                field="storage",
                value=type(storage).__name__,
                expected="BaseStorage subclass"
            )
        self._fsm_storage = storage
        # Initialize FSMContextManager
        self._fsm_manager = FSMContextManager(storage)
        # Update class attribute for dispatcher compatibility
        self.__class__.pyrogram_patch_fsm_storage = storage

    async def get_fsm_storage(self) -> Optional[BaseStorage]:
        """Get the current FSM storage."""
        return self._fsm_storage

    # Middleware integration
    async def add_middleware(
        self,
        middleware: Any,
        kind: str = "before",
        priority: int = 0
    ) -> str:
        """
        Add middleware via the integrated manager.

        Args:
            middleware: The middleware callable.
            kind: Type of middleware ('before', 'after', 'around').
            priority: Execution priority (higher first).

        Returns:
            str: The middleware ID.

        Raises:
            MiddlewareError: If middleware kind is invalid.
            ValueError: If middleware is not callable.
        """
        if not callable(middleware):
            raise ValueError("Middleware must be callable")
        if kind == "around":
            return await self._middleware_manager.add_around(middleware, priority=priority)
        elif kind == "before":
            return await self._middleware_manager.add_before(middleware, priority=priority)
        elif kind == "after":
            return await self._middleware_manager.add_after(middleware, priority=priority)
        else:
            raise MiddlewareError(f"Invalid middleware kind: {kind}")

    async def remove_middleware(self, mid: str) -> bool:
        """Remove middleware by ID.

        Args:
            mid: The middleware ID.

        Returns:
            bool: True if removed, False if not found.
        """
        return await self._middleware_manager.remove(mid)

    async def chain_middlewares(self, core_handler: Any) -> Any:
        """
        Chain all registered middlewares around the core handler.

        Args:
            core_handler: The core handler callable (async def handler(update)).

        Returns:
            Wrapped handler with middleware chain.

        Raises:
            MiddlewareError: If chaining configuration is invalid.
        """
        # Compose around middlewares (higher priority first)
        around_mids = sorted(
            [m for m in self._middleware_manager._middlewares if m.kind == "around"],
            key=lambda x: (-x.priority, self._middleware_manager._middlewares.index(x))  # Higher priority first
        )

        current = core_handler
        for mid in around_mids:
            current = mid.fn(current)

        async def wrapped(update: Update):
            await current(update)

        return wrapped

    async def execute_before_middlewares(self, update: Update, client: Client = None, patch_helper: 'ph.PatchHelper' = None) -> None:
        """Execute before middlewares in priority order."""
        before_mids = sorted(
            [m for m in self._middleware_manager._middlewares if m.kind == "before"],
            key=lambda x: (-x.priority, self._middleware_manager._middlewares.index(x))
        )
        for mid in before_mids:
            # Try to call with different signatures to support various middleware types
            try:
                if patch_helper is not None and client is not None:
                    await mid.fn(update, client, patch_helper)
                elif client is not None:
                    await mid.fn(update, client)
                else:
                    await mid.fn(update)
            except TypeError as e:
                # If signature doesn't match, try with just update
                if "positional arguments" in str(e):
                    await mid.fn(update)
                else:
                    raise

    async def execute_after_middlewares(self, update: Update) -> None:
        """Execute after middlewares in priority order."""
        after_mids = sorted(
            [m for m in self._middleware_manager._middlewares if m.kind == "after"],
            key=lambda x: (-x.priority, self._middleware_manager._middlewares.index(x))
        )
        for mid in after_mids:
            await mid.fn(update)


# Global pool initialization
global_pool: Optional[PatchDataPool] = None

async def initialize_global_pool(client: Optional[Client] = None) -> PatchDataPool:
    """Async initialization of the global pool.

    Args:
        client: Optional client for context (future use).

    Returns:
        PatchDataPool: The initialized global pool.

    Raises:
        PatchError: If initialization fails.
    """
    global global_pool
    if global_pool is None:
        try:
            global_pool = await PatchDataPool.get_instance()
        except Exception as e:
            raise PatchError("Failed to initialize global pool", cause=e) from e
    return global_pool