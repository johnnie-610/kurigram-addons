"""
Pyrogram Patch Showcase Bot

This bot demonstrates all key features of pyrogram_patch:
- Router system for organized handlers
- Finite State Machine (FSM) for multi-step conversations
- Middleware system for processing updates
- Pluggable storage (Memory, Redis, Custom MongoDB)
- Thread-safe data management
- Type safety with full type hints
- Seamless integration with standard Pyrogram filters

Additionally integrates pykeyboard for building inline and reply keyboards.

Setup:
1. Set environment variables:
   - API_ID: Your Telegram API ID
   - API_HASH: Your Telegram API Hash
   - BOT_TOKEN: Your bot token from @BotFather
   - STORAGE_TYPE: 'memory' (default), 'redis', or 'mongo'
   - For Redis: REDIS_HOST (localhost), REDIS_PORT (6379), REDIS_DB (0)
   - For Mongo: MONGO_URI (mongodb://localhost:27017/bot_db)

2. Install dependencies:
   - pyrogram
   - pyrogram_patch (this project)
   - pykeyboard (this project)
   - For Redis: redis
   - For Mongo: pymongo

3. Run: python showcase_bot.py

Features Demo:
- /start: Main menu with demo options
- FSM Demo: Multi-step profile collection
- Middleware Demo: Logs messages and checks auth
- Router Demo: Shows router organization
- Pykeyboard Demo: Advanced keyboard with pagination
- Storage: Configurable; check /storage_info
"""

import os
import re
import logging
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from contextlib import asynccontextmanager

from pyrogram import Client, filters
from pyrogram.methods.utilities.idle import idle
from pyrogram.types import Message, CallbackQuery
from pyrogram.errors import FloodWait

from pyrogram_patch import patch, PatchManager
from pyrogram_patch.fsm import StatesGroup, State, StateFilter, NoStateFilter
from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm.storages import MemoryStorage, RedisStorage
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.patch_helper import PatchHelper

from pyrogram_patch.middlewares.middleware_types.middlewares import BaseMiddleware
from pyrogram_patch.router import Router

from pykeyboard import InlineKeyboard, InlineButton, ReplyKeyboard, ReplyButton, KeyboardFactory

# Thread-safe note: pyrogram_patch uses thread-safe data management via patch_data_pool,
# ensuring safe concurrent access in high-load scenarios without locks.


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger(__name__)

# Environment variables
API_ID = os.getenv("API_ID")
API_HASH = os.getenv("API_HASH")
BOT_TOKEN = os.getenv("BOT_TOKEN")
STORAGE_TYPE = os.getenv("STORAGE_TYPE", "memory").lower()
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT_str = os.getenv("REDIS_PORT")
REDIS_PORT = int(REDIS_PORT_str) if REDIS_PORT_str else None
REDIS_DB_str = os.getenv("REDIS_DB")
REDIS_DB = int(REDIS_DB_str) if REDIS_DB_str else None
MONGO_URI = os.getenv("MONGO_URI")

required_vars = ["API_ID", "API_HASH", "BOT_TOKEN"]
missing_required = [var for var in required_vars if locals()[var] is None]

if missing_required:
    logger.error(
        f"Missing environment variable(s): {', '.join(missing_required)}\n"
        f"Set using `export VAR_NAME=your_value` in Linux/Mac or `set VAR_NAME=your_value` in Windows, replacing VAR_NAME with the actual variable name, or use a .env file"
    )

if STORAGE_TYPE == "redis":
    missing_redis = [var for var in ["REDIS_PORT", "REDIS_DB"] if locals()[var] is None]
    if missing_redis:
        logger.error(
            f"Missing environment variable(s) for Redis: {', '.join(missing_redis)}\n"
            f"Set using `export VAR_NAME=your_value` in Linux/Mac or `set VAR_NAME=your_value` in Windows, replacing VAR_NAME with the actual variable name, or use a .env file"
        )

