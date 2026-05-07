"""showcase_bot.py — kurigram-addons v0.5.0 feature showcase.

Demonstrates every improvement and new feature introduced in v0.5.0:
  - Bug fixes (get_data, reset_global_pool, storage heap, ...)
  - Concurrency & security (CAS, per-instance circuit breakers, ...)
  - DX (MiddlewareContext, State.filter(), PoolStatistics, ...)
  - New features (CallbackData, SQLiteStorage, DI, broadcast, i18n, ...)

Run:
    BOT_TOKEN=... API_ID=... API_HASH=... python showcase_bot.py

Optional env vars:
    HEALTH_PORT=8080       — expose GET /health endpoint (container probes)
    DB_PATH=fsm.db         — SQLite path (default: in-memory MemoryStorage)
    ADMIN_IDS=111,222      — comma-separated admin user IDs
    LOCALE_PATH=locales    — directory containing {lang}.json translation files
"""


from __future__ import annotations

import logging
import os
import random

from pyrogram import filters
from pyrogram.types import CallbackQuery, Message
from pyrogram.enums import ButtonStyle

# Unified namespace — every public symbol lives here 
from kurigram_addons import (
    # Client
    KurigramClient,
    # Router
    Router,
    # FSM storage
    MemoryStorage,
    # Conversations
    Conversation,
    ConversationContext,
    ConversationState,
    # Menus
    Menu,
    # Keyboards
    InlineKeyboard,
    ReplyButton,
    ReplyKeyboard,
    # Rate limiting
    RateLimit,
    # Command parsing
    CommandParseError,
    parse_command,
    # FloodWait
    FloodWaitHandler,
    # New in v0.5.0
    broadcast,        
    DIContainer,      
    Depends,          
    I18nMiddleware,   
    use_middleware,   
)

# v0.5.0 additions not yet promoted to the top-level namespace
try:
    from pykeyboard.callback_data import CallbackData
except ImportError:
    class CallbackData:
        """Mock CallbackData class for when pykeyboard is not installed."""
        def __init__(self, *args, **kwargs):
            pass
        def button(self, label, style):
            return label

from pyrogram_patch.middlewares.middleware_manager import MiddlewareContext
from pyrogram_patch.middlewares.rate_limit import RateLimitMiddleware
from pyrogram_patch.fsm.states import State, StatesGroup

# SQLite — persistent FSM, zero infrastructure
try:
    from pyrogram_patch.di import DIContainer, Depends
    from pyrogram_patch.fsm.storages.sqlite_storage import SQLiteStorage
    _SQLITE_AVAILABLE = True
except ImportError:
    _SQLITE_AVAILABLE = False


# Logging 
# Libraries (including kurigram-addons) now correctly use NullHandler.
# The application owns the root logger configuration.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("showcase")

# Setup random generator
rg = random.Random()

# Environment 
API_ID      = int(os.getenv("API_ID",     "12345"))
API_HASH    = os.getenv("API_HASH",       "abcdef")
BOT_TOKEN   = os.getenv("BOT_TOKEN",      "123:ABC")
HEALTH_PORT = int(os.getenv("HEALTH_PORT", "0"))
DB_PATH     = os.getenv("DB_PATH",        ":memory:")
ADMIN_IDS   = {
    int(x) for x in os.getenv("ADMIN_IDS", "").split(",") if x.strip().isdigit()
}
LOCALE_PATH = os.getenv("LOCALE_PATH", "locales")


# 1. CALLBACKDATA — strongly-typed callback data
#
# Every button payload is a typed, validated object.
# Typos and pattern changes are caught at pack() time, not silently at runtime.

class DemoNav(CallbackData, prefix="nav"):
    """Top-level navigation button payload."""
    section: str


class ColorPick(CallbackData, prefix="clr"):
    """Color picker button payload."""
    color: str


class PageNav(CallbackData, prefix="pg"):
    """Paginator button payload."""
    page: int
    total: int


