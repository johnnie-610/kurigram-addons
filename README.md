<div align="center">
  <h1>kurigram-addons</h1>
  <p><em>Advanced enterprise-grade toolset for the Kurigram / Pyrogram ecosystem.</em></p>
  <p>
    <a href="https://pypi.org/project/kurigram-addons/"><img src="https://img.shields.io/pypi/v/kurigram-addons.svg" alt="PyPI" /></a>
    <a href="https://github.com/johnnie-610/kurigram-addons"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  </p>
</div>

---

**`kurigram-addons`** is a professional collection of utilities designed to dramatically enhance the development, maintainability, and scalability of Telegram bots built with [Kurigram](https://pypi.org/project/kurigram/).

It brings powerful features such as a fully-typed Finite State Machine (FSM), deep hierarchical routing, tri-phase execution middlewares, and an extreme-performance UI framework natively into your applications.

> 📚 **[Visit the Official Documentation Portal for detailed guides and API references!](https://johnnie-610.github.io/kurigram-addons/)** 

## 🌟 Key Features

The package is conceptually divided into two primary submodules: `pyrogram_patch` and `pykeyboard`.

### 1. Pyrogram Patch (Core Engine Modding)

Replaces the standard Telegram event dispatcher with a modernized engine designed for clean architecture.

- **FSM Context Manager**: Manage conversation states with type-aware `StatesGroup` validation. Native support for persistent `RedisStorage` or rapid `MemoryStorage`.
- **Hierarchical Routers**: Compose large-scale applications easily. Nest `Router` trees with individual middlewares to modularize your bot similar to FastAPI or Express.
- **Tri-Phase Middlewares**: Absolute control over the execution stack with pre-handler (`before`), post-handler (`after`), and wrapping (`around`) capabilities.
- **Circuit Breakers & Timeouts**: Integrated fault-tolerance configurations built via Pydantic.

### 2. PyKeyboard (UI Foundation)

A fully declarative UI manipulation framework that obliterates traditional boilerplate.

- **Smart Layout Engine**: Set global `row_width` boundaries. Add a continuous stream of buttons, and let `InlineKeyboard` handle the row wrapping automatically.
- **Pagination Engine**: Built-in pagination with complex cache validations. Generate hundreds of dynamic pages efficiently, protected by LRU-hashing caching to prevent duplicate edit delays.
- **KeyboardFactory**: Eliminate repetitive work. Create instantaneous Star Ratings, Confirm/Deny Dialogs, and Action Menus with one-liners.
- **Builder API**: A modern Fluent/Chaining builder interface for creating complex UIs sequentially.

## 📦 Installation

```bash
pip install kurigram-addons
```

> **Requirements**: Python 3.10+. Requires `kurigram` >= 2.1.35 (or a compatible Pyrogram distribution), `pydantic` >= 2.11, and `redis` >= 6.0.0.

## 🚀 Quickstarts

### Stateful Interactions (Pyrogram Patch / FSM)

```python
from pyrogram import Client, filters
from pyrogram_patch import patch
from pyrogram_patch.fsm import StatesGroup, State
from pyrogram_patch.router import Router

app = Client("my_bot")
router = Router()

class Form(StatesGroup):
    name = State()
    age = State()

@router.on_message(filters.command("form"))
async def start_cmd(client, message, patch_helper):
    await patch_helper.fsm.set_state(Form.name)
    await message.reply("Welcome! What is your name?")

@router.on_message(patch_helper.fsm.state(Form.name))
async def process_name(client, message, patch_helper):
    await patch_helper.fsm.update_data(name=message.text)
    await patch_helper.fsm.set_state(Form.age)
    await message.reply(f"Nice to meet you, {message.text}. How old are you?")

@router.on_message(patch_helper.fsm.state(Form.age))
async def process_age(client, message, patch_helper):
    data = await patch_helper.fsm.get_data()
    await patch_helper.fsm.finish() # Clears context

    await message.reply(
        f"<b>Registration Complete!</b>\nName: {data['name']}\nAge: {message.text}"
    )

async def main():
    # Patch the application and attach your router network
    patch_manager = await patch(app)
    patch_manager.include_router(router)

    await app.start()
```

### Responsive Smart Layouts (PyKeyboard)

```python
from pyrogram import Client, filters
from pykeyboard import InlineKeyboard, InlineButton

app = Client("my_bot")

@app.on_message(filters.command("menu"))
async def show_menu(client, message):
    # Create an automated layout wrapping at 2 buttons per row
    kb = InlineKeyboard(row_width=2)

    kb.add(
        InlineButton("Settings", "settings"),
        InlineButton("History", "history"),
        InlineButton("Help Center", "help") # This drops automatically to Row 2
    )

    # Unconditionally force 'Exit' to monopolize its own row at the bottom
    kb.row(InlineButton("🚪 Exit", "exit"))

    # Modern direct attachment - no raw JSON conversions needed
    await message.reply("Main System Menu:", reply_markup=kb)
```


## 🤝 Contributing

We rely on developer input! To suggest new features, fix bugs, or report vulnerabilities, please raise a ticket on the [Issues Tracker](https://github.com/johnnie-610/kurigram-addons/issues).

### Local Setup

Using `poetry` is the recommended method for development:

```bash
git clone https://github.com/johnnie-610/kurigram-addons.git
cd kurigram-addons
poetry install
poetry run pytest tests/
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
