# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import logging
from typing import Any, Awaitable, Callable

from pyrogram_patch.middlewares.context import MiddlewareContext

logger = logging.getLogger("pyrogram_patch.middlewares.fsm_inject")


def FSMInjectionMiddleware(
    fsm_manager,
) -> Callable[
    [Callable[[Any], Awaitable[None]]], Callable[[Any], Awaitable[None]]
]:
    """Factory that returns an 'around' middleware which injects FSMContext into MiddlewareContext.

    Args:
        fsm_manager: instance of FSMContextManager providing from_update(update) -> FSMContext
    """

    def make_around(next_handler):
        async def wrapped(update):
            try:
                ctx = await fsm_manager.from_update(update)
                MiddlewareContext.set("fsm", ctx)
            except Exception as e:
                # Fail-fast? we log and continue without FSM injected
                logger.warning("FSM injection failed: %s", e, exc_info=True)
            return await next_handler(update)

        return wrapped

    return make_around
