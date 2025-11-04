# Copyright (c) 2025 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the pykeyboard-kurigram library
#
# pykeyboard/presets.py

from __future__ import annotations

import inspect
from dataclasses import dataclass, field
from typing import (Any, Callable, Dict, List, Mapping, MutableMapping, Optional,
                    Sequence, Tuple, Union)

from .builder import KeyboardBuilder
from .errors import ConfigurationError
from .inline_keyboard import InlineButton, InlineKeyboard
from .keyboard_base import KeyboardBase

PresetContext = Mapping[str, Any]
MutablePresetContext = MutableMapping[str, Any]


def _merge_context(*contexts: Optional[Mapping[str, Any]]) -> Dict[str, Any]:
    merged: Dict[str, Any] = {}
    for context in contexts:
        if context:
            merged.update(context)
    return merged


def _wrap_button_callable(
    func: Callable[..., Any], context: Mapping[str, Any]
) -> Callable[[Any], Any]:
    try:
        signature = inspect.signature(func)
    except (TypeError, ValueError):
        return func

    parameters = list(signature.parameters.values())
    accepts_context = False
    uses_keyword_context = False

    for parameter in parameters[1:]:
        if parameter.kind == inspect.Parameter.VAR_KEYWORD:
            uses_keyword_context = True
            break
        if parameter.kind in {
            inspect.Parameter.POSITIONAL_OR_KEYWORD,
            inspect.Parameter.POSITIONAL_ONLY,
        }:
            accepts_context = True
            break
        if (
            parameter.kind == inspect.Parameter.KEYWORD_ONLY
            and parameter.name == "context"
        ):
            uses_keyword_context = True
            break

    if not accepts_context and not uses_keyword_context:
        return func

    if accepts_context:
        return lambda button: func(button, context)

    return lambda button: func(button, context=context)


def _call_builder_hook(
    func: Callable[..., Any], builder: KeyboardBuilder, context: Mapping[str, Any]
) -> Any:
    try:
        signature = inspect.signature(func)
    except (TypeError, ValueError):
        return func(builder)

    parameters = list(signature.parameters.values())
    accepts_context = any(
        parameter.kind in {inspect.Parameter.POSITIONAL_ONLY,
                           inspect.Parameter.POSITIONAL_OR_KEYWORD}
        for parameter in parameters[1:]
    )
    accepts_keyword_context = any(
        parameter.kind == inspect.Parameter.KEYWORD_ONLY
        and parameter.name == "context"
        for parameter in parameters
    ) or any(
        parameter.kind == inspect.Parameter.VAR_KEYWORD for parameter in parameters
    )

    if accepts_context:
        return func(builder, context)
    if accepts_keyword_context:
        return func(builder, context=context)
    return func(builder)


class KeyboardThemeRegistry:
    """Registry managing keyboard themes."""

    def __init__(self) -> None:
        self._themes: Dict[str, KeyboardTheme] = {}

    def register(
        self, theme: "KeyboardTheme", *, override: bool = False
    ) -> "KeyboardTheme":
        if theme.name in self._themes and not override:
            raise ValueError(f"Keyboard theme '{theme.name}' already registered")
        self._themes[theme.name] = theme
        return theme

    def unregister(self, name: str) -> None:
        self._themes.pop(name, None)

    def get(self, name: str) -> "KeyboardTheme":
        try:
            return self._themes[name]
        except KeyError as exc:
            raise KeyError(f"Keyboard theme '{name}' is not registered") from exc

    def names(self) -> List[str]:
        return list(self._themes.keys())

    def __contains__(self, name: str) -> bool:  # pragma: no cover - trivial
        return name in self._themes


class KeyboardPresetRegistry:
    """Registry managing keyboard presets."""

    def __init__(self) -> None:
        self._presets: Dict[str, KeyboardPreset] = {}

    def register(
        self, preset: "KeyboardPreset", *, override: bool = False
    ) -> "KeyboardPreset":
        if preset.name in self._presets and not override:
            raise ValueError(f"Keyboard preset '{preset.name}' already registered")
        self._presets[preset.name] = preset
        return preset

    def unregister(self, name: str) -> None:
        self._presets.pop(name, None)

    def get(self, name: str) -> "KeyboardPreset":
        try:
            return self._presets[name]
        except KeyError as exc:
            raise KeyError(f"Keyboard preset '{name}' is not registered") from exc

    def names(self) -> List[str]:
        return list(self._presets.keys())

    def __contains__(self, name: str) -> bool:  # pragma: no cover - trivial
        return name in self._presets