class AdminAction(CallbackData, prefix="adm"):
    """Admin action on a specific user."""
    action: str     # "warn" | "ban" | "unban"
    target_id: int


# 2. FSM STATES — StatesGroup with .filter() shorthand

class RegistrationStates(StatesGroup):
    name    = State()
    age     = State()
    confirm = State()

# Usage example (shown for reference — actual filtering done inside Conversation):
#   @router.on_message(RegistrationStates.name.filter())
#   async def handler(client, message, patch_helper): ...
#
# Replaces the stringly-typed:
#   @router.on_message(StateFilter("RegistrationStates:name"))


# 3. DEPENDENCY INJECTION
#
# Register providers once. Handlers declare what they need by type annotation;
# the DIContainer resolves and injects automatically — zero per-handler boilerplate.

di = DIContainer()


class BotConfig:
    """Injected bot-wide configuration."""
    def __init__(self) -> None:
        self.admin_ids: set[int] = ADMIN_IDS
        self.version: str = "0.5.0"


async def get_config() -> BotConfig:
    return BotConfig()


di.register(BotConfig, get_config)


# 4. MIDDLEWARES

# 4a. Logging middleware — new MiddlewareContext calling convention 
#
# Instead of positional parameter-name sniffing the dispatcher now detects the
# MiddlewareContext annotation and passes a single structured context object.
# Old signatures (update, client, patch_helper) still work unchanged.

async def logging_middleware(ctx: MiddlewareContext) -> None:
    """Log every incoming update — demonstrates the MiddlewareContext API."""
    user = getattr(ctx.update, "from_user", None)
    if user:
        logger.info("update  user=%-12s  id=%s", user.first_name, user.id)


# 4b. Admin guard — per-handler middleware 
#
# Attached with @use_middleware(require_admin) on specific handlers only.
# Never runs globally — exactly the right scope.

async def require_admin(update: object, client: object, patch_helper: object) -> None:
    """Reject non-admin users at the handler level (legacy positional signature)."""
    user = getattr(update, "from_user", None)
    if user and ADMIN_IDS and user.id not in ADMIN_IDS:
        reply = getattr(update, "reply", None) or getattr(
            getattr(update, "message", None), "reply", None
        )
        if reply:
            await reply("⛔ This command is restricted to admins.")
        from pyrogram import StopPropagation
        raise StopPropagation


# 4c. i18n middleware 
#
# Detects user language from Telegram profile; injects a _() callable into the
# helper data under the key "_" and the detected code under "__lang__".

i18n = I18nMiddleware(
    default_lang="en",
    locales_path=LOCALE_PATH,
    use_json=True,   # looks for locales/en.json, locales/ru.json, etc.
)


# 4d. Global rate limit middleware 
#
# Limits ALL updates (not just /rl_mid) to 5 per 60s per user when using FSM
# storage.  Contrast with the @RateLimit decorator which is per-handler only.

_global_rl = RateLimitMiddleware(rate=5, period=60, scope="user", block=True)


# 5. ROUTER

router = Router()

# Toy registry so the broadcast demo has targets
_known_users: set[int] = set()


# /start 

