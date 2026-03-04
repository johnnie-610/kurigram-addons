"""showcase_bot.py — Demonstrates all kurigram-addons v0.4.1 features.

Run:
    BOT_TOKEN=... API_ID=... API_HASH=... python showcase_bot.py
"""

import asyncio
import logging
import os

# ── All imports from the unified namespace ──────────────────────
from kurigram_addons import (
    KurigramClient,
    Router,
    MemoryStorage,
    InlineKeyboard,
    InlineButton,
    ReplyKeyboard,
    ReplyButton,
    Conversation,
    ConversationState,
    ConversationContext,
    Menu,
    Depends,
    RateLimit,
    FloodWaitHandler,
    parse_command,
)
from pyrogram import filters
from pyrogram.types import CallbackQuery, Message

# ── Logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("ShowcaseBot")


# ═══════════════════════════════════════════════════════════════
# 1. ROUTER + CONVENIENCE DECORATORS
# ═══════════════════════════════════════════════════════════════

router = Router()


@router.on_command("start")
async def start_cmd(client, message: Message):
    """Entry point — show main menu."""
    kb = InlineKeyboard(row_width=2)
    kb.button("📝 Registration", callback="demo:registration")
    kb.button("📋 Menu System", callback="menu:main")
    kb.button("⌨️ Keyboards", callback="demo:keyboard")
    kb.button("🔧 Commands", callback="demo:commands")
    kb.button("⚡ Rate Limit", callback="demo:rate_limit")
    kb.button("📄 Pagination", callback="demo:pagination")
    kb.button("💬 Reply KB", callback="demo:reply_kb")

    await message.reply(
        "👋 **kurigram-addons v0.4.1 Showcase**\n\n"
        "Pick a feature to explore:",
        reply_markup=kb,
    )


@router.on_command("ping")
async def ping_cmd(client, message: Message):
    """Simple ping handler."""
    await message.reply("🏓 **Pong!**")


# ═══════════════════════════════════════════════════════════════
# 2. CONVERSATION HANDLER (class-based FSM)
# ═══════════════════════════════════════════════════════════════


class Registration(Conversation):
    """Multi-step registration flow using declarative states."""

    name = ConversationState(initial=True)
    age = ConversationState()
    confirm = ConversationState()

    @name.on_enter
    async def ask_name(self, ctx):
        await ctx.message.reply("📝 **Registration**\n\nWhat is your name?")

    @name.on_message
    async def save_name(self, ctx):
        await ctx.helper.update_data(name=ctx.message.text)
        await self.goto(ctx, self.age)

    @age.on_enter
    async def ask_age(self, ctx):
        await ctx.message.reply("How old are you?")

    @age.on_message
    async def save_age(self, ctx):
        if not ctx.message.text.isdigit():
            await ctx.message.reply("Please enter a number.")
            return
        age = int(ctx.message.text)
        if age < 1 or age > 120:
            await ctx.message.reply("Enter a valid age (1–120).")
            return
        await ctx.helper.update_data(age=age)
        await self.goto(ctx, self.confirm)

    @confirm.on_enter
    async def ask_confirm(self, ctx):
        data = await ctx.helper.data
        await ctx.message.reply(
            f"✅ **Confirm your details:**\n\n"
            f"👤 Name: {data.get('name')}\n"
            f"🎂 Age: {data.get('age')}\n\n"
            f"Type **yes** to confirm or **no** to cancel."
        )

    @confirm.on_message
    async def do_confirm(self, ctx):
        if ctx.message.text.lower() == "yes":
            data = await ctx.helper.data
            await ctx.message.reply(
                f"🎉 **Registration Complete!**\n"
                f"Welcome, {data.get('name')}!"
            )
        else:
            await ctx.message.reply("❌ Registration cancelled.")
        await self.finish(ctx)


@router.on_callback("demo:registration")
async def start_registration(client, query: CallbackQuery):
    """Trigger registration conversation from button."""
    await query.answer("Starting registration...")
    await query.message.reply("Send /register to begin the registration flow.")


@router.on_command("register")
async def register_cmd(client, message: Message, patch_helper):
    """Start the registration conversation via manual trigger."""
    # Conversation handlers are auto-registered via app.include_conversation()
    # but we still need to trigger the initial state transition
    reg = Registration()
    ctx = ConversationContext(
        client=client, message=message, helper=patch_helper
    )
    await reg.start(ctx)


