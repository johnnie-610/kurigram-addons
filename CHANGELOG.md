# Changelog

All notable changes to **kurigram-addons** will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] — 2026-02-24

### Added

- **`kurigram_addons` unified namespace** — single entry-point for all imports:
  `from kurigram_addons import KurigramClient, Router, InlineKeyboard, ...`
- **`KurigramClient`** — `pyrogram.Client` subclass that replaces `patch()`.
  Middleware, FSM, routing, and storage are configured at construction time.
- **Conversation handler** (`Conversation`, `ConversationState`) — class-based
  declarative FSM flows with `on_enter`, `on_message`, `on_callback` hook
  decorators and automatic handler registration.
- **Menu system** (`Menu`, `MenuButton`) — declarative menus with auto
  back-button, edit-in-place navigation, and callback routing.
- **`Router.on_callback(data)`** — shorthand decorator for exact `callback_data`
  matching (wraps `on_callback_query` + `filters.regex`).
- **`Router.on_command(command)`** — shorthand decorator for command filters.
- **`InlineKeyboard.button(text, callback=...)`** — convenience method that
  pairs with `Router.on_callback()` for keyboard-router integration.
- **`FloodWaitHandler`** — automatic retry with configurable max wait and
  retry limit for `FloodWait` errors.
- **`parse_command` / `CommandParseError`** — typed argument parsing for
  `/command arg1 arg2` using `shlex` + function signature introspection.
- **`Depends()`** — FastAPI-style dependency injection for handlers with
  per-request caching.
- **`RateLimit`** — per-user / per-chat token-bucket rate limiter decorator
  with configurable window and reply message.

### Deprecated

- Direct imports from `pykeyboard` and `pyrogram_patch` packages now emit
  `DeprecationWarning`. Migrate to `from kurigram_addons import ...`.
  The old import paths will be removed in v1.0.0.
- `patch()` function — use `KurigramClient` instead.

### Changed

- Package distribution now includes `kurigram_addons` alongside `pykeyboard`
  and `pyrogram_patch`.

---

## [0.3.7] — 2026-02-23

### Fixed

- Documentation deployment on GitHub Pages (base path, SPA fallback, logo paths).
- Feature card titles visibility in docs site.

---

## [0.3.6] — 2026-02-21

### Fixed

- API documentation pages rendering correctly.
- External links in documentation.

---

## [0.3.5] — 2026-02-18

### Changed

- Updated PyPI package metadata and README.
