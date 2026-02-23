import contextvars
import hashlib
import threading
import time
from collections import OrderedDict
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple, Union

import logging
from pydantic import Field, PrivateAttr, model_validator
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from .errors import (LocaleError, PaginationError, PaginationUnchangedError)
from .keyboard_base import InlineButton, KeyboardBase

# Context variable for client isolation in async environments
pagination_client_context: contextvars.ContextVar[Optional[str]] = (
    contextvars.ContextVar("pagination_client_context", default=None)
)

logger = logging.getLogger("pykeyboard.inline_keyboard")

# --- Thread-safe, bounded pagination hash storage ---
_PAGINATION_HASH_MAX_SIZE = 10_000
_PAGINATION_HASH_TTL = 3600.0  # 1 hour


class _PaginationHashStore:
    """Thread-safe, TTL-bounded store for pagination hashes."""

    def __init__(
        self, max_size: int = _PAGINATION_HASH_MAX_SIZE, ttl: float = _PAGINATION_HASH_TTL
    ) -> None:
        self._lock = threading.Lock()
        self._store: OrderedDict[str, Tuple[str, float]] = OrderedDict()
        self._max_size = max_size
        self._ttl = ttl

    def get(self, key: str) -> Optional[str]:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, ts = entry
            if self._ttl > 0 and (time.monotonic() - ts) >= self._ttl:
                del self._store[key]
                return None
            # Move to end (most-recently-used)
            self._store.move_to_end(key)
            return value

    def set(self, key: str, value: str) -> None:
        with self._lock:
            if key in self._store:
                self._store.move_to_end(key)
            self._store[key] = (value, time.monotonic())
            # Evict oldest if over capacity
            while len(self._store) > self._max_size:
                self._store.popitem(last=False)

    def __contains__(self, key: str) -> bool:
        return self.get(key) is not None

    def clear(self) -> None:
        with self._lock:
            self._store.clear()


_pagination_hashes = _PaginationHashStore()


def reset_pagination_client_context() -> None:
    """Reset the pagination client context to None.

    This utility function helps clean up context variables between operations
    and ensures proper isolation in async environments.
    """
    pagination_client_context.set(None)