# ═══════════════════════════════════════════════════════════════
# 3. MENU SYSTEM (declarative with auto back-button)
# ═══════════════════════════════════════════════════════════════

main_menu = Menu("main", text="📋 **Main Menu**\n\nChoose a section:")
main_menu.button("👤 Profile", goto="profile")
main_menu.button("⚙️ Settings", goto="settings")
async def alert_stats(c, q): await q.answer("📊 Stats coming soon!", show_alert=True)
main_menu.button("📊 Stats", callback=alert_stats)

profile_menu = Menu("profile", text="👤 **Profile**\n\nManage your profile:", parent=main_menu)
async def alert_edit_name(c, q): await q.answer("✏️ Edit name", show_alert=True)
async def alert_change_photo(c, q): await q.answer("📸 Photo upload", show_alert=True)
profile_menu.button("✏️ Edit Name", callback=alert_edit_name)
profile_menu.button("📸 Change Photo", callback=alert_change_photo)

settings_menu = Menu("settings", text="⚙️ **Settings**\n\nConfigure your preferences:", parent=main_menu)
async def alert_notif(c, q): await q.answer("🔔 Toggle notif", show_alert=True)
async def alert_lang(c, q): await q.answer("🌐 Pick lang", show_alert=True)
settings_menu.button("🔔 Notifications", callback=alert_notif)
settings_menu.button("🌐 Language", callback=alert_lang)


# ═══════════════════════════════════════════════════════════════
# 4. KEYBOARD ↔ ROUTER INTEGRATION
# ═══════════════════════════════════════════════════════════════


@router.on_callback("demo:keyboard")
async def keyboard_demo(client, query: CallbackQuery):
    """Show keyboard with button() shorthand."""
    kb = InlineKeyboard(row_width=2)
    kb.button("🔴 Red", callback="color:red")
    kb.button("🔵 Blue", callback="color:blue")
    kb.button("🟢 Green", callback="color:green")
    kb.button("🟡 Yellow", callback="color:yellow")

    await query.edit_message_text(
        "⌨️ **Keyboard Demo**\n\nPick a color:", reply_markup=kb
    )


@router.on_callback("color:red")
async def red_cb(client, query):
    await query.answer("🔴 You chose Red!", show_alert=True)


@router.on_callback("color:blue")
async def blue_cb(client, query):
    await query.answer("🔵 You chose Blue!", show_alert=True)


@router.on_callback("color:green")
async def green_cb(client, query):
    await query.answer("🟢 You chose Green!", show_alert=True)


@router.on_callback("color:yellow")
async def yellow_cb(client, query):
    await query.answer("🟡 You chose Yellow!", show_alert=True)


# ═══════════════════════════════════════════════════════════════
# 5. COMMAND PARSER (typed arguments)
# ═══════════════════════════════════════════════════════════════


@router.on_callback("demo:commands")
async def commands_demo(client, query: CallbackQuery):
    """Show command parser instructions."""
    await query.edit_message_text(
        "🔧 **Command Parser Demo**\n\n"
        "Try these commands:\n"
        "• `/greet John 25` — typed args\n"
        "• `/ban 12345 spamming` — parse ID + reason\n"
    )


@router.on_command("greet")
async def greet_cmd(client, message: Message):
    """Greet with typed args: /greet <name> <age>"""
    try:
        args = parse_command(message.text, name=str, age=int)
        name = args.get("name", "stranger")
        age = args.get("age", "?")
        await message.reply(f"👋 Hello **{name}**, age **{age}**!")
    except Exception as e:
        await message.reply(f"Usage: `/greet <name> <age>`\nError: {e}")


@router.on_command("ban")
async def ban_cmd(client, message: Message):
    """Ban with typed args: /ban <user_id> <reason>"""
    try:
        args = parse_command(message.text, user_id=int, reason=str)
        uid = args.get("user_id", 0)
        reason = args.get("reason", "No reason")
        await message.reply(f"🔨 Banned user `{uid}`: Reason: `{reason}`")
    except Exception as e:
        await message.reply(f"Usage: `/ban <user_id> <reason>`\nError: {e}")


# ═══════════════════════════════════════════════════════════════
# 6. RATE LIMITER
# ═══════════════════════════════════════════════════════════════


