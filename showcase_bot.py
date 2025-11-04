"""
Pyrogram Patch Showcase Bot - Enhanced Edition

This bot demonstrates all key features of the enhanced pyrogram_patch:
- Router system for organized handlers
- Finite State Machine (FSM) for multi-step conversations
- Middleware system with signature caching and context isolation
- Pluggable storage with circuit breaker resilience (Memory, Redis, Custom MongoDB)
- Thread-safe data management with weak references
- Comprehensive metrics and monitoring system
- Configuration management with validation
- Addon architecture for extensibility
- Enhanced security with input validation and JSON schema validation
- Event-driven cleanup for optimal performance

Additionally integrates pykeyboard for building inline and reply keyboards.

Setup:
1. Set environment variables (or use config file):
   - PYROGRAM_PATCH_API_ID: Your Telegram API ID
   - PYROGRAM_PATCH_API_HASH: Your Telegram API Hash
   - PYROGRAM_PATCH_BOT_TOKEN: Your bot token from @BotFather
   - PYROGRAM_PATCH_STORAGE_TYPE: 'memory' (default), 'redis', or 'mongo'
   - For Redis: PYROGRAM_PATCH_STORAGE_REDIS_URL
   - For Mongo: PYROGRAM_PATCH_STORAGE_MONGO_URI

2. Install dependencies:
   - pyrogram
   - pyrogram_patch (this project)
   - pykeyboard (this project)
   - For Redis: redis
   - For Mongo: pymongo

3. Run: python showcase_bot.py

New Features Demo:
- /start: Enhanced main menu with all new features
- /metrics: View real-time performance metrics
- /config: Show current configuration
- /addons: Demonstrate addon system
- FSM Demo: Multi-step profile collection with enhanced error handling
- Middleware Demo: Advanced logging with context isolation
- Circuit Breaker Demo: Storage resilience testing
- Enhanced Storage: Configurable with circuit breaker protection
"""

import asyncio
import logging
import os
import re
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from pyrogram import Client, filters
from pyrogram.errors import FloodWait
from pyrogram.methods.utilities.idle import idle
from pyrogram.types import CallbackQuery, Message

from pykeyboard import (InlineButton, InlineKeyboard, KeyboardFactory,
                        ReplyButton, ReplyKeyboard)
# Enhanced pyrogram_patch imports
from pyrogram_patch import PatchManager, patch
from pyrogram_patch.circuit_breaker import (CircuitBreakerConfig,
                                            get_circuit_breaker)
# New enhanced features
from pyrogram_patch.config import (PyrogramPatchConfig, get_config,
                                   validate_config)
from pyrogram_patch.fsm import NoStateFilter, State, StateFilter, StatesGroup
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm.storages import MemoryStorage, RedisStorage
from pyrogram_patch.metrics import (get_global_metrics, record_fsm_transition,
                                    record_middleware_execution,
                                    record_storage_operation)
from pyrogram_patch.middlewares.context import (MiddlewareContext,
                                                MiddlewareContextManager)
from pyrogram_patch.middlewares.middleware_types.middlewares import \
    BaseMiddleware
from pyrogram_patch.patch_helper import PatchHelper
from pyrogram_patch.addons import (discover_addons_in_module,
                                   get_addon_manager)
from pyrogram_patch.router import Router

# Thread-safe note: pyrogram_patch uses thread-safe data management via patch_data_pool,
# ensuring safe concurrent access in high-load scenarios without locks.


# Initialize configuration
config = get_config()

