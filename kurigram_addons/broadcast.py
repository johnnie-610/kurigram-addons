# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Broadcast helper — send messages to many users with automatic FloodWait handling.

Example::

    from kurigram_addons.broadcast import broadcast

    async for result in broadcast(
        client=app,
        user_ids=[111, 222, 333],
        text="📢 Important announcement!",
        delay=0.05,          # 50ms between sends
        max_flood_wait=60,   # give up if Telegram asks to wait >60s
    ):
        if result.ok:
            print(f"Sent to {result.user_id}")
        else:
            print(f"Failed for {result.user_id}: {result.error}")
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Any, AsyncIterator, Iterable, Optional

logger = logging.getLogger("kurigram.broadcast")


@dataclass
class BroadcastResult:
    """Result of a single send attempt within a broadcast.

    Attributes:
        user_id: The recipient's user ID.
        ok: ``True`` if the message was sent successfully.
        error: The exception that caused failure, or ``None`` on success.
        skipped: ``True`` if the user was skipped (e.g. blocked, deactivated).
    """

    user_id: int
    ok: bool
    error: Optional[Exception] = None
    skipped: bool = False


async def broadcast(
    client: Any,
    user_ids: Iterable[int],
    text: str,
    *,
    delay: float = 0.05,
    max_flood_wait: int = 60,
    on_error: str = "skip",
    parse_mode: Optional[str] = None,
    **send_kwargs: Any,
) -> AsyncIterator[BroadcastResult]:
    """Send *text* to each user in *user_ids*, respecting Telegram rate limits.

    This is an async generator — iterate it to both drive the sends and
    receive per-user results in real time.

    Args:
        client: A Pyrogram ``Client`` (or ``KurigramClient``) instance.
        user_ids: Iterable of Telegram user IDs to send to.
        text: Message text to send.
        delay: Seconds to sleep between successful sends (default: 0.05).
               Keeps the send rate comfortably below Telegram's ~30 msg/s limit.
        max_flood_wait: Maximum ``FloodWait`` duration to absorb automatically.
                        If Telegram asks to wait longer than this, the error
                        is surfaced as a failed result and the broadcast
                        continues (``on_error="skip"``) or stops
                        (``on_error="stop"``).
        on_error: What to do when a non-FloodWait error occurs:
                  ``"skip"`` (default) — record the failure and move on;
                  ``"stop"`` — raise immediately.
        parse_mode: Optional parse mode (``"html"``, ``"markdown"``, etc.).
        **send_kwargs: Extra keyword arguments forwarded to ``send_message``.

    Yields:
        :class:`BroadcastResult` for each user, in order.

    Example::

        success = 0
        async for result in broadcast(app, ids, "Hello!"):
            if result.ok:
                success += 1
        print(f"Sent to {success}/{len(ids)} users")
    """
    # Import here to avoid hard dependency if broadcast is never used
    try:
        from pyrogram.errors import FloodWait, InputUserDeactivated, UserIsBlocked, PeerIdInvalid
        _skip_errors = (InputUserDeactivated, UserIsBlocked, PeerIdInvalid)
    except ImportError:
        FloodWait = None  # type: ignore[assignment,misc]
        _skip_errors = ()

    if parse_mode is not None:
        send_kwargs["parse_mode"] = parse_mode

    for uid in user_ids:
        result = await _send_one(
            client=client,
            user_id=uid,
            text=text,
            delay=delay,
            max_flood_wait=max_flood_wait,
            on_error=on_error,
            flood_wait_cls=FloodWait,
            skip_error_classes=_skip_errors,
            send_kwargs=send_kwargs,
        )
        yield result
        if not result.ok and not result.skipped and on_error == "stop":
            return
        if result.ok:
            await asyncio.sleep(delay)


async def _send_one(
    *,
    client: Any,
    user_id: int,
    text: str,
    delay: float,
    max_flood_wait: int,
    on_error: str,
    flood_wait_cls: Any,
    skip_error_classes: tuple,
    send_kwargs: dict,
) -> BroadcastResult:
    """Attempt a single send with FloodWait retry."""
    retries = 3
    for attempt in range(retries):
        try:
            await client.send_message(user_id, text, **send_kwargs)
            return BroadcastResult(user_id=user_id, ok=True)

        except Exception as exc:
            # FloodWait: sleep and retry
            if flood_wait_cls and isinstance(exc, flood_wait_cls):
                wait = exc.value
                if wait <= max_flood_wait and attempt < retries - 1:
                    logger.info(
                        "FloodWait %ds for user %d (attempt %d/%d)",
                        wait, user_id, attempt + 1, retries,
                    )
                    await asyncio.sleep(wait)
                    continue
                logger.warning(
                    "FloodWait %ds exceeds max_flood_wait=%d for user %d",
                    wait, max_flood_wait, user_id,
                )
                return BroadcastResult(user_id=user_id, ok=False, error=exc)

            # Silently skip deactivated/blocked users
            if skip_error_classes and isinstance(exc, skip_error_classes):
                logger.debug("Skipping user %d: %s", user_id, exc)
                return BroadcastResult(user_id=user_id, ok=False, skipped=True, error=exc)

            # All other errors
            logger.warning("Failed to send to user %d: %s", user_id, exc)
            return BroadcastResult(user_id=user_id, ok=False, error=exc)

    return BroadcastResult(
        user_id=user_id,
        ok=False,
        error=RuntimeError(f"Exhausted {retries} retries for user {user_id}"),
    )


__all__ = ["broadcast", "BroadcastResult"]
