# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Enhanced rate limiter — per-user, per-chat, per-command buckets.

Use as a decorator or middleware to throttle handlers.

Example::

    from kurigram_addons import RateLimit

    @router.on_command("generate")
    @RateLimit(per_user=3, window=60, message="Slow down! {remaining}s left.")
    async def generate(client, message):
        ...

Or as middleware::

    from kurigram_addons import RateLimitMiddleware

    app.include_middleware(RateLimitMiddleware(per_user=5, window=30))
"""

from __future__ import annotations

import asyncio
import functools
import logging
import time
from collections import defaultdict
from typing import Any, Callable, Dict, Optional, Tuple

logger = logging.getLogger("kurigram.rate_limit")


class _TokenBucket:
    """Simple token bucket rate limiter."""

    __slots__ = ("capacity", "window", "_tokens", "_last_refill")

    def __init__(self, capacity: int, window: float) -> None:
        self.capacity = capacity
        self.window = window
        self._tokens = capacity
        self._last_refill = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self._last_refill
        refill = elapsed * (self.capacity / self.window)
        self._tokens = min(self.capacity, self._tokens + refill)
        self._last_refill = now

    def consume(self) -> Tuple[bool, float]:
        """Try to consume one token.

        Returns:
            (allowed, remaining_seconds). If allowed is False,
            remaining_seconds is how long until a token is available.
        """
        self._refill()
        if self._tokens >= 1:
            self._tokens -= 1
            return True, 0.0
        else:
            # Time until next token
            deficit = 1 - self._tokens
            wait = deficit * (self.window / self.capacity)
            return False, wait


class RateLimit:
    """Decorator that rate-limits a handler per user, chat, or globally.

    Args:
        per_user: Max calls per user within ``window``.
        per_chat: Max calls per chat within ``window``.
        window: Time window in seconds (default: 60).
        message: Reply to send when rate-limited. Supports ``{remaining}``
                 placeholder for seconds remaining.
        scope: ``'user'``, ``'chat'``, or ``'global'`` (auto-inferred
               from per_user/per_chat if not set).
    """

    def __init__(
        self,
        per_user: Optional[int] = None,
        per_chat: Optional[int] = None,
        *,
        window: float = 60,
        message: Optional[str] = None,
        scope: Optional[str] = None,
    ) -> None:
        if per_user is None and per_chat is None:
            raise ValueError("Specify at least one of per_user or per_chat")

        self.per_user = per_user
        self.per_chat = per_chat
        self.window = window
        self.message = message or "Rate limited. Try again in {remaining}s."

        if scope:
            self.scope = scope
        elif per_user:
            self.scope = "user"
        else:
            self.scope = "chat"

        # Buckets: key -> TokenBucket
        self._buckets: Dict[str, _TokenBucket] = defaultdict(
            lambda: _TokenBucket(
                capacity=self.per_user or self.per_chat or 1,
                window=self.window,
            )
        )

    def _get_key(self, update: Any) -> str:
        """Build a bucket key from the update."""
        parts = []

        if self.scope in ("user", "both"):
            user = getattr(update, "from_user", None)
            if user:
                parts.append(f"u:{user.id}")

        if self.scope in ("chat", "both"):
            chat = getattr(update, "chat", None)
            if chat is None:
                msg = getattr(update, "message", None)
                if msg:
                    chat = getattr(msg, "chat", None)
            if chat:
                parts.append(f"c:{chat.id}")

        return ":".join(parts) if parts else "global"

    def __call__(self, func: Callable) -> Callable:
        """Decorate a handler with rate limiting."""
        limiter = self

        @functools.wraps(func)
        async def wrapper(client: Any, update: Any, *args: Any, **kwargs: Any) -> Any:
            key = limiter._get_key(update)
            allowed, remaining = limiter._buckets[key].consume()

            if not allowed:
                remaining_int = int(remaining) + 1
                reply_text = limiter.message.format(remaining=remaining_int)

                # Try to reply
                reply = getattr(update, "reply", None)
                if reply is None:
                    msg = getattr(update, "message", None)
                    if msg:
                        reply = getattr(msg, "reply", None)

                if reply:
                    await reply(reply_text)
                elif hasattr(update, "answer"):
                    await update.answer(reply_text, show_alert=True)

                logger.debug(
                    "Rate limited key=%s, remaining=%ds", key, remaining_int
                )
                return None

            return await func(client, update, *args, **kwargs)

        return wrapper


__all__ = ["RateLimit"]
