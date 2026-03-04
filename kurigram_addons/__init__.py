# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""kurigram_addons — Unified namespace for kurigram-addons.

This is the recommended top-level import for all kurigram-addons
functionality. It re-exports everything from ``pykeyboard`` and
``pyrogram_patch`` under a single clean namespace.

Example::

    from kurigram_addons import (
        KurigramClient,
        InlineKeyboard,
        InlineButton,
        Router,
        MemoryStorage,
    )
"""

import os as _os

# Suppress deprecation warnings from our own re-exports
_os.environ["_KURIGRAM_ADDONS_INTERNAL"] = "1"

# ── Client ──────────────────────────────────────────────────────
from kurigram_addons.client import KurigramClient

# ── Conversation handler ────────────────────────────────────────
from kurigram_addons.conversation import Conversation, ConversationContext, ConversationState

# ── Menu system ─────────────────────────────────────────────────
from kurigram_addons.menu import Menu, MenuButton

# ── Keyboards (from pykeyboard) ────────────────────────────────
from pykeyboard import (
    Button,
    ForceReply,
    InlineButton,
    InlineKeyboard,
    ReplyButton,
    ReplyKeyboard,
    ReplyKeyboardRemove,
    pagination_client_context,
)

# Builder & Factory (optional deps)
try:
    from pykeyboard import (
        KeyboardBuilder,
        KeyboardFactory,
        build_inline_keyboard,
        build_reply_keyboard,
    )
except ImportError:
    pass

# ── Pyrogram Patch ──────────────────────────────────────────────
from pyrogram_patch.patch import PatchManager, patch

# Router
from pyrogram_patch.router.router import Router

# FSM
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
from pyrogram_patch.fsm.states import StatesGroup

try:
    from pyrogram_patch.fsm.redis_storage import RedisStorage
except ImportError:
    pass


# Errors
from pyrogram_patch.errors import (
    DispatcherError,
    FSMTransitionError,
    LockError,
    MiddlewareError,
    PatchError,
    PyrogramPatchError,
    RedisStorageError,
    RouterError,
    ValidationError,
)

# ── Phase 3: DX Improvements ───────────────────────────────────
from kurigram_addons.command_parser import CommandParseError, parse_command
from kurigram_addons.depends import Depends, resolve_dependencies
from kurigram_addons.flood_wait import FloodWaitHandler
from kurigram_addons.rate_limit import RateLimit

# ── Version ─────────────────────────────────────────────────────
__version__ = "0.4.1"

__all__ = [
    # Client
    "KurigramClient",
    # Conversation
    "Conversation",
    "ConversationState",
    "ConversationContext",
    # Menu
    "Menu",
    "MenuButton",
    # Legacy (deprecated but available)
    "PatchManager",
    "patch",
    # Keyboards
    "InlineKeyboard",
    "InlineButton",
    "ReplyKeyboard",
    "ReplyButton",
    "Button",
    "ForceReply",
    "ReplyKeyboardRemove",
    "pagination_client_context",
    "KeyboardBuilder",
    "KeyboardFactory",
    "build_inline_keyboard",
    "build_reply_keyboard",
    # Router
    "Router",
    # FSM
    "BaseStorage",
    "MemoryStorage",
    "RedisStorage",
    "StatesGroup",
    # Errors
    "PyrogramPatchError",
    "ValidationError",
    "DispatcherError",
    "PatchError",
    "LockError",
    "RedisStorageError",
    "FSMTransitionError",
    "MiddlewareError",
    "RouterError",
    # DX Improvements
    "FloodWaitHandler",
    "parse_command",
    "CommandParseError",
    "Depends",
    "resolve_dependencies",
    "RateLimit",
]
