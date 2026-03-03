<div align="center">
    <img src="./logo.png" alt="kurigram-addons Logo" width="150"/>
    <h1>kurigram-addons</h1>
    <p><em>Advanced toolset for the Kurigram / Pyrogram ecosystem.</em></p>
    <p>
        <a href="https://pypi.org/project/kurigram-addons/"><img src="https://img.shields.io/pypi/v/kurigram-addons.svg" alt="PyPI" /></a>
        <a href="https://pepy.tech/projects/kurigram-addons"><img src="https://static.pepy.tech/personalized-badge/kurigram-addons?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=BRIGHTGREEN&left_text=downloads" alt="PyPI Downloads"></a>
        <a href="https://github.com/johnnie-610/kurigram-addons"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
        <a href="https://github.com/johnnie-610/kurigram-addons"><img src="https://img.shields.io/badge/python-3.10+-blue.svg" alt="Python" /></a>
    </p>
</div>

**`kurigram-addons`** is a professional toolkit for building production Telegram bots with [Kurigram](https://pypi.org/project/kurigram/). It provides a `Client` subclass, declarative FSM conversations, a menu system, dependency injection, rate limiting, lifecycle hooks, and a powerful keyboard framework.

> 📚 **[Documentation (v0.4.x) →](https://johnnie-610.github.io/kurigram-addons/v0.4/)**
> 📖 **[Documentation (v0.3.x) →](https://johnnie-610.github.io/kurigram-addons/)**

## ✨ What's New in v0.4.1

- **Lifecycle hooks** — `@app.on_startup` / `@app.on_shutdown` for async init/teardown.
- **`RateLimit.on_limited`** — custom async callback when rate limit is hit.
- **`Optional[T]` support** — `parse_command` now supports optional parameters.
- **Required arg enforcement** — `parse_command` raises `CommandParseError` on missing args.
- **Bug fixes** — menu registry leak, rate-limit memory leak, keyboard cache poisoning, ConversationState hook resolution, and more.

See the full [CHANGELOG](./CHANGELOG.md) for details.

## 📦 Installation

```bash
pip install kurigram-addons
```

> **Requirements**: Python 3.10+, `kurigram` >= 2.1.35 (or compatible Pyrogram fork), `pydantic` >= 2.11.

## 🚀 Quick Start

```python
from kurigram_addons import KurigramClient, Router, MemoryStorage, InlineKeyboard

router = Router()

@router.on_command("start")
async def start(client, message):
    kb = InlineKeyboard(row_width=2)
    kb.button("👤 Profile", callback="profile")
    kb.button("⚙️ Settings", callback="settings")
    await message.reply("Welcome!", reply_markup=kb)

@router.on_callback("profile")
async def show_profile(client, query):
    await query.answer("Opening profile...")

app = KurigramClient(
    "my_bot",
    bot_token="YOUR_TOKEN",
    storage=MemoryStorage(),
    auto_flood_wait=True,
)
app.include_router(router)
app.run()
```

## 🧩 Features

### KurigramClient

Replaces the old `patch()` pattern. Everything is configured at construction:

```python
app = KurigramClient(
    "my_bot",
    bot_token="...",
    storage=MemoryStorage(),      # FSM storage
    auto_flood_wait=True,         # Auto-retry FloodWait
    max_flood_wait=60,            # Max seconds to wait
)
app.include_router(router)
app.include_conversation(Registration)
app.include_menus(main_menu, settings_menu)
```

### Lifecycle Hooks

Run async setup/teardown around the client lifecycle:

```python
@app.on_startup
async def init_db():
    await database.connect()

@app.on_shutdown
async def close_db():
    await database.disconnect()
```

### Conversation Handler

Declarative multi-step FSM flows:

```python
from kurigram_addons import Conversation, ConversationState

class Registration(Conversation):
    name = ConversationState(initial=True)
    age = ConversationState()

    @name.on_enter
    async def ask_name(self, ctx):
        await ctx.message.reply("What's your name?")

    @name.on_message
    async def save_name(self, ctx):
        await ctx.helper.update_data(name=ctx.message.text)
        await self.goto(ctx, self.age)

    @age.on_enter
    async def ask_age(self, ctx):
        await ctx.message.reply("How old are you?")

    @age.on_message
    async def save_age(self, ctx):
        await ctx.helper.update_data(age=int(ctx.message.text))
        await self.finish(ctx)
```

### Menu System

Declarative menus with auto back-button:

```python
from kurigram_addons import Menu

main_menu = Menu("main", text="Main Menu")
main_menu.button("👤 Profile", goto="profile")
main_menu.button("⚙️ Settings", goto="settings")

profile_menu = Menu("profile", text="Profile", parent=main_menu)
profile_menu.button("✏️ Edit Name", callback=edit_name_handler)

app.include_menus(main_menu, profile_menu)
```

### Dependency Injection

```python
from kurigram_addons import Depends

async def get_user(client, update):
    return await db.fetch_user(update.from_user.id)

@router.on_command("profile")
async def profile(client, message, user=Depends(get_user)):
    await message.reply(f"Hello, {user.name}!")
```

### Rate Limiting

```python
from kurigram_addons import RateLimit

@router.on_command("generate")
@RateLimit(per_user=3, window=60, message="Slow down! {remaining}s left.")
async def generate(client, message):
    await message.reply("Generating...")

# Custom handler (v0.4.1)
async def on_limited(client, update, remaining):
    await update.reply(f"⏳ Wait {remaining}s")

@RateLimit(per_user=3, window=60, on_limited=on_limited)
```

### Command Parser

```python
from kurigram_addons import parse_command
from typing import Optional

@router.on_command("ban")
async def ban(client, message):
    args = parse_command(message.text, user_id=int, reason=Optional[str])
    # /ban 12345        → {"user_id": 12345, "reason": None}
    # /ban 12345 spam   → {"user_id": 12345, "reason": "spam"}
```

## 🏗️ Legacy Support

Old imports still work for backward compatibility:

```python
# ⚠️ Legacy (still works)
from pykeyboard import InlineKeyboard
from pyrogram_patch import patch

# ✅ Recommended
from kurigram_addons import InlineKeyboard, KurigramClient
```

> See the [Migration Guide](https://johnnie-610.github.io/kurigram-addons/v0.4/migration) for full details.

## 🤝 Contributing

Raise tickets on the [Issues Tracker](https://github.com/johnnie-610/kurigram-addons/issues).

```bash
git clone https://github.com/johnnie-610/kurigram-addons.git
cd kurigram-addons
poetry install
poetry run pytest tests/
```

## 📝 License

MIT License. See [LICENSE](./LICENSE) for details.
