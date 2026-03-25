# Changelog

All notable changes to **kurigram-addons** will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-03-23

### Fixed

- **`KurigramClient.include_middleware()`** crashed with `AttributeError` on every
  call because it referenced a non-existent `pool.include_middleware()` method.
  Now correctly calls `await pool.add_middleware()` and is properly `async`.
- **`PatchHelper.data`** was an invalid async property — Python does not support
  async properties, so it silently returned a raw coroutine object instead of the
  data dict. Replaced with `await helper.get_data()`.
- **`global_pool` not reset after `unpatch()` / `stop()`** — a second `patch()` or
  `start()` call reused the cleared pool (missing storage, zeroed state, stale
  uptime). `reset_global_pool()` is now called inside both `unpatch()` and
  `KurigramClient.stop()`, and `PatchDataPool._instance` is cleared so
  `get_instance()` rebuilds cleanly.
- **`MemoryStorage` heap — premature key deletion on TTL renewal** — re-setting a
  key pushed a new heap entry but left the old one. When the stale entry fired,
  `_prune_expired` only checked key presence (not whether the expiry matched) and
  deleted a still-valid key. Fixed with a tombstone dict (`_current_expiry`) that
  maps each live key to its active expiry; heap entries whose expiry does not match
  are silently discarded.
- **`MemoryStorage` heap — ghost entries from `delete_state()` and CAS overwrites**
  — deleting or overwriting a key never removed the old heap entry, causing an
  unbounded memory leak under high traffic. Same tombstone fix covers this.
- **`MemoryStorage.get_state()` returned a mutable reference** — callers could
  mutate the stored dict in place, destroying the `compare_and_set` optimistic
  locking guarantee (the CAS check would compare an object to itself and always
  return `False`). `get_state()` now returns `copy.deepcopy(state)` and
  `set_state()` stores a deep copy.
- **`RateLimitMiddleware` never fired** — counters were stored as `{"count": N}`
  but `BaseStorage` uses the canonical `{"name": …, "data": {…}}` schema, so
  `state.get("count", 0)` always returned 0. Counters are now stored under
  `state["data"]["count"]` with a dedicated `__rl__:` key namespace to prevent
  collisions with real FSM state.
- **`FSMContextManager` fell back to `"global"` identifier** — when no chat or user
  ID could be extracted, all updates shared one FSM state, silently corrupting each
  other's conversations. Now raises a descriptive `FSMContextError` instead.
- **`errors.py` installed a root logger handler** — libraries must not configure
  logging. Replaced with `logging.NullHandler()`.
- **`PyrogramPatchError` logged at `ERROR` level on every instantiation** —
  `log_on_create` default changed from `True` to `False`, eliminating log spam
  from normal code paths such as filter evaluation misses.
- **`Callable` missing from `patch_data_pool.py` imports** — used in the
  `add_listener` type hint but not imported; `get_type_hints()` and any doc
  generator introspecting the method would raise `NameError`.
- **`FSMContext.update_data()` TOCTOU race** — concurrent handlers for the same
  user both read, applied changes to separate in-memory copies, and the last write
  silently discarded the other's changes. Replaced with a `compare_and_set` retry
  loop. Same fix applied to `set_state()` and `clear_data()`.
- **`PatchHelper.update_data()` non-atomic in-memory / storage update** — the
  lock was released after updating `_data` but before the FSM write, so a failed
  storage write left the two sources out of sync with no rollback. Storage is now
  written first; in-memory update only happens on success.
- **`AsyncCircuitBreaker._should_attempt_reset()` awaited while holding lock** —
  the method only does a time comparison but was declared `async def`. Awaiting
  it while holding `self._lock` would deadlock if the method ever acquired I/O.
  Made synchronous; `await` removed from both call sites (`call()` and
  `protect()`).
