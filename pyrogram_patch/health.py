# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Health and diagnostics helpers for pyrogram_patch.
#
# The health dashboard exposes a convenience router that can be plugged into
# bots to report runtime information such as helper pool utilisation, circuit
# breaker state, and aggregated metrics directly inside Telegram chats.

from __future__ import annotations

from typing import Optional, Sequence, Set

from pyrogram import filters
from pyrogram.types import Message

from pyrogram_patch.circuit_breaker import list_circuit_breakers
from pyrogram_patch.metrics import get_global_metrics
from pyrogram_patch.patch_data_pool import initialize_global_pool
from pyrogram_patch.router import Router


def _format_duration(seconds: float) -> str:
    """Return a human readable duration string."""

    seconds = int(max(0, seconds))
    if seconds <= 0:
        return "0s"

    periods = (
        ("d", 24 * 60 * 60),
        ("h", 60 * 60),
        ("m", 60),
        ("s", 1),
    )
    parts: list[str] = []
    for suffix, length in periods:
        value, seconds = divmod(seconds, length)
        if value:
            parts.append(f"{value}{suffix}")
    return " ".join(parts)


def create_health_router(
    command: str = "status",
    *,
    allowed_user_ids: Optional[Sequence[int]] = None,
) -> Router:
    """Create a router exposing an in-chat health dashboard command.

    Args:
        command: Slash command to trigger the dashboard (without leading slash).
        allowed_user_ids: Optional sequence of user IDs allowed to access the
            dashboard. When omitted anyone can trigger it.

    Returns:
        Configured :class:`Router` instance.
    """

    router = Router()
    allowed: Set[int] = set(allowed_user_ids or [])
    metrics = get_global_metrics()

    @router.on_message(filters.command(command))
    async def _health_status(client, message: Message) -> None:
        if allowed and (not message.from_user or message.from_user.id not in allowed):
            await message.reply_text("🚫 You are not allowed to view this dashboard.")
            return

        pool = await initialize_global_pool(client)
        pool_stats = await pool.get_statistics()

        counter_totals = metrics.get_counter_totals()
        histogram_counts = metrics.get_histogram_counts()
        breaker_stats = {
            name: breaker.get_stats() for name, breaker in list_circuit_breakers().items()
        }

        routers = getattr(client, "routers", []) or []

        lines = ["🩺 Bot status overview", ""]
        lines.append(f"• Uptime: {_format_duration(pool_stats['uptime'])}")
        lines.append(f"• Active helpers: {pool_stats['active_helpers']}")
        lines.append(
            "• Persisting helpers: "
            + ("yes" if pool_stats["persist_helpers"] else "no")
        )
        if pool_stats["session_ttl"]:
            lines.append(
                f"• Helper TTL: {_format_duration(pool_stats['session_ttl'])}"
            )
        lines.append(f"• Helpers created: {pool_stats['total_helpers_created']}")
        lines.append(f"• Helpers expired: {pool_stats['expired_helpers']}")
        lines.append(f"• Routers attached: {len(routers)}")

        if counter_totals:
            lines.extend(["", "Counters:"])
            for name, value in sorted(counter_totals.items()):
                lines.append(f"  - {name}: {value}")

        if histogram_counts:
            lines.extend(["", "Histograms:"])
            for name, count in sorted(histogram_counts.items()):
                lines.append(f"  - {name}: {count} samples")

        if breaker_stats:
            lines.extend(["", "Circuit breakers:"])
            for name, stats in breaker_stats.items():
                state = stats.get("state", "unknown")
                failures = stats.get("failure_count", 0)
                lines.append(f"  - {name}: {state} (failures={failures})")

        await message.reply_text("\n".join(lines))

    return router


__all__ = ["create_health_router"]
