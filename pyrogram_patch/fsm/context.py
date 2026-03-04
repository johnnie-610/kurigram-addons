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
from typing import Any, Dict, Optional, Union, TYPE_CHECKING
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

    # state 
    async def set_state(self, state: Union[str, "State"], *, ttl: Optional[int] = None) -> None:
        """Set the FSM state."""
        from pyrogram_patch.fsm.states import State
        from pyrogram_patch.errors import InvalidStateTransition

        # Validation logic for State objects with transitions
        if isinstance(state, State) and state._group_cls:
            transitions = getattr(state._group_cls, "transitions", None)
            if transitions:
                current_state_str = await self.get_state()
                # Find current state object?
                # We only have string stored. We need to find if current string matches a state in the group.
                # If current_state_str is None (start), usually allowed?
                # Let's assume start is allowed unless restricted?
                # Usually transitions map: SourceState -> [TargetState]
                # If current is None, we check if target is allowed from None? Or maybe any state allows from None?
                
                # If current state is in the same group, we check transition.
                # If not, maybe we allow it (switching groups)? Or should we be strict?
                # For simplicity/safety: if we are in a state of this group, we enforce transition.
                
                if current_state_str:
                    # Check if current state belongs to this group
                    # We can iterate the group states to find one matching current_state_str
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
                                context={"current": str(current_state_obj), "target": str(state)}
                            )

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

    # combined 
    async def get_state_and_data(self) -> Optional[Dict[str, Any]]:
        """Return the full FSM state dict, or None if absent."""
        return await self._storage.get_state(self._id)
