import asyncio
import logging
import os
from typing import Union

from pyrogram import Client, filters
from pyrogram.types import CallbackQuery, Message

# Pyrogram Patch Imports
from pyrogram_patch import PatchManager, patch
from pyrogram_patch.fsm import State, StatesGroup, StateFilter
from pyrogram_patch.fsm.storages import MemoryStorage, RedisStorage
from pyrogram_patch.middlewares import MiddlewareManager, PatchHelper
from pyrogram_patch.router import Router
from pyrogram_patch.config import get_config

# PyKeyboard Imports
from pykeyboard import (
    InlineButton,
    InlineKeyboard,
    ReplyButton,
    ReplyKeyboard,
    PaginationError,
    PaginationUnchangedError,
)

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("ShowcaseBot")

# Load Configuration
config = get_config()

# App initialization
app = Client(
    "pyrogram_patch_showcase",
    api_id=int(os.getenv("API_ID", "12345")),
    api_hash=os.getenv("API_HASH", "abcdef"),
    bot_token=os.getenv("BOT_TOKEN", "123:ABC"),
    in_memory=True,
)


# --- Direct Client Handlers (Coexistence Test) ---
@app.on_message(filters.command("ping") & filters.private)
async def ping_handler(client: Client, message: Message):
    """Direct handler that doesn't use the router system."""
    await message.reply_text("🏓 **Pong!** (Direct Handler)")


# --- FSM Definition ---
class DemoStates(StatesGroup):
    """FSM States for the form demo."""
    
    waiting_for_name = State()
    waiting_for_age = State()
    waiting_for_bio = State()
    
    # Define valid transitions (Optional, for State Guards)
    transitions = {
        waiting_for_name: [waiting_for_age],
        waiting_for_age: [waiting_for_bio],
        waiting_for_bio: []  # End state
    }


# --- Keyboards ---
def make_main_menu() -> InlineKeyboard:
    """Create the main menu keyboard."""
    keyboard = InlineKeyboard()
    keyboard.add(
        InlineButton(text="📝 FSM Demo", callback_data="demo:fsm"),
        InlineButton(text="⌨️ Keyboard Demo", callback_data="demo:keyboard"),
    )
    keyboard.add(
        InlineButton(text="🧩 Middleware Test", callback_data="demo:middleware"),
        InlineButton(text="💾 Storage Health", callback_data="demo:storage"),
    )
    keyboard.add(InlineButton(text="🔄 Refresh", callback_data="main_menu"))
    return keyboard


def make_pagination_kb(page: int = 1) -> InlineKeyboard:
    """Create a pagination demo keyboard."""
    keyboard = InlineKeyboard()
    try:
        keyboard.paginate(
            count_pages=10,
            current_page=page,
            callback_pattern="page:{number}",
        )
    except PaginationError as e:
        logger.error(f"Pagination error: {e}")
    
    keyboard.add(InlineButton(text="🔙 Back to Main", callback_data="main_menu"))
    return keyboard


def make_form_kb() -> ReplyKeyboard:
    """Create a reply keyboard for the form."""
    keyboard = ReplyKeyboard(
        resize_keyboard=True,
        one_time_keyboard=True,
        placeholder="Type something...",
    )
    keyboard.add(
        ReplyButton(text="❌ Cancel"),
        ReplyButton(text="skip"),
    )
    return keyboard


# --- Middleware ---
async def simple_logging_middleware(
    update: Union[Message, CallbackQuery], client: Client, patch_helper: PatchHelper
):
    """Example 'before' middleware that logs updates."""
    user_id = update.from_user.id if update.from_user else "Unknown"
    logger.info(f"[Before Middleware] Processing update from user {user_id}")


async def update_counter_middleware(update: Union[Message, CallbackQuery], patch_helper: PatchHelper):
    """Example 'before' middleware that counts updates using patch_helper.data."""
    # Shared data across all middlewares and the main handler
    # Note: patch_helper.data is an async property and must be awaited
    helper_data = await patch_helper.data
    count = helper_data.get("update_count", 0) + 1
    
    # We use update_data for concurrent-safe and FSM-synced updates
    await patch_helper.update_data(update_count=count, is_tracked=True)
    
    logger.info(f"[Before Middleware] Update # {count} received")


