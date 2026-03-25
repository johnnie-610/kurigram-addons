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

# Client
from kurigram_addons.client import KurigramClient

# Conversation handler
from kurigram_addons.conversation import Conversation, ConversationContext, ConversationState

# Menu system
from kurigram_addons.menu import Menu, MenuButton

# Keyboards (from pykeyboard)
# Keyboards (from pykeyboard) — wrapped so a pyrogram version mismatch in
# pykeyboard does not prevent the rest of kurigram_addons from loading.
try:
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
    pykeyboard_available = True
except (ImportError, Exception):
    pykeyboard_available = False

# Builder & Factory (optional deps)
try:
    from pykeyboard import (
        KeyboardBuilder,
        KeyboardFactory,
        build_inline_keyboard,
        build_reply_keyboard,
    )
except (ImportError, Exception):
    pass

# Pyrogram Patch
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

# Phase 3: DX Improvements
from kurigram_addons.command_parser import CommandParseError, parse_command
from kurigram_addons.depends import Depends as _LegacyDepends, resolve_dependencies
from kurigram_addons.flood_wait import FloodWaitHandler
from kurigram_addons.rate_limit import RateLimit

# Phase 4: New features
from kurigram_addons.broadcast import BroadcastResult, broadcast
from kurigram_addons.i18n import I18nMiddleware
from kurigram_addons.testing import (
    ConversationTester,
    MockClient,
    make_callback_query,
    make_message,
    make_user,
)
from pyrogram_patch.di import Depends, DIContainer
from pyrogram_patch.middlewares.per_handler import middleware, use_middleware
from pyrogram_patch.fsm.states import State

try:
    from pykeyboard.callback_data import CallbackData
    from pykeyboard.button_style import ButtonStyle
except ImportError:
    pass

try:
    from pyrogram_patch.fsm.storages.sqlite_storage import SQLiteStorage
except ImportError:
    pass

# Version
__version__ = "0.5.0"

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
    # Keyboards (only if pykeyboard is available)
]

if pykeyboard_available:
    __all__.extend([
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
        "CallbackData",
        "ButtonStyle"
    ])

# Router
__all__.append("Router")

# FSM
__all__.extend([
    "BaseStorage",
    "MemoryStorage",
    "RedisStorage",
    "SQLiteStorage",
    "StatesGroup",
    "State",
])

# Errors
__all__.extend([
    "PyrogramPatchError",
    "ValidationError",
    "DispatcherError",
    "PatchError",
    "LockError",
    "RedisStorageError",
    "FSMTransitionError",
    "MiddlewareError",
    "RouterError",
])

# DX Improvements
__all__.extend([
    "FloodWaitHandler",
    "parse_command",
    "CommandParseError",
    "RateLimit",
])

# Phase 4: New features
__all__.extend([
    "broadcast",
    "BroadcastResult",
    "I18nMiddleware",
    "Depends",
    "DIContainer",
    "use_middleware",
    "middleware",
    "MockClient",
    "make_message",
    "make_callback_query",
    "make_user",
    "ConversationTester",
])
