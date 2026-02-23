# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Auto FloodWait — transparent retry with exponential backoff.

Wraps Pyrogram API calls to automatically retry on ``FloodWait`` errors.
Integrated into :class:`KurigramClient` when ``auto_flood_wait=True``.

Example::

    app = KurigramClient(
        "my_bot",
        auto_flood_wait=True,   # Enable auto-retry
        max_flood_wait=60,      # Max seconds to wait (raise if longer)
    )
"""

from __future__ import annotations

import asyncio
import functools
import logging
from typing import Any, Callable, TypeVar

logger = logging.getLogger("kurigram.flood_wait")

F = TypeVar("F", bound=Callable[..., Any])


class FloodWaitHandler:
    """Wraps async callables with FloodWait retry logic.

    Args:
        max_wait: Maximum wait time in seconds. If ``FloodWait.value``
                  exceeds this, the error is re-raised.
        max_retries: Maximum number of retries (default: 3).
    """

    def __init__(self, max_wait: int = 60, max_retries: int = 3) -> None:
        self.max_wait = max_wait
        self.max_retries = max_retries

    async def __call__(
        self, func: Callable[..., Any], *args: Any, **kwargs: Any
    ) -> Any:
        """Execute *func* with FloodWait retry.

        Args:
            func: Async callable to execute.
            *args: Positional arguments.
            **kwargs: Keyword arguments.

        Returns:
            The result of *func*.

        Raises:
            FloodWait: If wait time exceeds ``max_wait`` or retries exhausted.
        """
        from pyrogram.errors import FloodWait

        for attempt in range(1, self.max_retries + 1):
            try:
                return await func(*args, **kwargs)
            except FloodWait as e:
                wait = e.value
                if wait > self.max_wait:
                    logger.warning(
                        "FloodWait %ds exceeds max_wait %ds, raising",
                        wait,
                        self.max_wait,
                    )
                    raise

                if attempt >= self.max_retries:
                    logger.warning(
                        "FloodWait: max retries (%d) exhausted, raising",
                        self.max_retries,
                    )
                    raise

                logger.info(
                    "FloodWait %ds, attempt %d/%d — sleeping...",
                    wait,
                    attempt,
                    self.max_retries,
                )
                await asyncio.sleep(wait)

    def wrap(self, func: F) -> F:
        """Decorator that wraps an async function with FloodWait retry.

        Args:
            func: Async function to wrap.

        Returns:
            Wrapped function.
        """
        handler = self

        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            return await handler(func, *args, **kwargs)

        return wrapper  # type: ignore[return-value]


__all__ = ["FloodWaitHandler"]
