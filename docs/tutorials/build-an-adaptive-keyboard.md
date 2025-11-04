# Build an Adaptive Keyboard

Learn how to assemble a locale-aware inline keyboard using PyKeyboard's builder, presets, and adaptive locale tooling.

## Prerequisites

- Python 3.9+
- `pykeyboard` installed (from this repository or PyPI)

```bash
pip install pykeyboard
```

## 1. Choose a preset

```python
from pykeyboard import InlineKeyboard
from pykeyboard.presets import inline_presets

builder = inline_presets.get("confirm_dialog").spawn_builder()
```

Presets encapsulate row structure and validation logic so you can focus on content.

## 2. Apply themes

```python
from pykeyboard.presets import inline_themes

theme = inline_themes.chain(
    inline_themes.prefix_text("✅"),
    inline_themes.namespace_callbacks("confirm")
)

theme.apply(builder)
```

Themes bundle button transforms and validators to keep naming and styling conventions consistent.

## 3. Personalize content

```python
builder.text_button("Proceed", callback_data="confirm:yes")
builder.text_button("Cancel", callback_data="confirm:no")
```

Validators defined by the preset and theme ensure callback data remains within your namespace.

## 4. Enable adaptive locales

```python
keyboard = InlineKeyboard.languages(
    locales=["en_US", "es_ES", "de_DE"],
    user_id=12345,
    remember=True,
    unavailable_suffix="(soon)"
)
```

Locale metadata is cached per user so subsequent keyboards can highlight their last choice.

## 5. Visualize the layout

```python
from pykeyboard.visualization import KeyboardVisualizer

report = KeyboardVisualizer.visualize(keyboard, include_metrics=True)
print(report)
```

The visualizer blends ASCII art with profiling stats, giving you instant feedback on structure and performance.

> ✅ You now have a dynamic, well-instrumented keyboard ready to plug into your bot.
