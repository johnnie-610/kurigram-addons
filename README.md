<img align=center src=./logo.png length=80 width = 400>


> This library is a collection of popular Addons and patches for pyrogram/Kurigram.
> Currently, Pykeyboard and Pyrogram-patch have been added. You're welcome to add more.

# Installation
> PLEASE DON'T USE THE PYPI VERSION OF THIS LIBRARY. IT'S OUTDATED.
## using pip  

```bash
#bash
pip install git+https://github.com/johnnie-610/kurigram-addons.git

```

## using poetry

```bash
# bash
poetry add git+https://github.com/johnnie-610/kurigram-addons.git

```

# Usage

<details>
<summary><b>PyKeyboard</b> (click to expand)</summary>

<div align="center">
<p align="center">
<img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/logo.png" alt="pykeyboard">
</p>

![PyPI](https://img.shields.io/pypi/v/pykeyboard-kurigram)
[![Downloads](https://pepy.tech/badge/pykeyboard-kurigram)](https://pepy.tech/project/pykeyboard-kurigram)
![GitHub](https://img.shields.io/github/license/johnnie-610/pykeyboard)

 <p><h2>🎉This is pykeyboard for <a href="https://github.com/KurimuzonAkuma/pyrogram">Kurigram</a> 🎉</h2></p>
 <br>
 <p><strong><em>No need to change your code, just install the library and you're good to go.</em></strong></p>

</div>

# Pykeyboard

- [Pykeyboard](#pykeyboard)
- [What's new?](#whats-new)
- [Documentation](#documentation)
  - [Inline Keyboard](#inline-keyboard)
        - [Parameters:](#parameters)
    - [Inline Keyboard add buttons](#inline-keyboard-add-buttons)
      - [Code](#code)
      - [Result](#result)
    - [Inline Keyboard row buttons](#inline-keyboard-row-buttons)
      - [Code](#code-1)
      - [Result](#result-1)
    - [Pagination inline keyboard](#pagination-inline-keyboard)
      - [Parameters:](#parameters-1)
      - [Pagination 3 pages](#pagination-3-pages)
      - [Code](#code-2)
      - [Result](#result-2)
      - [Pagination 5 pages](#pagination-5-pages)
      - [Code](#code-3)
      - [Result](#result-3)
      - [Pagination 9 pages](#pagination-9-pages)
      - [Code](#code-4)
      - [Result](#result-4)
      - [Pagination 100 pages](#pagination-100-pages)
      - [Code](#code-5)
      - [Result](#result-5)
      - [Pagination 150 pages and buttons](#pagination-150-pages-and-buttons)
      - [Code](#code-6)
      - [Result](#result-6)
    - [Languages inline keyboard](#languages-inline-keyboard)
      - [Parameters:](#parameters-2)
      - [Code](#code-7)
      - [Result](#result-7)
  - [Reply Keyboard](#reply-keyboard)
      - [Parameters:](#parameters-3)
    - [Reply Keyboard add buttons](#reply-keyboard-add-buttons)
      - [Code](#code-8)
      - [Result](#result-8)
    - [Reply Keyboard row buttons](#reply-keyboard-row-buttons)
      - [Code](#code-9)
      - [Result](#result-9)

# What's new?

- Minor changes due to update in Kurigram.

# Documentation

## Inline Keyboard

```python
from pykeyboard import InlineKeyboard
```

##### Parameters:

- row_width (integer, default 3)

### Inline Keyboard add buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton


keyboard = InlineKeyboard(row_width=3)
keyboard.add(
    InlineButton('1', 'inline_keyboard:1'),
    InlineButton('2', 'inline_keyboard:2'),
    InlineButton('3', 'inline_keyboard:3'),
    InlineButton('4', 'inline_keyboard:4'),
    InlineButton('5', 'inline_keyboard:5'),
    InlineButton('6', 'inline_keyboard:6'),
    InlineButton('7', 'inline_keyboard:7')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/add_inline_button.png" alt="add_inline_button"></p>

### Inline Keyboard row buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton


keyboard = InlineKeyboard()
keyboard.row(InlineButton('1', 'inline_keyboard:1'))
keyboard.row(
    InlineButton('2', 'inline_keyboard:2'),
    InlineButton('3', 'inline_keyboard:3')
)
keyboard.row(InlineButton('4', 'inline_keyboard:4'))
keyboard.row(
    InlineButton('5', 'inline_keyboard:5'),
    InlineButton('6', 'inline_keyboard:6')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/row_inline_button.png" alt="row_inline_button"></p>

### Pagination inline keyboard

```python
from pykeyboard import InlineKeyboard
```

#### Parameters:

- count_pages (integer)
- current_page (integer)
- callback_pattern (string) - use of the `{number}` pattern is <ins>required</ins>

#### Pagination 3 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(3, 3, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_3.png" alt="pagination_keyboard_3"></p>

#### Pagination 5 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(5, 3, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_5.png" alt="pagination_keyboard_5"></p>

#### Pagination 9 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(9, 5, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_9.png" alt="pagination_keyboard_9"></p>

#### Pagination 100 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(100, 100, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_100.png" alt="pagination_keyboard_100"></p>

#### Pagination 150 pages and buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton

keyboard = InlineKeyboard()
keyboard.paginate(150, 123, 'pagination_keyboard:{number}')
keyboard.row(
    InlineButton('Back', 'pagination_keyboard:back'),
    InlineButton('Close', 'pagination_keyboard:close')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_150.png" alt="pagination_keyboard_150"></p>

### Languages inline keyboard

```python
from pykeyboard import InlineKeyboard
```

#### Parameters:

- callback_pattern (string) - use of the `{locale}` pattern is <ins>required</ins>
- locales (string | list) - list of language codes
  - be_BY - Belarusian
  - de_DE - German
  - zh_CN - Chinese
  - en_US - English
  - fr_FR - French
  - id_ID - Indonesian
  - it_IT - Italian
  - ko_KR - Korean
  - tr_TR - Turkish
  - ru_RU - Russian
  - es_ES - Spanish
  - uk_UA - Ukrainian
  - uz_UZ - Uzbek
- row_width (integer, default 2)


#### Code

```python
from pykeyboard import InlineKeyboard


keyboard = InlineKeyboard(row_width=3)
keyboard.languages(
    'languages:{locale}', ['en_US', 'ru_RU', 'id_ID'], 2
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/languages_keyboard.png" alt="languages_keyboard"></p>

## Reply Keyboard

```python
from pykeyboard import ReplyKeyboard
```

#### Parameters:

- resize_keyboard (bool, optional)
- one_time_keyboard (bool, optional)
- selective (bool, optional)
- row_width (integer, default 3)

### Reply Keyboard add buttons

#### Code

```python
from pykeyboard import ReplyKeyboard, ReplyButton


keyboard = ReplyKeyboard(row_width=3)
keyboard.add(
    ReplyButton('Reply button 1'),
    ReplyButton('Reply button 2'),
    ReplyButton('Reply button 3'),
    ReplyButton('Reply button 4'),
    ReplyButton('Reply button 5')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/add_reply_button.png" alt="add_reply_button"></p>

### Reply Keyboard row buttons

#### Code

```python
from pykeyboard import ReplyKeyboard, ReplyButton


keyboard = ReplyKeyboard()
keyboard.row(ReplyButton('Reply button 1'))
keyboard.row(
    ReplyButton('Reply button 2'),
    ReplyButton('Reply button 3')
)
keyboard.row(ReplyButton('Reply button 4'))
keyboard.row(ReplyButton('Reply button 5'))
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/row_reply_button.png" alt="row_reply_button"></p>

</details>


<details>
<summary><b>Pyrogram Patch</b> (click to expand)</summary>

# 🔧 pyrogram_patch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Kurigram](https://img.shields.io/badge/Built%20for-Kurigram-blue)](https://github.com/JohnnieJohnnie/kurigram)

**pyrogram_patch** is a powerful Python library that extends Pyrogram with advanced middleware support, Finite State Machine (FSM) capabilities, and thread-safe data management, making it easier to build complex Telegram bots with better code organization and state management.


## ✨ Features

- 🔀 **Middleware System**: Intercept and process updates before they reach your handlers
- 🤖 **Finite State Machine (FSM)**: Manage conversation flows and user states
- 🧩 **Router Support**: Organize your handlers into modular components
- 🧵 **Thread-Safe**: Built with thread safety in mind for high-load applications
- 🧠 **Memory Efficient**: Uses weak references to prevent memory leaks
- 💾 **Flexible Storage**: Built-in memory storage with support for custom storage backends (Redis, MongoDB, PostgreSQL, etc.)
- 🎯 **Type Safety**: Full type hints support for better development experience
- 📦 **Easy Integration**: Simple API that works seamlessly with existing Pyrogram code

## 🚀 Quick Start

### Using Custom Storage

Pyrogram Patch makes it easy to implement your own storage backend. Here's how to create a custom storage:

1. **Create a storage class** by subclassing `CustomStorage`:

```python
from pyrogram_patch.fsm.storages.custom_storage import CustomStorage
from pyrogram_patch.fsm.base_storage import StateData, StateNotFoundError

class MyCustomStorage(CustomStorage):
    def __init__(self, connection_string: str):
        super().__init__()
        # Initialize your storage client here
        self.client = MyStorageClient(connection_string)
    
    async def get_state_data(self, key: str) -> StateData:
        """Retrieve state data from your storage."""
        data = await self.client.get(key)
        if data is None:
            raise StateNotFoundError(f"State not found: {key}")
        return StateData(**data)
    
    async def set_state(self, state: str, key: str, 
                       data: Optional[Dict[str, Any]] = None,
                       ttl: Optional[int] = None) -> None:
        """Save state data to your storage."""
        state_data = StateData(
            state=state,
            data=data or {},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            expires_at=(datetime.utcnow() + timedelta(seconds=ttl)) if ttl else None
        )
        await self.client.set(key, state_data.__dict__, ex=ttl)
    
    # Implement other required methods...
```

2. **Use your custom storage** in your application:

```python
from pyrogram import Client
from pyrogram_patch import patch

app = Client("my_bot")
patch_manager = patch(app)

# Initialize with your custom storage
storage = MyCustomStorage("your_connection_string")
patch_manager.set_storage(storage)

# Your bot code here...
```

### Built-in Storage Options

Pyrogram Patch comes with several built-in storage options:

- `MemoryStorage`: Simple in-memory storage (not persistent)
- `MongoStorage`: MongoDB-based storage
- `RedisStorage`: Redis-based storage

Example using built-in storage:

```python
from pyrogram_patch.fsm.storages import MemoryStorage

storage = MemoryStorage()  # Simple in-memory storage
# OR
from pyrogram_patch.fsm.storages import MongoStorage
storage = MongoStorage("mongodb://localhost:27017/", "my_database")
```

### Basic Usage

```python
from pyrogram import Client, filters
from pyrogram_patch import patch
from pyrogram_patch.fsm import StatesGroup, State, StateItem
from pyrogram_patch.fsm.storages import MemoryStorage

# Create a Pyrogram client
app = Client("my_bot", api_id=123456, api_hash="your_api_hash", bot_token="your_bot_token")

# Patch the client to enable middleware and FSM features
patch_manager = patch(app)

# Set up storage for FSM (in-memory storage for this example)
storage = MemoryStorage()
patch_manager.set_storage(storage)

# Define your states for a conversation
class UserRegistration(StatesGroup):
    waiting_name = StateItem()
    waiting_age = StateItem()

# Start the registration process
@app.on_message(filters.command("register") & filters.private)
async def start_registration(client, message, state: State):
    await client.send_message(message.chat.id, "Please enter your name:")
    await state.set_state(UserRegistration.waiting_name)

# Handle name input
@app.on_message(filters.private & StateFilter(UserRegistration.waiting_name))
async def process_name(client, message, state: State):
    await state.set_data("name", message.text)
    await client.send_message(message.chat.id, "Please enter your age:")
    await state.set_state(UserRegistration.waiting_age)

# Handle age input
@app.on_message(filters.private & StateFilter(UserRegistration.waiting_age))
async def process_age(client, message, state: State):
    name = await state.get_data("name")
    await client.send_message(
        message.chat.id,
        f"Registration completed!\nName: {name}\nAge: {message.text}"
    )
    await state.finish()

# Run the bot
if __name__ == "__main__":
    app.run()
```

## 📚 Documentation

### 🔧 Basic Setup

#### Patching the Client

```python
from pyrogram import Client
from pyrogram_patch import patch

# Create and patch the client
app = Client("my_bot")
patch_manager = patch(app)
```

### 🔄 Migration Guide (v0.2.0+)

#### PatchDataPool Changes

The `PatchDataPool` class has been completely refactored for better thread safety and memory management:

### Old Way (v0.1.x)

```python
# Direct attribute access
PatchDataPool.update_pool = {}
PatchDataPool.pyrogram_patch_middlewares = []
```

### New Way (v0.2.0+)

```python
# Recommended: Create your own instance
from pyrogram_patch.patch_data_pool import PatchDataPool
pool = PatchDataPool()
pool.include_helper_to_pool(update, helper)

# Or use the global instance (for backward compatibility)
from pyrogram_patch.patch_data_pool import global_pool
global_pool.include_helper_to_pool(update, helper)
```

#### Backward Compatibility

- The global instance `global_pool` is provided for backward compatibility
- Direct attribute access still works but is not recommended for new code
- Old imports will continue to work but may be deprecated in future versions

### 🔀 Middleware System

#### Creating Middleware

```python
from pyrogram_patch.middlewares.middleware_types import OnUpdateMiddleware
from pyrogram_patch.patch_helper import PatchHelper

class LoggingMiddleware(OnUpdateMiddleware):
    def __init__(self, log_file: str = "bot.log"):
        self.log_file = log_file

    async def __call__(self, update, client, patch_helper: PatchHelper):
        # Access thread-safe data storage
        patch_helper.data["request_time"] = datetime.datetime.now()
        
        # Skip processing if needed
        if some_condition:
            await patch_helper.skip_handler()
```

### 🧠 State Management

#### Using FSM

```python
from pyrogram_patch.fsm import StatesGroup, State, StateItem

class PizzaOrder(StatesGroup):
    selecting_size = StateItem()
    selecting_toppings = StateItem()
    confirming_order = StateItem()

@app.on_message(filters.command("order") & filters.private)
async def start_order(client, message, state: State):
    await message.reply("What size pizza would you like?")
    await state.set_state(PizzaOrder.selecting_size)
```

### 🧩 Router Support

#### Creating and Using Routers

```python
from pyrogram import filters
from pyrogram_patch.router import Router

router = Router()

@router.on_message(filters.command("start"))
async def start_command(client, message):
    await message.reply("Welcome to the bot!")

# Include router in your application
patch_manager.include_router(router)
```

### 🔒 Thread Safety

All components are designed with thread safety in mind:

- `PatchDataPool` uses `RLock` for thread-safe operations
- `PatchHelper` provides thread-safe data storage
- All public methods are designed to be thread-safe


## 📦 Advanced Usage

### Custom Storage Backend

```python
from typing import Dict, Optional
from datetime import datetime, timedelta
from pyrogram_patch.fsm import BaseStorage

class CustomStorage(BaseStorage):
    def __init__(self):
        self._storage: Dict[str, dict] = {}
    
    async def get_state(self, key: str) -> Optional[str]:
        if key in self._storage:
            return self._storage[key].get("state")
        return None
    
    async def set_state(self, key: str, state: str) -> None:
        if key not in self._storage:
            self._storage[key] = {}
        self._storage[key]["state"] = state
        self._storage[key]["updated_at"] = datetime.now()
    
    # Implement other required methods...
```

### Error Handling

```python
from pyrogram_patch.exceptions import StateNotFoundError

@app.on_message(filters.private)
async def handle_message(client, message, state: State):
    try:
        current_state = await state.get_state()
        # Process message...
    except StateNotFoundError:
        await message.reply("Please start a new session with /start")
```

Made with ❤️

</details>

