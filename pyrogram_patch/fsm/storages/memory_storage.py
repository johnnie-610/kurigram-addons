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
import heapq
import logging
import time
from typing import Any, Dict, List, Optional, Tuple

from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.fsm.memory_storage")


class MemoryStorage(BaseStorage):
    """In-memory FSM storage.

    Intended for testing or small bots where persistence is not required.
    """

    def __init__(
        self, *, default_ttl: int = 0, cleanup_interval: float = 5.0
    ) -> None:
        self._default_ttl = int(default_ttl)
        self._data: Dict[str, Tuple[Dict[str, Any], Optional[float]]] = {}
        self._lock = asyncio.Lock()

        # Event-driven cleanup using priority queue
        # Format: (expiration_time, identifier)
        self._expiration_queue: List[Tuple[float, str]] = []
        self._cleanup_task: Optional[asyncio.Task] = None
        self._cleanup_event = asyncio.Event()

    async def start(self) -> None:
        if self._cleanup_task and not self._cleanup_task.done():
            return
        self._cleanup_task = asyncio.create_task(self._event_driven_cleanup())

    async def stop(self) -> None:
        if self._cleanup_task and not self._cleanup_task.done():
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        self._cleanup_task = None

    async def health(self) -> bool:
        """Check if storage is healthy."""
        return True

    async def _event_driven_cleanup(self) -> None:
        """Event-driven cleanup that only runs when items actually expire."""
        try:
            while True:
                if not self._expiration_queue:
                    await self._cleanup_event.wait()
                    self._cleanup_event.clear()
                    continue

                next_expiry, _ = self._expiration_queue[0]
                now = time.time()

                if next_expiry <= now:
                    await self._prune_expired()
                else:
                    sleep_time = max(0.1, next_expiry - now)
                    try:
                        await asyncio.wait_for(
                            self._cleanup_event.wait(), timeout=sleep_time
                        )
                        self._cleanup_event.clear()
                    except asyncio.TimeoutError:
                        await self._prune_expired()

        except asyncio.CancelledError:
            return

    async def _prune_expired(self) -> None:
        """Remove all expired items from the priority queue and data store."""
        now = time.time()
        expired_keys = []

        async with self._lock:
            while (
                self._expiration_queue and self._expiration_queue[0][0] <= now
            ):
                _, key = heapq.heappop(self._expiration_queue)
                if key in self._data:
                    expired_keys.append(key)

            for key in expired_keys:
                self._data.pop(key, None)
                logger.debug("Pruned expired key=%s", key)

    def _schedule_cleanup(
        self, identifier: str, expiry: Optional[float]
    ) -> None:
        """Schedule cleanup for an item with expiry time."""
        if expiry is not None:
            heapq.heappush(self._expiration_queue, (expiry, identifier))
            self._cleanup_event.set()

    async def set_state(
        self,
        identifier: str,
        state: Dict[str, Any],
        *,
        ttl: Optional[int] = None,
    ) -> None:
        ttl_use = self._default_ttl if ttl is None else int(ttl)
        exp = time.time() + ttl_use if ttl_use > 0 else None
        async with self._lock:
            self._data[identifier] = (state, exp)
            if exp is not None:
                self._schedule_cleanup(identifier, exp)

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
            if exp is not None:
                self._schedule_cleanup(identifier, exp)
            return True

    async def list_keys(self, pattern: str = "*") -> list[str]:
        import fnmatch

        async with self._lock:
            if pattern == "*":
                return list(self._data.keys())
            return [k for k in self._data if fnmatch.fnmatch(k, pattern)]

    async def clear_namespace(self) -> int:
        async with self._lock:
            count = len(self._data)
            self._data.clear()
            return count