@dataclass
class KeyboardTheme:
    """Reusable collection of button transforms and builder hooks."""

    name: str
    description: str = ""
    button_transforms: Sequence[Callable[..., Any]] = field(default_factory=tuple)
    validation_hooks: Sequence[Callable[..., bool]] = field(default_factory=tuple)
    pre_layout_hooks: Sequence[Callable[..., Any]] = field(default_factory=tuple)
    post_layout_hooks: Sequence[Callable[..., Any]] = field(default_factory=tuple)
    metadata: MutablePresetContext = field(default_factory=dict)
    default_context: MutablePresetContext = field(default_factory=dict)

    def apply(
        self, builder: KeyboardBuilder, *, context: Optional[Mapping[str, Any]] = None
    ) -> KeyboardBuilder:
        ctx = _merge_context(self.default_context, context)

        for hook in self.validation_hooks:
            builder.add_validation_hook(_wrap_button_callable(hook, ctx))

        for transform in self.button_transforms:
            builder.add_button_transform(_wrap_button_callable(transform, ctx))

        for hook in self.pre_layout_hooks:
            _call_builder_hook(hook, builder, ctx)

        return builder

    def apply_post(
        self, builder: KeyboardBuilder, *, context: Optional[Mapping[str, Any]] = None
    ) -> KeyboardBuilder:
        ctx = _merge_context(self.default_context, context)

        for hook in self.post_layout_hooks:
            _call_builder_hook(hook, builder, ctx)

        return builder


@dataclass
class KeyboardPreset:
    """Declarative keyboard layout that can be reused across builders."""

    name: str
    keyboard_factory: Callable[[Mapping[str, Any]], KeyboardBase]
    apply_layout: Callable[[KeyboardBuilder, Mapping[str, Any]], None]
    description: str = ""
    tags: Tuple[str, ...] = tuple()
    default_context: MutablePresetContext = field(default_factory=dict)
    default_themes: Tuple[Union[str, KeyboardTheme], ...] = tuple()

    def _resolve_themes(
        self,
        themes: Optional[Sequence[Union[str, KeyboardTheme]]],
        theme_registry_override: Optional[KeyboardThemeRegistry],
    ) -> List[KeyboardTheme]:
        if not themes:
            return []

        registry = theme_registry_override or theme_registry
        resolved: List[KeyboardTheme] = []

        for theme in themes:
            if isinstance(theme, str):
                resolved.append(registry.get(theme))
            else:
                resolved.append(theme)

        return resolved

    def apply_to(
        self,
        builder: KeyboardBuilder,
        *,
        context: Optional[Mapping[str, Any]] = None,
        themes: Optional[Sequence[Union[str, KeyboardTheme]]] = None,
        theme_registry_override: Optional[KeyboardThemeRegistry] = None,
    ) -> KeyboardBuilder:
        ctx = _merge_context(self.default_context, context)
        resolved_themes = self._resolve_themes(
            themes or self.default_themes, theme_registry_override
        )

        for theme in resolved_themes:
            theme.apply(builder, context=ctx)

        self.apply_layout(builder, ctx)

        for theme in resolved_themes:
            theme.apply_post(builder, context=ctx)

        return builder

    def instantiate_builder(
        self,
        *,
        context: Optional[Mapping[str, Any]] = None,
        themes: Optional[Sequence[Union[str, KeyboardTheme]]] = None,
        theme_registry_override: Optional[KeyboardThemeRegistry] = None,
        keyboard: Optional[KeyboardBase] = None,
    ) -> KeyboardBuilder:
        ctx = _merge_context(self.default_context, context)
        keyboard_instance = keyboard or self.keyboard_factory(ctx)
        builder = KeyboardBuilder(keyboard_instance)
        self.apply_to(
            builder,
            context=ctx,
            themes=themes,
            theme_registry_override=theme_registry_override,
        )
        return builder

    def build(
        self,
        *,
        context: Optional[Mapping[str, Any]] = None,
        themes: Optional[Sequence[Union[str, KeyboardTheme]]] = None,
        theme_registry_override: Optional[KeyboardThemeRegistry] = None,
        keyboard: Optional[KeyboardBase] = None,
    ) -> KeyboardBase:
        return self.instantiate_builder(
            context=context,
            themes=themes,
            theme_registry_override=theme_registry_override,
            keyboard=keyboard,
        ).build()


preset_registry = KeyboardPresetRegistry()
theme_registry = KeyboardThemeRegistry()


def register_preset(
    preset: KeyboardPreset, *, override: bool = False
) -> KeyboardPreset:
    return preset_registry.register(preset, override=override)


def register_theme(theme: KeyboardTheme, *, override: bool = False) -> KeyboardTheme:
    return theme_registry.register(theme, override=override)


def _inline_keyboard_factory(context: Mapping[str, Any]) -> InlineKeyboard:
    row_width = context.get("row_width") or context.get("columns")
    if row_width:
        return InlineKeyboard(row_width=int(row_width))
    return InlineKeyboard()


