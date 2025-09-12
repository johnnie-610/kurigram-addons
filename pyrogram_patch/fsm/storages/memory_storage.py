# pyrogram_patch/fsm/storages/memory_storage.py
from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Dict, Optional

from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch import errors

logger = logging.getLogger("pyrogram_patch.fsm.memory_storage")


class MemoryStorage(BaseStorage):
    """In-memory FSM storage with async API.

    Intended for testing or small bots where persistence is not required.
    """

    def __init__(self, *, default_ttl: int = 0, cleanup_interval: float = 5.0) -> None:
        self._default_ttl = int(default_ttl)
        self._data: Dict[str, tuple[Dict[str, Any], Optional[float]]] = {}
        self._lock = asyncio.Lock()
        self._cleanup_interval = cleanup_interval
        self._cleanup_task: Optional[asyncio.Task] = None

    # ---- lifecycle ----
    async def start(self) -> None:
        if self._cleanup_task and not self._cleanup_task.done():
            return
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())

    async def stop(self) -> None:
        if self._cleanup_task and not self._cleanup_task.done():
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        self._cleanup_task = None

    async def _cleanup_loop(self) -> None:
        try:
            while True:
                await asyncio.sleep(self._cleanup_interval)
                await self._prune()
        except asyncio.CancelledError:
            return

    async def _prune(self) -> None:
        now = time.time()
        async with self._lock:
            expired = [k for k, (_, exp) in self._data.items() if exp is not None and exp <= now]
            for k in expired:
                self._data.pop(k, None)
                logger.debug("Pruned expired key=%s", k)

    # ---- API ----
    async def set_state(self, identifier: str, state: Dict[str, Any], *, ttl: Optional[int] = None) -> None:
        ttl_use = self._default_ttl if ttl is None else int(ttl)
        exp = time.time() + ttl_use if ttl_use > 0 else None
        async with self._lock:
            self._data[identifier] = (state, exp)

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        async with self._lock:
            entry = self._data.get(identifier)
            if not entry:
                return None
            state, exp = entry
            if exp and exp <= time.time():
                self._data.pop(identifier, None)
                return None
            return state

    async def delete_state(self, identifier: str) -> bool:
        async with self._lock:
            return self._data.pop(identifier, None) is not None

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        ttl_use = self._default_ttl if ttl is None else int(ttl)
        exp = time.time() + ttl_use if ttl_use > 0 else None
        async with self._lock:
            entry = self._data.get(identifier)
            if expected_state is None:
                if entry is not None:
                    return False
            else:
                current, _ = entry if entry else (None, None)
                if current != expected_state:
                    return False
            self._data[identifier] = (new_state, exp)
            return True

    async def list_keys(self, pattern: str = "*") -> list[str]:
        await self._prune()
        async with self._lock:
            return list(self._data.keys())

    async def clear_namespace(self) -> int:
        async with self._lock:
            count = len(self._data)
            self._data.clear()
            return count