# Setup logging based on configuration
logging.basicConfig(
    level=getattr(logging, config.logging.level),
    format=config.logging.format,
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Validate configuration
validation_warnings = validate_config(config)
if validation_warnings:
    logger.warning("Configuration validation warnings:")
    for warning in validation_warnings:
        logger.warning(f"  - {warning}")

# Extract configuration values
API_ID = os.getenv("PYROGRAM_PATCH_API_ID") or os.getenv(
    "API_ID"
)  # Backward compatibility
API_HASH = os.getenv("PYROGRAM_PATCH_API_HASH") or os.getenv("API_HASH")
BOT_TOKEN = os.getenv("PYROGRAM_PATCH_BOT_TOKEN") or os.getenv("BOT_TOKEN")
STORAGE_TYPE = config.storage.redis_url or config.storage.mongo_uri or "memory"

# Validate required configuration
required_vars = ["API_ID", "API_HASH", "BOT_TOKEN"]
missing_required = [var for var in required_vars if locals()[var] is None]

if missing_required:
    logger.error(
        f"Missing required configuration: {', '.join(missing_required)}\n"
        f"Set using environment variables like PYROGRAM_PATCH_API_ID=your_value\n"
        f"Or use the configuration system with config files"
    )
    exit(1)

logger.info("Configuration loaded successfully")
logger.info(f"Storage type: {STORAGE_TYPE}")
logger.info(f"Debug mode: {config.debug}")
logger.info(f"Metrics enabled: {config.metrics.enabled}")


# Enhanced Custom MongoDB Storage with circuit breaker protection
class CustomMongoStorage(BaseStorage):
    """
    Enhanced MongoDB storage implementation with circuit breaker protection.

    Demonstrates flexible storage backends with resilience patterns.
    Requires pymongo: pip install pymongo
    Stores state data in MongoDB collection with TTL support and circuit breaker.
    """

    def __init__(
        self,
        uri: str,
        db_name: str = "bot_db",
        collection_name: str = "states",
        circuit_breaker_config: Optional[CircuitBreakerConfig] = None,
    ):
        try:
            from pymongo import MongoClient
            from pymongo.errors import ConnectionFailure
        except ImportError:
            raise ImportError(
                "pymongo is required for MongoStorage. Install with: pip install pymongo"
            )

        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

        # Initialize circuit breaker for MongoDB operations
        self._circuit_breaker = get_circuit_breaker(
            "mongodb", circuit_breaker_config
        )

        try:
            self.client.admin.command("ping")
        except ConnectionFailure:
            raise ConnectionFailure("Failed to connect to MongoDB")

    async def get_state(self, key: str) -> Optional[dict]:
        async def _get_state_impl() -> Optional[dict]:
            doc = self.collection.find_one({"key": key})
            if doc and (
                not doc.get("expires_at")
                or doc["expires_at"] > datetime.now(datetime.timezone.utc)
            ):
                return {"name": doc.get("name"), "data": doc.get("data", {})}
            if doc:
                self.collection.delete_one({"key": key})
            return None

        return await self._circuit_breaker.call(_get_state_impl)

    async def set_state(self, key: str, state_data: dict) -> None:
        async def _set_state_impl() -> None:
            ttl = state_data.get("ttl", config.fsm.default_ttl)
            expires_at = (
                datetime.now(datetime.timezone.utc) + timedelta(seconds=ttl)
                if ttl
                else None
            )
            doc = {
                "key": key,
                "name": state_data.get("name"),
                "data": state_data.get("data", {}),
                "ttl": ttl,
                "expires_at": expires_at,
            }
            self.collection.replace_one({"key": key}, doc, upsert=True)

        await self._circuit_breaker.call(_set_state_impl)

    async def delete_state(self, key: str) -> bool:
        async def _delete_state_impl() -> bool:
            result = self.collection.delete_one({"key": key})
            return result.deleted_count > 0

        return await self._circuit_breaker.call(_delete_state_impl)

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        # MongoDB doesn't have built-in CAS, so we implement it with find_and_modify
        async def _cas_impl() -> bool:
            ttl_use = ttl or config.fsm.default_ttl
            expires_at = (
                datetime.now(datetime.timezone.utc) + timedelta(seconds=ttl_use)
                if ttl_use
                else None
            )

            # Use find_one_and_update with atomic operation
            query = {"key": identifier}
            if expected_state is not None:
                query["name"] = expected_state.get("name")
                query["data"] = expected_state.get("data", {})

            update_doc = {
                "key": identifier,
                "name": new_state.get("name"),
                "data": new_state.get("data", {}),
                "ttl": ttl_use,
                "expires_at": expires_at,
            }

            result = self.collection.find_one_and_update(
                query, {"$set": update_doc}, upsert=True, return_document=True
            )
            return result is not None

        return await self._circuit_breaker.call(_cas_impl)

    async def list_keys(self, pattern: str = "*") -> list[str]:
        async def _list_keys_impl() -> list[str]:
            # Simple implementation - in production you'd want more sophisticated pattern matching
            cursor = self.collection.find({}, {"key": 1})
            return [doc["key"] for doc in cursor]

        return await self._circuit_breaker.call(_list_keys_impl)

    async def clear_namespace(self) -> int:
        async def _clear_impl() -> int:
            result = self.collection.delete_many({})
            return result.deleted_count

        return await self._circuit_breaker.call(_clear_impl)


# Enhanced storage setup with circuit breaker protection
def get_storage() -> BaseStorage:
    """
    Enhanced factory for pluggable storage with circuit breaker protection.

    - memory: In-memory with event-driven cleanup (default, no deps)
    - redis: Redis with circuit breaker and JSON schema validation
    - mongo: Custom MongoDB with circuit breaker protection
    """
    # Configure circuit breaker based on storage type
    cb_config = CircuitBreakerConfig(
        failure_threshold=config.circuit_breaker.failure_threshold,
        recovery_timeout=config.circuit_breaker.recovery_timeout,
        success_threshold=config.circuit_breaker.success_threshold,
        timeout=config.circuit_breaker.timeout,
    )

    if config.storage.redis_url:
        try:
            import redis.asyncio as aioredis

            redis_client = aioredis.from_url(config.storage.redis_url)
            return RedisStorage(
                redis=redis_client,
                prefix=config.storage.redis_prefix,
                default_ttl=config.fsm.default_ttl,
                circuit_breaker_config=cb_config,
            )
        except ImportError:
            raise ImportError(
                "redis is required for RedisStorage. Install with: pip install redis"
            )
    elif config.storage.mongo_uri:
        return CustomMongoStorage(
            uri=config.storage.mongo_uri, circuit_breaker_config=cb_config
        )
    else:
        # Default to memory storage with enhanced cleanup
        return MemoryStorage(
            default_ttl=config.fsm.default_ttl,
            cleanup_interval=config.fsm.cleanup_interval,
        )


storage = get_storage()

client_kwargs = {
    "name": "showcase_bot",
    "api_id": API_ID,
    "api_hash": API_HASH,
    "bot_token": BOT_TOKEN,
    "in_memory": True,
}

# Client initialization
app = Client(**client_kwargs)


# Enhanced middleware with context isolation and metrics
class EnhancedLoggingMiddleware(BaseMiddleware):
    """
    Enhanced middleware with context isolation, metrics, and improved logging.

    Demonstrates:
    - Context isolation to prevent data leakage
    - Metrics collection for middleware performance
    - Proper error handling and logging
    - Thread-safe data management
    """

    def __init__(self, allowed_users: Optional[List[int]] = None):
        self.allowed_users = allowed_users or []  # For demo, allow all
        self.metrics = get_global_metrics()

    async def __call__(
        self, update: Any, client: Client, patch_helper: PatchHelper
    ) -> None:
        start_time = asyncio.get_event_loop().time()

        try:
            # Use context isolation for thread safety
            async with MiddlewareContextManager() as ctx_mgr:
                MiddlewareContext.set("middleware_start", start_time)
                MiddlewareContext.set("update_type", type(update).__name__)

                if not hasattr(update, "from_user"):
                    await record_middleware_execution(
                        "logging_middleware", 0.001, success=True
                    )
                    return  # Continue processing

                user_id = update.from_user.id
                text = getattr(update, "text", "N/A")

                # Store context data safely
                MiddlewareContext.set("user_id", user_id)
                MiddlewareContext.set(
                    "message_text", text[:100]
                )  # Limit for safety

                logger.info(f"Middleware processed update from user {user_id}")

                # Enhanced auth check with metrics
                if self.allowed_users and user_id not in self.allowed_users:
                    await record_middleware_execution(
                        "logging_middleware", 0.002, success=False
                    )
                    await update.reply(
                        "Access denied! Please contact your administrator."
                    )
                    await patch_helper.skip_handler()
                    return

                # Record successful middleware execution
                execution_time = asyncio.get_event_loop().time() - start_time
                await record_middleware_execution(
                    "logging_middleware", execution_time, success=True
                )

                # Log context information for debugging
                context_info = MiddlewareContext.get_stats()
                logger.debug(f"Middleware context: {context_info}")

        except Exception as e:
            execution_time = asyncio.get_event_loop().time() - start_time
            await record_middleware_execution(
                "logging_middleware", execution_time, success=False
            )
            logger.error(f"Middleware error: {e}")
            # Continue processing even if middleware fails


# Routers for organization
commands_router = Router()
fsm_router = Router()


# FSM StatesGroup for profile demo
class ProfileStates(StatesGroup):
    """FSM StatesGroup demo: Multi-step profile collection."""

    waiting_name = State()
    waiting_age = State()
    waiting_location = State()


# Enhanced /start: Welcome menu with all new features
@commands_router.on_message(filters.command("start") & filters.private)
async def start_handler(client: Client, message: Message):
    """
    Enhanced start command: Shows comprehensive main menu with all new features.

    Demonstrates:
    - Enhanced UI with new features
    - Metrics integration
    - Configuration awareness
    """
    # Record metrics for command usage
    await record_middleware_execution("start_command", 0.001, success=True)

    keyboard = InlineKeyboard(row_width=2)
    keyboard.add(
        InlineButton("🎭 FSM Demo", "demo:fsm"),
        InlineButton("🔧 Middleware Demo", "demo:middleware"),
        InlineButton("📊 Metrics", "demo:metrics"),
        InlineButton("⚙️ Config", "demo:config"),
        InlineButton("🔌 Addons", "demo:addons"),
        InlineButton("🛡️ Circuit Breaker", "demo:circuit_breaker"),
        InlineButton("📁 Router Demo", "demo:router"),
        InlineButton("💾 Storage Info", "info:storage"),
        InlineButton("⌨️ Pykeyboard Demo", "demo:pykeyboard"),
    )

    status_info = f"""
🤖 Enhanced Pyrogram Patch Showcase Bot!

Current Configuration:
• Storage: {STORAGE_TYPE}
• Debug Mode: {config.debug}
• Metrics: {'Enabled' if config.metrics.enabled else 'Disabled'}
• Circuit Breaker: {'Enabled' if config.circuit_breaker.failure_threshold > 0 else 'Disabled'}

New Features Available:
• Real-time metrics monitoring
• Configuration management
• Addon architecture
• Circuit breaker protection
• Enhanced security & performance

Click a button to explore features!
"""

    await message.reply_text(status_info, reply_markup=keyboard)


# Enhanced callback query handler for all menu options
@fsm_router.on_callback_query(filters.regex(r"(demo|info|cb):(.+)"))
async def menu_callback(client: Client, query: CallbackQuery):
    """
    Enhanced callback handler for all menu options including new features.
    """
    await query.answer()
    data = query.data
    logger.info(f"Callback query: {data}")

    try:
        if data == "demo:fsm":
            await query.message.edit_text(
                "🎭 FSM Demo\n\nStarting Finite State Machine Demo...\nSend /fsm to begin profile collection."
            )
        elif data == "demo:middleware":
            await query.message.edit_text(
                "🔧 Middleware Demo\n\nEnhanced middleware with context isolation and metrics.\nSend /middleware_test to see it in action."
            )
        elif data == "demo:metrics":
            await query.message.edit_text(
                "📊 Metrics Demo\n\nSend /metrics to view real-time performance metrics."
            )
        elif data == "demo:config":
            await query.message.edit_text(
                "⚙️ Configuration Demo\n\nSend /config to view current configuration settings."
            )
        elif data == "demo:addons":
            await query.message.edit_text(
                "🔌 Addon Demo\n\nSend /addons to view loaded addons and their capabilities."
            )
        elif data == "demo:circuit_breaker":
            await query.message.edit_text(
                "🛡️ Circuit Breaker Demo\n\nSend /circuit_breaker to control circuit breaker protection."
            )
        elif data == "demo:router":
            await query.message.edit_text(
                "📁 Router Demo\n\nSend /router_test to see organized handler routing."
            )
        elif data == "info:storage":
            storage_info = f"""
💾 Storage Information:

Current Type: {STORAGE_TYPE}
Enhanced Features:
• Circuit breaker protection
• Event-driven cleanup (memory)
• JSON schema validation (Redis)
• Automatic failover handling

Configuration loaded from: {config.__class__.__name__}
"""
            await query.message.edit_text(storage_info)
        elif data == "demo:pykeyboard":
            await pykeyboard_demo(client, query.message)
        elif data.startswith("cb:"):
            await handle_circuit_breaker_callback(client, query)

    except Exception as e:
        logger.error(f"Error handling callback {data}: {e}")
        await query.answer("Error processing request", show_alert=True)


# Circuit breaker callback handler
async def handle_circuit_breaker_callback(client: Client, query: CallbackQuery):
    """Handle circuit breaker control callbacks."""
    action = query.data.split(":", 2)[2]  # cb:action:target

    if action == "reset:redis":
        success = await reset_circuit_breaker("redis")
        status = (
            "✅ Redis circuit breaker reset"
            if success
            else "❌ Failed to reset Redis circuit breaker"
        )
    elif action == "reset:mongodb":
        success = await reset_circuit_breaker("mongodb")
        status = (
            "✅ MongoDB circuit breaker reset"
            if success
            else "❌ Failed to reset MongoDB circuit breaker"
        )
    elif action == "status":
        redis_cb = get_circuit_breaker("redis")
        mongo_cb = get_circuit_breaker("mongodb")
        status = f"""
🛡️ Circuit Breaker Status:

Redis CB:
• State: {redis_cb.get_stats()['state'].upper()}
• Failures: {redis_cb.get_stats()['failure_count']}

MongoDB CB:
• State: {mongo_cb.get_stats()['state'].upper()}
• Failures: {mongo_cb.get_stats()['failure_count']}
"""
    else:
        status = "❌ Unknown circuit breaker action"

    await query.message.edit_text(status)


# FSM Demo handlers (using fsm_router)
@fsm_router.on_message(
    filters.command("fsm") & filters.private & NoStateFilter(storage=storage)
)
async def fsm_start(client: Client, message: Message, state: FSMContext):
    """Starts FSM profile collection."""
    await state.set_state(ProfileStates.waiting_name)
    keyboard = ReplyKeyboard(one_time_keyboard=True, resize_keyboard=True)
    keyboard.add(ReplyButton("Cancel", request_poll=None))  # Simple cancel
    await message.reply_text(
        "FSM Demo: Profile Collection\n\nEnter your name:",
        reply_markup=keyboard,
    )


@fsm_router.on_message(
    StateFilter(ProfileStates.waiting_name, storage=storage)
    & filters.private
    & filters.text
)
async def fsm_name(
    client: Client,
    message: Message,
    state: FSMContext,
    patch_helper: PatchHelper,
):
    """Collects name and advances to age with enhanced error handling and metrics."""
    name = message.text.strip()

    # Validate input
    if not name or len(name.strip()) == 0:
        await record_fsm_transition(
            "waiting_name", "waiting_name", success=False
        )
        await message.reply_text("Please enter a valid name.")
        return

    if len(name) > 50:  # Reasonable limit
        await record_fsm_transition(
            "waiting_name", "waiting_name", success=False
        )
        await message.reply_text(
            "Name is too long. Please enter a shorter name."
        )
        return

    try:
        await patch_helper.update_data(Name=name)
        await state.set_state(ProfileStates.waiting_age)
        await record_fsm_transition("waiting_name", "waiting_age", success=True)
        await message.reply_text("Great! Now enter your age:")
    except Exception as e:
        logger.error(f"Error in FSM name collection: {e}")
        await record_fsm_transition(
            "waiting_name", "waiting_name", success=False
        )
        await message.reply_text("An error occurred. Please try again.")


@fsm_router.on_message(
    StateFilter(ProfileStates.waiting_age, storage=storage)
    & filters.private
    & filters.text
)
async def fsm_age(
    client: Client,
    message: Message,
    state: FSMContext,
    patch_helper: PatchHelper,
):
    """Collects age and advances to location with enhanced validation."""
    try:
        age_text = message.text.strip()

        # Enhanced validation
        if not age_text:
            await record_fsm_transition(
                "waiting_age", "waiting_age", success=False
            )
            await message.reply_text("Please enter your age.")
            return

        age = int(age_text)

        # Business rule validation
        if age < 0:
            await record_fsm_transition(
                "waiting_age", "waiting_age", success=False
            )
            await message.reply_text(
                "Age cannot be negative. Please enter a valid age."
            )
            return
        elif age > 150:
            await record_fsm_transition(
                "waiting_age", "waiting_age", success=False
            )
            await message.reply_text(
                "Please enter a realistic age (under 150)."
            )
            return
        elif age < 13:
            await record_fsm_transition(
                "waiting_age", "waiting_age", success=False
            )
            await message.reply_text(
                "You must be at least 13 years old to use this bot."
            )
            return

        await patch_helper.update_data(Age=age)
        await state.set_state(ProfileStates.waiting_location)
        await record_fsm_transition(
            "waiting_age", "waiting_location", success=True
        )
        await message.reply_text("Finally, enter your location:")

    except ValueError:
        await record_fsm_transition("waiting_age", "waiting_age", success=False)
        await message.reply_text(
            "Invalid age format. Please enter a number between 13-150."
        )
    except Exception as e:
        logger.error(f"Error in FSM age collection: {e}")
        await record_fsm_transition("waiting_age", "waiting_age", success=False)
        await message.reply_text("An error occurred. Please try again.")


@fsm_router.on_message(
    StateFilter(ProfileStates.waiting_location, storage=storage)
    & filters.private
    & filters.text
)
async def fsm_location(
    client: Client,
    message: Message,
    state: FSMContext,
    patch_helper: PatchHelper,
):
    """Completes FSM and shows summary with enhanced formatting and metrics."""
    location = message.text.strip()

    # Validate location input
    if not location or len(location.strip()) == 0:
        await record_fsm_transition(
            "waiting_location", "waiting_location", success=False
        )
        await message.reply_text("Please enter a valid location.")
        return

    if len(location) > 100:  # Reasonable limit
        await record_fsm_transition(
            "waiting_location", "waiting_location", success=False
        )
        await message.reply_text(
            "Location name is too long. Please enter a shorter location."
        )
        return

    try:
        await patch_helper.update_data(Location=location)

        # Get final data with error handling
        data = await patch_helper.data

        # Enhanced summary with better formatting
        summary = "🎉 Profile Complete!\n\n"
        summary += "📋 Your Information:\n"
        summary += f"• Name: {data.get('Name', 'N/A')}\n"
        summary += f"• Age: {data.get('Age', 'N/A')}\n"
        summary += f"• Location: {data.get('Location', 'N/A')}\n\n"
        summary += "Thank you for completing the FSM demo!"

        await message.reply_text(summary)

        # Clear state and record successful completion
        await state.clear_state()
        await record_fsm_transition("waiting_location", "*", success=True)
        logger.info(f"FSM profile completed for user {message.from_user.id}")

    except Exception as e:
        logger.error(f"Error completing FSM profile: {e}")
        await record_fsm_transition(
            "waiting_location", "waiting_location", success=False
        )
        await message.reply_text(
            "An error occurred while saving your profile. Please try again."
        )


# Middleware Demo
@commands_router.on_message(
    filters.command("middleware_test") & filters.private
)
async def middleware_test(client: Client, message: Message):
    """Triggers middleware: Will be logged and auth-checked."""
    await message.reply_text("Middleware activated! Check console for log.")


# Router Demo
@commands_router.on_message(filters.command("router_test") & filters.private)
async def router_test(client: Client, message: Message):
    """Demonstrates router organization."""
    await message.reply_text(
        "Router Demo:\n"
        "- Commands handled by commands_router\n"
        "- FSM by fsm_router\n"
        "This shows modular handler organization."
    )


# Pykeyboard Demo: Pagination and languages
async def pykeyboard_demo(client: Client, message: Message):
    """Shows advanced pykeyboard features: Pagination and language selection."""
    keyboard = InlineKeyboard(row_width=2)
    keyboard.add(
        InlineButton("🌐 Languages", "show_languages"),
        InlineButton("Pagination", "show_pagination"),
    )
    await message.edit_text(
        "Pykeyboard Demo:\n\n"
        "Click 'show_languages' for language selector.\n\n"
        "Features: Builders, factories, serialization, validation.",
        reply_markup=keyboard,
    )


# Additional handler for languages in pykeyboard demo
@fsm_router.on_callback_query(filters.regex(r"show_languages"))
async def show_languages(client: Client, query: CallbackQuery):
    """Language selection demo using pykeyboard factory."""
    logger.info(f"Callback query: {query.data}")
    await query.answer()
    keyboard = KeyboardFactory.create_language_keyboard(
        locales=["en_US", "ru_RU", "es_ES", "fr_FR", "de_DE"],
        callback_pattern="set_lang_{locale}",
        row_width=2,
    )
    await query.message.edit_text(
        "Language Selection Demo:\nSelect a language:", reply_markup=keyboard
    )


@fsm_router.on_callback_query(filters.regex(r"show_pagination"))
async def show_pagination(client: Client, query: CallbackQuery):
    """Pagination demo using pykeyboard factory."""
    logger.info(f"Callback query: {query.data}")
    await query.answer()
    keyboard = KeyboardFactory.create_pagination_keyboard(
        total_pages=10,
        current_page=4,
        callback_pattern="page_{number}",
        include_buttons=[
            {"text": "Button 1", "callback_data": "button_1"},
            {"text": "Button 2", "callback_data": "button_2"},
        ],
    )
    await query.message.edit_text(
        "Pagination Demo:\n\n"
        "Click 'show_pagination' for pagination selector.",
        reply_markup=keyboard,
    )


@fsm_router.on_callback_query(filters.regex(r"set_lang_(\w+)"))
async def set_language(client: Client, query: CallbackQuery):
    """Set language demo using pykeyboard factory."""
    logger.info(f"Callback query: {query.data}")
    await query.answer()
    await query.message.edit_text(
        "Language set to: {}".format(query.data.split("_")[1])
    )


@fsm_router.on_callback_query(filters.regex(r"page_(\d+)"))
async def page_callback(client: Client, query: CallbackQuery):
    """Page callback demo."""
    logger.info(f"Callback query: {query.data}")
    await query.answer()
    total_pages = 10
    current_page = int(query.data.split("_")[1])
    keyboard = KeyboardFactory.create_pagination_keyboard(
        total_pages=total_pages,
        current_page=current_page,
        callback_pattern="page_{number}",
        include_buttons=[
            {"text": "Button 1", "callback_data": "button_1"},
            {"text": "Button 2", "callback_data": "button_2"},
        ],
    )
    await query.message.edit_text("Page {}".format(query.data.split("_")[1]))
    await query.message.edit_reply_markup(keyboard)


@app.on_callback_query(filters.regex(r"button_(\d+)"))
async def button_callback(client: Client, query: CallbackQuery):
    """Button callback demo."""
    logger.info(f"Callback query: {query.data}")
    await query.answer(f"Button {query.data} clicked!", show_alert=True)


# Enhanced storage info command
@commands_router.on_message(filters.command("storage_info") & filters.private)
async def storage_info(client: Client, message: Message):
    """Shows enhanced storage configuration and circuit breaker status."""
    storage_info = f"""
💾 Storage Configuration:

Type: {STORAGE_TYPE}
Circuit Breaker: {'Enabled' if config.circuit_breaker.failure_threshold > 0 else 'Disabled'}
Default TTL: {config.fsm.default_ttl}s
"""

    if config.storage.redis_url:
        storage_info += f"Redis URL: {config.storage.redis_url}\n"
    elif config.storage.mongo_uri:
        storage_info += f"MongoDB URI: {config.storage.mongo_uri}\n"

    # Get circuit breaker stats
    cb = get_circuit_breaker("redis" if config.storage.redis_url else "mongodb")
    cb_stats = cb.get_stats()
    storage_info += f"""
🛡️ Circuit Breaker Status:
State: {cb_stats['state'].upper()}
Failure Count: {cb_stats['failure_count']}
Success Count: {cb_stats['success_count']}
"""

    await message.reply_text(storage_info)


# New metrics command
@commands_router.on_message(filters.command("metrics") & filters.private)
async def metrics_handler(client: Client, message: Message):
    """Shows real-time performance metrics."""
    metrics = get_global_metrics()

    metrics_report = f"""
📊 Real-time Metrics Report:

Middleware Performance:
• Total Executions: {metrics.get_counter_value('middleware_executions_total')}
• Avg Execution Time: {metrics.get_histogram_stats('middleware_execution_duration_seconds')['avg']:.4f}s

FSM Transitions:
• Total Transitions: {metrics.get_counter_value('fsm_transitions_total')}

Storage Operations:
• Total Operations: {metrics.get_counter_value('storage_operations_total')}
• Avg Operation Time: {metrics.get_histogram_stats('storage_operation_duration_seconds')['avg']:.4f}s

Error Tracking:
• Total Errors: {metrics.get_counter_value('errors_total')}

Recent Samples: {len(metrics.get_recent_samples(10))}
"""

    await message.reply_text(metrics_report)


# New config command
@commands_router.on_message(filters.command("config") & filters.private)
async def config_handler(client: Client, message: Message):
    """Shows current configuration settings."""
    config_info = f"""
⚙️ Configuration Settings:

Debug Mode: {config.debug}
Max Workers: {config.max_workers}

Circuit Breaker:
• Failure Threshold: {config.circuit_breaker.failure_threshold}
• Recovery Timeout: {config.circuit_breaker.recovery_timeout}s
• Success Threshold: {config.circuit_breaker.success_threshold}

Metrics:
• Enabled: {config.metrics.enabled}
• Max Samples: {config.metrics.max_samples}

FSM:
• Default TTL: {config.fsm.default_ttl}s
• Max State Size: {config.fsm.max_state_size} bytes

Storage:
• Redis URL: {config.storage.redis_url or 'Not configured'}
• MongoDB URI: {config.storage.mongo_uri or 'Not configured'}
"""

    await message.reply_text(config_info)


# New addons command
@commands_router.on_message(filters.command("addons") & filters.private)
async def addons_handler(client: Client, message: Message):
    """Shows loaded addons and their capabilities."""
    addon_manager = get_addon_manager()
    addons = addon_manager.list_addons()

    if not addons:
        await message.reply_text("🔌 No addons currently loaded.")
        return

    addons_info = "🔌 Loaded Addons:\n\n"
    for addon in addons:
        addons_info += f"📦 {addon['name']} v{addon['version']}\n"
        addons_info += f"   {addon['description']}\n"
        if addon["capabilities"]:
            addons_info += f"   Capabilities: {', '.join(addon['capabilities'])}\n"
        addons_info += "\n"

    await message.reply_text(addons_info)


# New circuit breaker command
@commands_router.on_message(
    filters.command("circuit_breaker") & filters.private
)
async def circuit_breaker_handler(client: Client, message: Message):
    """Shows circuit breaker status and allows manual control."""
    keyboard = InlineKeyboard(row_width=2)
    keyboard.add(
        InlineButton("🔄 Reset Redis CB", "cb:reset:redis"),
        InlineButton("🔄 Reset MongoDB CB", "cb:reset:mongodb"),
        InlineButton("📊 CB Status", "cb:status"),
    )

    status_info = """
🛡️ Circuit Breaker Control Panel

Available Actions:
• Reset circuit breakers to closed state
• View detailed status information

Circuit breakers automatically protect against:
• Database connection failures
• Storage timeouts
• High error rates
"""

    await message.reply_text(status_info, reply_markup=keyboard)


# Helper function for circuit breaker reset
async def reset_circuit_breaker(name: str) -> bool:
    """Reset a circuit breaker to closed state."""
    try:
        cb = get_circuit_breaker(name)
        return await cb.reset()
    except Exception as e:
        logger.error(f"Failed to reset circuit breaker {name}: {e}")
        return False


async def main():
    """Enhanced main function with all new features."""
    # Handle existing event loop to prevent Pyrogram loop conflicts
    try:
        loop = asyncio.get_running_loop()
        logger.info(f"Using existing event loop: {loop}")
    except RuntimeError:
        loop = asyncio.get_event_loop()
        logger.info(f"Using new event loop: {loop}")

    # Ensure Pyrogram uses the correct loop
    app.loop = loop

    # Initialize pyrogram_patch with enhanced features
    logger.info("Initializing Pyrogram Patch with enhanced features...")
    patch_manager: PatchManager = await patch(app)

    # Set storage with circuit breaker protection
    await patch_manager.set_storage(storage)
    logger.info(f"Storage initialized: {STORAGE_TYPE}")

    # Use enhanced middleware with context isolation and metrics
    enhanced_mw = EnhancedLoggingMiddleware()
    await patch_manager.include_middleware(enhanced_mw, kind="before")
    logger.info("Enhanced middleware registered with context isolation")

    # Register routers
    patch_manager.include_router(commands_router)
    patch_manager.include_router(fsm_router)
    logger.info("Routers registered successfully")

    # Load addons if configured
    if config.addons:
        addon_manager = get_addon_manager()
        loaded_addons = []
        for addon_spec in config.addons:
            try:
                if ":" in addon_spec:
                    module_name, class_name = addon_spec.split(":", 1)
                    addon_name = await addon_manager.load_addon_from_module(
                        module_name,
                        class_name,
                        config.get_addon_config(addon_spec),
                    )
                else:
                    # Assume it's a module with a default addon class
                    addons_found = discover_addons_in_module(addon_spec)
                    if addons_found:
                        addon_name = await addon_manager.load_addon(
                            addons_found[0],
                            config.get_addon_config(addon_spec),
                        )
                    else:
                        logger.warning(
                            f"No addons found in module {addon_spec}"
                        )
                        continue
                loaded_addons.append(addon_name)
                logger.info(f"Addon loaded: {addon_name}")
            except Exception as e:
                logger.error(f"Failed to load addon {addon_spec}: {e}")

        if loaded_addons:
            logger.info(
                f"Successfully loaded {len(loaded_addons)} addons: {', '.join(loaded_addons)}"
            )

    # Log router capabilities
    events = commands_router.get_supported_events()
    logger.info(f"Router supports {len(events)} event types")

    # Start the bot with enhanced error handling
    logger.info("Starting Enhanced Pyrogram Patch Showcase Bot...")
    logger.info(
        f"Configuration: Debug={config.debug}, Metrics={config.metrics.enabled}"
    )

    try:
        await app.start()
        logger.info("Bot started successfully!")

        # Log startup metrics
        metrics = get_global_metrics()
        await record_middleware_execution("bot_startup", 0.001, success=True)

        # Main bot loop
        await idle()

    except FloodWait as e:
        logger.warning(f"FloodWait detected, sleeping for {e.x} seconds")
        await asyncio.sleep(e.x)
        await app.start()
        await idle()
    except Exception as e:
        logger.error(f"Bot startup failed: {e}")
        logger.info("Please check configuration and try again")
        return
    finally:
        # Cleanup on shutdown
        try:
            addon_manager = get_addon_manager()
            await addon_manager.shutdown_all()
            logger.info("Addons shut down successfully")
        except Exception as e:
            logger.error(f"Error during addon shutdown: {e}")

        await app.stop()
        logger.info("Bot stopped successfully")


# Run the bot
if __name__ == "__main__":
    asyncio.run(main())
