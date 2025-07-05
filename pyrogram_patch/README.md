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