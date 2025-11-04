from typing import List

import pytest

pytest.importorskip("pydantic")

from pykeyboard.builder import KeyboardBuilder, KeyboardFactory
from pykeyboard.inline_keyboard import InlineButton, InlineKeyboard
from pykeyboard.presets import preset_registry, theme_registry
from pykeyboard.visualization import KeyboardVisualizer
from pykeyboard.errors import LocaleError


def extract_labels(keyboard: InlineKeyboard) -> List[str]:
    return [
        button.text
        for row in keyboard.keyboard
        for button in row
        if isinstance(button, InlineButton)
    ]


def test_languages_marks_unavailable_and_highlights_active():
    keyboard = InlineKeyboard()
    keyboard.languages(
        "lang_{locale}",
        ["en_US", "es_ES", "fr_FR"],
        available_translations={"en_US": True, "es_ES": False},
        current_locale="es_ES",
    )

    summary = keyboard.get_last_locale_summary()
    labels = extract_labels(keyboard)

    assert any(entry["locale"] == "es_ES" and entry["is_active"] for entry in summary)
    assert any(label.startswith("✅ ") for label in labels)
    assert any(
        entry["locale"] == "es_ES" and not entry["is_available"]
        for entry in summary
    )


def test_languages_uses_fallback_and_remembers_selection():
    keyboard = InlineKeyboard()
    keyboard.languages(
        "lang_{locale}",
        ["xx_XX"],
        fallback_locale="en_US",
        remember_selection_id="user-42",
    )

    summary = keyboard.get_last_locale_summary()
    assert summary[0]["locale"] == "en_US"
    assert keyboard.get_locale_selection("user-42") == "en_US"


def test_languages_invalid_locale_error_contains_suggestion():
    keyboard = InlineKeyboard()
    with pytest.raises(LocaleError) as exc:
        keyboard.languages("lang_{locale}", ["xx_XX"])

    assert exc.value.context.get("suggested_locale") is not None


def test_remember_locale_selection_validation():
    keyboard = InlineKeyboard()
    keyboard.remember_locale_selection("user", "fr_FR")
    assert keyboard.get_locale_selection("user") == "fr_FR"

    keyboard.clear_locale_selections("user")
    assert keyboard.get_locale_selection("user") is None

    with pytest.raises(LocaleError):
        keyboard.remember_locale_selection("user", "xx_XX")


def test_visualizer_includes_performance_snapshot():
    keyboard = InlineKeyboard()
    keyboard.add(InlineButton(text="Hello", callback_data="hello"))

    report = KeyboardVisualizer.generate_debug_report(
        keyboard, include_metrics=True
    )

    assert "PERFORMANCE SNAPSHOT" in report
    assert "Operation: to_dict" in report


def test_collect_performance_metrics_filters_operations():
    keyboard = InlineKeyboard()
    keyboard.add(InlineButton(text="Hello", callback_data="hello"))

    _, metrics = KeyboardVisualizer.collect_performance_metrics(
        keyboard, operations=["to_json"]
    )

    assert metrics
    assert metrics[0][0] == "to_json"


def test_preset_builds_keyboard_with_theme_layers():
    preset = preset_registry.get("confirmation")

    keyboard = preset.build(
        context={
            "yes_text": "Agree",
            "no_text": "Decline",
            "callback_pattern": "decision_{action}",
            "text_prefix": "👉 ",
            "callback_namespace": "flow",
            "footer": {"text": "Need help?", "callback_data": "help"},
        },
        themes=("text_prefix", "callback_namespace", "footer"),
    )

    rows = keyboard.keyboard
    assert rows[0][0].text.startswith("👉 ")
    assert rows[0][0].callback_data == "flow:decision_yes"
    assert rows[-1][0].text == "Need help?"


def test_builder_apply_preset_resolves_theme_names():
    builder = KeyboardBuilder(InlineKeyboard(row_width=2))

    builder.apply_preset(
        "menu",
        context={
            "menu_items": {"Home": "home", "Settings": "settings"},
            "callback_pattern": "nav_{action}",
            "callback_namespace": "demo",
        },
        themes=("callback_namespace",),
        theme_registry=theme_registry,
    )

    keyboard = builder.build()
    callbacks = [
        button.callback_data
        for row in keyboard.keyboard
        for button in row
        if isinstance(button, InlineButton)
    ]

    assert all(callback.startswith("demo:nav_") for callback in callbacks)
    assert keyboard.row_width == 2


def test_keyboard_factory_allows_theme_context_overrides():
    keyboard = KeyboardFactory.create_confirmation_keyboard(
        themes=("text_prefix",),
        extra_context={"text_prefix": "🔥 "},
    )

    first_button = keyboard.keyboard[0][0]
    assert first_button.text.startswith("🔥 ")
