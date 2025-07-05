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

# pyrogram_patch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![PyPI](https://img.shields.io/pypi/v/kurigram-addons)](https://pypi.org/project/kurigram-addons/)
[![Downloads](https://static.pepy.tech/badge/kurigram-addons)](https://pepy.tech/project/kurigram-addons)
[![Telegram](https://img.shields.io/badge/chat-telegram-blue)](https://t.me/kurigram_addons_chat)

**pyrogram_patch** is a powerful extension for Pyrogram that enhances it with advanced features for building robust Telegram bots. It provides middleware support, Finite State Machine (FSM) capabilities, and thread-safe data management, making it easier to develop complex bot interactions.

## ✨ Features

- **Middleware System**: Intercept and process updates with a powerful middleware pipeline
- **Finite State Machine (FSM)**: Manage complex conversation flows with ease
- **Router Support**: Organize your handlers into modular components
- **Thread-Safe**: Built with thread safety for high-load applications
- **Flexible Storage**: Multiple storage backends with Redis and MongoDB support
- **Type Safety**: Full type hints for better development experience
- **Easy Integration**: Works seamlessly with existing Pyrogram code

## 🚀 Quick Start

### Basic Usage

```python
from pyrogram import Client, filters
from pyrogram_patch import patch, Router
from pyrogram_patch.fsm import StatesGroup, State, StateFilter

# Initialize the client and router
app = Client("my_bot")
router = Router()

# Apply the patch
patch_manager = patch(app)

# Define states
class Registration(StatesGroup):
    waiting_for_name = State()
    waiting_for_age = State()

# Command handler with router
@router.on_message(filters.command("start") & filters.private)
async def start(client, message, state):
    await state.set_state(Registration.waiting_for_name)
    await message.reply("Welcome! Please enter your name:")

# State handler with router
@router.on_message(StateFilter(Registration.waiting_for_name) & filters.private)
async def process_name(client, message, state):
    await state.update_data(name=message.text)
    await state.set_state(Registration.waiting_for_age)
    await message.reply(f"Nice to meet you, {message.text}! How old are you?")

# Include router in the application
app.include_router(router)

# Run the bot
if __name__ == "__main__":
    app.run()
```

## 🔌 Middleware System

Easily add middleware to process updates before they reach your handlers:

```python
from pyrogram_patch.middlewares import BaseMiddleware

class AuthMiddleware(BaseMiddleware):
    def __init__(self, allowed_users: list):
        self.allowed_users = allowed_users
        
    async def __call__(self, update, client, patch_helper):
        if update.from_user.id not in self.allowed_users:
            await update.reply("Access denied!")
            return None  # Stop processing
        return await self.next(update, client, patch_helper)

# Register middleware
middleware_manager = MiddlewareManager()
middleware_manager.register(MessageHandler, AuthMiddleware([12345678]))
```

## 💾 Storage Options

### Built-in Storage Backends

```python
from pyrogram_patch.fsm.storages import MemoryStorage, RedisStorage, MongoStorage

# In-memory storage (not persistent across restarts)
storage = MemoryStorage()

# Redis storage (persistent)
redis_storage = RedisStorage(
    host="localhost",
    port=6379,
    db=0,
    ttl=86400  # 24 hours
)

# MongoDB storage (persistent with document support)
mongo_storage = MongoStorage(
    host="mongodb://localhost:27017/",
    db_name="bot_states",
    collection_name="user_states"
)
```

### Custom Storage

Implement your own storage by extending the `BaseStorage` class:

```python
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.states import StateData

class CustomStorage(BaseStorage):
    def __init__(self, connection_string: str):
        self.connection = self._connect(connection_string)
    
    async def get_state(self, key: str) -> Optional[StateData]:
        data = await self.connection.get(f"state:{key}")
        return StateData(**data) if data else None
    
    async def set_state(self, key: str, state_data: StateData) -> None:
        await self.connection.set(
            f"state:{key}",
            state_data.dict(),
            ex=state_data.ttl or 86400  # Default 24h TTL
        )
    
    async def delete_state(self, key: str) -> None:
        await self.connection.delete(f"state:{key}")
    
    async def _cleanup(self) -> None:
        """Optional: Clean up expired states"""
        pass
```

## 📚 Documentation

For complete documentation, including advanced usage and API reference, visit:

- [Kurigram Documentation](https://docs.kurigram.live/)
- [pyrogram_patch Documentation](/pyrogram_patch/DOCUMENTATION.md)

## 💬 Community

Join our community for support and discussions:

- [Telegram Group](https://t.me/kurigram_addons_chat)
- [GitHub Issues](https://github.com/johnnie-610/kurigram-addons/issues)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

🥳 Have fun with pyrogram_patch! 🎉

</details>

