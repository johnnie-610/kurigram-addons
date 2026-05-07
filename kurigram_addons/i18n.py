# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Internationalisation (i18n) middleware.

Detects each user's preferred language from their Telegram profile and
injects a ``_()`` translation callable into the handler via the
``PatchHelper`` data dict.

Supports:
* Plain ``.po``/``.mo`` files via Python's built-in ``gettext`` module.
* Simple JSON translation files (``{"key": "translated string"}``).
* A fluent fallback: if a key is missing in the user's language the default
  language is tried, then the key itself is returned.

Example layout::

    locales/
        en/LC_MESSAGES/bot.mo
        ru/LC_MESSAGES/bot.mo
        de/LC_MESSAGES/bot.mo

Setup::

    from kurigram_addons.i18n import I18nMiddleware

    i18n = I18nMiddleware(
        default_lang="en",
        locales_path="locales",
        domain="bot",           # matches the .mo file name
    )
    await app.include_middleware(i18n)

In handlers::

    async def start(client, message, patch_helper):
        _ = await patch_helper.get("_")          # the translation callable
        await message.reply(_("welcome_message"))
"""

from __future__ import annotations

import gettext as _gettext
import json
import logging
import os
from pathlib import Path
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger("kurigram.i18n")

# Sentinel returned when no translation is found at all
_MISSING = object()


class I18nMiddleware:
    """Before-middleware that detects user language and injects ``_()`` into
    the helper data dict under the key ``"_"``.

    Args:
        default_lang: Fallback language code (e.g. ``"en"``).
        locales_path: Path to the locales directory.  For ``.mo`` files this
                      should contain ``{lang}/LC_MESSAGES/{domain}.mo``.
                      For JSON files it should contain ``{lang}.json``.
        domain: ``gettext`` domain name (default: ``"bot"``).
        use_json: If ``True``, load ``{lang}.json`` files instead of ``.mo``.
    """

    def __init__(
        self,
        default_lang: str = "en",
        locales_path: str = "locales",
        domain: str = "bot",
        use_json: bool = False,
    ) -> None:
        self.default_lang = default_lang
        self.locales_path = Path(locales_path)
        self.domain = domain
        self.use_json = use_json

        # Cache: lang_code -> translation callable
        self._cache: Dict[str, Callable[[str], str]] = {}
        # Pre-load the default language
        self._cache[default_lang] = self._load_lang(default_lang)

    # ── Language loading ─────────────────────────────────────────────────────

    def _load_lang(self, lang: str) -> Callable[[str], str]:
        """Return a translation callable for *lang*, falling back to default."""
        try:
            if self.use_json:
                return self._load_json(lang)
            return self._load_gettext(lang)
        except (FileNotFoundError, OSError) as exc:
            if lang != self.default_lang:
                logger.debug(
                    "No translations for '%s' (%s), falling back to '%s'",
                    lang, exc, self.default_lang,
                )
                return self._cache.get(self.default_lang, lambda k: k)
            logger.debug("No translations for default lang '%s': %s", lang, exc)
            return lambda key: key  # identity — return the key as-is

    def _load_gettext(self, lang: str) -> Callable[[str], str]:
        translation = _gettext.translation(
            domain=self.domain,
            localedir=str(self.locales_path),
            languages=[lang],
        )
        return translation.gettext

    def _load_json(self, lang: str) -> Callable[[str], str]:
        json_path = self.locales_path / f"{lang}.json"
        with open(json_path, encoding="utf-8") as f:
            table: Dict[str, str] = json.load(f)
        fallback = self._cache.get(self.default_lang, lambda k: k)

        def _translate(key: str) -> str:
            value = table.get(key, _MISSING)
            if value is not _MISSING:
                return str(value)
            # Fall back to default language table
            return fallback(key)

        return _translate

    def get_translator(self, lang: str) -> Callable[[str], str]:
        """Return (and cache) a translator for *lang*."""
        if lang not in self._cache:
            self._cache[lang] = self._load_lang(lang)
        return self._cache[lang]

    # ── Middleware callable ──────────────────────────────────────────────────

    async def __call__(
        self,
        update: Any,
        client: Any,
        patch_helper: Any,
    ) -> None:
        """Detect the user's language and inject ``_`` into the helper."""
        lang = self._detect_lang(update)
        translator = self.get_translator(lang)
        await patch_helper.update_data(**{"_": translator, "__lang__": lang})

    @staticmethod
    def _detect_lang(update: Any) -> str:
        """Extract the language code from the update's from_user."""
        user = getattr(update, "from_user", None)
        if user is None:
            msg = getattr(update, "message", None)
            if msg:
                user = getattr(msg, "from_user", None)

        if user is not None:
            lang = getattr(user, "language_code", None)
            if lang:
                # Normalise "en-US" -> "en", then sanitise to alphanumeric +
                # underscore only to prevent path traversal in _load_json.
                code = lang.split("-")[0].lower()
                if code.isalpha() and 2 <= len(code) <= 8:
                    return code

        return "en"


__all__ = ["I18nMiddleware"]