@router.on_command("start")
async def start_cmd(client, message: Message) -> None:
    """Entry point — build the main menu from typed CallbackData instances."""
    # Registers the user for the broadcast demo
    if message.from_user:
        _known_users.add(message.from_user.id)

    kb = InlineKeyboard(row_width=2)
    sections = [
        ("📝 Registration",  "registration"),
        ("📋 Menu system",   "menu"),
        ("⌨️ Keyboards",     "keyboard"),
        ("🔧 Commands",      "commands"),
        ("⚡ Rate limit",    "ratelimit"),
        ("📄 Pagination",    "pagination"),
        ("📣 Broadcast",     "broadcast"),
        ("🕰 FSM history",   "history"),
        ("📊 Pool stats",    "stats"),
        ("👤 Who am I?",     "whoami"),
    ]
    
    # Collect all buttons first, then add them in one call
    buttons = []
    for label, section in sections:
        # DemoNav.button() wraps InlineKeyboardButton — no raw strings
        # Randomly select a style for the button
        rn = random.randint(0, 3)
        buttons.append(DemoNav(section=section).button(
            label,
            style=ButtonStyle.DEFAULT if rn == 0 else ButtonStyle.PRIMARY if rn == 1 else ButtonStyle.SUCCESS if rn == 2 else ButtonStyle.DANGER
        ))
    
    # Add all buttons at once to ensure proper row_width=2 layout
    kb.add(*buttons)

    await message.reply(
        "👋 **kurigram-addons v0.5.0 Showcase**\n\n"
        "Pick a feature to explore:",
        reply_markup=kb,
    )


@router.on_command("ping")
async def ping_cmd(client, message: Message) -> None:
    await message.reply("🏓 **Pong!**")


@router.on_command("help")
async def help_cmd(client, message: Message) -> None:
    await message.reply(
        "📖 **Commands**\n\n"
        "/start   — main menu\n"
        "/help    — this list\n"
        "/ping    — latency check\n\n"
        "**FSM / Conversation**\n"
        "/register — multi-step registration (5-min timeout)\n"
        "/history  — recent FSM state transitions\n\n"
        "**Menus & keyboards**\n"
        "/menu    — declarative menu with back-navigation\n"
        "/replykb — one-time reply keyboard\n\n"
        "**Commands & guards**\n"
        "/greet   — typed command args demo\n"
        "/ban     — admin-only (@use_middleware guard)\n"
        "/limited — decorator rate limit (3 / 30s)\n"
        "/rl_mid  — global middleware rate limit\n\n"
        "**Broadcast**\n"
        "/bcast   — send to all known users (admin only)\n\n"
        "**Info**\n"
        "/whoami  — injected BotConfig via DI container\n"
        "/hello   — i18n greeting in your language\n"
        "/stats   — live PoolStatistics\n"
    )


# on_callback_data — capture group injection 
#
# A single handler covers ALL nav: callbacks.  The `section` kwarg is extracted
# from the named capture group and injected by the dispatcher automatically.

@router.on_callback_data(r"nav:(?P<section>\w+)")
async def nav_handler(client, query: CallbackQuery, section: str) -> None:
    """Unified navigation — `section` injected from regex capture group."""
    dispatch = {
        "registration": _section_registration,
        "menu":         _section_menu,
        "keyboard":     _section_keyboard,
        "commands":     _section_commands,
        "ratelimit":    _section_ratelimit,
        "pagination":   _section_pagination,
        "broadcast":    _section_broadcast,
        "history":      _section_history,
        "stats":        _section_stats,
        "whoami":       _section_whoami,
    }
    fn = dispatch.get(section)
    if fn:
        await fn(client, query)
    else:
        await query.answer("Unknown section.", show_alert=True)


# 6. CONVERSATION with timeout, get_data(), and ConversationState.filter()