if STORAGE_TYPE == "mongo" and MONGO_URI is None:
    logger.error(
        f"Missing environment variable: MONGO_URI\n"
        f"Set using `export MONGO_URI=your_value` in Linux/Mac or `set MONGO_URI=your_value` in Windows, or use a .env file"
    )

# Custom MongoDB Storage (extends BaseStorage for pluggable FSM storage)
class CustomMongoStorage(BaseStorage):
    """
    Custom MongoDB storage implementation extending BaseStorage.

    Demonstrates flexible storage backends. Requires pymongo: pip install pymongo
    Stores state data in MongoDB collection with TTL support.
    """
    def __init__(self, uri: str, db_name: str = "bot_db", collection_name: str = "states"):
        try:
            from pymongo import MongoClient
            from pymongo.errors import ConnectionFailure
        except ImportError:
            raise ImportError("pymongo is required for MongoStorage. Install with: pip install pymongo")

        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]
        try:
            self.client.admin.command('ping')
        except ConnectionFailure:
            raise ConnectionFailure("Failed to connect to MongoDB")

    async def get_state(self, key: str) -> Optional[dict]:
        doc = self.collection.find_one({"key": key})
        if doc and (not doc.get("expires_at") or doc["expires_at"] > datetime.utcnow()):
            return {"name": doc.get("name"), "data": doc.get("data", {})}
        if doc:
            self.collection.delete_one({"key": key})
        return None

    async def set_state(self, key: str, state_data: dict) -> None:
        ttl = state_data.get("ttl", 86400)
        expires_at = datetime.utcnow() + timedelta(seconds=ttl) if ttl else None
        doc = {
            "key": key,
            "name": state_data.get("name"),
            "data": state_data.get("data", {}),
            "ttl": ttl,
            "expires_at": expires_at
        }
        self.collection.replace_one({"key": key}, doc, upsert=True)

    async def delete_state(self, key: str) -> bool:
        result = self.collection.delete_one({"key": key})
        return result.deleted_count > 0

    async def _cleanup(self) -> None:
        """Clean up expired states (optional)."""
        if self.collection.count_documents({}) > 1000:  # Example threshold
            self.collection.delete_many({"expires_at": {"$lt": datetime.utcnow()}})

# Storage setup (pluggable based on env)
def get_storage() -> BaseStorage:
    """
    Factory for pluggable storage.

    - memory: In-memory (default, no deps)
    - redis: Requires redis lib: pip install redis
    - mongo: Custom MongoDB (requires pymongo: pip install pymongo)
    """
    if STORAGE_TYPE == "memory":
        return MemoryStorage()
    elif STORAGE_TYPE == "redis":
        try:
            from pyrogram_patch.fsm.storages.redis_storage import RedisStorage
            return RedisStorage(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, ttl=86400)
        except ImportError:
            raise ImportError("redis is required for RedisStorage. Install with: pip install redis")
    elif STORAGE_TYPE == "mongo":
        return CustomMongoStorage(MONGO_URI)
    else:
        raise ValueError(f"Unsupported STORAGE_TYPE: {STORAGE_TYPE}. Use 'memory', 'redis', or 'mongo'.")

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

# Middleware: Simple logging and basic auth demo (allow all for showcase)
class LoggingMiddleware(BaseMiddleware):
    """
    Demo middleware: Logs messages and simulates auth check.

    Runs before handlers; can modify/update or skip.
    """
    def __init__(self, allowed_users: Optional[List[int]] = None):
        self.allowed_users = allowed_users or []  # For demo, allow all

    async def __call__(self, update: Any, client: Client, patch_helper: PatchHelper) -> None:
        if not hasattr(update, 'from_user'):
            return  # Continue processing

        user_id = update.from_user.id
        text = getattr(update, 'text', 'N/A')
        print(f"Middleware: Logged update from {user_id}: {text}")

        # Basic auth check (demo: always allow)
        if user_id not in self.allowed_users:
            if self.allowed_users:  # If auth enabled
                await update.reply("Access denied! (Demo: auth not enforced)")
                await patch_helper.skip_handler()
                return

        # Continue to handlers (no return needed for before middleware)