def _confirmation_layout(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    yes_text = context.get("yes_text", "✅ Yes")
    no_text = context.get("no_text", "❌ No")
    cancel_text = context.get("cancel_text")
    callback_pattern = context.get("callback_pattern", "confirm_{action}")

    buttons: List[Dict[str, Any]] = [
        {"text": yes_text, "callback_data": callback_pattern.format(action="yes")},
        {"text": no_text, "callback_data": callback_pattern.format(action="no")},
    ]

    if cancel_text:
        buttons.append(
            {
                "text": cancel_text,
                "callback_data": callback_pattern.format(action="cancel"),
            }
        )

    builder.add_buttons(*buttons)


def _menu_layout(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    menu_items = context.get("menu_items")
    if not menu_items:
        raise ConfigurationError("menu_items", menu_items, "non-empty mapping")

    callback_pattern = context.get("callback_pattern", "menu_{action}")

    buttons = [
        {
            "text": text,
            "callback_data": callback_pattern.format(action=action),
        }
        for text, action in menu_items.items()
    ]

    builder.add_buttons(*buttons)


def _rating_layout(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    max_rating = int(context.get("max_rating", 5))
    callback_pattern = context.get("callback_pattern", "rate_{stars}")
    include_labels = context.get("include_labels", True)

    buttons = []
    for rating in range(1, max_rating + 1):
        stars = "⭐" * rating
        text = f"{stars} ({rating})" if include_labels else stars
        buttons.append(
            {"text": text, "callback_data": callback_pattern.format(stars=rating)}
        )

    builder.add_buttons(*buttons)


def _pagination_layout(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    total_pages = context.get("total_pages")
    current_page = context.get("current_page")
    callback_pattern = context.get("callback_pattern", "page_{number}")

    if total_pages is None or current_page is None:
        raise ConfigurationError(
            "pagination",
            {"total_pages": total_pages, "current_page": current_page},
            "total_pages and current_page provided",
        )

    builder.add_navigation_buttons(int(total_pages), int(current_page), callback_pattern)

    include_buttons = context.get("include_buttons")
    if include_buttons:
        button_specs: List[Any] = []
        for button in include_buttons:
            if isinstance(button, dict):
                text = button.get("text")
                if not text:
                    raise ConfigurationError("text", button, "provided")
                callback_data = button.get("callback_data", text.lower())
                button_specs.append({"text": text, "callback_data": callback_data})
            else:
                button_specs.append(button)

        builder.add_row(*button_specs)


def _language_layout(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    locales = context.get("locales")
    if not locales:
        raise ConfigurationError("locales", locales, "non-empty sequence")

    callback_pattern = context.get("callback_pattern", "lang_{locale}")
    row_width = int(context.get("row_width", 2))

    builder.add_language_buttons(list(locales), callback_pattern, row_width)


def _callback_namespace_transform(button: Any, context: Mapping[str, Any]) -> Any:
    namespace = context.get("callback_namespace")
    if not namespace:
        return button

    if isinstance(button, InlineButton) and button.callback_data:
        prefix = f"{namespace}:"
        if not button.callback_data.startswith(prefix):
            button.callback_data = f"{prefix}{button.callback_data}"

    return button


def _text_prefix_transform(button: Any, context: Mapping[str, Any]) -> Any:
    prefix = context.get("text_prefix")
    if not prefix or not hasattr(button, "text"):
        return button

    if not str(button.text).startswith(prefix):
        button.text = f"{prefix}{button.text}"
    return button


def _append_footer(builder: KeyboardBuilder, context: Mapping[str, Any]) -> None:
    footer = context.get("footer")
    if not footer:
        return

    text = footer.get("text")
    callback_data = footer.get("callback_data")
    if not text:
        return

    button = InlineButton(text=text, callback_data=callback_data)
    builder.keyboard.row(button)


register_theme(
    KeyboardTheme(
        name="callback_namespace",
        description="Prefixes callback data with a shared namespace.",
        button_transforms=(
            _callback_namespace_transform,
        ),
        default_context={"callback_namespace": ""},
    )
)

register_theme(
    KeyboardTheme(
        name="text_prefix",
        description="Prefixes button texts with a shared marker.",
        button_transforms=(
            _text_prefix_transform,
        ),
        default_context={"text_prefix": ""},
    )
)

register_theme(
    KeyboardTheme(
        name="footer",
        description="Appends an informational footer row after layout generation.",
        post_layout_hooks=(
            _append_footer,
        ),
        default_context={"footer": {}},
    )
)

register_preset(
    KeyboardPreset(
        name="confirmation",
        description="Standard yes/no[/cancel] confirmation dialog.",
        keyboard_factory=_inline_keyboard_factory,
        apply_layout=_confirmation_layout,
        tags=("inline", "dialog"),
    )
)

register_preset(
    KeyboardPreset(
        name="menu",
        description="Menu keyboard constructed from a mapping of label -> action.",
        keyboard_factory=_inline_keyboard_factory,
        apply_layout=_menu_layout,
        tags=("inline", "menu"),
    )
)

register_preset(
    KeyboardPreset(
        name="rating",
        description="Star rating selector supporting optional labels.",
        keyboard_factory=_inline_keyboard_factory,
        apply_layout=_rating_layout,
        tags=("inline", "rating"),
    )
)

register_preset(
    KeyboardPreset(
        name="pagination",
        description="Pagination controls with optional trailing buttons.",
        keyboard_factory=_inline_keyboard_factory,
        apply_layout=_pagination_layout,
        tags=("inline", "navigation"),
    )
)

register_preset(
    KeyboardPreset(
        name="languages",
        description="Language selector leveraging InlineKeyboard.languages().",
        keyboard_factory=_inline_keyboard_factory,
        apply_layout=_language_layout,
        tags=("inline", "i18n"),
    )
)

