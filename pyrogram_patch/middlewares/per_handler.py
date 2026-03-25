# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie

"""Per-handler middleware decorators.

The global middleware system applies to every update.  Sometimes you only
want a middleware to run for specific handlers — for example, an admin check
only on admin commands, or a tight rate limit only on an expensive AI endpoint.

This module provides :func:`use_middleware` (and the convenience alias
:func:`middleware`) for attaching middleware callables directly to handler
functions as decorators.

The dispatcher detects the ``__handler_middlewares__`` attribute on the
callback and executes the per-handler chain **after** the global ``before``
middlewares but **before** the handler itself.

Example::

    from pyrogram_patch.middlewares.per_handler import use_middleware

    async def require_admin(update, client, patch_helper):
        if update.from_user.id not in ADMIN_IDS:
            await update.reply("Not authorised.")
            raise StopPropagation

    @router.on_message(filters.command("ban"))
    @use_middleware(require_admin)
    async def ban_user(client, message):
        ...

    # Stacking multiple per-handler middlewares (executed left-to-right)
    @router.on_message(filters.command("generate"))
    @use_middleware(require_admin)
    @use_middleware(RateLimit(per_user=1, window=30))
    async def generate(client, message):
        ...
"""

from __future__ import annotations

import functools
import inspect
import logging
from typing import Any, Callable, List

logger = logging.getLogger("pyrogram_patch.middlewares.per_handler")

# Attribute name stored on the handler function
_ATTR = "__handler_middlewares__"


def use_middleware(*middlewares: Callable) -> Callable:
    """Attach one or more middleware callables to a handler function.

    Middleware are executed in the order they are passed (left-to-right when
    using ``@use_middleware(a, b, c)`` syntax, or outer-to-inner when stacking
    multiple ``@use_middleware`` decorators).

    Each middleware may be:

    * An async callable ``async def mid(update, client, patch_helper) -> None``
    * A :class:`~pyrogram_patch.middlewares.middleware_manager.MiddlewareContext`
      style callable ``async def mid(ctx: MiddlewareContext) -> None``
    * A class instance with an async ``__call__`` (e.g. :class:`RateLimit`)

    Raising :class:`pyrogram.StopPropagation` inside a middleware prevents
    the handler from being called and stops the entire update chain.

    Args:
        *middlewares: One or more async middleware callables.

    Returns:
        A decorator that marks the handler function with the middleware list.
    """
    def decorator(fn: Callable) -> Callable:
        existing: List[Callable] = getattr(fn, _ATTR, [])
        # Prepend so that decorator-stacking order is intuitive:
        # the outermost (top) decorator runs first.
        object.__setattr__ if hasattr(fn, "__slots__") else None
        try:
            fn.__handler_middlewares__ = list(middlewares) + existing
        except AttributeError:
            # Wrapped functions may not support arbitrary attribute assignment;
            # use functools.wraps-compatible approach
            fn = functools.wraps(fn)(fn)
            fn.__handler_middlewares__ = list(middlewares) + existing
        return fn

    return decorator


# Convenience alias
middleware = use_middleware


async def run_handler_middlewares(
    handler_callback: Callable,
    update: Any,
    client: Any,
    patch_helper: Any,
) -> bool:
    """Execute the per-handler middleware chain for *handler_callback*.

    Called by the dispatcher just before invoking the handler.

    Returns:
        ``True`` if the chain completed and the handler should be called.
        ``False`` if a middleware short-circuited the chain (should not
        normally happen — middlewares are expected to raise StopPropagation
        instead).

    Raises:
        pyrogram.StopPropagation: re-raised from any middleware that calls it.
        Exception: any other exception from a middleware is re-raised as-is.
    """
    mids: List[Callable] = getattr(handler_callback, _ATTR, [])
    if not mids:
        return True

    from pyrogram_patch.middlewares.middleware_manager import MiddlewareContext

    for mid in mids:
        try:
            # Detect MiddlewareContext calling convention
            sig = inspect.signature(mid if not hasattr(mid, "__call__") or inspect.isfunction(mid) else mid.__call__)
            params = list(sig.parameters.values())
            uses_ctx = bool(params and params[0].annotation is MiddlewareContext)
        except (ValueError, TypeError):
            uses_ctx = False

        if uses_ctx:
            ctx = MiddlewareContext(update=update, client=client, helper=patch_helper)
            await mid(ctx)
        else:
            # Detect how many positional args the middleware wants
            try:
                sig = inspect.signature(mid)
                n = len(sig.parameters)
            except (ValueError, TypeError):
                n = 3
            if n >= 3:
                await mid(update, client, patch_helper)
            elif n == 2:
                await mid(update, client)
            else:
                await mid(update)

    return True


__all__ = ["use_middleware", "middleware", "run_handler_middlewares"]
