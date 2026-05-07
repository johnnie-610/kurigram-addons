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

# Keyboards (from pykeyboard) — wrapped so a pyrogram version mismatch in
# pykeyboard does not prevent the rest of kurigram_addons from loading.
_pykeyboard_exports: list = []

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
    _pykeyboard_exports += [
        "Button", "ForceReply", "InlineButton", "InlineKeyboard",
        "ReplyButton", "ReplyKeyboard", "ReplyKeyboardRemove",
        "pagination_client_context",
    ]
except (ImportError, Exception):
    pass

try:
    from pykeyboard import (
        KeyboardBuilder,
        KeyboardFactory,
        build_inline_keyboard,
        build_reply_keyboard,
    )
    _pykeyboard_exports += [
        "KeyboardBuilder", "KeyboardFactory",
        "build_inline_keyboard", "build_reply_keyboard",
    ]
except (ImportError, Exception):
    pass

try:
    from pykeyboard.callback_data import CallbackData
    _pykeyboard_exports.append("CallbackData")
except ImportError:
    pass

try:
    from pykeyboard.button_style import ButtonStyle
    _pykeyboard_exports.append("ButtonStyle")
except ImportError:
    pass

try:
    from pykeyboard import (
        ButtonValidator,
        KeyboardHookManager,
        add_keyboard_hook,
        add_validation_rule,
        default_hook_manager,
        default_validator,
        validate_button,
        validate_keyboard,
    )
    _pykeyboard_exports += [
        "ButtonValidator", "KeyboardHookManager",
        "add_keyboard_hook", "add_validation_rule",
        "default_hook_manager", "default_validator",
        "validate_button", "validate_keyboard",
    ]
except (ImportError, Exception):
    pass

try:
    from pykeyboard import (
        create_keyboard_from_config,
        get_keyboard_info,
        validate_keyboard_config,
    )
    _pykeyboard_exports += [
        "create_keyboard_from_config", "get_keyboard_info",
        "validate_keyboard_config",
    ]
except (ImportError, Exception):
    pass

try:
    from pykeyboard import (
        PyKeyboardError,
        PaginationError,
        PaginationUnchangedError,
        LocaleError,
        ConfigurationError,
    )
    _pykeyboard_exports += [
        "PyKeyboardError", "PaginationError", "PaginationUnchangedError",
        "LocaleError", "ConfigurationError",
    ]
except (ImportError, Exception):
    pass

# Pyrogram Patch
from pyrogram_patch.patch import PatchManager, patch

# Router
from pyrogram_patch.router.router import Router

# FSM
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
from pyrogram_patch.fsm.states import State, StatesGroup

_optional_fsm_exports: list = []

try:
    from pyrogram_patch.fsm.storages.redis_storage import RedisStorage
    _optional_fsm_exports.append("RedisStorage")
except ImportError:
    pass

try:
    from pyrogram_patch.fsm.storages.sqlite_storage import SQLiteStorage
    _optional_fsm_exports.append("SQLiteStorage")
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

# Middleware extras
from pyrogram_patch.middlewares.middleware_manager import MiddlewareContext
from pyrogram_patch.middlewares.rate_limit import RateLimitMiddleware

# DX Improvements
from kurigram_addons.command_parser import CommandParseError, parse_command
from kurigram_addons.depends import Depends as _LegacyDepends, resolve_dependencies
from kurigram_addons.flood_wait import FloodWaitHandler
from kurigram_addons.rate_limit import RateLimit

# New features
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
    # Legacy (deprecated but still available)
    "PatchManager",
    "patch",
    # Router
    "Router",
    # FSM (always available)
    "BaseStorage",
    "MemoryStorage",
    "StatesGroup",
    "State",
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
    # Middleware extras
    "MiddlewareContext",
    "RateLimitMiddleware",
    # DX Improvements
    "FloodWaitHandler",
    "parse_command",
    "CommandParseError",
    "RateLimit",
    # New features
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
]

# Optional exports (only included when the underlying module loaded successfully)
__all__ += _pykeyboard_exports
__all__ += _optional_fsm_exports
