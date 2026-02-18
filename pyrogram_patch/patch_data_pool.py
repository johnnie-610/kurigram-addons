# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


from __future__ import annotations

import asyncio
import logging
import time
import weakref
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel
from pydantic import ValidationError as PydanticValidationError
from pyrogram import Client
from pyrogram.types import Update

import pyrogram_patch.patch_helper as ph
from pyrogram_patch.errors import MiddlewareError, PatchError, ValidationError
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.context_manager import FSMContextManager
from pyrogram_patch.middlewares.middleware_manager import MiddlewareManager
from pyrogram_patch.config import get_config

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
    _init_lock: Optional[asyncio.Lock] = None

    # Class attributes for basic implementation compatibility
    pyrogram_patch_outer_middlewares: list = []
    pyrogram_patch_middlewares: list = []
    pyrogram_patch_fsm_storage: Optional[BaseStorage] = None

    @classmethod
    async def get_instance(cls) -> "PatchDataPool":
        """Async get the singleton instance."""
        if cls._init_lock is None:
            cls._init_lock = asyncio.Lock()
            
        if cls._instance is None:
            async with cls._init_lock:
                if cls._instance is None:
                    cls._instance = PatchDataPool()
                    await cls._instance._initialize()
        return cls._instance

    async def _initialize(self) -> None:
        """Async initialization of pool structures."""
        config = get_config()
        self._helpers: Dict[str, PooledHelperData] = {}
        self._helper_refs: Dict[str, weakref.ReferenceType[ph.PatchHelper]] = {}
        self._middleware_manager = MiddlewareManager()
        self._fsm_storage: Optional[BaseStorage] = None
        self._fsm_manager: Optional[FSMContextManager] = None
        self._lock = asyncio.Lock()
        self._session_ttl = max(0.0, float(config.fsm.helper_session_ttl))
        self._persist_helpers = bool(config.fsm.persist_helpers)
        self._started_at = time.time()
        self._total_helpers_created = 0
        self._expired_helper_count = 0
        self._initialized = True

    def __init__(self) -> None:
        """Basic sync init (full async init in _initialize)."""
        self._initialized = False

    async def include_helper_to_pool(
        self,
        update: Update,
        helper: ph.PatchHelper,
        client: Optional[Client] = None,
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
            key = f"basic_{id(update)}"
        else:
            key = await ph.create_key(update, client)

        pooled_data = PooledHelperData(
            key=key, helper_id=id(helper), timestamp=time.time()
        )

        expired_helpers: List[Tuple[str, Optional[ph.PatchHelper]]]
        is_new_entry = False
        async with self._lock:
            expired_helpers = self._cleanup_expired_helpers_locked()
            existing_ref = self._helper_refs.get(key)
            is_new_entry = existing_ref is None or existing_ref() is None
            self._helpers[key] = pooled_data
            self._helper_refs[key] = weakref.ref(helper)
            if is_new_entry:
                self._total_helpers_created += 1

        await self._persist_expired_helpers(expired_helpers)

        if self._persist_helpers and is_new_entry:
            await self._restore_helper_snapshot(key, helper)

    def _session_storage_key(self, key: str) -> str:
        return f"helper:{key}"

    def _cleanup_expired_helpers_locked(
        self,
    ) -> List[Tuple[str, Optional[ph.PatchHelper]]]:
        if not self._session_ttl:
            return []

        now = time.time()
        expired: List[Tuple[str, Optional[ph.PatchHelper]]] = []
        keys_to_remove = [
            key
            for key, data in list(self._helpers.items())
            if now - data.timestamp >= self._session_ttl
        ]

        for key in keys_to_remove:
            ref = self._helper_refs.pop(key, None)
            helper = ref() if ref else None
            self._helpers.pop(key, None)
            expired.append((key, helper))
            self._expired_helper_count += 1

        return expired

    async def _persist_helper_snapshot(
        self, key: str, helper: Optional[ph.PatchHelper]
    ) -> None:
        if not self._persist_helpers or self._fsm_storage is None or helper is None:
            return

        try:
            snapshot = await helper.export_snapshot()
            payload = {
                "name": snapshot.state,
                "data": snapshot.data,
            }
            ttl = int(self._session_ttl) if self._session_ttl > 0 else None
            await self._fsm_storage.set_state(
                self._session_storage_key(key), payload, ttl=ttl
            )
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning(
                "Failed to persist helper snapshot for %s: %s", key, exc
            )

    async def _restore_helper_snapshot(
        self, key: str, helper: ph.PatchHelper
    ) -> None:
        if not self._persist_helpers or self._fsm_storage is None:
            return

        try:
            payload = await self._fsm_storage.get_state(
                self._session_storage_key(key)
            )
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning("Failed to load helper snapshot for %s: %s", key, exc)
            return

        if not payload:
            return

        try:
            snapshot = ph.PatchHelperData(
                state=str(payload.get("name", "*")),
                data=payload.get("data") or {},
            )
        except PydanticValidationError as exc:
            logger.debug("Invalid helper snapshot for %s: %s", key, exc)
            return

        await helper.apply_snapshot(snapshot)

    async def _persist_expired_helpers(
        self, expired: List[Tuple[str, Optional[ph.PatchHelper]]]
    ) -> None:
        if not expired or not self._persist_helpers:
            return

        for key, helper in expired:
            await self._persist_helper_snapshot(key, helper)

    async def exclude_helper_from_pool(
        self, update: Update, client: Optional[Client] = None
    ) -> bool:
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
            key = f"basic_{id(update)}"
        else:
            key = await ph.create_key(update, client)

        helper: Optional[ph.PatchHelper] = None
        expired_helpers: List[Tuple[str, Optional[ph.PatchHelper]]]
        async with self._lock:
            expired_helpers = self._cleanup_expired_helpers_locked()
            ref = self._helper_refs.pop(key, None)
            helper = ref() if ref else None
            removed = key in self._helpers
            if removed:
                self._helpers.pop(key, None)

        await self._persist_expired_helpers(expired_helpers)
        if removed:
            await self._persist_helper_snapshot(key, helper)
        return removed

    async def get_helper_from_pool(
        self, update: Update, client: Client
    ) -> ph.PatchHelper:
        """
        Get a PatchHelper from the pool or create a new one.

        Args:
            update: The Pyrogram update object.
            client: The Pyrogram client instance.

        Returns:
            PatchHelper: The pooled or new helper instance.
        """
        key = await ph.create_key(update, client)
        helper: Optional[ph.PatchHelper]
        created = False
        expired_helpers: List[Tuple[str, Optional[ph.PatchHelper]]]
        async with self._lock:
            expired_helpers = self._cleanup_expired_helpers_locked()
            ref = self._helper_refs.get(key)
            helper = ref() if ref else None
            if helper is None:
                helper = ph.PatchHelper(fsm_storage=self._fsm_storage)
                self._helper_refs[key] = weakref.ref(helper)
                created = True
                self._total_helpers_created += 1
            pooled_data = PooledHelperData(
                key=key, helper_id=id(helper), timestamp=time.time()
            )
            self._helpers[key] = pooled_data

        await self._persist_expired_helpers(expired_helpers)

        if created and self._persist_helpers:
            await self._restore_helper_snapshot(key, helper)

        return helper

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
                expected="BaseStorage subclass",
            )
        self._fsm_storage = storage
        # Initialize FSMContextManager
        self._fsm_manager = FSMContextManager(storage)
        # Update class attribute for dispatcher compatibility
        self.__class__.pyrogram_patch_fsm_storage = storage

    async def get_fsm_storage(self) -> Optional[BaseStorage]:
        """Get the current FSM storage."""
        return self._fsm_storage

    async def get_statistics(self) -> Dict[str, Any]:
        """Return operational statistics for the helper pool."""

        async with self._lock:
            now = time.time()
            active = len(self._helpers)
            oldest_age = 0.0
            if self._helpers:
                oldest_age = max(
                    now - data.timestamp for data in self._helpers.values()
                )

            return {
                "active_helpers": active,
                "session_ttl": self._session_ttl,
                "persist_helpers": self._persist_helpers,
                "uptime": now - self._started_at,
                "expired_helpers": self._expired_helper_count,
                "total_helpers_created": self._total_helpers_created,
                "oldest_helper_age": oldest_age,
            }

    # Middleware integration
    async def add_middleware(
        self, middleware: Any, kind: str = "before", priority: int = 0
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
            return await self._middleware_manager.add_around(
                middleware, priority=priority
            )
        elif kind == "before":
            return await self._middleware_manager.add_before(
                middleware, priority=priority
            )
        elif kind == "after":
            return await self._middleware_manager.add_after(
                middleware, priority=priority
            )
        else:
            raise MiddlewareError(f"Invalid middleware kind: {kind}")



    # Lifecycle Events
    async def add_listener(self, event: str, fn: Callable) -> None:
        """Register a lifecycle listener via middleware manager."""
        await self._middleware_manager.add_listener(event, fn)

    async def trigger_event(self, event: str, *args, **kwargs) -> None:
        """Trigger a lifecycle event."""
        await self._middleware_manager.fire_event(event, *args, **kwargs)

    async def clear_all(self) -> None:
        """Clear all pool state: middlewares, helpers, and FSM storage.

        Used during unpatch() to fully clean up the pool.
        """
        async with self._lock:
            self._middleware_manager._middlewares.clear()
            self._middleware_manager._listeners["startup"].clear()
            self._middleware_manager._listeners["shutdown"].clear()
            self._helpers.clear()
            self.__class__.pyrogram_patch_outer_middlewares.clear()
            self.__class__.pyrogram_patch_middlewares.clear()
            self.__class__.pyrogram_patch_fsm_storage = None
            logger.info("PatchDataPool cleared all state")



# Global pool initialization
global_pool: Optional[PatchDataPool] = None


async def initialize_global_pool(
    client: Optional[Client] = None,
) -> PatchDataPool:
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
