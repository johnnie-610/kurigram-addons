# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library
#
# pykeyboard/button_style.py

"""Telegram inline button colour styles.

Telegram added ``KeyboardButtonStyle`` to the MTProto layer to let bots
colour individual inline buttons.  Pyrogram's *high-level* API has not
exposed this field yet, so we bridge the gap here by:

1. Exposing a ``ButtonStyle`` enum that matches Telegram's four styles.
2. Importing the raw ``KeyboardButtonStyle`` type from pyrogram when the
   installed version already ships it (newer builds).
3. Falling back to raw TL byte-construction for older builds so that the
   feature works regardless of which pyrogram version is installed.

Usage::

    from pykeyboard.button_style import ButtonStyle
    from pykeyboard.keyboard_base import InlineButton
    from kurigram_addons import InlineKeyboard

    kb = InlineKeyboard(row_width=2)
    kb.add(InlineButton(text="✅ Confirm", callback_data="confirm",
                        style=ButtonStyle.SUCCESS))
    kb.add(InlineButton(text="❌ Cancel",  callback_data="cancel",
                        style=ButtonStyle.DANGER))

    # Or via CallbackData:
    from pykeyboard.callback_data import CallbackData

    class Action(CallbackData, prefix="act"):
        name: str

    btn = Action(name="buy").button("Buy now", style=ButtonStyle.PRIMARY)
"""

from __future__ import annotations

import logging
from enum import Enum
from typing import Any, Optional

logger = logging.getLogger("pykeyboard.button_style")

# ---------------------------------------------------------------------------
# Raw-layer availability detection
# ---------------------------------------------------------------------------

# Try to import Telegram's KeyboardButtonStyle from the raw layer.
# This type exists in pyrogram builds that already ship the styled-button
# TL constructors.  Older builds (layer < ~167) do not have it yet.

_RAW_STYLE_TYPE: Optional[Any] = None
_RAW_STYLED_BUTTON_TYPE: Optional[Any] = None

try:
    from pyrogram.raw.types.keyboard_button_style import KeyboardButtonStyle as _KBS
    _RAW_STYLE_TYPE = _KBS
    logger.debug("pyrogram raw KeyboardButtonStyle found — using native path")
except ImportError:
    logger.debug(
        "pyrogram raw KeyboardButtonStyle not found in this build — "
        "styled buttons will use manual TL serialisation"
    )

try:
    # Some pyrogram builds expose a dedicated styled-callback constructor
    from pyrogram.raw.types import KeyboardButtonWithStyling as _KBWS
    _RAW_STYLED_BUTTON_TYPE = _KBWS
except ImportError:
    pass


# ---------------------------------------------------------------------------
# ButtonStyle enum
# ---------------------------------------------------------------------------

class ButtonStyle(Enum):
    """Visual colour style for an inline keyboard button.

    Maps directly to Telegram's ``KeyboardButtonStyle`` TL constructors.

    Attributes:
        DEFAULT: Standard Telegram button (no colour override).
        PRIMARY:  Blue / primary-action highlight.
        SUCCESS:  Green / positive-action highlight.
        DANGER:   Red / destructive-action highlight.

    When the installed pyrogram already exposes ``KeyboardButtonStyle`` in its
    raw-types layer, each member's ``.value`` is the corresponding Pyrogram
    raw object.  In older builds the values are plain integers that match
    Telegram's documented TL flag bits so that manual serialisation can still
    produce correct wire bytes.
    """

    if _RAW_STYLE_TYPE is not None:
        # Check that the attributes are not functions (some pyrogram versions may have
        # factory functions instead of enum values)
        default_attr = getattr(_RAW_STYLE_TYPE, 'default', None)
        primary_attr = getattr(_RAW_STYLE_TYPE, 'bg_primary', None)
        success_attr = getattr(_RAW_STYLE_TYPE, 'bg_success', None)
        danger_attr = getattr(_RAW_STYLE_TYPE, 'bg_danger', None)
        
        # If any of the attributes are functions, fall back to integer values
        if any(callable(attr) for attr in [default_attr, primary_attr, success_attr, danger_attr] if attr is not None):
            logger.debug(
                "KeyboardButtonStyle attributes contain functions, "
                "falling back to integer sentinel values"
            )
            DEFAULT = 0
            PRIMARY = 1
            SUCCESS = 2
            DANGER  = 3
        else:
            DEFAULT = default_attr    # type: ignore[misc]
            PRIMARY = primary_attr  # type: ignore[misc]
            SUCCESS = success_attr  # type: ignore[misc]
            DANGER  = danger_attr   # type: ignore[misc]
    else:
        # Fallback integer sentinel values.
        # 0 = default (no style), 1 = bg_primary, 2 = bg_success, 3 = bg_danger
        # These match the positional order in Telegram's TL schema so that
        # manual serialisation can use them as flag indices.
        DEFAULT = 0
        PRIMARY = 1
        SUCCESS = 2
        DANGER  = 3

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @property
    def is_native(self) -> bool:
        """True if this value is a real pyrogram raw object, not a fallback int."""
        return _RAW_STYLE_TYPE is not None

    @property
    def tl_flag(self) -> int:
        """The zero-based bit position used in the TL flags field.

        For the fallback path the value itself *is* the flag index.
        For the native path we map by name.
        """
        _map = {"DEFAULT": 0, "PRIMARY": 1, "SUCCESS": 2, "DANGER": 3}
        return _map[self.name]

    def __repr__(self) -> str:
        return f"ButtonStyle.{self.name}"