- **`_storage_circuit_breakers` global registry shared across all clients** — in
  multi-account bots, a Redis failure for one client tripped the breaker and
  blocked every other client's storage. `RedisStorage` now instantiates its own
  `AsyncCircuitBreaker` directly. The global `get_circuit_breaker()` helper is
  deprecated.
- **Handler data-map cache wrote to a shared function object** — two concurrent
  coroutines could both find the cache absent and both `setattr` the same handler
  function. Replaced with a module-level `_handler_data_maps` dict keyed by
  `id(handler)`.
- **`_validate_telegram_id()` accepted the full 64-bit signed range** — values
  like `-9223372036854775808` would pass validation and produce nonsensical storage
  keys. Tightened to `±10¹³` (well above any real Telegram ID) with an additional
  guard against `bool` values.
- **`config.py` `fallback_message` unsanitised** — the value is settable via
  `PYROGRAM_PATCH_CB_FALLBACK_MESSAGE` and was forwarded verbatim to users. Added
  a Pydantic `field_validator` that strips whitespace and enforces a 200-character
  cap.
- **`RedisStorage.list_keys()` `IndexError`** — `k.decode().split(":", 1)[1]`
  raised `IndexError` on any key without a colon. Replaced with `removeprefix()`
  and a `startswith()` guard.
- **`MemoryStorage` TTL cleanup task never started automatically** — TTLs were
  silently ignored unless the user remembered to call `await storage.start()`.
  `KurigramClient` now calls `storage.start()` and `storage.stop()` automatically
  as part of its lifecycle.
- **`ConversationContext.data` declared but never populated** — the docstring
  promised lazy population but no implementation existed; accessing it raised
  `AttributeError`. Replaced with `async def get_data(model=None)` which fetches
  from the helper and caches the result.
- **`pykeyboard` UTF-8 truncation bug** — `callback_data` byte-length was checked
  correctly but truncation used character slicing. A 64-character Cyrillic string
  (128 bytes) would pass the length check then get truncated to 64 characters
  (still 128 bytes), exceeding Telegram's limit. Truncation now slices bytes and
  decodes with `errors="ignore"`.
- **`FSMContext` history `push_history()` CAS always failed after first entry** —
  the `entries` list was mutated before being passed as `expected_state`, so the
  stored value and the expected value were always different after the first push.
  Fixed by copying the list before appending.
- **`kurigram_addons/__init__.py` hard-imported `pykeyboard`** — a pyrogram
  version mismatch in `pykeyboard` prevented the entire package from loading even
  when `pykeyboard` was not needed. The import is now wrapped in `try/except`.

### Added

- **`PatchHelper.get_data(model=None)`** — returns a copy of the data dict, or a
  validated Pydantic model instance when `model=` is provided, giving IDE
  autocomplete and schema validation at the point of use.
- **`PatchHelper.set_data(**kwargs)`** — replaces the entire data dict (unlike
  `update_data` which merges), synced atomically to FSM storage.
- **`BaseStorage.increment(identifier, amount=1, *, ttl=None)`** — new abstract
  method for atomic counter increments. `MemoryStorage` implements it with the
  internal asyncio lock; `RedisStorage` maps it directly to `INCRBY` + `EXPIRE`
  (O(1), no CAS loop). `SQLiteStorage` uses an UPSERT.
- **`RateLimitMiddleware` rewritten** — replaced the broken CAS loop with a single
  `storage.increment()` call. Eliminates all the previous issues: wrong schema,
  counter always reading zero, up to 5 round-trips per request under contention.
- **`MiddlewareContext` dataclass** — new preferred calling convention for
  middlewares. Annotate the first parameter as `MiddlewareContext` to receive a
  single structured object (`ctx.update`, `ctx.client`, `ctx.helper`) instead of
  relying on parameter-name sniffing. Old positional signatures still work.
- **`State.filter()`** and **`ConversationState.filter()`** — ergonomic shorthand
  that returns a `StateFilter` bound to the state, replacing stringly-typed
  `StateFilter("Registration:name")` with `Registration.name.filter()`.