class Registration(Conversation):
    """Multi-step registration demonstrating v0.5.0 conversation features.

    New in this version:
    - `timeout = 300`: state key auto-expires on inactivity.
      The FSM storage TTL is refreshed on every goto() call.
    - `await ctx.get_data()`: correctly awaited lazy fetch.
      The old `await ctx.helper.data` was a broken async property that
      returned a raw coroutine object — it is now removed entirely.
    - `ConversationState.filter()`: used by register_handlers() internally,
      replacing stringly-typed StateFilter("Registration:name").
    """

    timeout = 300   # seconds — auto-finish if user goes quiet for 5 min

    name    = ConversationState(initial=True)
    age     = ConversationState()
    confirm = ConversationState()

    @name.on_enter
    async def ask_name(self, ctx: ConversationContext) -> None:
        await ctx.message.reply(
            "📝 **Registration** _(times out after 5 min of inactivity)_\n\n"
            "What is your name?"
        )

    @name.on_message
    async def save_name(self, ctx: ConversationContext) -> None:
        if ctx.message.text is None:
            await ctx.message.reply("Please send a text message with your name.")
            return
        await ctx.helper.update_data(name=ctx.message.text.strip())
        # push_history is called automatically by set_state() inside goto()
        await self.goto(ctx, self.age)

    @age.on_enter
    async def ask_age(self, ctx: ConversationContext) -> None:
        await ctx.message.reply("How old are you?")

    @age.on_message
    async def save_age(self, ctx: ConversationContext) -> None:
        if ctx.message.text is None:
            await ctx.message.reply("Please send a text message with your age.")
            return
        text = ctx.message.text.strip()
        if not text.isdigit() or not (1 <= int(text) <= 120):
            await ctx.message.reply("Please enter a valid age (1–120).")
            return
        await ctx.helper.update_data(age=int(text))
        await self.goto(ctx, self.confirm)

    @confirm.on_enter
    async def ask_confirm(self, ctx: ConversationContext) -> None:
        # await ctx.get_data() — lazy, cached, properly awaited.
        # The old ctx.helper.data was an async property that silently returned
        # a coroutine object instead of the dict; it is gone in v0.5.0.
        data = await ctx.get_data()
        await ctx.message.reply(
            "✅ **Confirm your details:**\n\n"
            f"👤 Name: {data.get('name')}\n"
            f"🎂 Age:  {data.get('age')}\n\n"
            "Type **yes** to confirm or **no** to cancel."
        )

    @confirm.on_message
    async def do_confirm(self, ctx: ConversationContext) -> None:
        if ctx.message.text is None or ctx.message.text.strip().lower() != "yes":
            await ctx.message.reply("Please reply with 'yes' to confirm or send /cancel to restart.")
            return
        
        data = await ctx.get_data()
        await ctx.message.reply(
            f"🎉 **Registration complete!**\n"
            f"Welcome aboard, {data.get('name')}! 🎊"
        )
        await self.finish(ctx)


async def _section_registration(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "📝 **Conversation Demo**\n\n"
        "Send /register to start the multi-step registration flow.\n\n"
        "**v0.5.0 features shown:**\n"
        "• `timeout = 300` — inactivity auto-finish\n"
        "• `await ctx.get_data()` — fixed lazy data fetch\n"
        "• `.filter()` on ConversationState — no more stringly-typed filters"
    )
    await query.answer()


@router.on_command("register")
async def register_cmd(client, message: Message, patch_helper) -> None:
    """Start the Registration conversation."""
    ctx = ConversationContext(client=client, message=message, helper=patch_helper)
    await Registration().start(ctx)


# 7. MENU SYSTEM (declarative with auto back-button)

main_menu     = Menu("main",     text="📋 **Main Menu**\n\nChoose a section:")
profile_menu  = Menu("profile",  text="👤 **Profile**",  parent=main_menu)
settings_menu = Menu("settings", text="⚙️ **Settings**", parent=main_menu)

main_menu.button("👤 Profile",  goto="profile")
main_menu.button("⚙️ Settings", goto="settings")

async def _stats_alert(c, q):       await q.answer("📊 Coming soon!", show_alert=True)
async def _edit_name_alert(c, q):   await q.answer("✏️ Edit name — coming soon", show_alert=True)
async def _photo_alert(c, q):       await q.answer("📸 Photo — coming soon", show_alert=True)
async def _notif_alert(c, q):       await q.answer("🔔 Notifications toggled", show_alert=True)
async def _lang_alert(c, q):        await q.answer("🌐 Language selection — coming soon", show_alert=True)