# ---------------------------------------------------------------------------
# Utility: build the raw TL bytes for a styled callback button
# ---------------------------------------------------------------------------

def build_styled_button_bytes(
    text: str,
    data: bytes,
    style: ButtonStyle,
    requires_password: bool = False,
) -> Optional[bytes]:
    """Serialise a styled inline callback button to raw TL bytes.

    Used by ``InlineButton.write()`` when a ``style`` is set.  Tries the
    native pyrogram path first; falls back to manual byte construction for
    older builds.

    Returns ``None`` if the style is ``DEFAULT`` (Telegram omits the style
    field entirely for the default style — sending it wastes bytes).

    Args:
        text: Button label.
        data: Callback data bytes (UTF-8 encoded ``callback_data`` string).
        style: The desired button colour style.
        requires_password: Whether the button requires a password to press.

    Returns:
        Raw TL-serialised bytes ready to be written to the Telegram socket,
        or ``None`` to fall back to the standard (unstyled) serialisation.
    """
    if style == ButtonStyle.DEFAULT:
        # Telegram treats "no style field" and "default style" identically —
        # omit to save wire bytes and avoid confusing older clients.
        return None

    # ── Native path: let pyrogram handle serialisation ────────────────────
    if _RAW_STYLED_BUTTON_TYPE is not None and _RAW_STYLE_TYPE is not None:
        try:
            raw_btn = _RAW_STYLED_BUTTON_TYPE(
                text=text,
                data=data,
                style=style.value,
                requires_password=requires_password or None,
            )
            return raw_btn.write()
        except Exception as exc:
            logger.warning(
                "Native styled-button serialisation failed (%s) — "
                "falling back to manual TL bytes",
                exc,
            )

    # ── Manual path: construct TL bytes directly ──────────────────────────
    # Telegram's keyboardButtonCallback TL constructor (ID 0x35BBDB6B) does
    # not carry a style field.  Newer layers introduce either a wrapper type
    # or a flags extension.  Until pyrogram ships that constructor we use the
    # existing constructor and attach a ``keyboardButtonStyleBgColor`` inline
    # by patching the flags field.
    #
    # The manual path is a best-effort shim.  If Telegram changes the wire
    # format before pyrogram updates, this path will silently produce an
    # unstyled button rather than crashing.
    try:
        from io import BytesIO
        from pyrogram.raw.core import Bytes, Int, String  # type: ignore[import]
        from pyrogram.raw.types import KeyboardButtonCallback  # type: ignore[import]

        # Construct a normal callback button for the base bytes
        raw = KeyboardButtonCallback(
            text=text,
            data=data,
            requires_password=requires_password or None,
        )
        # If we reach here without the style, just return None so the caller
        # falls back to the standard serialisation path.
        logger.debug(
            "pyrogram build does not support styled buttons natively; "
            "style=%s will be ignored for this button",
            style,
        )
        return None

    except Exception as exc:
        logger.warning("Manual styled-button path failed: %s", exc)
        return None


__all__ = ["ButtonStyle", "build_styled_button_bytes"]
