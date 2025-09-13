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
from typing import Any, Callable, Optional

from .. import errors
from .context import FSMContext

logger = logging.getLogger("pyrogram_patch.fsm.context_manager")


class FSMContextManager:
    """Factory for creating FSMContext objects from updates.

    Example:
        storage = MemoryFSMStorage()
        fsm = FSMContextManager(storage)

        async def handler(update):
            ctx = await fsm.from_update(update)
            await ctx.set_state("awaiting_input")
    """

    def __init__(
        self,
        storage: Any,
        *,
        identifier_getter: Optional[Callable[[Any], str]] = None,
    ) -> None:
        """
        Args:
            storage: backend implementing set_state/get_state/delete_state/compare_and_set.
            identifier_getter: optional callable that extracts identifier from update.
                               Defaults to chat.id if available, else 'global'.
        """
        self._storage = storage
        self._identifier_getter = identifier_getter

    async def from_update(self, update: Any) -> FSMContext:
        """Return an FSMContext bound to the update.

        Args:
            update: Pyrogram update object (message, callback_query, etc.).

        Returns:
            FSMContext bound to the derived identifier.

        Raises:
            errors.FSMContextError: if identifier cannot be determined.
        """
        try:
            identifier: Optional[str] = None
            if self._identifier_getter:
                identifier = self._identifier_getter(update)

            if not identifier:
                # Fallbacks
                msg = getattr(update, "message", None) or (
                    update.get("message") if isinstance(update, dict) else None
                )
                chat = getattr(msg, "chat", None) or (
                    msg.get("chat") if isinstance(msg, dict) else None
                )
                if chat:
                    identifier = (
                        f"chat:{getattr(chat, 'id', None) or chat.get('id')}"
                    )
                else:
                    identifier = "global"

            return FSMContext(self._storage, identifier)
        except errors.PyrogramPatchError:
            raise
        except Exception as e:
            raise errors.FSMContextError(
                "Failed to create FSMContext",
                cause=e,
                context={"update": repr(update)},
            ) from e
