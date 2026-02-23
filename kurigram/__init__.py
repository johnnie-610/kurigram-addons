# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""kurigram — Unified namespace for kurigram-addons.

This is the recommended top-level import for all kurigram-addons
functionality. It re-exports everything from ``pykeyboard`` and
``pyrogram_patch`` under a single clean namespace.

Example::

    from kurigram import (
        KurigramClient,
        InlineKeyboard,
        InlineButton,
        Router,
        MemoryStorage,
    )
"""

# ── Client ──────────────────────────────────────────────────────
from kurigram.client import KurigramClient

# ── Conversation handler ────────────────────────────────────────
from kurigram.conversation import Conversation, ConversationContext, ConversationState

# ── Menu system ─────────────────────────────────────────────────
from kurigram.menu import Menu, MenuButton

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
from pyrogram_patch.fsm.memory_storage import MemoryStorage
from pyrogram_patch.fsm.states import StatesGroup

try:
    from pyrogram_patch.fsm.redis_storage import RedisStorage
except ImportError:
    pass

# Middleware
from pyrogram_patch.middlewares.middleware_types import (
    OnAfterMiddlewareType,
    OnAroundMiddlewareType,
    OnBeforeMiddlewareType,
)

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

# ── Version ─────────────────────────────────────────────────────
__version__ = "0.4.0-dev"

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
    # Middleware types
    "OnBeforeMiddlewareType",
    "OnAfterMiddlewareType",
    "OnAroundMiddlewareType",
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
]