@router.on_callback("demo:rate_limit")
async def rate_limit_demo(client, query: CallbackQuery):
    """Show rate limit instructions."""
    await query.edit_message_text(
        "⚡ **Rate Limiter Demo**\n\n"
        "Try spamming `/limited` — you get 3 calls per 30s."
    )


@router.on_command("limited")
@RateLimit(per_user=3, window=30, message="⏳ Slow down! Try again in {remaining}s.")
async def limited_cmd(client, message: Message):
    """Rate-limited command (3 per 30s per user)."""
    await message.reply("✅ This call went through!")


# ═══════════════════════════════════════════════════════════════
# 7. DEPENDENCY INJECTION
# ═══════════════════════════════════════════════════════════════

async def get_user_info(client, update):
    """Dependency: resolve user info from any update."""
    user = getattr(update, "from_user", None)
    if user:
        return {"id": user.id, "name": user.first_name}
    return {"id": 0, "name": "Unknown"}


@router.on_command("whoami")
async def whoami_cmd(client, message: Message, user=Depends(get_user_info)):
    """Show user info resolved by DI."""
    await message.reply(
        f"🆔 **Your Info**\n"
        f"ID: `{user['id']}`\n"
        f"Name: {user['name']}"
    )


# ═══════════════════════════════════════════════════════════════
# 8. PAGINATION KEYBOARD
# ═══════════════════════════════════════════════════════════════


@router.on_callback("demo:pagination")
async def pagination_demo(client, query: CallbackQuery):
    """Show a paginated keyboard."""
    await _show_page(query, page=1)


from pykeyboard.errors import PaginationUnchangedError

@router.on_callback_query(filters.regex(r"^page_(\d+)$"))
async def _page_handler(client, query: CallbackQuery):
    page = int(query.matches[0].group(1))
    await _show_page(query, page)

async def _show_page(query: CallbackQuery, page: int):
    """Build and show a specific page."""
    total_pages = 10
    kb = InlineKeyboard()
    
    try:
        kb.paginate(total_pages, page, "page_{number}")
    except PaginationUnchangedError:
        # User clicked the page they are already on
        await query.answer("You are already on this page!")
        return

    await query.edit_message_text(
        f"📄 **Pagination Demo**\n\nPage **{page}** of {total_pages}:\n\nHere is the content for page {page}!",
        reply_markup=kb,
    )
    await query.answer()

@router.on_callback("noop")
async def noop_cb(client, query: CallbackQuery):
    """No-op callback for content buttons."""
    await query.answer("Nothing to see here.")


# ═══════════════════════════════════════════════════════════════
# 9. REPLY KEYBOARD
# ═══════════════════════════════════════════════════════════════


@router.on_callback("demo:reply_kb")
async def reply_kb_demo(client, query: CallbackQuery):
    """Show a reply keyboard."""
    kb = ReplyKeyboard(resize_keyboard=True, one_time_keyboard=True)
    kb.add(
        ReplyButton(text="📍 Send Location", request_location=True),
        ReplyButton(text="📞 Share Contact", request_contact=True),
    )
    kb.row(ReplyButton(text="❌ Remove Keyboard"))

    await query.message.reply(
        "💬 **Reply Keyboard Demo**\n\n"
        "Choose an option below (one-time keyboard):",
        reply_markup=kb,
    )
    await query.answer()


# ═══════════════════════════════════════════════════════════════
# MAIN — KurigramClient replaces patch()
# ═══════════════════════════════════════════════════════════════

app = KurigramClient(
    "showcase_bot",
    api_id=int(os.getenv("API_ID", "12345")),
    api_hash=os.getenv("API_HASH", "abcdef"),
    bot_token=os.getenv("BOT_TOKEN", "123:ABC"),
    in_memory=True,
    storage=MemoryStorage(),
    auto_flood_wait=True,
    max_flood_wait=60,
)

# ── Lifecycle hooks ─────────────────────────────────────────────


@app.on_startup
async def on_start():
    """Runs after the client connects to Telegram."""
    logger.info("✅ Bot started! Ready to handle updates.")


@app.on_shutdown
async def on_stop():
    """Runs before the client disconnects."""
    logger.info("👋 Bot stopping. Cleaning up resources...")


# ── Register everything ────────────────────────────────────────
app.include_router(router)
app.include_conversation(Registration)
app.include_menus(main_menu, profile_menu, settings_menu)

if __name__ == "__main__":
    logger.info("Starting showcase bot...")
    app.run()
