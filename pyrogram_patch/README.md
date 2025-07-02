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