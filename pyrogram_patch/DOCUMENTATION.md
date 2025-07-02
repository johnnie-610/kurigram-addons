# Pyrogram Patch Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Middleware System](#middleware-system)
5. [Finite State Machine (FSM)](#finite-state-machine-fsm)
6. [Storage Backends](#storage-backends)
   - [Built-in Storage Options](#built-in-storage-options)
   - [Creating Custom Storage](#creating-custom-storage)
   - [Storage Methods Reference](#storage-methods-reference)
7. [Router System](#router-system)
8. [Smart Plugins Integration](#smart-plugins-integration)
9. [Advanced Usage](#advanced-usage)
10. [Best Practices](#best-practices)

## Introduction

Pyrogram Patch extends Pyrogram with powerful features like middleware support, Finite State Machine (FSM), and a router system, making it easier to build complex Telegram bots with better code organization and state management.

## Installation

```bash
pip install pyrogram-patch
```

## Basic Usage

### Initial Setup

```python
from pyrogram import Client, filters
from pyrogram_patch import patch
from pyrogram_patch.fsm import StatesGroup, StateItem, State
from pyrogram_patch.fsm.storages import MemoryStorage

# Initialize the Pyrogram client
app = Client("my_bot", api_id=12345, api_hash="your_api_hash", bot_token="your_bot_token")

# Patch the client to enable pyrogram_patch features
patch_manager = patch(app)

# Set up storage for FSM (in-memory for this example)
storage = MemoryStorage()
patch_manager.set_storage(storage)

# Define your states
class Registration(StatesGroup):
    waiting_for_name = StateItem()
    waiting_for_age = StateItem()

# Basic command handler
@app.on_message(filters.command("start") & filters.private)
async def start(client, message):
    await message.reply("Welcome! Use /register to start registration.")

# Run the bot
if __name__ == "__main__":
    app.run()
```

## Middleware System

### Creating Middleware

```python
from pyrogram_patch.middlewares.middleware_types import OnMessageMiddleware
from pyrogram_patch.patch_helper import PatchHelper

class LoggingMiddleware(OnMessageMiddleware):
    async def __call__(self, update, client, patch_helper: PatchHelper):
        # Add user info to handler data
        patch_helper.data["user_name"] = update.from_user.first_name
        print(f"Message from {update.from_user.first_name}: {update.text}")

# Register the middleware
patch_manager.include_middleware(LoggingMiddleware())
```

## Finite State Machine (FSM)

### State Management

```python
@app.on_message(filters.command("register") & filters.private)
async def start_registration(client, message, state: State):
    await state.set_state(Registration.waiting_for_name)
    await message.reply("Please enter your name:")

@app.on_message(filters.private & StateFilter(Registration.waiting_for_name))
async def process_name(client, message, state: State):
    await state.set_data({"name": message.text})
    await state.set_state(Registration.waiting_for_age)
    await message.reply(f"Thanks, {message.text}! Now, how old are you?")

@app.on_message(filters.private & StateFilter(Registration.waiting_for_age))
async def process_age(client, message, state: State):
    try:
        age = int(message.text)
        data = await state.get_data()
        await message.reply(
            f"Registration complete!\n"
            f"Name: {data['name']}\n"
            f"Age: {age}"
        )
        await state.finish()
    except ValueError:
        await message.reply("Please enter a valid number for age.")
```

## Router System

### Creating and Using Routers

```python
from pyrogram_patch.router import Router

# Create a router
admin_router = Router()

# Add handlers to the router
@admin_router.on_message(filters.command("ban") & filters.private)
async def ban_user(client, message):
    await message.reply("User banned!")

# Register the router
patch_manager.include_router(admin_router)
```

## Smart Plugins Integration

### Using with Pyrogram's Smart Plugins

1. **Create a plugin file** (e.g., `plugins/admin_commands.py`):

```python
# plugins/admin_commands.py
from pyrogram import filters
from pyrogram_patch.router import Router

router = Router()

@router.on_message(filters.command("ping") & filters.private)
async def ping(client, message):
    await message.reply("Pong!")

@router.on_message(filters.command("echo") & filters.private)
async def echo(client, message):
    if len(message.command) > 1:
        await message.reply(" ".join(message.command[1:]))
    else:
        await message.reply("Please provide some text to echo!")
```

2. **Load the plugin in your main bot file**:

```python
# main.py
from pyrogram import Client, filters
from pyrogram_patch import patch

app = Client("my_bot")
patch_manager = patch(app)

# Load plugins
app.load_plugins("plugins")

# Run the bot
if __name__ == "__main__":
    app.run()
```

### Plugin with FSM

```python
# plugins/survey_plugin.py
from pyrogram import filters
from pyrogram_patch.router import Router
from pyrogram_patch.fsm import StatesGroup, StateItem, State
from pyrogram_patch.fsm.filter import StateFilter

router = Router()

class Survey(StatesGroup):
    waiting_for_feedback = StateItem()
    waiting_for_rating = StateItem()

@router.on_message(filters.command("survey") & filters.private)
async def start_survey(client, message, state: State):
    await state.set_state(Survey.waiting_for_feedback)
    await message.reply("Please share your feedback about our service:")

@router.on_message(StateFilter(Survey.waiting_for_feedback) & filters.private)
async def process_feedback(client, message, state: State):
    await state.set_data({"feedback": message.text})
    await state.set_state(Survey.waiting_for_rating)
    await message.reply("Thank you! Now please rate our service from 1 to 5:")

@router.on_message(StateFilter(Survey.waiting_for_rating) & filters.private)
async def process_rating(client, message, state: State):
    if message.text.isdigit() and 1 <= int(message.text) <= 5:
        data = await state.get_data()
        await message.reply(
            f"Thank you for your feedback!\n\n"
            f"Your feedback: {data['feedback']}\n"
            f"Your rating: {message.text}/5"
        )
        await state.finish()
    else:
        await message.reply("Please enter a number between 1 and 5.")
```

## Advanced Usage

### Custom Storage Backend

```python
from typing import Dict, Optional
from pyrogram_patch.fsm import BaseStorage

class CustomStorage(BaseStorage):
    def __init__(self):
        self._storage: Dict[str, dict] = {}
    
    async def get_state(self, key: str) -> Optional[str]:
        return self._storage.get(key, {}).get("state")
    
    async def set_state(self, key: str, state: str) -> None:
        if key not in self._storage:
            self._storage[key] = {}
        self._storage[key]["state"] = state
    
    async def get_data(self, key: str) -> dict:
        return self._storage.get(key, {}).get("data", {})
    
    async def set_data(self, data: dict, key: str) -> None:
        if key not in self._storage:
            self._storage[key] = {}
        self._storage[key]["data"] = data
    
    async def finish_state(self, key: str) -> None:
        self._storage.pop(key, None)

# Usage
storage = CustomStorage()
patch_manager.set_storage(storage)
```

## Storage Backends

Pyrogram Patch provides a flexible storage system for managing FSM states. The `CustomStorage` class serves as a base for creating your own storage backends, with built-in thread safety and common functionality.

### Built-in Storage Options

The library includes several storage implementations:

- `MemoryStorage`: In-memory storage (not persistent, for development only)
- `MongoStorage`: MongoDB-based storage
- `RedisStorage`: Redis-based storage

Example using built-in storage:

```python
from pyrogram_patch.fsm.storages import MemoryStorage, MongoStorage, RedisStorage

# Simple in-memory storage (not persistent)
storage = MemoryStorage()

# MongoDB storage
mongo_storage = MongoStorage("mongodb://localhost:27017/", "my_database")

# Redis storage
redis_storage = RedisStorage("redis://localhost:6379/0")
```

### Creating Custom Storage

To create a custom storage backend, subclass `CustomStorage` and implement the required methods. Here's a minimal example:

```python
from typing import Dict, Any, Optional, AsyncIterator
from datetime import datetime, timedelta
from pyrogram_patch.fsm.storages.custom_storage import CustomStorage
from pyrogram_patch.fsm.base_storage import StateData, StateNotFoundError

class MyCustomStorage(CustomStorage):
    def __init__(self, connection_string: str):
        super().__init__()
        # Initialize your storage client here
        self.client = MyStorageClient(connection_string)
    
    async def get_state_data(self, key: str) -> StateData:
        """Retrieve complete state information including metadata."""
        data = await self.client.get(key)
        if data is None:
            raise StateNotFoundError(f"State not found: {key}")
        return StateData(**data)
    
    async def set_state(self, state: str, key: str, 
                       data: Optional[Dict[str, Any]] = None,
                       ttl: Optional[int] = None) -> None:
        """Update the state for a given key."""
        state_data = StateData(
            state=state,
            data=data or {},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            expires_at=(datetime.utcnow() + timedelta(seconds=ttl)) if ttl else None
        )
        await self.client.set(key, state_data.__dict__, ex=ttl)
    
    async def set_data(self, data: Dict[str, Any], key: str) -> None:
        """Update the data for a given state."""
        try:
            state_data = await self.get_state_data(key)
            state_data.data.update(data)
            state_data.updated_at = datetime.utcnow()
            await self.client.set(key, state_data.__dict__)
        except StateNotFoundError:
            await self.set_state("", key, data)
    
    async def get_data(self, key: str) -> Dict[str, Any]:
        """Retrieve the data for a given state."""
        try:
            return (await self.get_state_data(key)).data
        except StateNotFoundError:
            return {}
    
    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data."""
        await self.client.delete(key)
    
    async def cleanup_expired(self) -> int:
        """Remove all expired states."""
        # Implementation depends on your storage backend
        return 0
    
    async def list_states(self, state: Optional[str] = None, 
                         created_before: Optional[datetime] = None) -> AsyncIterator[str]:
        """List all state keys matching the given criteria."""
        # Implementation depends on your storage backend
        # This is a simplified example
        all_keys = await self.client.keys("*")
        for key in all_keys:
            try:
                state_data = await self.get_state_data(key)
                if state and state_data.state != state:
                    continue
                if created_before and state_data.created_at > created_before:
                    continue
                yield key
            except Exception:
                continue
```

### Storage Methods Reference

When implementing a custom storage, these are the methods you need to implement:

1. **`get_state_data(key: str) -> StateData`**
   - Retrieve complete state information including metadata
   - Raises `StateNotFoundError` if the state doesn't exist

2. **`set_state(state: str, key: str, data: Optional[Dict[str, Any]] = None, ttl: Optional[int] = None) -> None`**
   - Update the state for a given key
   - Creates the state if it doesn't exist

3. **`set_data(data: Dict[str, Any], key: str) -> None`**
   - Update the data for a given state
   - Creates the state with empty state if it doesn't exist

4. **`get_data(key: str) -> Dict[str, Any]`**
   - Retrieve the data for a given state
   - Returns an empty dict if the state doesn't exist

5. **`finish_state(key: str) -> None`**
   - Remove a state and its associated data
   - Should be idempotent (no error if state doesn't exist)

6. **`cleanup_expired() -> int`**
   - Remove all expired states
   - Returns the number of states removed

7. **`list_states(state: Optional[str] = None, created_before: Optional[datetime] = None) -> AsyncIterator[str]`**
   - List all state keys matching the given criteria
   - Should efficiently filter by state and creation time if provided

### Best Practices for Custom Storage

1. **Thread Safety**: The base class provides a lock (`self._lock`) that you can use with the `@synchronized` decorator or as a context manager.

2. **Error Handling**: Always handle storage-specific errors and raise appropriate exceptions from `pyrogram_patch.fsm.base_storage`.

3. **Performance**: Consider implementing batch operations for better performance with your storage backend.

4. **Testing**: Test your storage implementation with concurrent access and edge cases.

5. **Documentation**: Document any specific requirements or limitations of your storage implementation.

For a complete example, see the built-in storage implementations in the `pyrogram_patch.fsm.storages` package.

## Best Practices for Beginners

Let's break down each best practice with simple explanations and examples to help you understand why they're important and how to implement them.

### 1. Organize Your Code with Routers and Plugins
**Why?** As your bot grows, having all your code in one file becomes messy and hard to maintain.

**How to do it:**
- Group related commands in separate router files
- Use Pyrogram's plugin system to organize features
- Example structure:
  ```
  my_bot/
  ├── main.py
  ├── plugins/
  │   ├── __init__.py
  │   ├── admin_commands.py
  │   ├── user_commands.py
  │   └── utils.py
  └── config.py
  ```

### 2. Use FSM for Multi-step Interactions

**Why?** Handling conversations with multiple steps (like registration forms) is much cleaner with FSM.

**Example:** Instead of using flags like `waiting_for_name = True`:

```python
# ❌ Don't do this
if waiting_for_name:
    # handle name
    waiting_for_name = False
    waiting_for_age = True

# ✅ Do this instead
class Registration(StatesGroup):
    waiting_for_name = StateItem()
    waiting_for_age = StateItem()
```

### 3. Implement Proper Error Handling

**Why?** Bots crash when they encounter unexpected input. Good error handling makes them more reliable.

**Example:**

```python
@app.on_message(filters.command("divide"))
async def divide_numbers(client, message):
    try:
        _, a, b = message.text.split()
        result = int(a) / int(b)
        await message.reply(f"Result: {result}")
    except ValueError:
        await message.reply("Please provide two numbers after /divide")
    except ZeroDivisionError:
        await message.reply("Cannot divide by zero!")
    except Exception as e:
        await message.reply(f"Something went wrong: {str(e)}")
        # Log the full error for debugging
        print(f"Error in divide command: {str(e)}")
```

### 4. Use Middleware for Cross-cutting Concerns
**Why?** Middleware helps you handle common tasks (like logging, authentication) in one place.

**Example: Simple Logging Middleware**
```python
class LoggingMiddleware(OnMessageMiddleware):
    async def __call__(self, update, client, patch_helper: PatchHelper):
        # Log before processing
        print(f"Received message: {update.text}")
        
        try:
            # Continue to the next middleware/handler
            return await self.next(update, client, patch_helper)
        except Exception as e:
            # Log any errors
            print(f"Error processing message: {str(e)}")
            raise
        finally:
            # Log after processing
            print(f"Finished processing message: {update.text}")
```

### 5. Clean Up Resources
**Why?** Not cleaning up can lead to memory leaks and unexpected behavior.

**Example:** Always finish FSM states when done:
```python
@router.on_message(StateFilter(SomeState.some_state) & filters.private)
async def handle_state(client, message, state: State):
    try:
        # Process the message
        await message.reply("Processing...")
        # ... your code ...
    except Exception as e:
        await message.reply("An error occurred!")
        # Make sure to clean up even if there's an error
        await state.finish()
        raise
    finally:
        # This runs whether there was an error or not
        await some_cleanup_function()
```

### 6. Use Type Hints
**Why?** Type hints make your code more readable and help catch errors early.

**Example:**
```python
# ❌ Hard to understand what types are expected
def process_user(data):
    return f"Hello {data['name']}"

# ✅ Clear what goes in and what comes out
def process_user(data: dict) -> str:
    """Process user data and return a greeting.
    
    Args:
        data: Dictionary containing user information
        
    Returns:
        A greeting string
    """
    return f"Hello {data['name']}"
```

### 7. Keep Handlers Focused
**Why?** Each handler should do one thing well. This makes your code easier to test and maintain.

**Example:**
```python
# ❌ One handler doing too much
@router.on_message(filters.command("user"))
async def handle_user_command(client, message):
    if len(message.command) == 1:
        # Show user info
        user = get_user(message.from_user.id)
        await message.reply(f"Name: {user.name}")
    elif message.command[1] == "update":
        # Update user info
        update_user(message.from_user.id, message.command[2])
        await message.reply("Updated!")

# ✅ Split into focused handlers
@router.on_message(filters.command("user") & filters.private)
async def show_user_info(client, message):
    user = get_user(message.from_user.id)
    await message.reply(f"Name: {user.name}")

@router.on_message(filters.command("user_update") & filters.private)
async def update_user_info(client, message):
    if len(message.command) < 2:
        await message.reply("Usage: /user_update <new_name>")
        return
    update_user(message.from_user.id, message.command[1])
    await message.reply("Updated!")
```

### 8. Use Environment Variables for Sensitive Data
**Why?** Never hardcode sensitive information like API keys in your code.

**Example using python-dotenv:**

1. Install the package:
```bash
pip install python-dotenv
```

2. Create a `.env` file (add it to .gitignore!):
```
API_ID=1234567
API_HASH=your_api_hash_here
BOT_TOKEN=your_bot_token_here
```

3. In your code:
```python
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Client(
    "my_bot",
    api_id=os.getenv("API_ID"),
    api_hash=os.getenv("API_HASH"),
    bot_token=os.getenv("BOT_TOKEN")
)
```

## Next Steps for Beginners

Now that you understand the basics, here's how to continue learning:

1. **Start Small**: Begin with simple commands and gradually add complexity
2. **Experiment**: Try modifying the examples to create your own features
3. **Read the Code**: Look at how other bots are structured
4. **Join Communities**: The Pyrogram community is very helpful for beginners
5. **Build Projects**: The best way to learn is by building real projects

## Getting Help

If you get stuck:
1. Check the [Pyrogram Documentation](https://docs.pyrogram.org/)
2. Search for similar issues on [GitHub](https://github.com/pyrogram/pyrogram)
3. Ask questions on [Stack Overflow](https://stackoverflow.com/) with the `pyrogram` tag
4. Join the [Pyrogram Telegram Group](https://t.me/pyrogram)

## Final Thoughts

Building bots with Pyrogram and pyrogram_patch can be incredibly rewarding. As you become more comfortable with the basics, you'll discover even more powerful patterns and techniques. Remember:

- **Don't be afraid to make mistakes** - they're part of learning
- **Break problems into smaller parts** - solve one piece at a time
- **Read error messages carefully** - they often tell you exactly what's wrong
- **Back up your code** - use version control like Git
- **Have fun!** - Building bots should be enjoyable

Happy coding! 🚀
