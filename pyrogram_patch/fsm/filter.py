# pyrogram_patch/fsm/filter.py
from __future__ import annotations

import logging
from typing import Any, Optional, Sequence, Union

from pyrogram_patch import errors
from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm.states import State

logger = logging.getLogger("pyrogram_patch.fsm.filter")


class StateFilter:
    """Filter that passes if the FSM state matches the expected value."""

    def __init__(self, expected: Union[str, State], *, storage: Any = None, identifier_getter: Optional[callable] = None) -> None:
        self.expected = str(expected)
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            # Try the new FSMContextManager approach first
            try:
                from pyrogram_patch.patch_data_pool import initialize_global_pool
                from pyrogram import Client
                # Get client from update if possible
                client = getattr(update, '_client', None)
                if client is None:
                    # Try to get from message
                    msg = getattr(update, 'message', None)
                    if msg and hasattr(msg, '_client'):
                        client = msg._client
                if client:
                    pool = await initialize_global_pool(client)
                    if pool._fsm_manager:
                        ctx = await pool._fsm_manager.from_update(update)
                        current_state = await ctx.get_state()
                        return self.expected == str(current_state) if current_state else False
            except Exception:
                pass

            # Fallback to pool-based approach
            try:
                from pyrogram_patch.patch_helper import PatchHelper
                helper = PatchHelper.get_from_pool(update)
                current_state = str(helper.state)
                return self.expected == current_state
            except Exception:
                pass

            # Fallback to storage-based approach
            if self.storage:
                identifier = self._resolve_identifier(update)
                ctx = FSMContext(self.storage, identifier)
                state = await ctx.get_state()
                if not state:
                    return False
                return state.get("name") == self.expected
            return False
        except errors.PyrogramPatchError:
            raise
        except Exception as e:
            logger.debug("StateFilter failed", exc_info=True)
            return False

    def _resolve_identifier(self, update: Any) -> str:
        if self.identifier_getter:
            return self.identifier_getter(update)

        # Default: try chat id
        msg = getattr(update, "message", None) or (update.get("message") if isinstance(update, dict) else None)
        chat = getattr(msg, "chat", None) or (msg.get("chat") if isinstance(msg, dict) else None)
        if chat:
            return f"chat:{getattr(chat, 'id', None) or chat.get('id')}"
        return "global"


class CombinedFilter:
    """Combined filter that supports multiple filters with &."""

    def __init__(self, *filters):
        self.filters = filters

    def __and__(self, other):
        return CombinedFilter(*self.filters, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        for filter_obj in self.filters:
            if hasattr(filter_obj, '__call__'):
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

class AnyStateFilter:
    """Filter that passes if the FSM state is in the given list."""

    def __init__(self, expected_states: Sequence[Union[str, State]], *, storage: Any = None, identifier_getter: Optional[callable] = None) -> None:
        self.expected = {str(s) for s in expected_states}
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            # Try the new FSMContextManager approach first
            try:
                from pyrogram_patch.patch_data_pool import initialize_global_pool
                from pyrogram import Client
                # Get client from update if possible
                client = getattr(update, '_client', None)
                if client is None:
                    # Try to get from message
                    msg = getattr(update, 'message', None)
                    if msg and hasattr(msg, '_client'):
                        client = msg._client
                if client:
                    pool = await initialize_global_pool(client)
                    if pool._fsm_manager:
                        ctx = await pool._fsm_manager.from_update(update)
                        current_state = await ctx.get_state()
                        return str(current_state) in self.expected if current_state else False
            except Exception:
                pass

            # Fallback to pool-based approach
            try:
                from pyrogram_patch.patch_helper import PatchHelper
                helper = PatchHelper.get_from_pool(update)
                current_state = str(helper.state)
                return current_state in self.expected
            except Exception:
                pass

            # Fallback to storage-based approach
            if self.storage:
                identifier = self._resolve_identifier(update)
                ctx = FSMContext(self.storage, identifier)
                state = await ctx.get_state()
                if not state:
                    return False
                return state.get("name") in self.expected
            return False
        except Exception:
            logger.debug("AnyStateFilter failed", exc_info=True)
            return False

    def _resolve_identifier(self, update: Any) -> str:
        if self.identifier_getter:
            return self.identifier_getter(update)

        msg = getattr(update, "message", None) or (update.get("message") if isinstance(update, dict) else None)
        chat = getattr(msg, "chat", None) or (msg.get("chat") if isinstance(msg, dict) else None)
        if chat:
            return f"chat:{getattr(chat, 'id', None) or chat.get('id')}"
        return "global"


class NoStateFilter:
    """Filter that passes if no FSM state is currently set."""

    def __init__(self, *, storage: Any = None, identifier_getter: Optional[callable] = None) -> None:
        self.storage = storage
        self.identifier_getter = identifier_getter

    def __and__(self, other):
        """Support & operator with other filters."""
        return CombinedFilter(self, other)

    async def __call__(self, client: Any, update: Any) -> bool:
        try:
            # Try the new FSMContextManager approach first
            try:
                from pyrogram_patch.patch_data_pool import initialize_global_pool
                from pyrogram import Client
                # Get client from update if possible
                client = getattr(update, '_client', None)
                if client is None:
                    # Try to get from message
                    msg = getattr(update, 'message', None)
                    if msg and hasattr(msg, '_client'):
                        client = msg._client
                if client:
                    pool = await initialize_global_pool(client)
                    if pool._fsm_manager:
                        ctx = await pool._fsm_manager.from_update(update)
                        current_state = await ctx.get_state()
                        return current_state is None
            except Exception:
                pass

            # Fallback to pool-based approach
            try:
                from pyrogram_patch.patch_helper import PatchHelper
                helper = PatchHelper.get_from_pool(update)
                current_state = helper.state
                return current_state == "*" or current_state is None
            except Exception:
                pass

            # Fallback to storage-based approach
            if self.storage:
                identifier = self._resolve_identifier(update)
                ctx = FSMContext(self.storage, identifier)
                state = await ctx.get_state()
                return state is None
            return True  # If no storage, assume no state
        except Exception:
            logger.debug("NoStateFilter failed", exc_info=True)
            return False

    def _resolve_identifier(self, update: Any) -> str:
        if self.identifier_getter:
            return self.identifier_getter(update)

        msg = getattr(update, "message", None) or (update.get("message") if isinstance(update, dict) else None)
        chat = getattr(msg, "chat", None) or (msg.get("chat") if isinstance(update, dict) else None)
        if chat:
            return f"chat:{getattr(chat, 'id', None) or chat.get('id')}"
        return "global"
