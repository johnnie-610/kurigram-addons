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
from typing import Any, Optional, Sequence, Union

from pyrogram_patch import errors
from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm.states import State

logger = logging.getLogger("pyrogram_patch.fsm.filter")


def _resolve_client(update: Any) -> Any:
    """Try to extract the Pyrogram client from an update object.

    Checks ``update._client``, then ``update.message._client``.

    Returns:
        The client or ``None``.
    """
    client = getattr(update, "_client", None)
    if client is not None:
        return client

    msg = getattr(update, "message", None)
    if msg is not None:
        return getattr(msg, "_client", None)

    return None


def _resolve_identifier(
    update: Any,
    identifier_getter: Optional[callable] = None,
) -> str:
    """Resolve an FSM context identifier from an update.

    Falls through: ``identifier_getter`` → ``update.chat`` → ``update.message.chat``
    → ``update.from_user`` → ``"global"``.

    Args:
        update: The Pyrogram update object.
        identifier_getter: Optional user-supplied callable.

    Returns:
        An identifier string such as ``"chat:12345"`` or ``"global"``.
    """
    if identifier_getter:
        return identifier_getter(update)

    # 1) Try direct chat attribute (works for CallbackQuery, etc.)
    chat = getattr(update, "chat", None)
    if chat is not None:
        chat_id = getattr(chat, "id", None)
        if chat_id is not None:
            return f"chat:{chat_id}"

    # 2) Try message.chat
    msg = getattr(update, "message", None) or (
        update.get("message") if isinstance(update, dict) else None
    )
    if msg is not None:
        chat = getattr(msg, "chat", None) or (
            msg.get("chat") if isinstance(msg, dict) else None
        )
        if chat is not None:
            chat_id = getattr(chat, "id", None)
            if chat_id is None and isinstance(chat, dict):
                chat_id = chat.get("id")
            if chat_id is not None:
                return f"chat:{chat_id}"

    # 3) Try from_user
    user = getattr(update, "from_user", None)
    if user is not None:
        user_id = getattr(user, "id", None)
        if user_id is not None:
            return f"user:{user_id}"

    return "global"


async def _get_current_state(
    update: Any,
    storage: Any = None,
    identifier_getter: Optional[callable] = None,
    client: Optional[Any] = None,
) -> Optional[str]:
    """Resolve the current FSM state for an update.

    Tries three strategies in order:
    1. FSMContextManager via the global pool.
    2. PatchHelper from the pool (fallback).
    3. Direct storage access (last resort).

    Returns:
        The state name string, ``None`` if no state is set, or raises on fatal error.
    """
    # Strategy 1: FSMContextManager via global pool
    if client is None:
        client = _resolve_client(update)
        
    if client is not None:
        try:
            from pyrogram_patch.patch_data_pool import initialize_global_pool

            pool = await initialize_global_pool(client)
            if pool._fsm_manager:
                ctx = await pool._fsm_manager.from_update(update)
                raw = await ctx.get_state()
                return str(raw) if raw is not None else None
        except Exception:
            pass

    # Strategy 2: PatchHelper from pool
    if client is not None:
        try:
            from pyrogram_patch.patch_helper import PatchHelper

            helper = await PatchHelper.get_from_pool(update, client)
            state = helper.state
            return None if state in ("*", None) else str(state)
        except Exception:
            pass

    # Strategy 3: Direct storage
    if storage is not None:
        identifier = _resolve_identifier(update, identifier_getter)
        ctx = FSMContext(storage, identifier)
        raw = await ctx.get_state()
        if raw is None:
            return None
        return raw.get("name") if isinstance(raw, dict) else str(raw)

    return None


class CombinedFilter:
    """Combined filter that supports multiple filters with &."""

    def __init__(self, *filters):
        self.filters = filters

    def __and__(self, other):
        return CombinedFilter(*self.filters, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        for filter_obj in self.filters:
            if hasattr(filter_obj, "__call__"):
                try:
                    if not await filter_obj(client, update):
                        return False
                except TypeError:
                    # If it's a sync filter, call without await
                    if not filter_obj(update):
                        return False
            else:
                # Assume it's a Pyrogram filter
                if not filter_obj(update):
                    return False
        return True


class StateFilter:
    """Filter that passes if the FSM state matches the expected value."""

    def __init__(
        self,
        expected: Union[str, State],
        *,
        storage: Any = None,
        identifier_getter: Optional[callable] = None,
    ) -> None:
        self.expected = str(expected)
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            current = await _get_current_state(
                update, self.storage, self.identifier_getter, client
            )
            return current is not None and current == self.expected
        except errors.PyrogramPatchError:
            raise
        except Exception:
            logger.debug("StateFilter failed", exc_info=True)
            return False


class AnyStateFilter:
    """Filter that passes if the FSM state is in the given list."""

    def __init__(
        self,
        expected_states: Sequence[Union[str, State]],
        *,
        storage: Any = None,
        identifier_getter: Optional[callable] = None,
    ) -> None:
        self.expected = {str(s) for s in expected_states}
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            current = await _get_current_state(
                update, self.storage, self.identifier_getter, client
            )
            return current is not None and current in self.expected
        except Exception:
            logger.debug("AnyStateFilter failed", exc_info=True)
            return False


class NoStateFilter:
    """Filter that passes if no FSM state is currently set."""

    def __init__(
        self,
        *,
        storage: Any = None,
        identifier_getter: Optional[callable] = None,
    ) -> None:
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            current = await _get_current_state(
                update, self.storage, self.identifier_getter, client
            )
            return current is None
        except Exception:
            logger.debug("NoStateFilter failed", exc_info=True)
            return False
