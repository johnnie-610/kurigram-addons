# PyKeyboard Overview

PyKeyboard is a batteries-included toolkit for designing Telegram inline and reply keyboards with confidence. It pairs fluent builders with visualization and profiling utilities so you can iterate quickly and ship ergonomic interfaces.

## Core capabilities

- **Fluent builders** – Compose keyboards row-by-row using `KeyboardBuilder`, register validation rules with `add_validator`, and transform buttons on the fly via `add_button_transform`.
- **Preset catalog** – Reuse curated layouts from `pykeyboard.presets`, layer in project-specific themes, and publish your own packs to the registry.
- **Adaptive locales** – Generate locale-aware language pickers that remember per-user preferences and annotate unavailable translations out of the box.
- **Visualization & profiling** – Render ASCII layouts, export JSON/YAML representations, and embed build/serialization metrics in your design reviews.

## When to reach for PyKeyboard

Use PyKeyboard whenever you need:

1. Predictable keyboard validation before you hit Telegram API errors.
2. Consistent layout logic across multiple bots or message flows.
3. Insight into how keyboards evolve over time, especially in large teams.

Ready to build? Dive into the [PyKeyboard tutorial](../tutorials/build-an-adaptive-keyboard.md) for a practical walkthrough.
