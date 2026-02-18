import time
import logging
from typing import Optional, Union, Any

from pyrogram.types import Message, CallbackQuery, Update
from pyrogram import Client, StopPropagation

from pyrogram_patch.patch_helper import PatchHelper
from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.middlewares.rate_limit")

class RateLimitMiddleware:
    """
    Middleware to limit the rate of updates processing.
    
    Uses the FSM storage backend to track usage, making it distributed-safe
    if a distributed storage (like Redis) is used.
    """

    def __init__(
        self,
        rate: int,
        period: float,
        scope: str = "user",
        block: bool = True
    ) -> None:
        """
        Initialize rate limiter.

        Args:
            rate: Number of allowed requests per period.
            period: Time window in seconds.
            scope: Scope of limiting. "user" (per user_id), "chat" (per chat_id), or "global".
            block: If True, stops propagation when limit exceeded. If False, effectively does nothing (logging only).
        """
        self.rate = rate
        self.period = period
        self.scope = scope
        self.block = block

    async def __call__(
        self,
        update: Update,
        client: Client,
        patch_helper: PatchHelper
    ) -> None:
        storage: Optional[BaseStorage] = patch_helper._fsm_storage
        if not storage:
            logger.warning("RateLimitMiddleware requires FSM storage to be configured.")
            return

        key = await self._get_key(update, client)
        if not key:
            return

        # Attempt to acquire token/slot
        allowed = await self._check_limit(storage, key)
        
        if not allowed:
            logger.info("Rate limit exceeded for %s", key)
            if self.block:
                raise StopPropagation("Rate limit exceeded")

    async def _get_key(self, update: Update, client: Client) -> Optional[str]:
        if self.scope == "global":
            return f"ratelimit:global:{client.me.id}"
        
        user_id = None
        chat_id = None

        if isinstance(update, Message):
            user_id = update.from_user.id if update.from_user else None
            chat_id = update.chat.id if update.chat else None
        elif isinstance(update, CallbackQuery):
            user_id = update.from_user.id
            chat_id = update.message.chat.id if update.message and update.message.chat else None
        else:
            # Fallback for other updates
            user_id = getattr(update, "from_user", None)
            user_id = getattr(user_id, "id", None) if user_id else None
            
            chat = getattr(update, "chat", None)
            chat_id = getattr(chat, "id", None) if chat else None

        if self.scope == "user":
            if user_id:
                return f"ratelimit:user:{user_id}"
        elif self.scope == "chat":
            if chat_id:
                return f"ratelimit:chat:{chat_id}"
                
        return None

    async def _check_limit(self, storage: BaseStorage, key: str) -> bool:
        """
        Check rate limit using sliding window approximation (fixed window for simplicity/atomicity with BaseStorage).
        We use a bucket keyed by time window.
        """
        now = time.time()
        # Key rotates every 'period' seconds
        window_key = f"{key}:{int(now / self.period)}"
        
        # CAS Loop to increment
        for _ in range(5): # Retry limit
            state = await storage.get_state(window_key)
            if not state:
                # Initialize
                new_state = {"count": 1}
                success = await storage.compare_and_set(
                    window_key, 
                    new_state, 
                    expected_state=None, 
                    ttl=int(self.period) + 1
                )
                if success:
                    return True
            else:
                current_count = state.get("count", 0)
                if current_count >= self.rate:
                    return False
                
                new_state = {"count": current_count + 1}
                success = await storage.compare_and_set(
                    window_key,
                    new_state,
                    expected_state=state,
                    # Maintain TTL roughly? Or just set max TTL?
                    # BaseStorage sets TTL on write.
                    ttl=int(self.period) + 1
                )
                if success:
                    return True
                # If failed, loop and retry
                
        # If too many CAS failures, assume busy and allow? Or deny?
        # Deny to be safe? Or allow to avoid dropping legitimate traffic due to infrastructure?
        # Allow is fail-open. Deny is fail-closed.
        logger.warning("CAS loop failed for rate limit %s", key)
        return True # Fail-open
