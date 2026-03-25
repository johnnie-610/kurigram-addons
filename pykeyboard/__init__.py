# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library
#
# pykeyboard/__init__.py

"""PyKeyboard - Modern, Type-Safe Keyboard Addon for pyrogram(kurigram).

PyKeyboard is a comprehensive Python library for creating beautiful and functional
inline and reply keyboards for Telegram bots using pyrogram.


Example:
    >>> from pykeyboard import InlineKeyboard, InlineButton
    >>>
    >>> keyboard = InlineKeyboard()
    >>> keyboard.add(
    ...     InlineButton("👍 Like", "action:like"),
    ...     InlineButton("👎 Dislike", "action:dislike")
    ... )
    >>> # Use with pyrogram bot
    >>> await message.reply_text("Rate this!", reply_markup=keyboard)

Classes:
    InlineKeyboard: Advanced inline keyboard with pagination and language selection
    ReplyKeyboard: Feature-rich reply keyboard with customization options
    InlineButton: Type-safe inline keyboard button
    ReplyButton: Type-safe reply keyboard button
    Button: Base button class with validation
    ReplyKeyboardRemove: Remove reply keyboard markup
    ForceReply: Force user to send a reply

For more information, visit: https://github.com/johnnie-610/kurigram-addons
"""

import os as _os
import warnings as _warnings

# Only warn when imported directly by user code, not by kurigram_addons
_caller = _os.environ.get("_KURIGRAM_ADDONS_INTERNAL")
if not _caller:
    _warnings.warn(
        "Importing from 'pykeyboard' is deprecated. "
        "Use 'from kurigram_addons import ...' instead. "
        "This shim will be removed in v1.0.0.",
        DeprecationWarning,
        stacklevel=2,
    )

from .inline_keyboard import InlineKeyboard, pagination_client_context
from .keyboard_base import Button, InlineButton
from .reply_keyboard import PyForceReply as ForceReply
from .reply_keyboard import PyReplyKeyboardRemove as ReplyKeyboardRemove
from .reply_keyboard import ReplyButton, ReplyKeyboard

# ButtonStyle — Telegram's new inline button colour styles.
# Gracefully absent if the raw type isn't available in this pyrogram build.
try:
    from .button_style import ButtonStyle
    _button_style_available = True
except ImportError:
    _button_style_available = False
    ButtonStyle = None

# Builder and factory utilities
try:
    from .builder import (KeyboardBuilder, KeyboardFactory,
                          build_inline_keyboard, build_reply_keyboard)

    _builder_available = True
except ImportError:
    _builder_available = False
    KeyboardBuilder = None
    KeyboardFactory = None
    build_inline_keyboard = None
    build_reply_keyboard = None

# Validation hooks and middleware
try:
    from .hooks import (ButtonValidator, KeyboardHookManager,
                        add_keyboard_hook, add_validation_rule,
                        default_hook_manager, default_validator,
                        validate_button, validate_keyboard)

    _hooks_available = True
except ImportError:
    _hooks_available = False
    ButtonValidator = None
    KeyboardHookManager = None
    validate_button = None
    validate_keyboard = None
    add_validation_rule = None
    add_keyboard_hook = None
    default_validator = None
    default_hook_manager = None

# Utilities
try:
    from .utils import (create_keyboard_from_config, get_keyboard_info,
                        validate_keyboard_config)

    _utils_available = True
except ImportError:
    _utils_available = False
    create_keyboard_from_config = None
    get_keyboard_info = None
    validate_keyboard_config = None

# Error reporting system
try:
    from .errors import (ConfigurationError, LocaleError, PaginationError,
                         PaginationUnchangedError, PyKeyboardError,
                         ValidationError)

    _errors_available = True
except ImportError:
    _errors_available = False
    PyKeyboardError = None
    ValidationError = None
    PaginationError = None
    PaginationUnchangedError = None
    LocaleError = None
    ConfigurationError = None

__all__ = [
    # Core Classes
    "Button",
    "InlineButton",
    "InlineKeyboard",
    "ReplyKeyboard",
    "ReplyButton",
    "ReplyKeyboardRemove",
    "ForceReply",
    # Button styling (new in v0.5.0 — Telegram layer ≥167)
    "ButtonStyle",
    # Context Variables
    "pagination_client_context",
    # Builder Pattern
    "KeyboardBuilder",
    "KeyboardFactory",
    "build_inline_keyboard",
    "build_reply_keyboard",
    # Validation System
    "ButtonValidator",
    "KeyboardHookManager",
    "validate_button",
    "validate_keyboard",
    "add_validation_rule",
    "add_keyboard_hook",
    "default_validator",
    "default_hook_manager",
    # Utilities
    "create_keyboard_from_config",
    "get_keyboard_info",
    "validate_keyboard_config",
    # Error Reporting System
    "PyKeyboardError",
    "ValidationError",
    "PaginationError",
    "PaginationUnchangedError",
    "LocaleError",
    "ConfigurationError",
]

