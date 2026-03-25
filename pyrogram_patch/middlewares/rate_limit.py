import time
import logging
from typing import Optional, Any

from pyrogram.types import Message, CallbackQuery, Update
from pyrogram import Client, StopPropagation

from pyrogram_patch.patch_helper import PatchHelper
from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("Kurigram_Addons.middlewares.rate_limit")


class RateLimitMiddleware:
    """
    Middleware to limit the rate of updates processing.

    Uses the FSM storage backend to track usage, making it distributed-safe
    when a shared storage (like Redis) is used.

    Keys are stored under the ``__rl__:`` namespace so they never collide
    with real FSM state keys.  Each key follows the canonical BaseStorage
    schema: ``{"name": "__rate_limit__", "data": {"count": N}}``.
    """

    def __init__(
        self,
        rate: int,
        period: float,
        scope: str = "user",
        block: bool = True,
    ) -> None:
        """
        Initialize rate limiter.

        Args:
            rate: Number of allowed requests per period.
            period: Time window in seconds.
            scope: Scope of limiting — ``"user"``, ``"chat"``, or ``"global"``.
            block: If True, stops propagation when limit exceeded.
        """
        self.rate = rate
        self.period = period
        self.scope = scope
        self.block = block

    async def __call__(
        self,
        update: Update,
        client: Client,
        patch_helper: PatchHelper,
    ) -> None:
        storage: Optional[BaseStorage] = patch_helper.storage
        if not storage:
            logger.warning(
                "RateLimitMiddleware requires FSM storage to be configured."
            )
            return

        key = await self._get_key(update, client)
        if not key:
            return

        allowed = await self._check_limit(storage, key)

        if not allowed:
            logger.info("Rate limit exceeded for %s", key)
            if self.block:
                raise StopPropagation("Rate limit exceeded")

    async def _get_key(self, update: Update, client: Client) -> Optional[str]:
        if self.scope == "global":
            return f"__rl__:global:{client.me.id}"

        user_id = None
        chat_id = None

        if isinstance(update, Message):
            user_id = update.from_user.id if update.from_user else None
            chat_id = update.chat.id if update.chat else None
        elif isinstance(update, CallbackQuery):
            user_id = update.from_user.id
            chat_id = (
                update.message.chat.id
                if update.message and update.message.chat
                else None
            )
        else:
            from_user = getattr(update, "from_user", None)
            user_id = getattr(from_user, "id", None) if from_user else None
            chat = getattr(update, "chat", None)
            chat_id = getattr(chat, "id", None) if chat else None

        if self.scope == "user" and user_id:
            return f"__rl__:user:{user_id}"
        elif self.scope == "chat" and chat_id:
            return f"__rl__:chat:{chat_id}"

        return None

    async def _check_limit(self, storage: BaseStorage, key: str) -> bool:
        """Check the rate limit using an atomic increment.

        Uses ``BaseStorage.increment()`` which maps to Redis ``INCRBY`` or a
        locked integer add for MemoryStorage.  This replaces the previous
        CAS-loop approach which:

        1. Used the wrong storage schema (``{"count": N}`` instead of
           ``{"name": …, "data": {…}}``), causing the counter to always read 0.
        2. Required up to 5 round-trips to storage under contention.
        3. Could double the intended rate at fixed-window boundaries.

        The key rotates every ``period`` seconds (fixed window).  The TTL is
        set to ``period + 1`` so Redis automatically cleans up expired windows.
        """
        now = time.time()
        window_key = f"{key}:{int(now / self.period)}"
        ttl = int(self.period) + 1

        new_count = await storage.increment(window_key, ttl=ttl)
        return new_count <= self.rate