main_menu.button("📊 Stats",          callback=_stats_alert)
profile_menu.button("✏️ Edit Name",   callback=_edit_name_alert)
profile_menu.button("📸 Change Photo",callback=_photo_alert)
settings_menu.button("🔔 Notifications", callback=_notif_alert)
settings_menu.button("🌐 Language",      callback=_lang_alert)


async def _section_menu(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "📋 **Menu System**\n\n"
        "Send /menu to open the full declarative menu\n"
        "with automatic back-navigation."
    )
    await query.answer()


@router.on_command("menu")
async def menu_cmd(client, message: Message) -> None:
    kb = main_menu.build_keyboard()
    await message.reply(main_menu.text, reply_markup=kb)


# 8. CALLBACKDATA KEYBOARD + on_callback_data

async def _section_keyboard(client, query: CallbackQuery) -> None:
    """Build keyboard using CallbackData.button() — zero raw strings."""
    colors = [
        ("🔴 Red",    "red"),
        ("🔵 Blue",   "blue"),
        ("🟢 Green",  "green"),
        ("🟡 Yellow", "yellow"),
    ]
    kb = InlineKeyboard(row_width=2)
    for label, color in colors:
        # .button() creates an InlineKeyboardButton with a packed payload
        kb.add(ColorPick(color=color).button(label))

    await query.edit_message_text(
        "⌨️ **Keyboard Demo**\n\n"
        "Each button payload is a `ColorPick` instance packed as `clr:<color>`.\n"
        "The `on_callback_data` handler below unpacks it and injects `color`.\n\n"
        "Pick a color:",
        reply_markup=kb,
    )
    await query.answer()


# named capture group `color` is injected as a handler kwarg
@router.on_callback_data(r"clr:(?P<color>\w+)")
async def color_picked(client, query: CallbackQuery, color: str) -> None:
    """Color selection — `color` injected from regex capture group."""
    emoji = {"red": "🔴", "blue": "🔵", "green": "🟢", "yellow": "🟡"}.get(color, "🎨")
    await query.answer(f"{emoji} You chose {color.capitalize()}!", show_alert=True)


# 9. COMMAND PARSER + per-handler middleware

async def _section_commands(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "🔧 **Command Parser Demo**\n\n"
        "• `/greet Alice 30` — typed name + age\n"
        "• `/ban 12345 spamming` — admin-only (@use_middleware guard)"
    )
    await query.answer()


@router.on_command("greet")
async def greet_cmd(client, message: Message) -> None:
    """Typed command args: /greet <n> <age>"""
    try:
        args = parse_command(message.text, name=str, age=int)
        await message.reply(f"👋 Hello **{args['name']}**, age **{args['age']}**!")
    except CommandParseError as e:
        await message.reply(f"Usage: `/greet <name> <age>`\n`{e}`")


@router.on_command("ban")
@use_middleware(require_admin)   # admin check scoped to this handler only
async def ban_cmd(client, message: Message) -> None:
    """Admin-only ban: /ban <user_id> <reason>  (guarded by @use_middleware)"""
    try:
        args = parse_command(message.text, user_id=int, reason=str)
        await message.reply(
            f"🔨 Banned `{args['user_id']}` — reason: `{args['reason']}`"
        )
    except CommandParseError as e:
        await message.reply(f"Usage: `/ban <user_id> <reason>`\n`{e}`")


# 10. RATE LIMITING — decorator AND middleware (both patterns shown)

async def _section_ratelimit(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "⚡ **Rate Limit Demo**\n\n"
        "**Decorator pattern** (per-handler):\n"
        "/limited — 3 calls per 30s per user\n\n"
        "**Middleware pattern** (global, uses FSM storage + increment()):\n"
        "/rl_mid — 5 calls per 60s per user via `RateLimitMiddleware`\n\n"
        "The middleware implementation was completely rewritten in v0.5.0:\n"
        "old CAS loop replaced by a single atomic `storage.increment()` call."
    )
    await query.answer()


