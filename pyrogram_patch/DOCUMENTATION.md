# Pyrogram Patch Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Usage](#basic-usage)
3. [Middleware System](#middleware-system)
4. [Finite State Machine (FSM)](#finite-state-machine-fsm)
5. [Storage Backends](#storage-backends)
   - [Built-in Storage Options](#built-in-storage-options)
   - [Creating Custom Storage](#creating-custom-storage)
   - [Storage Methods Reference](#storage-methods-reference)
6. [Router System](#router-system)
7. [Smart Plugins Integration](#smart-plugins-integration)
8. [Best Practices](#best-practices)

## Introduction

Pyrogram Patch extends Pyrogram with powerful features like middleware support, Finite State Machine (FSM), and a router system, making it easier to build complex Telegram bots with better code organization and state management.

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

### MiddlewareManager

The `MiddlewareManager` class is responsible for registering and executing middlewares for Pyrogram handlers. It provides a flexible way to intercept and process updates before they reach your handlers.

#### Key Features

- Register middlewares for specific handler types
- Execute middlewares in the order they were registered
- Support for both synchronous and asynchronous middlewares
- Type-safe middleware registration

#### Basic Usage:

```python
from pyrogram import Client, filters
from pyrogram.handlers import MessageHandler
from pyrogram_patch.middlewares.middleware_manager import MiddlewareManager
from pyrogram_patch.middlewares.middleware_types.middlewares import BaseMiddleware

# Create a custom middleware
class LoggingMiddleware(BaseMiddleware):
    async def __call__(self, update, client, patch_helper):
        print(f"Processing update: {update.id}")
        # Call the next middleware/handler
        return await self.next(update, client, patch_helper)

# Initialize the middleware manager
middleware_manager = MiddlewareManager()

# Register the middleware for MessageHandler
middleware_manager.register(MessageHandler, LoggingMiddleware())

# Create your Pyrogram client
app = Client("my_bot")

# Apply the middleware manager to your handlers
@app.on_message(filters.command("start"))
async def start(client, message):
    await message.reply("Hello! This is a command with middleware support.")

# Or apply globally to all handlers
app.add_handler(MessageHandler(start), middleware_manager=middleware_manager)
```

#### Advanced Usage:

```python
# Multiple middlewares are executed in the order they are registered
class AuthMiddleware(BaseMiddleware):
    def __init__(self, allowed_users: list):
        self.allowed_users = allowed_users
        
    async def __call__(self, update, client, patch_helper):
        user_id = update.from_user.id
        if user_id not in self.allowed_users:
            await update.reply("Unauthorized access!")
            return None  # Stop further processing
        return await self.next(update, client, patch_helper)

# Register multiple middlewares
middleware_manager.register(MessageHandler, LoggingMiddleware())
middleware_manager.register(MessageHandler, AuthMiddleware(allowed_users=[12345678]))
```

## Finite State Machine (FSM)

The Finite State Machine (FSM) provides a structured way to manage conversation flows and states in your Telegram bot.

### FSMContext

The `FSMContext` class provides a convenient way to manage conversation states and associated data in your Pyrogram application.

#### Key Features

- State management with expiration
- Thread-safe operations
- Support for both sync and async storage backends
- Automatic state cleanup

### State Management

#### Defining States

```python
from pyrogram_patch.fsm import StatesGroup, StateItem, State
from pyrogram_patch.fsm.filter import StateFilter

class Registration(StatesGroup):
    waiting_for_name = StateItem()
    waiting_for_age = StateItem()
    waiting_for_email = StateItem()
```

#### State Transitions with FSMContext

```python
from pyrogram import filters
from pyrogram_patch.fsm.context import FSMContext

# Initialize FSM with a storage backend
storage = MemoryStorage()  # or RedisStorage, MongoStorage, etc.
fsm = FSMContext(storage)

@app.on_message(filters.command("register") & filters.private)
async def start_registration(client, message, state: State):
    await fsm.set_state(message, Registration.waiting_for_name)
    await message.reply("Welcome! Please enter your name:")

# Handle state transitions
@app.on_message(StateFilter(Registration.waiting_for_name) & filters.private)
async def process_name(client, message, state: State):
    # Store the name in state data
    await fsm.update_data(message, {"name": message.text})
    await fsm.set_state(message, Registration.waiting_for_age)
    await message.reply(f"Nice to meet you, {message.text}! How old are you?")

@app.on_message(StateFilter(Registration.waiting_for_age) & filters.private)
async def process_age(client, message, state: State):
    try:
        age = int(message.text)
        await fsm.update_data(message, {"age": age})
        data = await fsm.get_data(message)
        await message.reply(
            f"Got it, {data['name']}! "
            f"You are {age} years old."
        )
        await fsm.finish_state(message)  # Clear the state
    except ValueError:
        await message.reply("Please enter a valid age!")
```

#### Advanced State Management:

```python
# Set state with expiration (in seconds)
await fsm.set_state(message, "some_state", expires_in=3600)  # Expires in 1 hour

# Get all states (admin only)
if message.from_user.id == ADMIN_ID:
    states = await fsm.get_all_states()
    await message.reply(f"Active states: {len(states)}")

# Find states by state value
async for key, state in fsm.find_states("waiting_for_name"):
    print(f"User {key} is waiting to provide their name")

# Clear all states (use with caution!)
if message.from_user.id == ADMIN_ID and "clear_all" in message.text:
    await fsm.clear_all_states()
    await message.reply("All states have been cleared!")
```

#### Handling State Transitions

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
        if age < 13:
            await message.reply("Sorry, you must be at least 13 years old to register.")
            await state.finish()
            return
            
        # Update state data
        await state.update_data({"age": age})
        await state.set_state(Registration.waiting_for_email)
        await message.reply("Great! Now, what's your email address?")
    except ValueError:
        await message.reply("Please enter a valid age (numbers only).")

@app.on_message(filters.private & StateFilter(Registration.waiting_for_email))
async def process_email(client, message, state: State):
    email = message.text.strip()
    if "@" not in email or "." not in email:
        await message.reply("Please enter a valid email address.")
        return
        
    # Get all collected data
    data = await state.get_data()
    data["email"] = email
    
    # Process the registration (e.g., save to database)
    # await save_registration(data)
    
    # Send confirmation and finish the state
    await message.reply(
        "Registration complete!\n\n"
        f"Name: {data['name']}\n"
        f"Age: {data['age']}\n"
        f"Email: {email}"
    )
    
    # Clear the state
    await state.finish()
```

#### State Timeouts

You can set timeouts for states to automatically expire:

```python
# Set a 5-minute timeout for the current state
await state.set_state(Registration.waiting_for_email, timeout=300)

# Check if state has timed out
if await state.is_expired():
    await message.reply("Session expired. Please start over with /register")
    await state.finish()
    return
```

#### State Data Management

```python
# Set data
await state.set_data({"key1": "value1", "key2": "value2"})

# Update specific fields
await state.update_data({"key2": "new_value"})

# Get all data
data = await state.get_data()

# Get specific field
value = await state.get_data("key1")

# Delete specific field
await state.delete_data("key1")

# Clear all data
await state.clear_data()
```

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

Here's a basic example of how to create and use a plugin:

1. **Create a plugin file** (`plugins/example.py`):

   ```python
   # plugins/example.py
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

2. **Load the plugin in your main bot file** (`main.py`):

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

## Storage Backends

Pyrogram Patch provides a flexible and extensible storage system for managing FSM states. The storage system is designed to be thread-safe and supports various backends out of the box, with the ability to create custom storage implementations.

### Built-in Storage Options

#### 1. MemoryStorage

- **Type**: In-memory storage (not persistent)
- **Use Case**: Development, testing, or single-process applications
- **Thread Safety**: Yes (thread-safe implementation)
- **Persistence**: Data is lost on application restart

```python
from pyrogram_patch.fsm.storages import MemoryStorage

# Initialize with optional TTL (in seconds)
storage = MemoryStorage(ttl=3600)  # Data expires after 1 hour

# Disable TTL (data won't expire)
storage_no_ttl = MemoryStorage()
```

#### 2. RedisStorage

RedisStorage is a production-ready backend that stores state data in a Redis database. It's ideal for:

- Multi-process/multi-instance bot deployments
- High-availability requirements
- Distributed systems
- Persistent state across restarts

**Features:**

- Connection pooling for better performance
- Configurable key prefixing
- Support for Redis Sentinel and Cluster
- Automatic reconnection on connection loss
- Configurable timeouts and retries
- Thread-safe operations

**Dependencies:**

```bash
pip install redis>=4.0.0
```

**Configuration Options:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `host` | str | 'localhost' | Redis server hostname |
| `port` | int | 6379 | Redis server port |
| `db` | int | 0 | Database number (0-15) |
| `password` | str | None | Authentication password |
| `socket_timeout` | int | 5 | Socket timeout in seconds |
| `socket_connect_timeout` | int | 5 | Connection timeout in seconds |
| `max_connections` | int | 10 | Max connections in pool |
| `ttl` | int | 86400 | Default TTL in seconds |
| `prefix` | str | 'pyrogram_patch:' | Key prefix |
| `retry_on_timeout` | bool | False | Retry on connection timeout |
| `ssl` | bool | False | Use SSL for connection |
| `ssl_cert_reqs` | str | 'required' | SSL certificate requirements |
| `health_check_interval` | int | 0 | Health check interval in seconds |

**Example with Sentinel:**

```python
from redis.sentinel import Sentinel

sentinel = Sentinel([
    ('sentinel1.example.com', 26379),
    ('sentinel2.example.com', 26379)
], socket_timeout=0.5)

master = sentinel.master_for('mymaster', socket_timeout=0.5)
storage = RedisStorage(connection_pool=master.connection_pool)
```

- **Type**: Persistent storage using Redis
- **Use Case**: Production, distributed applications, multi-process environments
- **Dependencies**: `redis` package (`pip install redis`)
- **Persistence**: Yes (depends on Redis configuration)

```python
from pyrogram_patch.fsm.storages import RedisStorage

### Connection Options

```python
from pyrogram_patch.fsm.storages import RedisStorage

# Basic connection with minimal options
storage = RedisStorage(
    host='localhost',    # Redis server host
    port=6379,           # Redis server port
    db=0,                # Database number (0-15)
    password=None,       # Optional password for authentication
    ttl=86400,           # Default TTL in seconds (24 hours)
    prefix='fsm:'        # Prefix for all Redis keys
)

# Advanced connection with connection pooling
storage = RedisStorage(
    host='localhost',
    port=6379,
    db=0,
    password='your_secure_password',
    socket_timeout=5,           # Connection timeout in seconds
    socket_connect_timeout=5,   # Socket connect timeout
    retry_on_timeout=True,      # Retry on connection timeout
    max_connections=10,         # Maximum number of connections in pool
    ttl=86400,                 # Default TTL in seconds
    prefix='my_bot:fsm:'       # Namespaced keys
)

# Using Redis URL format
redis_url = 'redis://username:password@localhost:6379/0'
storage = RedisStorage.from_url(
    redis_url,
    ttl=3600,  # 1 hour TTL
    prefix='bot:fsm:'
)

# Connection with connection pool
storage_with_pool = RedisStorage(
    host='localhost',
    port=6379,
    db=0,
    password='your_redis_password',
    ttl=3600,
    max_connections=10  # Connection pool size
)

# Connect to Redis cluster
# Requires redis-py-cluster package
from redis.cluster import RedisCluster

cluster = RedisCluster(
    startup_nodes=[{"host": "localhost", "port": "7000"}],
    decode_responses=True
)
storage_cluster = RedisStorage(redis=cluster)
```

### Creating Custom Storage

You can create your own storage backend by subclassing `CustomStorage` and implementing the required methods. Here's a complete example:

```python
from typing import Dict, Any, Optional, AsyncIterator
from datetime import datetime, timedelta, timezone
from pyrogram_patch.fsm.storages import CustomStorage
from pyrogram_patch.fsm.base_storage import StateData, StateNotFoundError

class MyCustomStorage(CustomStorage):
    """
    Example implementation of a custom storage backend.
    This example uses an in-memory dictionary, but you can replace it with any storage system.
    """
    def __init__(self, ttl: int = 3600):
        super().__init__()
        self._storage: Dict[str, Dict[str, Any]] = {}
        self._ttl = ttl
    
    async def get_state_data(self, key: str) -> StateData:
        """Retrieve state data for a given key."""
        if key not in self._storage:
            raise StateNotFoundError(f"State not found: {key}")
            
        data = self._storage[key]
        
        # Check if data has expired
        if "expires_at" in data and data["expires_at"] < datetime.now(timezone.utc):
            await self.delete_state(key)
            raise StateNotFoundError(f"State expired: {key}")
            
        return StateData(**data)
    
    async def set_state_data(self, key: str, state_data: StateData) -> None:
        """Store state data for a given key."""
        data = state_data.dict()
        
        # Add TTL if specified
        if self._ttl > 0:
            data["expires_at"] = datetime.now(timezone.utc) + timedelta(seconds=self._ttl)
            
        self._storage[key] = data
    
    async def delete_state(self, key: str) -> None:
        """Delete state data for a given key."""
        self._storage.pop(key, None)
    
    async def has_state(self, key: str) -> bool:
        """Check if a state exists for the given key."""
        return key in self._storage
    
    async def get_all_states(self) -> Dict[str, StateData]:
        """Retrieve all states."""
        return {k: StateData(**v) for k, v in self._storage.items()}
    
    async def clear_all_states(self) -> None:
        """Clear all stored states."""
        self._storage.clear()
    
    async def find_states(self, state: str) -> AsyncIterator[tuple[str, StateData]]:
        """Find all states with the given state value."""
        for key, data in self._storage.items():
            if data.get("state") == state:
                yield key, StateData(**data)
    
    async def cleanup_expired(self) -> int:
        """Remove all expired states and return count of removed items."""
        now = datetime.now(timezone.utc)
        expired = []
        
        for key, data in self._storage.items():
            if "expires_at" in data and data["expires_at"] < now:
                expired.append(key)
                
        for key in expired:
            del self._storage[key]
            
        return len(expired)
```

### Storage Best Practices

1. **Thread Safety**

   - Ensure your storage implementation is thread-safe, especially if using shared resources
   - Use locks or atomic operations for concurrent access
   - Consider using connection pools for database connections

2. **Error Handling**

   - Implement proper error handling for storage operations
   - Handle connection errors gracefully
   - Implement retries for transient failures
   - Log errors with appropriate context

3. **Connection Management**

   - Use connection pooling for database connections
   - Implement proper connection cleanup
   - Handle connection timeouts and retries

4. **TTL Support**

   - Implement automatic cleanup of expired states
   - Consider background cleanup tasks for large datasets
   - Document TTL behavior in your implementation

5. **Data Validation**

   - Validate data before storing to maintain consistency
   - Use proper serialization/deserialization
   - Handle schema migrations if needed

6. **Performance Considerations**

   - Use batch operations when possible
   - Implement efficient querying for large datasets
   - Consider caching frequently accessed data

7. **Monitoring and Logging**

   - Log important operations and errors
   - Add metrics for monitoring storage performance
   - Include context in error messages for easier debugging

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

## Organize Your Code with Routers and Plugins

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

```env
API_ID=1234567
API_HASH=your_api_hash_here
BOT_TOKEN=your_bot_token_here
```

{{ ... }}

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

1. Check the [Kurigram Documentation](https://docs.kurigram.live/)
2. Join the [Telegram Group](https://t.me/kurigram_addons_chat)

## Final Thoughts

Building bots with Pyrogram and pyrogram_patch can be incredibly rewarding. As you become more comfortable with the basics, you'll discover even more powerful patterns and techniques. Remember:

- **Don't be afraid to make mistakes** - they're part of learning
- **Break problems into smaller parts** - solve one piece at a time
- **Read error messages carefully** - they often tell you exactly what's wrong
- **Back up your code** - use version control like Git
- **Have fun!** - Building bots should be enjoyable

Happy coding! 🚀