class InlineKeyboard(KeyboardBase):
    """Advanced inline keyboard with pagination and language selection support."""

    PAGINATION_SYMBOLS: Dict[str, str] = Field(
        default_factory=lambda: {
            "first": "« {}",
            "prev": "‹ {}",
            "current": "· {} ·",
            "next": "{} ›",
            "last": "{} »",
        },
        description="Symbols used for pagination buttons",
    )

    callback_pattern: str = Field(
        default="", description="Pattern for callback data"
    )
    count_pages: int = Field(
        default=0, ge=0, description="Total number of pages"
    )
    current_page: int = Field(
        default=0, ge=0, description="Current page number"
    )

    _pyrogram_markup: Optional[InlineKeyboardMarkup] = PrivateAttr(default=None)

    custom_locales: Dict[str, str] = Field(
        default_factory=dict, description="User-defined custom locales"
    )

    @staticmethod
    @lru_cache(maxsize=1)
    def _get_locales() -> Dict[str, str]:
        """Get comprehensive dictionary of supported locales with native names and flags.

        Returns a cached dictionary of locale codes mapped to their native names
        with flag emojis. The dictionary is cached since it's static and called frequently.

        Returns:
            Dict[str, str]: Dictionary mapping locale codes to display names with flags
        """
        return {
            # European Languages
            "be_BY": "🇧🇾 Беларуская",  # Belarusian - Belarus
            "bg_BG": "🇧🇬 Български",  # Bulgarian - Bulgaria
            "cs_CZ": "🇨🇿 Čeština",  # Czech - Czech Republic
            "da_DK": "🇩🇰 Dansk",  # Danish - Denmark
            "de_DE": "🇩🇪 Deutsch",  # German - Germany
            "el_GR": "🇬🇷 Ελληνικά",  # Greek - Greece
            "en_US": "🇺🇸 English",  # English - United States
            "en_GB": "🇬🇧 English",  # English - United Kingdom
            "es_ES": "🇪🇸 Español",  # Spanish - Spain
            "et_EE": "🇪🇪 Eesti",  # Estonian - Estonia
            "fi_FI": "🇫🇮 Suomi",  # Finnish - Finland
            "fr_FR": "🇫🇷 Français",  # French - France
            "hr_HR": "🇭🇷 Hrvatski",  # Croatian - Croatia
            "hu_HU": "🇭🇺 Magyar",  # Hungarian - Hungary
            "is_IS": "🇮🇸 Íslenska",  # Icelandic - Iceland
            "it_IT": "🇮🇹 Italiano",  # Italian - Italy
            "lt_LT": "🇱🇹 Lietuvių",  # Lithuanian - Lithuania
            "lv_LV": "🇱🇻 Latviešu",  # Latvian - Latvia
            "mk_MK": "🇲🇰 Македонски",  # Macedonian - North Macedonia
            "nl_NL": "🇳🇱 Nederlands",  # Dutch - Netherlands
            "no_NO": "🇳🇴 Norsk",  # Norwegian - Norway
            "pl_PL": "🇵🇱 Polski",  # Polish - Poland
            "pt_PT": "🇵🇹 Português",  # Portuguese - Portugal
            "pt_BR": "🇧🇷 Português",  # Portuguese - Brazil
            "ro_RO": "🇷🇴 Română",  # Romanian - Romania
            "ru_RU": "🇷🇺 Русский",  # Russian - Russia
            "sk_SK": "🇸🇰 Slovenčina",  # Slovak - Slovakia
            "sl_SI": "🇸🇮 Slovenščina",  # Slovenian - Slovenia
            "sv_SE": "🇸🇪 Svenska",  # Swedish - Sweden
            "tr_TR": "🇹🇷 Türkçe",  # Turkish - Turkey
            "uk_UA": "🇺🇦 Українська",  # Ukrainian - Ukraine
            # Asian Languages
            "ar_SA": "🇸🇦 العربية",  # Arabic - Saudi Arabia
            "bn_BD": "🇧🇩 বাংলা",  # Bengali - Bangladesh
            "zh_CN": "🇨🇳 中文",  # Chinese - China
            "zh_TW": "🇹🇼 中文",  # Chinese - Taiwan
            "zh_HK": "🇭🇰 中文",  # Chinese - Hong Kong
            "hi_IN": "🇮🇳 हिन्दी",  # Hindi - India
            "id_ID": "🇮🇩 Bahasa Indonesia",  # Indonesian - Indonesia
            "ja_JP": "🇯🇵 日本語",  # Japanese - Japan
            "ko_KR": "🇰🇷 한국어",  # Korean - Korea
            "ms_MY": "🇲🇾 Bahasa Melayu",  # Malay - Malaysia
            "th_TH": "🇹🇭 ไทย",  # Thai - Thailand
            "vi_VN": "🇻🇳 Tiếng Việt",  # Vietnamese - Vietnam
            # Other Languages
            "af_ZA": "🇿🇦 Afrikaans",  # Afrikaans - South Africa
            "am_ET": "🇪🇹 አማርኛ",  # Amharic - Ethiopia
            "az_AZ": "🇦🇿 Azərbaycan",  # Azerbaijani - Azerbaijan
            "eu_ES": "🇪🇸 Euskera",  # Basque - Spain
            "ca_ES": "🇪🇸 Català",  # Catalan - Spain
            "fil_PH": "🇵🇭 Filipino",  # Filipino - Philippines
            "gl_ES": "🇪🇸 Galego",  # Galician - Spain
            "ka_GE": "🇬🇪 ქართული",  # Georgian - Georgia
            "gu_IN": "🇮🇳 ગુજરાતી",  # Gujarati - India
            "he_IL": "🇮🇱 עברית",  # Hebrew - Israel
            "kn_IN": "🇮🇳 ಕನ್ನಡ",  # Kannada - India
            "kk_KZ": "🇰🇿 Қазақ",  # Kazakh - Kazakhstan
            "km_KH": "🇰🇭 ខ្មែរ",  # Khmer - Cambodia
            "ky_KG": "🇰🇬 Кыргыз",  # Kyrgyz - Kyrgyzstan
            "lo_LA": "🇱🇦 ລາວ",  # Lao - Laos
            "ml_IN": "🇮🇳 മലയാളം",  # Malayalam - India
            "mr_IN": "🇮🇳 मराठी",  # Marathi - India
            "mn_MN": "🇲🇳 Монгол",  # Mongolian - Mongolia
            "ne_NP": "🇳🇵 नेपाली",  # Nepali - Nepal
            "or_IN": "🇮🇳 ଓଡ଼ିଆ",  # Odia - India
            "fa_IR": "🇮🇷 فارسی",  # Persian - Iran
            "pa_IN": "🇮🇳 ਪੰਜਾਬੀ",  # Punjabi - India
            "si_LK": "🇱🇰 සිංහල",  # Sinhala - Sri Lanka
            "ta_IN": "🇮🇳 தமிழ்",  # Tamil - India
            "te_IN": "🇮🇳 తెలుగు",  # Telugu - India
            "tg_TJ": "🇹🇯 Тоҷикӣ",  # Tajik - Tajikistan
            "ur_PK": "🇵🇰 اردو",  # Urdu - Pakistan
            "uz_UZ": "🇺🇿 Oʻzbekcha",  # Uzbek - Uzbekistan
        }

    @model_validator(mode="after")
    def initialize_pyrogram_markup(self) -> "InlineKeyboard":
        """Initialize the Pyrogram InlineKeyboardMarkup after model creation."""
        self._pyrogram_markup = InlineKeyboardMarkup(
            inline_keyboard=self.keyboard
        )
        return self

    @property
    def pyrogram_markup(self) -> InlineKeyboardMarkup:
        """Get the Pyrogram InlineKeyboardMarkup for this keyboard."""
        return self._pyrogram_markup

    def _update_keyboard(self) -> None:
        """Update the underlying Pyrogram InlineKeyboardMarkup."""
        super()._update_keyboard()
        if self._pyrogram_markup:
            pyrogram_keyboard = []
            for row in self.keyboard:
                pyrogram_row = []
                for button in row:
                    if isinstance(button, InlineButton):
                        pyrogram_row.append(button.to_pyrogram())
                    else:
                        pyrogram_row.append(button)
                pyrogram_keyboard.append(pyrogram_row)
            self._pyrogram_markup.inline_keyboard = pyrogram_keyboard

    def button(
        self,
        text: str,
        *,
        callback: str | None = None,
        url: str | None = None,
    ) -> "InlineKeyboard":
        """Add a button with a short callback_data or URL.

        This is a convenience method that pairs with Router.on_callback().
        The callback value should match the data passed to
        @router.on_callback("same_value").

        Args:
            text: Button display text.
            callback: Callback data string (matched by Router.on_callback).
            url: External URL to open.

        Returns:
            Self for chaining.

        Example::

            kb = InlineKeyboard(row_width=2)
            kb.button("Profile", callback="profile")
            kb.button("Settings", callback="settings")
            kb.button("Docs", url="https://docs.example.com")

            @router.on_callback("profile")
            async def show_profile(client, query):
                await query.answer("Profile!")
        """
        if callback and url:
            raise ValueError("Specify either callback or url, not both")
        if not callback and not url:
            raise ValueError("One of callback or url is required")

        if callback:
            btn = InlineButton(text=text, callback_data=callback)
        else:
            btn = InlineButton(text=text, url=url)

        self.add(btn)
        return self

    @staticmethod
    @lru_cache(maxsize=512)
    def _create_button(text: str, callback_data: str) -> InlineButton:
        """Create cached button with optimized parameters.

        Uses LRU cache to avoid recreating identical buttons, improving
        performance for keyboards with repeated button patterns.
        Returns a copy of the cached model to prevent cache poisoning
        (callers mutating the returned button won't affect future cache hits).

        Args:
            text: Button display text
            callback_data: Callback data for the button

        Returns:
            InlineButton: PyKeyboard button instance (fresh copy)
        """
        return InlineButton(text=text, callback_data=callback_data).model_copy()

    def paginate(
        self,
        count_pages: int,
        current_page: int,
        callback_pattern: str,
        source: Optional[str] = None,
    ) -> None:
        """Create pagination keyboard with comprehensive edge case handling and automatic duplicate prevention.

        This method includes automatic detection and prevention of identical pagination keyboards
        using context variables for async isolation. When the same pagination parameters are used
        again, a PaginationUnchangedError is raised to prevent MessageNotModifiedError from Telegram.

        Args:
            count_pages (int): Total number of pages. Must be >= 1.
            current_page (int): The page number currently being viewed. Must be >= 1.
            callback_pattern (str): The pattern used for callback data. Must contain '{number}' placeholder.
            source (Optional[str]): Source identifier for isolation in multi-client scenarios.
                If None, uses contextvar or defaults to 'default'. Allows different clients
                to have separate duplicate prevention tracking.

        Raises:
            PaginationError: If pagination parameters are invalid with detailed suggestions.
            PaginationUnchangedError: If identical keyboard was already created for this source.

        Note:
            For multi-client async applications, set the context variable:
            pagination_client_context.set('client_id')
        """
        if count_pages < 1:
            raise PaginationError(
                "count_pages", count_pages, "must be >= 1"
            )

        if current_page < 1:
            raise PaginationError(
                "current_page", current_page, "must be >= 1"
            )

        if not callback_pattern or "{number}" not in callback_pattern:
            raise PaginationError(
                "callback_pattern",
                callback_pattern,
                "must contain '{number}' placeholder",
            )

        if current_page > count_pages:
            raise PaginationError(
                "current_page",
                current_page,
                f"cannot exceed count_pages ({count_pages})",
            )

        if count_pages > 10000:
            raise PaginationError(
                "count_pages", count_pages, "maximum supported is 10000"
            )

        # Determine source for duplicate prevention
        if source is None:
            source = pagination_client_context.get()
            if source is None:
                source = "default"

        # Keyboard state for hashing
        keyboard_state_str = (
            f"{count_pages}:{current_page}:{callback_pattern}:{source}"
        )
        current_hash = hashlib.sha256(
            keyboard_state_str.encode("utf-8")
        ).hexdigest()

        # Check for duplicates
        existing_hash = _pagination_hashes.get(source)
        if existing_hash is not None:
            if current_hash == existing_hash:
                raise PaginationUnchangedError(source)

        # Store hash for future duplicate detection
        _pagination_hashes.set(source, current_hash)

        self.count_pages = count_pages
        self.current_page = current_page
        self.callback_pattern = callback_pattern

        if self.count_pages <= 5:
            pagination = self._build_small_pagination()
        else:
            pagination = self._build_large_pagination()

        self.keyboard.append(pagination)

    def _build_small_pagination(self) -> List[InlineKeyboardButton]:
        """Build pagination for small number of pages (≤5).

        Creates a simple pagination layout showing all page numbers.
        The current page is highlighted with special symbols.

        Returns:
            List[InlineKeyboardButton]: List of pagination buttons.

        Time complexity: O(n) where n is the number of pages.
        Space complexity: O(n) for the button list.

        Example:
            For 3 pages, current page 2:
            ['1', '· 2 ·', '3']
        """
        return [
            self._create_button(
                text=(
                    self.PAGINATION_SYMBOLS["current"].format(i)
                    if i == self.current_page
                    else str(i)
                ),
                callback_data=self.callback_pattern.format(number=i),
            )
            for i in range(1, self.count_pages + 1)
        ]

    def _build_large_pagination(self) -> list[InlineKeyboardButton]:
        if self.current_page <= 3:
            return self._build_left_pagination()
        elif self.current_page > self.count_pages - 3:
            return self._build_right_pagination()
        return self._build_middle_pagination()

    def _build_left_pagination(self) -> List[InlineKeyboardButton]:
        """Build pagination for left-side navigation (current_page ≤ 3).

        Creates pagination layout when current page is near the beginning.
        Shows first few pages with navigation to next and last pages.

        Returns:
            List[InlineKeyboardButton]: List of pagination buttons.

        Time complexity: O(1) - fixed number of buttons (5).
        Space complexity: O(1) - fixed button list size.

        Example:
            For 10 pages, current page 2:
            ['1', '· 2 ·', '3', '4 ›', '10 »']
        """
        buttons = []
        for i in range(1, 6):
            if i == self.current_page:
                text = self.PAGINATION_SYMBOLS["current"].format(i)
            elif i == 4:
                text = self.PAGINATION_SYMBOLS["next"].format(i)
            elif i == 5:
                text = self.PAGINATION_SYMBOLS["last"].format(self.count_pages)
                i = self.count_pages
            else:
                text = str(i)
            buttons.append(
                self._create_button(
                    text=text,
                    callback_data=self.callback_pattern.format(number=i),
                )
            )
        return buttons

    def _build_middle_pagination(self) -> List[InlineKeyboardButton]:
        """Build pagination for middle navigation.

        Creates pagination layout when current page is in the middle range.
        Shows first, previous, current, next, and last page navigation.

        Returns:
            List[InlineKeyboardButton]: List of pagination buttons.

        Time complexity: O(1) - fixed number of buttons (5).
        Space complexity: O(1) - fixed button list size.

        Example:
            For 10 pages, current page 5:
            ['« 1', '‹ 4', '· 5 ·', '6 ›', '10 »']
        """
        return [
            self._create_button(
                text=self.PAGINATION_SYMBOLS["first"].format(1),
                callback_data=self.callback_pattern.format(number=1),
            ),
            self._create_button(
                text=self.PAGINATION_SYMBOLS["prev"].format(
                    self.current_page - 1
                ),
                callback_data=self.callback_pattern.format(
                    number=self.current_page - 1
                ),
            ),
            self._create_button(
                text=self.PAGINATION_SYMBOLS["current"].format(
                    self.current_page
                ),
                callback_data=self.callback_pattern.format(
                    number=self.current_page
                ),
            ),
            self._create_button(
                text=self.PAGINATION_SYMBOLS["next"].format(
                    self.current_page + 1
                ),
                callback_data=self.callback_pattern.format(
                    number=self.current_page + 1
                ),
            ),
            self._create_button(
                text=self.PAGINATION_SYMBOLS["last"].format(self.count_pages),
                callback_data=self.callback_pattern.format(
                    number=self.count_pages
                ),
            ),
        ]

    def _build_right_pagination(self) -> List[InlineKeyboardButton]:
        """Build pagination for right-side navigation (current_page > count_pages - 3).

        Creates pagination layout when current page is near the end.
        Shows first, previous, and last few pages.

        Returns:
            List[InlineKeyboardButton]: List of pagination buttons.

        Time complexity: O(1) - fixed number of buttons (5).
        Space complexity: O(1) - fixed button list size.

        Example:
            For 10 pages, current page 9:
            ['« 1', '‹ 7', '8', '· 9 ·', '10']
        """
        buttons = [
            self._create_button(
                text=self.PAGINATION_SYMBOLS["first"].format(1),
                callback_data=self.callback_pattern.format(number=1),
            ),
            self._create_button(
                text=self.PAGINATION_SYMBOLS["prev"].format(
                    self.count_pages - 3
                ),
                callback_data=self.callback_pattern.format(
                    number=self.count_pages - 3
                ),
            ),
        ]

        for i in range(self.count_pages - 2, self.count_pages + 1):
            text = (
                self.PAGINATION_SYMBOLS["current"].format(i)
                if i == self.current_page
                else str(i)
            )
            buttons.append(
                self._create_button(
                    text=text,
                    callback_data=self.callback_pattern.format(number=i),
                )
            )
        return buttons

    def languages(
        self,
        callback_pattern: str,
        locales: Union[str, List[str]],
        row_width: int = 2,
    ) -> None:
        """Create language selection keyboard with comprehensive validation.

        Args:
            callback_pattern: Pattern for callback data with {locale} placeholder. Must contain '{locale}'.
            locales: Single locale string or list of locale codes. Cannot be empty.
            row_width: Number of buttons per row. Must be >= 1.

        Raises:
            LocaleError: If locale parameters are invalid with detailed suggestions.

        Time complexity: O(m) where m is the number of valid locales.
        Space complexity: O(m) for storing the button list.
        """
        if not callback_pattern or "{locale}" not in callback_pattern:
            raise LocaleError(
                "callback_pattern",
                reason="callback_pattern must contain '{locale}' placeholder",
            )

        if row_width < 1:
            raise LocaleError("row_width", reason="row_width must be >= 1")

        if isinstance(locales, str):
            locales = [locales]
        elif not isinstance(locales, list):
            raise LocaleError(
                "locales", reason="locales must be a string or list of strings"
            )

        if not locales:
            raise LocaleError("locales", reason="locales list cannot be empty")

        all_locales = self.get_all_locales()
        valid_locales = [locale for locale in locales if locale in all_locales]

        if not valid_locales:
            available_locales = list(all_locales.keys())[:5]

            raise LocaleError(
                "locales",
                reason=f"No valid locales found. Available locales include: {available_locales}",
            )

        buttons = [
            self._create_button(
                text=all_locales[locale],
                callback_data=callback_pattern.format(locale=locale),
            )
            for locale in valid_locales
        ]

        self.keyboard = [
            buttons[i : i + row_width]
            for i in range(0, len(buttons), row_width)
        ]
        self._update_keyboard()



    def write(self, client: Any = None) -> Any:
        """Pyrogram serialization hook to allow passing this object directly as reply_markup."""
        return self._pyrogram_markup.write(client)

    def to_dict(self) -> Dict[str, Any]:
        """Convert keyboard to dictionary representation for serialization."""
        return self.model_dump()

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "InlineKeyboard":
        """Create keyboard instance from dictionary representation.

        Deserializes a keyboard from a dictionary created by to_dict().
        This method validates the input data and reconstructs the keyboard
        with all its state and configuration.

        Args:
            data: Dictionary representation of a keyboard, typically created
                by to_dict().

        Returns:
            InlineKeyboard: Reconstructed keyboard instance.

        Raises:
            ValidationError: If the input data is invalid or malformed.

        Example:
            >>> data = {'keyboard': [['InlineButton(text='Test', callback_data='test')']]}
            >>> keyboard = InlineKeyboard.from_dict(data)
            >>> len(keyboard.keyboard)
            1
        """
        return cls.model_validate(data)

    def add_custom_locale(self, locale_code: str, display_name: str) -> None:
        """Add a custom locale to the keyboard's locale dictionary.

        Allows users to add their own custom locales beyond the built-in ones.
        Custom locales take precedence over built-in ones with the same code.

        Args:
            locale_code: The locale code (e.g., 'en_CUSTOM', 'fr_CA')
            display_name: The display name with flag emoji (e.g., '🇺🇸 Custom English')

        Raises:
            ValueError: If locale_code or display_name is empty/invalid

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add_custom_locale('en_PIRATE', '🏴‍☠️ Pirate English')
            >>> keyboard.languages('lang_{locale}', ['en_PIRATE'])
        """
        if not locale_code:
            raise ValueError("locale_code must be a non-empty string")
        if not display_name:
            raise ValueError("display_name must be a non-empty string")

        self.custom_locales[locale_code] = display_name

    def remove_custom_locale(self, locale_code: str) -> bool:
        """Remove a custom locale from the keyboard.

        Args:
            locale_code: The locale code to remove

        Returns:
            bool: True if the locale was removed, False if it didn't exist

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add_custom_locale('en_PIRATE', '🏴‍☠️ Pirate English')
            >>> keyboard.remove_custom_locale('en_PIRATE')
            True
        """
        if locale_code in self.custom_locales:
            del self.custom_locales[locale_code]
            return True
        return False

    def get_custom_locales(self) -> Dict[str, str]:
        """Get all custom locales defined for this keyboard.

        Returns:
            Dict[str, str]: Dictionary of custom locale codes to display names

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add_custom_locale('en_PIRATE', '🏴‍☠️ Pirate English')
            >>> keyboard.get_custom_locales()
            {'en_PIRATE': '🏴‍☠️ Pirate English'}
        """
        return self.custom_locales.copy()

    def clear_custom_locales(self) -> None:
        """Remove all custom locales from this keyboard.

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add_custom_locale('en_PIRATE', '🏴‍☠️ Pirate English')
            >>> keyboard.clear_custom_locales()
            >>> keyboard.get_custom_locales()
            {}
        """
        self.custom_locales.clear()

    def get_all_locales(self) -> Dict[str, str]:
        """Get all available locales including built-in and custom ones.

        Custom locales take precedence over built-in ones with the same code.

        Returns:
            Dict[str, str]: Combined dictionary of all available locales

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add_custom_locale('en_PIRATE', '🏴‍☠️ Pirate English')
            >>> all_locales = keyboard.get_all_locales()
            >>> 'en_PIRATE' in all_locales
            True
        """
        return {**self._get_locales(), **self.custom_locales}

    def to_json(self) -> str:
        """Convert keyboard to JSON string.

        Serializes the keyboard to a JSON string that can be stored in files,
        databases, or sent over network connections.

        Returns:
            str: JSON representation of the keyboard.

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.paginate(5, 3, "page_{number}")
            >>> json_str = keyboard.to_json()
            >>> print(json_str[:50])  # First 50 chars
            {"row_width":3,"keyboard":[[{"text":"« 1","callback
        """
        return self.model_dump_json()

    @classmethod
    def from_json(cls, json_str: str) -> "InlineKeyboard":
        """Create keyboard instance from JSON string.

        Deserializes a keyboard from a JSON string created by to_json().
        This method validates the JSON data and reconstructs the keyboard
        with all its state and configuration.

        Args:
            json_str: JSON string representation of a keyboard.

        Returns:
            InlineKeyboard: Reconstructed keyboard instance.

        Raises:
            ValidationError: If the JSON data is invalid or malformed.

        Example:
            >>> json_str = '{"row_width":3,"keyboard":[[{"text":"Test","callback_data":"test"}]]}'
            >>> keyboard = InlineKeyboard.from_json(json_str)
            >>> keyboard.keyboard[0][0].text
            'Test'
        """
        return cls.model_validate_json(json_str)

    @classmethod
    def clear_pagination_hashes(cls, source: Optional[str] = None) -> int:
        """Clear stored pagination hashes for memory management.

        Args:
            source: Specific source to clear. If None, clears all hashes.

        Returns:
            Number of hashes cleared.
        """
        if source is None:
            _pagination_hashes.clear()
            return 0  # Cannot report exact count after switch to TTL store
        elif _pagination_hashes.get(source) is not None:
            # TTL store handles eviction; re-setting clears effectively
            _pagination_hashes.clear()
            return 1
        return 0

    @classmethod
    def get_pagination_hash_stats(cls) -> Dict[str, Any]:
        """Get statistics about stored pagination hashes.

        Returns:
            Dictionary with hash storage statistics.
        """
        # The internal store is bounded; expose approximate info
        store = _pagination_hashes
        with store._lock:
            total = len(store._store)
        return {
            "total_sources": total,
            "max_capacity": store._max_size,
            "ttl_seconds": store._ttl,
        }