# Routers for organization
commands_router = Router()
fsm_router = Router()

# FSM StatesGroup for profile demo
class ProfileStates(StatesGroup):
    """FSM StatesGroup demo: Multi-step profile collection."""
    waiting_name = State()
    waiting_age = State()
    waiting_location = State()

# /start: Welcome menu with pykeyboard
@commands_router.on_message(filters.command("start") & filters.private)
async def start_handler(client: Client, message: Message):
    """
    Start command: Shows main menu with demo buttons using pykeyboard InlineKeyboard.

    Integrates standard Pyrogram filter (filters.private) with router.
    """
    keyboard = InlineKeyboard(row_width=1)
    keyboard.add(
        InlineButton("🎭 FSM Demo", "demo:fsm"),
        InlineButton("🔧 Middleware Demo", "demo:middleware"),
        InlineButton("📁 Router Demo", "demo:router"),
        InlineButton("💾 Storage Info", "info:storage"),
        InlineButton("⌨️ Pykeyboard Demo", "demo:pykeyboard")
    )
    await message.reply_text(
        "Welcome to Pyrogram Patch Showcase Bot!\n\n"
        "Click a button to demo a feature.\n\n"
        "This bot uses:\n"
        "- pyrogram_patch for advanced features\n"
        "- pykeyboard for keyboards\n"
        "- Pluggable storage (current: {})".format(STORAGE_TYPE),
        reply_markup=keyboard
    )

# Callback query handler for menu (on main router for easy integration)
@fsm_router.on_callback_query(filters.regex(r"demo:(.+)") | filters.regex(r"info:(.+)"))
async def menu_callback(client: Client, query: CallbackQuery):
    """
    Handles menu callbacks, dispatching to demos.

    Demonstrates easy integration: Direct app handler with regex filter.
    """

    data = query.data
    logger.info(f"Callback query: {data}")
    if data == "demo:fsm":
        await query.message.edit_text("Starting FSM Demo...\nSend /fsm to begin profile collection.")
    elif data == "demo:middleware":
        await query.message.edit_text("Middleware Demo: Send /middleware_test\nIt will log and check auth.")
    elif data == "demo:router":
        await query.message.edit_text("Router Demo: Send /router_test\nShows organized handler routing.")
    elif data == "info:storage":
        await query.message.edit_text(
            f"Storage Info:\nType: {STORAGE_TYPE}\n"
            "Switch via STORAGE_TYPE env var.\n"
            "For Redis/Mongo, set respective env vars and install deps."
        )
    elif data == "demo:pykeyboard":
        await pykeyboard_demo(client, query.message)
    await query.answer()

# FSM Demo handlers (using fsm_router)
@fsm_router.on_message(filters.command("fsm") & filters.private & NoStateFilter(storage=storage))
async def fsm_start(client: Client, message: Message, state: FSMContext):
    """Starts FSM profile collection."""
    await state.set_state(ProfileStates.waiting_name)
    keyboard = ReplyKeyboard(one_time_keyboard=True, resize_keyboard=True)
    keyboard.add(ReplyButton("Cancel", request_poll=None))  # Simple cancel
    await message.reply_text(
        "FSM Demo: Profile Collection\n\nEnter your name:",
        reply_markup=keyboard
    )

@fsm_router.on_message(StateFilter(ProfileStates.waiting_name, storage=storage) & filters.private & filters.text)
async def fsm_name(client: Client, message: Message, state: FSMContext, patch_helper: PatchHelper):
    """Collects name and advances to age."""
    name = message.text.strip()
    await patch_helper.update_data(Name=name)
    await state.set_state(ProfileStates.waiting_age)
    await message.reply_text("Great! Now enter your age:")