- **`PatchDataPool.get_statistics()`** now returns a typed `PoolStatistics` frozen
  dataclass instead of a plain dict, with IDE-autocompleted fields.
- **`await app.stats()`** on `KurigramClient` — convenience method that delegates
  to the pool and raises a clear `PatchError` if called before `start()`.
- **`Router` async context manager** (`async with Router() as router`) — preferred
  over the sync form for consistency with the rest of the async API.
- **`patch()` and `unpatch()` emit `DeprecationWarning`** — both functions now
  warn at call time and point users to `KurigramClient`.
- **`reset_global_pool()`** — public function that clears the module-level pool
  singleton and the `PatchDataPool._instance` so that re-patching or restarting a
  client creates a fully fresh pool.
- **`CallbackData` factory** (`pykeyboard/callback_data.py`) — aiogram-style
  strongly-typed callback data. Subclass with a `prefix=` keyword, annotate fields,
  and get automatic `pack()` / `unpack()` / `button()` / `filter()` for free.
  Supports `int`, `float`, `str`, `bool` fields. Raises `ValueError` if the packed
  string would exceed Telegram's 64-byte limit.
- **`SQLiteStorage`** (`pyrogram_patch/fsm/storages/sqlite_storage.py`) — fully
  persistent FSM storage using `aiosqlite` with zero infrastructure. Implements
  the complete `BaseStorage` interface including `compare_and_set` via SQLite
  `BEGIN IMMEDIATE` transactions and `increment` via UPSERT. Background cleanup
  task prunes expired rows automatically.
- **`Conversation.timeout`** — class-level inactivity timeout in seconds. When
  set, every `goto()` call passes the TTL to the FSM storage key so the state
  auto-expires if the user stops responding.
- **`@use_middleware(*middlewares)`** / **`@middleware`**
  (`pyrogram_patch/middlewares/per_handler.py`) — attach middleware callables
  directly to a specific handler function. Executed before the global middleware
  chain. Supports `MiddlewareContext`, legacy positional, and class-instance
  middlewares. The dispatcher picks up the `__handler_middlewares__` attribute
  automatically.
- **`broadcast(client, user_ids, text, ...)`** (`kurigram_addons/broadcast.py`) —
  async generator that sends a message to an iterable of user IDs, absorbing
  `FloodWait` up to `max_flood_wait` seconds, silently skipping blocked/deactivated
  users, and yielding a `BroadcastResult` per user in real time.
- **`FSMContext.push_history()` / `get_history()` / `clear_history()`** — state
  transition audit ring-buffer stored under a separate key in FSM storage. Returns
  `[{"state": str, "at": float}, ...]`, newest last. Hard cap of 50 entries.
- **`Router.on_callback_data(pattern)`** — registers a callback query handler with
  regex capture group injection. Named groups (`(?P<name>…)`) and positional groups
  (`(…)`) are extracted from `query.data` and injected as keyword arguments into
  the handler.
- **`HealthServer`** / **`KurigramClient(health_port=N)`** — lightweight asyncio
  HTTP server (stdlib only, no aiohttp dependency) that serves `GET /health` as
  JSON containing pool statistics and storage health. Returns 200 OK or 503
  Service Unavailable. Designed for Kubernetes liveness probes and Docker
  `HEALTHCHECK`.
- **`DIContainer`** / **`Depends`** (`pyrogram_patch/di.py`) — dependency
  injection container. Register providers by type (`async def`, async generator,
  plain value, or class). Handlers declare dependencies by type annotation or
  `default=Depends(provider)`. The dispatcher resolves and injects them
  automatically without any per-handler boilerplate.
- **`I18nMiddleware`** (`kurigram_addons/i18n.py`) — before-middleware that
  detects each user's language from their Telegram profile and injects a `_()`
  translation callable into the helper under the `"_"` key. Supports GNU `gettext`
  `.mo` files and simple JSON translation tables, with a fluent fallback chain
  (user language → default language → identity function).
