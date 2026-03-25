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
import copy
import heapq
import logging
import time
from typing import Any, Dict, List, Optional, Tuple

from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.fsm.memory_storage")


class MemoryStorage(BaseStorage):
    """In-memory FSM storage.

    Intended for testing or small bots where persistence is not required.

    Expiry design
    -------------
    The priority queue holds ``(expiry_time, identifier)`` tuples.  Because
    we cannot cheaply remove entries from a heapq, we use a *tombstone*
    dictionary ``_current_expiry`` that maps each live key to its current
    expiry timestamp.  When ``_prune_expired`` pops a heap entry it compares
    the popped expiry against ``_current_expiry[key]``:

    * Equal   → the entry is the live one; delete the key.
    * Missing or different → the key was renewed or deleted since the heap
      entry was pushed; it is a ghost/stale entry — discard silently.

    This means ``delete_state()``, ``set_state()`` (renewal), and CAS
    overwrites never leak heap memory: the old entries become inert ghosts
    that evaporate harmlessly when they reach the top of the heap.
    """

    def __init__(
        self, *, default_ttl: int = 0, cleanup_interval: float = 5.0
    ) -> None:
        self._default_ttl = int(default_ttl)
        # Maps identifier → (state_dict, expiry_timestamp_or_None)
        self._data: Dict[str, Tuple[Dict[str, Any], Optional[float]]] = {}
        self._lock = asyncio.Lock()

        # Priority queue: (expiry_time, identifier)
        self._expiration_queue: List[Tuple[float, str]] = []
        # Tombstone table: identifier → current active expiry.
        # An entry in _expiration_queue is live only if its expiry time
        # matches _current_expiry[identifier] exactly.
        self._current_expiry: Dict[str, float] = {}

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
        """Remove expired keys using tombstone matching.

        A heap entry is only acted upon when its expiry time exactly matches
        the value in ``_current_expiry`` for that key.  Stale entries from
        renewals or deletions are discarded silently.
        """
        now = time.time()
        async with self._lock:
            while (
                self._expiration_queue and self._expiration_queue[0][0] <= now
            ):
                exp_time, key = heapq.heappop(self._expiration_queue)
                active_exp = self._current_expiry.get(key)
                if active_exp is None or active_exp != exp_time:
                    # Ghost/stale entry — key was renewed or deleted; skip.
                    continue
                # This is the live entry for this key — expire it.
                self._data.pop(key, None)
                del self._current_expiry[key]
                logger.debug("Pruned expired key=%s", key)

    def _schedule_cleanup(self, identifier: str, expiry: float) -> None:
        """Push a heap entry and record it as the current active expiry."""
        heapq.heappush(self._expiration_queue, (expiry, identifier))
        self._current_expiry[identifier] = expiry
        self._cleanup_event.set()

    def _cancel_expiry(self, identifier: str) -> None:
        """Remove the active expiry record for a key without touching the heap.

        The corresponding heap entry becomes a ghost and will be silently
        discarded by ``_prune_expired`` when it eventually fires.
        """
        self._current_expiry.pop(identifier, None)

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
            self._data[identifier] = (copy.deepcopy(state), exp)
            if exp is not None:
                self._schedule_cleanup(identifier, exp)
            else:
                # Key renewed without TTL — cancel any previous expiry.
                self._cancel_expiry(identifier)

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        async with self._lock:
            entry = self._data.get(identifier)
            if not entry:
                return None
            state, exp = entry
            if exp is not None and exp <= time.time():
                self._data.pop(identifier, None)
                self._cancel_expiry(identifier)
                return None
            # Return a deep copy so callers cannot mutate the stored state.
            # This is critical for compare_and_set correctness: if the caller
            # modifies the returned dict and passes it as expected_state, the
            # CAS check would be comparing an object to itself — always equal —
            # destroying the optimistic locking guarantee.
            return copy.deepcopy(state)

    async def delete_state(self, identifier: str) -> bool:
        async with self._lock:
            existed = self._data.pop(identifier, None) is not None
            if existed:
                # Remove from tombstone table so the old heap entry becomes
                # a ghost and will not cause a spurious deletion when it fires.
                self._cancel_expiry(identifier)
            return existed

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
            self._data[identifier] = (copy.deepcopy(new_state), exp)
            if exp is not None:
                # Overwriting the key: the old heap entry becomes a ghost
                # because _schedule_cleanup updates _current_expiry.
                self._schedule_cleanup(identifier, exp)
            else:
                self._cancel_expiry(identifier)
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
            self._current_expiry.clear()
            # The heap entries are now all ghosts; let them drain naturally.
            # Clearing the heap list too avoids unbounded memory if clear_namespace
            # is called frequently.
            self._expiration_queue.clear()
            return count

    async def increment(
        self,
        identifier: str,
        amount: int = 1,
        *,
        ttl: Optional[int] = None,
    ) -> int:
        """Atomically increment a counter stored at *identifier*.

        Counters are stored as plain integers in a separate dict
        (``_counters``) so they never collide with FSM state dicts.
        The asyncio lock guarantees atomicity within a single process.
        """
        ttl_use = self._default_ttl if ttl is None else int(ttl)
        exp = time.time() + ttl_use if ttl_use > 0 else None

        async with self._lock:
            if not hasattr(self, "_counters"):
                self._counters: Dict[str, Tuple[int, Optional[float]]] = {}

            entry = self._counters.get(identifier)
            if entry is not None:
                current, stored_exp = entry
                # Respect existing expiry if no new TTL given
                if exp is None:
                    exp = stored_exp
            else:
                current = 0

            new_value = current + amount
            self._counters[identifier] = (new_value, exp)

            if exp is not None:
                self._schedule_cleanup(identifier + "__ctr__", exp)

            return new_value