@router.on_command("limited")
@RateLimit(per_user=3, window=30, message="⏳ Slow down! Retry in {remaining}s.")
async def limited_cmd(client, message: Message) -> None:
    """Decorator-based rate limit: 3 calls per 30 seconds per user."""
    await message.reply("✅ This call went through! (decorator rate limit)")


@router.on_command("rl_mid")
async def rl_mid_cmd(client, message: Message) -> None:
    """Protected by the global RateLimitMiddleware registered on startup."""
    await message.reply("✅ This call went through! (middleware rate limit)")


# 11. PAGINATION  (positional capture group)

async def _section_pagination(client, query: CallbackQuery) -> None:
    await _render_page(query, page=1)


# positional capture group — injected as group_1 (page number)
@router.on_callback_data(r"pg:(\d+):\d+")
async def page_handler(client, query: CallbackQuery, group_1: str) -> None:
    """Page navigation — page number in group_1 (positional capture)."""
    await _render_page(query, page=int(group_1))


async def _render_page(query: CallbackQuery, page: int) -> None:
    total = 8
    from pykeyboard.errors import PaginationUnchangedError
    kb = InlineKeyboard()
    try:
        kb.paginate(total, page, f"pg:{{number}}:{total}")
    except PaginationUnchangedError:
        await query.answer("Already on this page!")
        return
    await query.edit_message_text(
        f"📄 **Pagination** — page {page} of {total}\n\n"
        f"Content for page {page} goes here.",
        reply_markup=kb,
    )
    await query.answer()


# 12. BROADCAST — async-generator bulk sender with FloodWait handling

async def _section_broadcast(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "📣 **Broadcast Demo**\n\n"
        "Use `/bcast Hello everyone!` to send to all known users.\n\n"
        "**Features:**\n"
        "• Async generator — yields `BroadcastResult` per user in real time\n"
        "• Auto-absorbs `FloodWait` up to 60s\n"
        "• Silently skips blocked / deactivated accounts\n"
        "• Configurable inter-send delay (default 50ms)\n"
        "• `on_error='skip'` or `'stop'` strategy"
    )
    await query.answer()


@router.on_command("bcast")
@use_middleware(require_admin)   # admin guard scoped to this handler
async def bcast_cmd(client, message: Message) -> None:
    """Broadcast a message to all known users: /bcast <text>"""
    parts = message.text.split(None, 1)
    if len(parts) < 2 or not parts[1].strip():
        await message.reply("Usage: `/bcast <message text>`")
        return

    text = parts[1].strip()
    if not _known_users:
        await message.reply(
            "No known users yet — users are registered when they send /start."
        )
        return

    status = await message.reply(f"📣 Broadcasting to {len(_known_users)} users…")
    ok = fail = skip = 0

    # iterate the async generator to drive sends and collect results
    async for result in broadcast(
        client,
        list(_known_users),
        text,
        delay=0.05,          # 50ms between sends — stays under Telegram's 30 msg/s
        max_flood_wait=60,   # absorb FloodWait up to 60s, surface larger ones
        on_error="skip",     # continue after non-FloodWait errors
    ):
        if result.ok:
            ok += 1
        elif result.skipped:
            skip += 1
        else:
            fail += 1

    await status.edit_text(
        f"📣 **Broadcast complete**\n\n"
        f"✅ Sent:    {ok}\n"
        f"⏭ Skipped: {skip}\n"
        f"❌ Failed:  {fail}"
    )


# 13. FSM STATE HISTORY 

async def _section_history(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "🕰 **FSM History Demo**\n\n"
        "After running /register, use /history to see your state transition log.\n\n"
        "• Stored under a separate key — never interferes with FSM state\n"
        "• Ring-buffer of up to 50 entries\n"
        "• Each entry: state name + Unix timestamp\n"
        "• Cleared automatically when `finish()` is called"
    )
    await query.answer()


