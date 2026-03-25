# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import logging
from typing import Any, Callable, Dict, List, Optional, Union, TYPE_CHECKING
if TYPE_CHECKING:
    from pyrogram_patch.fsm.states import State

from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.fsm.context")


class FSMContext:
    """Finite State Machine context bound to a specific identifier.

    This is the main interface developers will use to manage state and data.

    Example:
        ctx = FSMContext(storage, f"chat:{chat_id}")
        await ctx.set_state("Registration:name")
        await ctx.update_data(username="alice")
        state = await ctx.get_state()   # "Registration:name"
        data = await ctx.get_data()     # {"username": "alice"}
    """

    def __init__(self, storage: BaseStorage, identifier: str) -> None:
        self._storage = storage
        self._id = identifier

    # ── helpers ──────────────────────────────────────────────────

    _CAS_RETRIES = 10  # max optimistic retries before raising

    async def _cas_update(
        self,
        transform,
        ttl: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Apply *transform(current_doc) → new_doc* atomically via CAS.

        Reads the current state doc, applies *transform*, then attempts
        a compare-and-set.  Retries up to ``_CAS_RETRIES`` times on
        contention (another writer changed the doc between read and write).

        This eliminates the TOCTOU race present in the original
        read-modify-write pattern used by ``update_data``, ``set_state``,
        and ``clear_data``.

        Raises:
            FSMTransitionError: if all retries are exhausted.
        """
        from pyrogram_patch.errors import FSMTransitionError

        for attempt in range(self._CAS_RETRIES):
            current = await self._storage.get_state(self._id)
            expected = current  # may be None (key absent)
            new_doc = transform(
                current if current is not None else {"name": None, "data": {}}
            )
            ok = await self._storage.compare_and_set(
                self._id,
                new_doc,
                expected_state=expected,
                ttl=ttl,
            )
            if ok:
                return new_doc
            logger.debug(
                "CAS contention on %s (attempt %d/%d)",
                self._id, attempt + 1, self._CAS_RETRIES,
            )

        raise FSMTransitionError(
            f"Failed to update FSM state for '{self._id}' after "
            f"{self._CAS_RETRIES} retries — high write contention.",
            context={"identifier": self._id},
        )

    # ── state ────────────────────────────────────────────────────

    async def set_state(
        self,
        state: Union[str, "State"],
        *,
        ttl: Optional[int] = None,
    ) -> None:
        """Set the FSM state, preserving existing data.

        Uses a CAS loop so concurrent writers for the same identifier
        do not overwrite each other's data sub-field.
        """
        from pyrogram_patch.fsm.states import State
        from pyrogram_patch.errors import InvalidStateTransition

        # Validate allowed transitions when the State carries a transition map.
        if isinstance(state, State) and state._group_cls:
            transitions = getattr(state._group_cls, "transitions", None)
            if transitions:
                current_state_str = await self.get_state()
                if current_state_str:
                    current_state_obj = None
                    for s in state._group_cls:
                        if str(s) == current_state_str:
                            current_state_obj = s
                            break
                    if current_state_obj:
                        allowed = transitions.get(current_state_obj, [])
                        if state not in allowed:
                            raise InvalidStateTransition(
                                f"Transition from {current_state_obj} to {state} is not allowed",
                                context={
                                    "current": str(current_state_obj),
                                    "target": str(state),
                                },
                            )

        state_str = str(state)

        def _set(doc: Dict[str, Any]) -> Dict[str, Any]:
            return {"name": state_str, "data": doc.get("data", {})}

        await self._cas_update(_set, ttl=ttl)

    async def get_state(self) -> Optional[str]:
        """Return the current state name, or None if not set."""
        doc = await self._storage.get_state(self._id)
        return doc.get("name") if doc else None

    async def clear_state(self) -> bool:
        """Clear the FSM state and data."""
        return await self._storage.delete_state(self._id)

    # ── data ─────────────────────────────────────────────────────

    async def update_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Merge *kwargs* into the FSM data dict and return the new dict.

        Uses a CAS loop to prevent the TOCTOU race that arises when two
        concurrent handlers for the same user call update_data() at the
        same time: without CAS, both read the same doc, apply different
        changes to separate in-memory copies, and the last writer silently
        discards the first writer's changes.
        """
        def _update(doc: Dict[str, Any]) -> Dict[str, Any]:
            new_data = {**doc.get("data", {}), **kwargs}
            return {"name": doc.get("name"), "data": new_data}

        new_doc = await self._cas_update(_update)
        logger.debug(
            "Updated FSM data for identifier %s with %d keys",
            self._id, len(kwargs),
        )
        return new_doc["data"]

    async def get_data(self) -> Dict[str, Any]:
        """Return the FSM data dict (empty if not set)."""
        doc = await self._storage.get_state(self._id)
        return doc.get("data", {}) if doc else {}

    async def clear_data(self) -> None:
        """Clear FSM data but keep the current state name.

        Uses a CAS loop so the state name is not lost under concurrent writes.
        """
        def _clear(doc: Dict[str, Any]) -> Dict[str, Any]:
            return {"name": doc.get("name"), "data": {}}

        await self._cas_update(_clear)

    # ── combined ─────────────────────────────────────────────────

    async def get_state_and_data(self) -> Optional[Dict[str, Any]]:
        """Return the full FSM state dict, or None if absent."""
        return await self._storage.get_state(self._id)

    # ── history ──────────────────────────────────────────────────

    _HISTORY_KEY_SUFFIX = "__history__"
    _HISTORY_MAX = 50  # hard cap to prevent unbounded growth

    def _history_id(self) -> str:
        return f"{self._id}{self._HISTORY_KEY_SUFFIX}"

    async def push_history(self, state_name: str, *, ttl: Optional[int] = None) -> None:
        """Append *state_name* to the transition history ring-buffer."""
        import time as _time
        entry = {"state": state_name, "at": _time.time()}
        history_id = self._history_id()

        for _ in range(self._CAS_RETRIES):
            current = await self._storage.get_state(history_id)
            # Copy the list before appending so that mutating `entries` does
            # not also mutate `current` (which is used as expected_state in
            # the CAS call below).  Without the copy the CAS always fails
            # after the first entry because expected_state already contains
            # the new entry by the time compare_and_set reads the stored doc.
            existing = list((current or {}).get("data", {}).get("entries", []))
            existing.append(entry)
            existing = existing[-self._HISTORY_MAX:]
            new_doc = {"name": "__history__", "data": {"entries": existing}}
            if await self._storage.compare_and_set(
                history_id, new_doc, expected_state=current, ttl=ttl
            ):
                return

    async def get_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Return the *limit* most recent state transitions.

        Each entry is a dict with keys ``"state"`` (the state name string)
        and ``"at"`` (a Unix timestamp float).

        Example::

            history = await ctx.get_history(limit=5)
            for h in history:
                print(h["state"], h["at"])

        Args:
            limit: Maximum number of entries to return (default: 10).

        Returns:
            List of ``{"state": str, "at": float}`` dicts, newest last.
        """
        doc = await self._storage.get_state(self._history_id())
        if not doc:
            return []
        entries = doc.get("data", {}).get("entries", [])
        return entries[-limit:]

    async def clear_history(self) -> None:
        """Delete the state transition history for this identifier."""
        await self._storage.delete_state(self._history_id())