async def latency_measurement_middleware(handler, update, client, patch_helper: PatchHelper):
    """Example 'around' middleware that provides a detailed latency breakdown."""
    import time
    from datetime import datetime
    
    # 1. Record start of this middleware
    middleware_start = time.time()
    
    # 2. Extract when the update was sent and received
    helper_data = await patch_helper.data
    received_at = helper_data.get("__received_at__", middleware_start)
    
    sent_at = getattr(update, "date", None)
    if sent_at is None and hasattr(update, "message"):
        sent_at = getattr(update.message, "date", None)
    
    # 3. Calculate breakdown
    delivery_latency = (received_at - sent_at.timestamp()) * 1000 if sent_at else 0
    library_overhead = (middleware_start - received_at) * 1000
    
    # 4. Execute handler
    result = await handler()
    
    # 5. Calculate execution time
    execution_time = (time.time() - middleware_start) * 1000
    
    logger.info(
        f"⏱️ **Latency Breakdown**\n"
        f"  ├ Telegram Delivery: {delivery_latency:.2f}ms\n"
        f"  ├ Library Overhead: {library_overhead:.2f}ms\n"
        f"  └ Handler Execution: {execution_time:.2f}ms (including API calls)"
    )
    
    return result


async def cleanup_logging_middleware(update: Union[Message, CallbackQuery]):
    """Example 'after' middleware that runs after processing is complete."""
    logger.info("[After Middleware] Finished processing current update.")


# --- Routers ---
root_router = Router()
fsm_router = Router()
keyboard_router = Router()

# Include sub-routers (Demonstrating Router Nesting)
root_router.include_router(fsm_router)
root_router.include_router(keyboard_router)


# --- Handlers: Main ---
@root_router.on_message(filters.command("start") & filters.private)
async def start_cmd(client: Client, message: Message, patch_helper: PatchHelper):
    """Start command handler."""
    await message.reply_text(
        "👋 **Welcome to Pyrogram Patch Showcase!**\n\n"
        "This bot demonstrates the features of `pyrogram_patch` and `pykeyboard`.\n"
        "Explore the features using the menu below.",
        reply_markup=make_main_menu(),
    )