@router.on_command("history")
async def history_cmd(client, message: Message, patch_helper) -> None:
    """Show the 10 most recent FSM state transitions for this user."""
    if patch_helper._fsm_ctx is None:
        await message.reply("No FSM context yet. Try /register first.")
        return

    entries = await patch_helper._fsm_ctx.get_history(limit=10)
    if not entries:
        await message.reply("No state history yet. Try /register first.")
        return

    import time
    lines = [
        f"`{e['state']}`  —  {int(time.time() - e['at'])}s ago"
        for e in reversed(entries)
    ]
    await message.reply(
        "🕰 **Recent state transitions** (newest first):\n\n" + "\n".join(lines)
    )


# 14. POOL STATISTICS — PoolStatistics typed dataclass

async def _section_stats(client, query: CallbackQuery) -> None:
    # `app` is defined below but this runs at call time, not definition time
    s = await app.stats()
    # s is a frozen PoolStatistics dataclass — IDE-autocompleted fields,
    # not a raw dict. `s.active_helpers` not `s["active_helpers"]`.
    await query.edit_message_text(
        "📊 **Live Pool Statistics** _(PoolStatistics dataclass)_\n\n"
        f"Active helpers:         `{s.active_helpers}`\n"
        f"Total helpers created:  `{s.total_helpers_created}`\n"
        f"Expired helpers:        `{s.expired_helpers}`\n"
        f"Oldest helper age:      `{s.oldest_helper_age:.1f}s`\n"
        f"Session TTL:            `{s.session_ttl}s`\n"
        f"Persist helpers:        `{s.persist_helpers}`\n"
        f"Uptime:                 `{s.uptime:.0f}s`"
    )
    await query.answer()


@router.on_command("stats")
async def stats_cmd(client, message: Message) -> None:
    """Live pool statistics — same data as the inline button."""
    s = await app.stats()
    await message.reply(
        "📊 **Pool Statistics**\n\n"
        f"Active helpers:         `{s.active_helpers}`\n"
        f"Total helpers created:  `{s.total_helpers_created}`\n"
        f"Expired helpers:        `{s.expired_helpers}`\n"
        f"Oldest helper age:      `{s.oldest_helper_age:.1f}s`\n"
        f"Uptime:                 `{s.uptime:.0f}s`"
    )


# 15. DEPENDENCY INJECTION 

async def _section_whoami(client, query: CallbackQuery) -> None:
    await query.edit_message_text(
        "👤 **Dependency Injection Demo**\n\n"
        "Send /whoami — `BotConfig` is resolved by the DIContainer and\n"
        "injected into the handler by type annotation. No boilerplate."
    )
    await query.answer()


@router.on_command("whoami")
async def whoami_cmd(client, message: Message, cfg=Depends(get_config)) -> None:
    """BotConfig injected automatically by the DIContainer.

    The dispatcher detects `cfg: BotConfig`, looks up the registered
    provider (`get_config`), calls it, and passes the result as a kwarg.
    """
    user = message.from_user
    is_admin = user.id in cfg.admin_ids if user else False
    await message.reply(
        "🆔 **Your Info** _(BotConfig injected via DI)_\n\n"
        f"User ID:     `{user.id if user else '—'}`\n"
        f"Name:        {user.first_name if user else '—'}\n"
        f"Admin:       {'✅ yes' if is_admin else '❌ no'}\n\n"
        f"Bot version: `{cfg.version}`"
    )


# 16. I18N — language detection + _() injection 

@router.on_command("hello")
async def hello_cmd(client, message: Message, patch_helper) -> None:
    """Greet in the user's detected language .

    `I18nMiddleware` (registered on startup) injects two keys into the helper:
    - `"_"` : a translation callable, e.g. `_("greeting")` → "Hello!"
    - `"__lang__"` : the detected language code, e.g. "en", "ru"

    If locale files exist in `LOCALE_PATH/{lang}.json`, the translated string
    is returned. Otherwise the key itself is returned (identity fallback).
    """
    _ = await patch_helper.get("_") or (lambda k: k)
    lang = await patch_helper.get("__lang__") or "en"
    await message.reply(
        f"{_('greeting')}  _(lang={lang})_\n\n"
        "_Tip: create `locales/en.json` with `{\"greeting\": \"Hello!\"}` to test i18n._"
    )


