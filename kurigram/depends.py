# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Dependency injection — FastAPI-style ``Depends()`` for handlers.

Declare dependencies as default parameter values. The framework resolves
them before calling the handler.

Example::

    from kurigram import Depends

    async def get_user(client, update):
        return await db.get_user(update.from_user.id)

    @router.on_command("profile")
    async def profile(client, message, user=Depends(get_user)):
        await message.reply(f"Name: {user.name}")
"""

from __future__ import annotations

import inspect
import logging
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger("kurigram.depends")


class Depends:
    """Marker for dependency injection in handler parameters.

    Args:
        dependency: An async callable ``(client, update) -> value``.
        cache: If True, the result is cached per-request (default: True).
    """

    def __init__(
        self,
        dependency: Callable[..., Any],
        *,
        cache: bool = True,
    ) -> None:
        self.dependency = dependency
        self.cache = cache

    def __repr__(self) -> str:
        name = getattr(self.dependency, "__name__", repr(self.dependency))
        return f"Depends({name})"


async def resolve_dependencies(
    handler: Callable,
    client: Any,
    update: Any,
    *,
    cache: Optional[Dict[Callable, Any]] = None,
) -> Dict[str, Any]:
    """Resolve all Depends() parameters for a handler.

    Inspects the handler's signature for parameters with ``Depends()``
    defaults, calls each dependency, and returns a dict of resolved values.

    Args:
        handler: The handler function to inspect.
        client: The Pyrogram client.
        update: The incoming update (Message, CallbackQuery, etc.).
        cache: Optional shared cache dict (for same-request dedup).

    Returns:
        Dictionary mapping parameter name → resolved value.
    """
    if cache is None:
        cache = {}

    sig = inspect.signature(handler)
    resolved: Dict[str, Any] = {}

    for name, param in sig.parameters.items():
        if param.default is inspect.Parameter.empty:
            continue

        if not isinstance(param.default, Depends):
            continue

        dep = param.default
        dep_fn = dep.dependency

        # Check cache
        if dep.cache and dep_fn in cache:
            resolved[name] = cache[dep_fn]
            continue

        # Resolve the dependency
        if inspect.iscoroutinefunction(dep_fn):
            value = await dep_fn(client, update)
        else:
            value = dep_fn(client, update)

        # Cache if requested
        if dep.cache:
            cache[dep_fn] = value

        resolved[name] = value

    return resolved


__all__ = ["Depends", "resolve_dependencies"]