@root_router.on_callback_query(filters.regex("^main_menu$"))
async def main_menu_cb(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Return to main menu."""
    from pyrogram.errors import MessageNotModified
    
    try:
        await callback.edit_message_text(
            "👋 **Main Menu**\n\nChoose a demo:",
            reply_markup=make_main_menu()
        )
    except MessageNotModified:
        # Ignore if the menu is already up-to-date
        await callback.answer("Menu is up to date!")
    except Exception as e:
        logger.error(f"Error refreshing menu: {e}")
        await callback.answer("Error refreshing menu.")


# --- Handlers: Storage & Middleware ---
@root_router.on_callback_query(filters.regex("^demo:storage$"))
async def storage_demo_cb(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Check storage health."""
    is_healthy = await patch_helper.storage.health()
    status = "✅ Healthy" if is_healthy else "❌ Unhealthy"
    
    storage_type = type(patch_helper.storage).__name__
    
    await callback.answer(f"Storage: {storage_type}\nStatus: {status}", show_alert=True)


@root_router.on_callback_query(filters.regex("^demo:middleware$"))
async def middleware_demo_cb(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Trigger middleware test."""
    # The middleware log should appear in console
    await callback.answer("Check the console logs for middleware output!", show_alert=True)


# --- Handlers: FSM Demo ---
@fsm_router.on_callback_query(filters.regex("^demo:fsm$"))
async def start_fsm_demo(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Start FSM flow."""
    await patch_helper.set_state(str(DemoStates.waiting_for_name))
    await callback.message.reply_text(
        "📝 **FSM Demo Started**\n\nWhat is your name?",
        reply_markup=make_form_kb()
    )
    await callback.answer()


@fsm_router.on_message(filters.regex("^❌ Cancel$") & filters.private & filters.text)
async def cancel_fsm(client: Client, message: Message, patch_helper: PatchHelper):
    """Cancel FSM flow."""
    current_state = patch_helper.state
    if current_state and current_state != "*":
        await patch_helper.finish()
        await message.reply_text("❌ Operation cancelled.", reply_markup=make_main_menu())
    else:
        await message.reply_text("❌ Operation cancelled.", reply_markup=make_main_menu())

@fsm_router.on_message(filters.regex("^skip$") & filters.private & filters.text)
async def skip_fsm(client: Client, message: Message, patch_helper: PatchHelper):
    """Skip FSM flow."""
    await patch_helper.finish()
    await message.reply_text("❌ Operation skipped.", reply_markup=make_main_menu())


@fsm_router.on_message(StateFilter(DemoStates.waiting_for_name) & filters.private & filters.text)
async def name_step(client: Client, message: Message, patch_helper: PatchHelper):
    """Handle name input."""
    name = message.text
    
    # Update data with kwargs
    await patch_helper.update_data(name=name)
    
    await patch_helper.set_state(str(DemoStates.waiting_for_age))
    await message.reply_text(f"Nice to meet you, {name}!\n\nNow, how old are you?")


@fsm_router.on_message(StateFilter(DemoStates.waiting_for_age) & filters.private & filters.text)
async def age_step(client: Client, message: Message, patch_helper: PatchHelper):
    """Handle age input."""
    if not message.text.isdigit():
        await message.reply_text("Please enter a valid number.")
        return
    elif message.text.isdigit() and (int(message.text) < 0 or int(message.text) > 120):
        await message.reply_text("Please enter a valid age.")
        return

    age = int(message.text)
    # Use update_data kwarg syntax
    await patch_helper.update_data(age=age)
    
    await patch_helper.set_state(str(DemoStates.waiting_for_bio))
    await message.reply_text("Great! Finally, tell me a bit about yourself.")


@fsm_router.on_message(StateFilter(DemoStates.waiting_for_bio) & filters.private & filters.text)
async def bio_step(client: Client, message: Message, patch_helper: PatchHelper):
    """Handle bio input and finish."""
    bio = message.text
    data = await patch_helper.data
    
    summary = (
        "📋 **Form Summary**\n\n"
        f"👤 Name: {data.get('name')}\n"
        f"🎂 Age: {data.get('age')}\n"
        f"📝 Bio: {bio}"
    )
    
    await patch_helper.finish()
    await message.reply_text(summary, reply_markup=make_main_menu())


# --- Handlers: Keyboard Demo ---
@keyboard_router.on_callback_query(filters.regex("^demo:keyboard$"))
async def keyboard_demo_cb(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Start keyboard demo."""
    await callback.edit_message_text(
        "⌨️ **Keyboard Demo**\n\nCheck out the pagination below:",
        reply_markup=make_pagination_kb(1)
    )


@keyboard_router.on_callback_query(filters.regex(r"^page:(\d+)$"))
async def pagination_handler(client: Client, callback: CallbackQuery, patch_helper: PatchHelper):
    """Handle pagination."""
    page = int(callback.matches[0].group(1))
    
    try:
        await callback.edit_message_reply_markup(
            reply_markup=make_pagination_kb(page)
        )
    except PaginationUnchangedError:
        # Ignore if user clicks the same page
        await callback.answer("You are already on this page.")
    except Exception as e:
        logger.error(f"Pagination error: {e}")
        await callback.answer("Error navigating pages.")


# --- Main Application ---
async def main():
    """Main entry point."""
    
    # Debug: Force logging to stdout
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    logging.getLogger("pyrogram_patch").addHandler(console_handler)
    logging.getLogger("ShowcaseBot").addHandler(console_handler)

    # 1. Patch the Client
    logger.info("Patching Pyrogram Client...")
    patch_manager = await patch(app)
    
    # 2. Setup Storage
    # Use Redis if configured, otherwise Memory
    if config.storage.redis_url:
        storage = RedisStorage(config.storage.redis_url)
        logger.info(f"Using Redis Storage: {config.storage.redis_url}")
    else:
        storage = MemoryStorage()
        logger.info("Using Memory Storage")
    
    await patch_manager.set_storage(storage)
    
    # 3. Setup Middleware
    logger.info("Registering Middleware...")
    
    # Register 'before' middlewares
    await patch_manager.include_middleware(simple_logging_middleware, kind="before", priority=10)
    await patch_manager.include_middleware(update_counter_middleware, kind="before", priority=5)
    
    # Register 'around' middleware (wraps the handler)
    await patch_manager.include_middleware(latency_measurement_middleware, kind="around")
    
    # Register 'after' middleware
    await patch_manager.include_middleware(cleanup_logging_middleware, kind="after")
    
    # 4. Register Routers
    logger.info("Registering Routers...")
    patch_manager.include_router(root_router)
    
    # 5. Start App
    logger.info("Starting Bot...")
    try:
        await app.start()
        print("Bot started successfully! Send /start to start the bot.")
        
        # Keep running
        from pyrogram import idle
        await idle()
    except Exception as e:
        logger.error(f"Failed to start bot: {e}")
    finally:
        logger.info("Stopping Bot...")
        try:
            await app.stop()
        except ConnectionError:
            pass # Already stopped

if __name__ == "__main__":
    try:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        pass