# 17. REPLY KEYBOARD

@router.on_command("replykb")
async def reply_kb_cmd(client, message: Message) -> None:
    """One-time reply keyboard requesting location and contact."""
    kb = ReplyKeyboard(resize_keyboard=True, one_time_keyboard=True)
    kb.add(
        ReplyButton(text="📍 Share Location", request_location=True),
        ReplyButton(text="📞 Share Contact",  request_contact=True),
    )
    kb.row(ReplyButton(text="❌ Dismiss"))
    await message.reply(
        "💬 **Reply Keyboard**\n\nChoose an option:",
        reply_markup=kb,
    )


# 18. CLIENT SETUP

# SQLiteStorage — persistent FSM with zero infrastructure
# Falls back to MemoryStorage when aiosqlite is not installed.
if _SQLITE_AVAILABLE and DB_PATH != ":memory:":
    storage = SQLiteStorage(DB_PATH)
    logger.info("FSM: SQLiteStorage at '%s'", DB_PATH)
else:
    storage = MemoryStorage()
    logger.info("FSM: MemoryStorage (in-process, non-persistent)")

app = KurigramClient(
    "showcase_bot",
    api_id=API_ID,
    api_hash=API_HASH,
    bot_token=BOT_TOKEN,
    in_memory=True,
    # storage is auto-started (await storage.start()) and
    # auto-stopped (await storage.stop()) by KurigramClient — no manual calls needed.
    storage=storage,
    auto_flood_wait=True,
    max_flood_wait=60,
    # optional HTTP health endpoint for container orchestration.
    # GET /health returns pool stats and storage health as JSON.
    # Useful for Kubernetes liveness probes and Docker HEALTHCHECK.
    health_port=HEALTH_PORT,
    health_host="0.0.0.0",
)


# 19. LIFECYCLE HOOKS

@app.on_startup
async def on_start() -> None:
    logger.info("Bot started — kurigram-addons v0.5.0")
    if HEALTH_PORT:
        logger.info("Health endpoint: http://0.0.0.0:%d/health", HEALTH_PORT)
    if ADMIN_IDS:
        logger.info("Admin IDs: %s", sorted(ADMIN_IDS))


@app.on_startup
async def register_middlewares() -> None:
    """Register global middlewares after the pool is ready."""
    pool = app._pool

    # logging_middleware uses the new MiddlewareContext single-arg API
    await pool.add_middleware(logging_middleware, kind="before", priority=50)

    # i18n — detects user language, injects _() callable into helper
    await pool.add_middleware(i18n, kind="before", priority=40)

    # Rewritten rate limit middleware — uses storage.increment()
    # Limits every update to 5 per 60s per user when FSM storage is configured
    await pool.add_middleware(_global_rl, kind="before", priority=10)

    logger.info("Middlewares registered: logging | i18n | rate-limit")


@app.on_shutdown
async def on_stop() -> None:
    logger.info("Bot stopping — kurigram-addons v0.5.0")


# 20. WIRE EVERYTHING TOGETHER

# Router — all handlers defined above
app.include_router(router)

# Conversation — Registration with 5-min timeout
# register_handlers() internally uses ConversationState.filter()
app.include_conversation(Registration)

# Menus — declarative with auto back-navigation
app.include_menus(main_menu, profile_menu, settings_menu)

# DI container — attach so the dispatcher resolves BotConfig for /whoami
# (and any other type-annotated handler parameters)
di.attach(app)


# ENTRY POINT

if __name__ == "__main__":
    logger.info("Starting kurigram-addons v0.5.0 showcase…")
    app.run()
