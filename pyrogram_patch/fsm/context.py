# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

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

    # ---- state ----
    async def set_state(self, state: str, *, ttl: Optional[int] = None) -> None:
        """Set the FSM state."""
        state_str = str(state)
        current_state = await self._storage.get_state(self._id) or {
            "name": None,
            "data": {},
        }
        await self._storage.set_state(
            self._id,
            {"name": state_str, "data": current_state["data"]},
            ttl=ttl,
        )

    async def get_state(self) -> Optional[str]:
        """Return the current state name, or None if not set."""
        state = await self._storage.get_state(self._id)
        return state.get("name") if state else None

    async def clear_state(self) -> bool:
        """Clear the FSM state and data."""
        return await self._storage.delete_state(self._id)

    # ---- data ----
    async def update_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Update the FSM data and return the new dict."""
        state: dict = await self._storage.get_state(self._id) or {
            "name": None,
            "data": {},
        }
        dt: dict = state["data"]
        dt.update(kwargs)
        logger.debug(
            "Updated FSM data for identifier %s with %d keys",
            self._id,
            len(kwargs),
        )
        await self._storage.set_state(self._id, state)
        return dt

    async def get_data(self) -> Dict[str, Any]:
        """Return the FSM data dict (empty if not set)."""
        state = await self._storage.get_state(self._id)
        return state.get("data", {}) if state else {}

    async def clear_data(self) -> None:
        """Clear FSM data but keep current state."""
        state = await self._storage.get_state(self._id)
        if not state:
            return
        state["data"] = {}
        await self._storage.set_state(self._id, state)

    # ---- combined ----
    async def get_state_and_data(self) -> Optional[Dict[str, Any]]:
        """Return the full FSM state dict, or None if absent."""
        return await self._storage.get_state(self._id)
