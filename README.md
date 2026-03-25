<div align="center">
    <img src="./logo.png" alt="kurigram-addons logo" width="150"/>
    <h1>kurigram-addons</h1>
    <p><em>Advanced toolset for the Kurigram / Pyrogram ecosystem.</em></p>
    <p>
        <a href="https://pypi.org/project/kurigram-addons/"><img src="https://img.shields.io/pypi/v/kurigram-addons.svg" alt="PyPI" /></a>
        <a href="https://pepy.tech/projects/kurigram-addons"><img src="https://static.pepy.tech/personalized-badge/kurigram-addons?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=BRIGHTGREEN&left_text=downloads" alt="Downloads" /></a>
        <a href="https://github.com/johnnie-610/kurigram-addons/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
        <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.10+-blue.svg" alt="Python" /></a>
    </p>
</div>

**`kurigram-addons`** is a production-grade toolkit for building Telegram bots with [Kurigram](https://pypi.org/project/kurigram/). It layers a clean, opinionated API on top of Pyrogram: a `Client` subclass, declarative FSM conversations, strongly-typed callback data, a full DI container, middleware with typed context, per-handler guards, broadcast helpers, i18n, SQLite storage, health checks, and a comprehensive testing module — all with zero boilerplate.

> 📚 **[Full Documentation →](https://johnnie-610.github.io/kurigram-addons/)**
> 📋 **[Changelog →](./CHANGELOG.md)**
> 🤖 **[Showcase bot →](./showcase_bot.py)**

---

## ✨ What's new in v0.5.0

This release is the largest since v0.4.0. It fixes every known correctness bug, hardens concurrency, and adds new features.

**Bug fixes**
- `await helper.get_data()` replaces the broken async property `helper.data`
- `global_pool` is now reset after `stop()` so restarting a client works cleanly
- `MemoryStorage` heap tombstoning — TTL renewal and key deletion no longer cause premature expiry or ghost entries
- `MemoryStorage.get_state()` returns a deep copy, fixing optimistic locking
- `RateLimitMiddleware` now actually fires — the counter schema was wrong in previous versions
- `FSMContextManager` raises a clear error instead of silently sharing state via a `"global"` fallback identifier
- `include_middleware()` on `KurigramClient` was calling a nonexistent method — fixed

**Concurrency & security**
- `FSMContext.update_data()`, `set_state()`, and `clear_data()` are now atomic via CAS retry loops
- Per-instance circuit breakers — multi-account bots no longer share one breaker across all clients
- `_validate_telegram_id()` tightened to realistic Telegram ID ranges
- `fallback_message` validated at config load time with a 200-character cap

**New features (Phase 4)**

| Feature | What it gives you |
|---------|-------------------|
| `CallbackData` | Strongly-typed, versioned callback data — no more raw strings |
| `SQLiteStorage` | Persistent FSM with zero infrastructure (`aiosqlite`) |
| `Conversation.timeout` | Auto-finish idle conversations via storage TTL |
| `@use_middleware` | Scope middleware to a single handler, not globally |
| `broadcast()` | Async-generator bulk sender with FloodWait handling |
| `FSMContext.get_history()` | State-transition audit ring-buffer |
| `Router.on_callback_data(pattern)` | Regex capture groups injected as handler kwargs |
| `KurigramClient(health_port=N)` | HTTP `/health` endpoint for container orchestration |
| `DIContainer` / `Depends` | Full dependency injection, resolved by type annotation |
| `I18nMiddleware` | Auto-detects user language, injects `_()` into helper |
| `kurigram_addons.testing` | Mock factories and `ConversationTester` for unit tests |

**DX improvements**
- `MiddlewareContext` dataclass — one typed object instead of positional name sniffing
- `State.filter()` / `ConversationState.filter()` — replace `StateFilter("Cls:state")`
- `await app.stats()` returns a typed `PoolStatistics` frozen dataclass
- `BaseStorage.increment()` — atomic counter, maps to Redis `INCRBY`
- `Router` supports `async with` context manager
- `MemoryStorage` auto-started and auto-stopped by `KurigramClient`
- `patch()` and `unpatch()` deprecated — emit `DeprecationWarning`

---

## 📦 Installation

```bash
pip install kurigram-addons
```

Optional extras:

```bash
pip install kurigram-addons[redis]    # RedisStorage
pip install kurigram-addons[sqlite]   # SQLiteStorage (aiosqlite)
```

**Requirements:** Python 3.10+, kurigram ≥ 2.1.35 (or compatible Pyrogram fork), pydantic ≥ 2.11.

---

## 🚀 Quick start

```python
from kurigram_addons import KurigramClient, Router, MemoryStorage
from pykeyboard.callback_data import CallbackData

router = Router()


class Action(CallbackData, prefix="act"):
    name: str


@router.on_command("start")
async def start(client, message):
    from kurigram_addons import InlineKeyboard
    kb = InlineKeyboard(row_width=2)
    kb.add(Action(name="profile").button("👤 Profile"))
    kb.add(Action(name="settings").button("⚙️ Settings"))
    await message.reply("Welcome!", reply_markup=kb)


@router.on_callback_data(r"act:(?P<name>\w+)")
async def on_action(client, query, name: str):
    await query.answer(f"Opening {name}…", show_alert=True)


app = KurigramClient(
    "my_bot",
    bot_token="YOUR_TOKEN",
    storage=MemoryStorage(),
    auto_flood_wait=True,
)
app.include_router(router)
app.run()
```

---

## 🧩 Features

### KurigramClient

The recommended entry point. Replaces the deprecated `patch()` function. Everything is configured at construction time and the client manages its own lifecycle.

```python
from kurigram_addons import KurigramClient, MemoryStorage

app = KurigramClient(
    "my_bot",
    api_id=12345,
    api_hash="...",
    bot_token="...",
    storage=MemoryStorage(),   # auto-started and auto-stopped
    auto_flood_wait=True,      # absorb FloodWait automatically
    max_flood_wait=60,         # raise if Telegram asks to wait longer
    health_port=8080,          # optional: GET /health for container probes
)

app.include_router(router)
app.include_conversation(Registration)
app.include_menus(main_menu, profile_menu)
app.run()
```

#### Lifecycle hooks

```python
@app.on_startup
async def init_db():
    await database.connect()

@app.on_shutdown
async def close_db():
    await database.disconnect()
```

#### Live pool statistics

`await app.stats()` returns a **frozen dataclass** — IDE-autocompleted fields, not a plain dict:

```python
@router.on_command("stats")
async def stats_cmd(client, message):
    s = await app.stats()
    await message.reply(
        f"Active helpers: {s.active_helpers}\n"
        f"Uptime: {s.uptime:.0f}s\n"
        f"Total created: {s.total_helpers_created}"
    )
```

---

### CallbackData — strongly-typed callbacks

Declare callback payloads as typed classes. Encoding, decoding, overflow checks, and Pyrogram filters are handled automatically.

```python
from pykeyboard.callback_data import CallbackData

class Page(CallbackData, prefix="pg"):
    num: int
    total: int

# Building a button
btn = Page(num=3, total=10).button("Page 3")
# btn.callback_data == "pg:3:10"

# Decoding in a handler
obj = Page.unpack("pg:3:10")
print(obj.num, obj.total)  # 3  10

# Pyrogram filter — exact class match
@router.on_callback_query(Page.filter())
async def any_page(client, query): ...

# Pyrogram filter — specific field value
@router.on_callback_query(Page.filter(num=1))
async def first_page(client, query): ...
```

**Supported field types:** `str`, `int`, `float`, `bool`.  
`pack()` raises `ValueError` if the encoded string exceeds Telegram's 64-byte limit.

---

### Router

```python
from kurigram_addons import Router

router = Router()

# Exact command
@router.on_command("start")
async def start(client, message): ...

# Exact callback_data string
@router.on_callback("profile")
async def profile(client, query): ...

# Regex with capture group injection (NEW in v0.5.0)
@router.on_callback_data(r"page:(?P<num>\d+)")
async def paginate(client, query, num: str):
    # `num` injected automatically from the named capture group
    await show_page(query, int(num))

# Positional groups → group_1, group_2, ...
@router.on_callback_data(r"item:(\d+):(buy|sell)")
async def trade(client, query, group_1: str, group_2: str): ...

# Sub-router composition
child = Router()
router.include_router(child)

# Async context manager
async with Router() as r:
    @r.on_command("ping")
    async def ping(client, message): ...
    r.set_client(app)
# handlers unregistered here
```

---

### Conversation handler

Declarative multi-step FSM flows. State transitions are backed by the configured FSM storage — conversations survive bot restarts when `SQLiteStorage` or `RedisStorage` is used.

```python
from kurigram_addons import Conversation, ConversationState, ConversationContext

class Registration(Conversation):
    timeout = 300           # auto-finish after 5 min of inactivity (NEW)

    name    = ConversationState(initial=True)
    age     = ConversationState()
    confirm = ConversationState()

    @name.on_enter
    async def ask_name(self, ctx: ConversationContext):
        await ctx.message.reply("What is your name?")

    @name.on_message
    async def save_name(self, ctx: ConversationContext):
        await ctx.helper.update_data(name=ctx.message.text)
        await self.goto(ctx, self.age)

    @age.on_enter
    async def ask_age(self, ctx: ConversationContext):
        await ctx.message.reply("How old are you?")

    @age.on_message
    async def save_age(self, ctx: ConversationContext):
        if not ctx.message.text.isdigit():
            await ctx.message.reply("Please enter a number.")
            return
        await ctx.helper.update_data(age=int(ctx.message.text))
        await self.goto(ctx, self.confirm)

    @confirm.on_enter
    async def ask_confirm(self, ctx: ConversationContext):
        # v0.5.0: await ctx.get_data() — lazy, cached, correctly awaited.
        # The old ctx.helper.data async property is removed.
        data = await ctx.get_data()
        await ctx.message.reply(
            f"Name: {data['name']}, Age: {data['age']}. Confirm? (yes/no)"
        )

    @confirm.on_message
    async def do_confirm(self, ctx: ConversationContext):
        if ctx.message.text.lower() == "yes":
            data = await ctx.get_data()
            await ctx.message.reply(f"Welcome, {data['name']}!")
        else:
            await ctx.message.reply("Cancelled.")
        await self.finish(ctx)

app.include_conversation(Registration)
```

**Typed data access with a Pydantic model:**

```python
from pydantic import BaseModel

class UserData(BaseModel):
    name: str
    age: int

data = await ctx.get_data(model=UserData)
print(data.name, data.age)   # IDE-autocompleted, schema-validated
```

**State filter shorthand:**

```python
# v0.5.0 — no more stringly-typed filters
@router.on_message(Registration.name.filter())
async def in_name_state(client, message, patch_helper): ...

# v0.4.x — the old way (still works, but verbose)
from pyrogram_patch.fsm.filter import StateFilter
@router.on_message(StateFilter("Registration:name"))
async def in_name_state(client, message, patch_helper): ...
```

---

### FSM storage

Three backends, all implementing the same `BaseStorage` interface.

#### MemoryStorage

In-process, non-persistent. Good for development and stateless bots.

```python
from kurigram_addons import MemoryStorage

# TTL cleanup runs automatically — no need to call storage.start() manually.
# KurigramClient starts and stops the backend as part of its own lifecycle.
storage = MemoryStorage(default_ttl=0)
```

#### SQLiteStorage _(new in v0.5.0)_

Persistent with zero infrastructure. Uses `aiosqlite` under the hood. `compare_and_set` is atomic via `BEGIN IMMEDIATE`.

```python
from pyrogram_patch.fsm.storages.sqlite_storage import SQLiteStorage

app = KurigramClient("my_bot", storage=SQLiteStorage("fsm.db"), ...)
```

#### RedisStorage

For distributed or multi-process deployments. Each `RedisStorage` instance owns its own circuit breaker — failures for one client do not trip the breaker for others.

```python
import redis.asyncio as aioredis
from pyrogram_patch.fsm.storages.redis_storage import RedisStorage

redis = aioredis.from_url("redis://localhost")
app = KurigramClient("my_bot", storage=RedisStorage(redis, prefix="bot"), ...)
```

#### Custom storage

Subclass `BaseStorage` and implement six methods. `increment()` is new in v0.5.0 — it maps to `INCRBY` on Redis, a locked integer add on MemoryStorage, and an UPSERT on SQLite.

```python
from pyrogram_patch.fsm.base_storage import BaseStorage

class MyStorage(BaseStorage):
    async def set_state(self, identifier, state, *, ttl=None): ...
    async def get_state(self, identifier): ...
    async def delete_state(self, identifier): ...
    async def compare_and_set(self, identifier, new_state, *, expected_state=None, ttl=None): ...
    async def list_keys(self, pattern="*"): ...
    async def clear_namespace(self): ...
    async def increment(self, identifier, amount=1, *, ttl=None): ...  # NEW
```

---

### FSM state history _(new in v0.5.0)_

A ring-buffer of up to 50 recent state transitions, stored under a separate key so it never interferes with FSM state.

```python
@router.on_command("history")
async def history_cmd(client, message, patch_helper):
    if patch_helper._fsm_ctx is None:
        await message.reply("No active conversation.")
        return

    entries = await patch_helper._fsm_ctx.get_history(limit=5)
    # [{"state": "Registration:name", "at": 1711234567.0}, ...]

    for entry in reversed(entries):
        print(entry["state"], entry["at"])

    # Clear when done
    await patch_helper._fsm_ctx.clear_history()
```

---

### Middleware

#### Global middleware

```python
from pyrogram_patch.middlewares.middleware_manager import MiddlewareContext

# NEW in v0.5.0: single typed context object — no positional name sniffing
async def audit_log(ctx: MiddlewareContext) -> None:
    user = getattr(ctx.update, "from_user", None)
    if user:
        print(f"[{user.id}] {type(ctx.update).__name__}")

# Legacy positional signatures still work unchanged
async def old_style(update, client, patch_helper) -> None:
    print(update)

@app.on_startup
async def setup():
    await app._pool.add_middleware(audit_log,  kind="before", priority=50)
    await app._pool.add_middleware(old_style,  kind="before", priority=40)
```

#### Per-handler middleware _(new in v0.5.0)_

Scope middleware to a single handler instead of running it globally on every update.

```python
from kurigram_addons import use_middleware

async def require_admin(update, client, patch_helper):
    user = getattr(update, "from_user", None)
    if user and user.id not in ADMIN_IDS:
        await update.reply("⛔ Admins only.")
        from pyrogram import StopPropagation
        raise StopPropagation

@router.on_command("ban")
@use_middleware(require_admin)          # only runs for /ban
async def ban_cmd(client, message): ...

# Stack multiple guards (outer-first execution)
@router.on_command("broadcast")
@use_middleware(require_admin)
@use_middleware(RateLimit(per_user=1, window=60))
async def broadcast_cmd(client, message): ...
```

#### Around middleware

```python
async def timing(handler, update, client=None):
    import time
    t = time.perf_counter()
    result = await handler()          # call the actual handler
    elapsed = (time.perf_counter() - t) * 1000
    print(f"Handler took {elapsed:.1f}ms")
    return result

await app._pool.add_middleware(timing, kind="around")
```

#### Rate-limit middleware

Uses `storage.increment()` — a single atomic call, no CAS loop, works correctly with all backends.

```python
from pyrogram_patch.middlewares.rate_limit import RateLimitMiddleware

rl = RateLimitMiddleware(rate=10, period=60, scope="user", block=True)

@app.on_startup
async def setup():
    await app._pool.add_middleware(rl, kind="before")
```

---

### Dependency Injection _(new in v0.5.0)_

Declare what a handler needs by type annotation. The `DIContainer` resolves and injects automatically — no `Depends()` marker required for annotated parameters.

```python
from kurigram_addons import DIContainer, Depends

di = DIContainer()

class Database:
    async def get_user(self, uid: int): ...

async def get_db() -> Database:
    return Database()

di.register(Database, get_db)

# Attach once — the dispatcher picks it up for every handler
di.attach(app)

# Injection by type annotation
@router.on_command("profile")
async def profile(client, message, db: Database):
    user = await db.get_user(message.from_user.id)
    await message.reply(f"Hello, {user.name}!")

# Explicit Depends() marker for ambiguous or dynamic providers
@router.on_command("config")
async def config_cmd(client, message, cfg=Depends(get_config)):
    await message.reply(f"Version: {cfg.version}")

# Register a plain value (no factory call)
di.register_value(AppConfig, AppConfig(debug=True))
```

---

### i18n middleware _(new in v0.5.0)_

Detects each user's language from their Telegram profile. Injects a `_()` translation callable into the helper under the key `"_"`.

**JSON locale files** (`locales/en.json`, `locales/ru.json`, …):

```json
{"greeting": "Hello!", "farewell": "Goodbye!"}
```

```python
from kurigram_addons import I18nMiddleware

i18n = I18nMiddleware(
    default_lang="en",
    locales_path="locales",
    use_json=True,
)

@app.on_startup
async def setup():
    await app._pool.add_middleware(i18n, kind="before")

@router.on_command("hello")
async def hello(client, message, patch_helper):
    _ = await patch_helper.get("_") or (lambda k: k)
    await message.reply(_("greeting"))
```

**GNU gettext** (`.po`/`.mo` files): omit `use_json=True`.

---

### Broadcast _(new in v0.5.0)_

An async generator that sends a message to many users, automatically absorbing `FloodWait` and skipping blocked / deactivated accounts.

```python
from kurigram_addons import broadcast

@router.on_command("announce")
async def announce(client, message):
    user_ids = await db.get_all_user_ids()
    ok = fail = skip = 0

    async for result in broadcast(
        client,
        user_ids,
        "📢 Important update!",
        delay=0.05,           # 50ms between sends
        max_flood_wait=60,    # absorb FloodWait ≤ 60s; surface larger ones
        on_error="skip",      # "skip" or "stop"
    ):
        if result.ok:      ok   += 1
        elif result.skipped: skip += 1
        else:              fail += 1

    await message.reply(f"Sent {ok} | Skipped {skip} | Failed {fail}")
```

---

### Health check endpoint _(new in v0.5.0)_

Pass `health_port=N` to `KurigramClient`. A lightweight stdlib-only HTTP server starts alongside the bot and serves `GET /health` as JSON.

```python
app = KurigramClient("my_bot", ..., health_port=8080)
```

```
GET /health
→ 200 OK
{
  "status": "ok",
  "pool": {"active_helpers": 2, "uptime": 3600.0, ...},
  "storage": "healthy"
}
```

Returns `503 Service Unavailable` when storage reports unhealthy. Useful for Kubernetes liveness/readiness probes and Docker `HEALTHCHECK`.

---

### Menu system

```python
from kurigram_addons import Menu

main     = Menu("main",     text="📋 Main Menu")
profile  = Menu("profile",  text="👤 Profile",  parent=main)
settings = Menu("settings", text="⚙️ Settings", parent=main)

main.button("👤 Profile",  goto="profile")
main.button("⚙️ Settings", goto="settings")

async def edit_name(client, query):
    await query.answer("✏️ Edit name")

profile.button("✏️ Edit Name", callback=edit_name)

app.include_menus(main, profile, settings)
```

Every non-root menu automatically gets a **Back** button. Navigation state is maintained in the FSM storage.

---

### Rate limiting

**Decorator** (per-handler, no storage required):

```python
from kurigram_addons import RateLimit

@router.on_command("generate")
@RateLimit(per_user=3, window=60, message="⏳ Retry in {remaining}s.")
async def generate(client, message):
    await message.reply("Generating…")

# Custom handler for when the limit is hit
async def on_limited(client, update, remaining):
    await update.reply(f"⏳ Wait {remaining}s before trying again.")

@RateLimit(per_user=3, window=60, on_limited=on_limited)
```

**Middleware** (global, storage-backed, atomic):

```python
from pyrogram_patch.middlewares.rate_limit import RateLimitMiddleware

rl = RateLimitMiddleware(rate=20, period=60, scope="user")

@app.on_startup
async def setup():
    await app._pool.add_middleware(rl, kind="before")
```

---

### Command parser

```python
from kurigram_addons import parse_command, CommandParseError
from typing import Optional

@router.on_command("ban")
async def ban(client, message):
    try:
        args = parse_command(message.text, user_id=int, reason=Optional[str])
        # /ban 12345         → {"user_id": 12345, "reason": None}
        # /ban 12345 spam    → {"user_id": 12345, "reason": "spam"}
        await do_ban(args["user_id"], args.get("reason"))
    except CommandParseError as e:
        await message.reply(f"Usage: `/ban <user_id> [reason]`\n`{e}`")
```

---

### Keyboards

```python
from kurigram_addons import InlineKeyboard, ReplyKeyboard, ReplyButton

# Inline — with CallbackData buttons
from pykeyboard.callback_data import CallbackData

class Color(CallbackData, prefix="c"):
    name: str

kb = InlineKeyboard(row_width=3)
for name in ("Red", "Green", "Blue"):
    kb.add(Color(name=name.lower()).button(name))

# Reply keyboard
rk = ReplyKeyboard(resize_keyboard=True, one_time_keyboard=True)
rk.add(
    ReplyButton("📍 Location", request_location=True),
    ReplyButton("📞 Contact",  request_contact=True),
)

# Pagination
kb.paginate(total_pages=10, current_page=3, pattern="page_{number}")
```

---

### Testing _(new in v0.5.0)_

Unit-test handlers and conversations without hitting Telegram's API.

```python
from kurigram_addons.testing import (
    make_message,
    make_callback_query,
    MockClient,
    ConversationTester,
)

# Mock objects
msg    = make_message(text="/start", user_id=42, chat_id=100)
query  = make_callback_query(data="pg:2:10", user_id=42)
client = MockClient(me_id=999)

# MockClient records all sends
await client.send_message(100, "Hello!")
assert client.sent[0]["text"] == "Hello!"
client.reset()

# ConversationTester drives a full Conversation flow
async def test_registration():
    tester = ConversationTester(Registration)

    await tester.start(user_id=1, chat_id=1)
    assert tester.current_state == "Registration:name"

    await tester.send_message("Alice")
    assert tester.current_state == "Registration:age"

    await tester.send_message("30")
    assert tester.current_state == "Registration:confirm"

    tester.assert_replied("Confirm your details")
```

---

## 🔐 Migration from v0.4.x

### `helper.data` → `await helper.get_data()`

```python
# v0.4.x — broken async property (returned a coroutine, not the dict)
data = await ctx.helper.data       # ❌

# v0.5.0 — correct
data = await ctx.helper.get_data() # ✅
data = await ctx.get_data()        # ✅ inside ConversationContext
```

### `StateFilter("Cls:state")` → `Cls.state.filter()`

```python
# v0.4.x
from pyrogram_patch.fsm.filter import StateFilter
@router.on_message(StateFilter("Registration:name"))

# v0.5.0
@router.on_message(Registration.name.filter())
```

### `patch()` / `unpatch()` → `KurigramClient`

`patch()` and `unpatch()` now emit `DeprecationWarning` and will be removed in v1.0.0.

```python
# v0.4.x — deprecated
from pyrogram_patch import patch
manager = await patch(app)

# v0.5.0 — recommended
app = KurigramClient("my_bot", storage=MemoryStorage(), ...)
```

### Direct package imports

Old import paths still work but also emit `DeprecationWarning`:

```python
# ⚠️ Deprecated (still works in v0.5.0, removed in v1.0.0)
from pykeyboard import InlineKeyboard
from pyrogram_patch import patch

# ✅ Recommended
from kurigram_addons import InlineKeyboard, KurigramClient
```

---

## 🏗️ Architecture overview

```
kurigram_addons/          ← unified public namespace
├── client.py             ← KurigramClient
├── conversation.py       ← Conversation, ConversationState, ConversationContext
├── menu.py               ← Menu, MenuButton
├── broadcast.py          ← broadcast(), BroadcastResult          (NEW)
├── health.py             ← HealthServer                           (NEW)
├── i18n.py               ← I18nMiddleware                        (NEW)
└── testing.py            ← MockClient, ConversationTester, ...   (NEW)

pyrogram_patch/           ← dispatcher, FSM, middleware
├── dispatcher.py         ← PatchedDispatcher (DI + per-handler middleware)
├── patch_data_pool.py    ← PatchDataPool, PoolStatistics
├── di.py                 ← DIContainer, Depends                  (NEW)
├── fsm/
│   ├── base_storage.py   ← BaseStorage (+ increment() abstract method)
│   ├── context.py        ← FSMContext (CAS writes, get_history())
│   ├── states.py         ← State, StatesGroup (+ .filter())
│   └── storages/
│       ├── memory_storage.py   ← MemoryStorage (tombstone heap, deepcopy)
│       ├── redis_storage.py    ← RedisStorage (per-instance breaker)
│       └── sqlite_storage.py   ← SQLiteStorage                   (NEW)
└── middlewares/
    ├── middleware_manager.py   ← MiddlewareContext, MiddlewareManager
    ├── per_handler.py          ← use_middleware, run_handler_middlewares (NEW)
    └── rate_limit.py           ← RateLimitMiddleware (uses increment())

pykeyboard/               ← keyboard builder
└── callback_data.py      ← CallbackData                          (NEW)
```

---

## 🤝 Contributing

```bash
git clone https://github.com/johnnie-610/kurigram-addons.git
cd kurigram-addons
poetry install
poetry run pytest tests/
```

Bug reports and pull requests are welcome on the [issue tracker](https://github.com/johnnie-610/kurigram-addons/issues).

---

## 📝 License

MIT — see [LICENSE](./LICENSE) for details.