@fsm_router.on_message(StateFilter(ProfileStates.waiting_age, storage=storage) & filters.private & filters.text)
async def fsm_age(client: Client, message: Message, state: FSMContext, patch_helper: PatchHelper):
    """Collects age and advances to location."""
    try:
        age = int(message.text.strip())
        if age < 0 or age > 150:
            raise ValueError
        await patch_helper.update_data(Age=age)

    except ValueError:
        await message.reply_text("Invalid age. Enter a number between 0-150.")
        return

    await state.set_state(ProfileStates.waiting_location)
    await message.reply_text("Finally, enter your location:")

@fsm_router.on_message(StateFilter(ProfileStates.waiting_location, storage=storage) & filters.private & filters.text)
async def fsm_location(client: Client, message: Message, state: FSMContext, patch_helper: PatchHelper):
    """Completes FSM and shows summary."""
    location = message.text.strip()
    await patch_helper.update_data(Location=location)

    data = await patch_helper.data
    summary = (
        f"Profile Complete!\n"
        f"Name: {data.get('Name', 'N/A')}\n"
        f"Age: {data.get('Age', 'N/A')}\n"
        f"Location: {data.get('Location', 'N/A')}"
    )
    await message.reply_text(summary)
    await state.clear_state()  # Reset state

# Middleware Demo
@commands_router.on_message(filters.command("middleware_test") & filters.private)
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
    keyboard.add(InlineButton("🌐 Languages", "show_languages"), InlineButton("Pagination", "show_pagination"))
    await message.edit_text(
        "Pykeyboard Demo:\n\n"
        "Click 'show_languages' for language selector.\n\n"
        "Features: Builders, factories, serialization, validation.",
        reply_markup=keyboard
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
        row_width=2
    )
    await query.message.edit_text(
        "Language Selection Demo:\nSelect a language:",
        reply_markup=keyboard
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
        ]
    )
    await query.message.edit_text(
        "Pagination Demo:\n\n"
        "Click 'show_pagination' for pagination selector.",
        reply_markup=keyboard
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
        ]
    )
    await query.message.edit_text(
        "Page {}".format(query.data.split("_")[1])
    )
    await query.message.edit_reply_markup(keyboard)

@fsm_router.on_callback_query(filters.regex(r"button_(\d+)"))
async def button_callback(client: Client, query: CallbackQuery):
    """Button callback demo."""
    logger.info(f"Callback query: {query.data}")
    await query.answer(f"Button {query.data} clicked!", show_alert=True)


# Storage info command
@commands_router.on_message(filters.command("storage_info") & filters.private)
async def storage_info(client: Client, message: Message):
    """Shows current storage config."""
    info = f"Current Storage: {STORAGE_TYPE}\nSwitch via env and restart."
    if STORAGE_TYPE == "mongo":
        info += "\nCustom MongoStorage in use."
    await message.reply_text(info)

async def main():
    # Handle existing event loop to prevent Pyrogram loop conflicts
    try:
        loop = asyncio.get_running_loop()
        print(f"INFO: Using existing event loop: {loop}")
    except RuntimeError:
        loop = asyncio.get_event_loop()
        print(f"INFO: Using new event loop: {loop}")

    # Ensure Pyrogram uses the correct loop
    app.loop = loop


    patch_manager: PatchManager = await patch(app)
    await patch_manager.set_storage(storage)
    logging_mw = LoggingMiddleware()
    await patch_manager.include_middleware(logging_mw, kind="before")
    patch_manager.include_router(commands_router)
    patch_manager.include_router(fsm_router)
    print("Starting Pyrogram Patch Showcase Bot...")
    print(f"Storage: {STORAGE_TYPE}")

    events = commands_router.get_supported_events()
    logger.info(f"Router supports {len(events)} event types")
    # for event in events:
    #     logger.info(f"Event: {event}")
    try:
        await app.start()
    except FloodWait as e:
        await asyncio.sleep(e.x)
        await app.start()
    except:
        print("TRY AGAIN TOMORROW SON!")
        return

    print("Bot started successfully!")
    try:
        await idle()
    except KeyboardInterrupt:
        print("Stop signal received, stopping bot now.")
        await app.stop()

# Run the bot
if __name__ == "__main__":
    asyncio.run(main())