- **`testing` module** (`kurigram_addons/testing.py`) — factory functions
  (`make_message`, `make_callback_query`, `make_inline_query`, `make_user`,
  `make_chat`) and `MockClient` for unit-testing handlers without hitting
  Telegram's API. `ConversationTester` drives full `Conversation` flows in tests
  by simulating messages, callbacks, and assertions on replied text and FSM state.

### Changed

- `FSMContext.set_state()`, `update_data()`, and `clear_data()` are now backed by
  a shared `_cas_update()` helper that retries up to 10 times on CAS contention
  before raising `FSMTransitionError`. All three were previously naked
  read-modify-write operations with no concurrency protection.
- `PatchHelper.update_data()` now writes to FSM storage **before** updating the
  in-memory dict, so a storage failure leaves both sources unchanged.
- `_handler_data_maps` cache moved from `setattr` on function objects to a
  module-level dict keyed by `id(handler)`, eliminating the shared-object mutation
  race.
- `MiddlewareManager._add()` inspects the first parameter's type annotation for
  `MiddlewareContext` and sets `entry.uses_context_object = True`, enabling the
  new single-argument calling convention without breaking old signatures.
- `PatchDataPool.get_statistics()` return type changed from `Dict[str, Any]` to
  the new `PoolStatistics` frozen dataclass. Callers using dict-key access will
  need to switch to attribute access.
- `RedisStorage` no longer uses the global `get_circuit_breaker()` registry;
  each instance creates its own `AsyncCircuitBreaker` directly.
- `kurigram_addons` version bumped from `0.4.2` to `0.5.0`.

### Deprecated

- **`patch()` / `unpatch()`** — now emit `DeprecationWarning`. Use
  `KurigramClient` instead. Will be removed in v1.0.0.
- **`get_circuit_breaker(name)`** — now emits `DeprecationWarning`. Instantiate
  `AsyncCircuitBreaker` directly inside storage classes instead. Will be removed
  in v1.0.0.

---

## [0.4.1] — 2026-03-03

### Fixed

- **Menu registry**: `Menu._registry` no longer leaks across test suites — menus are auto-removed from the registry on garbage collection.
- **RateLimit memory leak**: `_buckets` now uses a bounded `OrderedDict` with LRU eviction (max 10,000 entries) and TTL-based stale cleanup.
- **`_create_button` cache safety**: Changed from shallow to deep copy (`model_copy(deep=True)`) to prevent cache poisoning.
- **ConversationState hook resolution**: Hook decorators now store a reference to the descriptor instance instead of `_name` (which was `None` at decoration time). The metaclass resolves state names by identity comparison.
- **`parse_command` missing args**: Now raises `CommandParseError` when required arguments are missing instead of silently returning an empty dict. Supports `Optional[T]` types for truly optional parameters.
- **`CircuitBreakerConfig` duplication**: `AsyncCircuitBreaker` now accepts both the Pydantic config from `config.py` and the legacy dataclass, with automatic adaptation.
- **`ReplyButton.write()`**: Now passes `client` argument to `pyrogram_button.write()` consistently.
- **`_add_serialization_methods`**: Fixed double `classmethod()` wrapping in `from_json` assignment.
- **CRLF line endings**: Normalized `reply_keyboard.py` to LF.
- **Unused import**: Removed `import re` from `menu.py`.

### Added

- **Lifecycle hooks**: `KurigramClient.on_startup` and `on_shutdown` decorators for registering async callbacks that run after start and before stop.
- **`InlineKeyboard.copy()`**: Convenience method for creating keyboard copies (deep by default).
- **`RateLimit.on_limited`**: Optional async callback `(client, update, remaining)` called instead of the default reply when rate-limited.
- **`Optional[T]` support in `parse_command`**: Type hints using `Optional[int]` are treated as non-required parameters.

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
