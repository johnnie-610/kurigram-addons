# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


from __future__ import annotations

import asyncio
import inspect
import logging
import uuid
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Dict, List, Optional

from pyrogram_patch import errors

logger = logging.getLogger("pyrogram_patch.middlewares")

# Types
AsyncHandler = Callable[[Any], Awaitable[None]]
AsyncMiddleware = Callable[[AsyncHandler], AsyncHandler]
AsyncBefore = Callable[[Any], Awaitable[None]]
AsyncAfter = Callable[[Any], Awaitable[None]]


@dataclass
class MiddlewareEntry:
    id: str
    kind: str  # 'before' | 'after' | 'around'
    fn: Any
    priority: int
    signature: Optional[inspect.Signature] = None
    param_count: int = 0
    has_update_param: bool = False
    has_client_param: bool = False
    has_helper_param: bool = False


class MiddlewareManager:
    """Async middleware manager used by pyrogram_patch.

    The manager supports three middleware kinds:
      * 'before' -- runs before the handler (async fn(update) -> None)
      * 'after'  -- runs after the handler (async fn(update) -> None)
      * 'around' -- wrapper (async fn(handler) -> handler)

    Middlewares are executed in order of priority (higher first), then registration order.
    All middleware must be async-compatible. Synchronous callables will raise MiddlewareError.
    """

    def __init__(self) -> None:
        self._middlewares: List[MiddlewareEntry] = []
        self._lock = asyncio.Lock()

    # Registration API ---------------------------------------------------
    async def add_before(
        self, fn: AsyncBefore, *, priority: int = 0, mid: Optional[str] = None
    ) -> str:
        """Register a before middleware."""
        # Check if fn is async (either function or callable with async __call__)
        is_async = asyncio.iscoroutinefunction(fn)
        if hasattr(fn, "__call__") and not is_async:
            # Check the __call__ method if it's a callable object
            is_async = asyncio.iscoroutinefunction(fn.__call__)

        if not is_async:
            raise errors.MiddlewareError(
                "before middleware must be async", context={"fn": repr(fn)}
            )
        return await self._add("before", fn, priority, mid)

    async def add_after(
        self, fn: AsyncAfter, *, priority: int = 0, mid: Optional[str] = None
    ) -> str:
        """Register an after middleware."""
        if not asyncio.iscoroutinefunction(fn):
            raise errors.MiddlewareError(
                "after middleware must be async", context={"fn": repr(fn)}
            )
        return await self._add("after", fn, priority, mid)

    async def add_around(
        self,
        fn: AsyncMiddleware,
        *,
        priority: int = 0,
        mid: Optional[str] = None,
    ) -> str:
        """Register an around middleware (wraps handler)."""
        if not callable(fn):
            raise errors.MiddlewareError(
                "around middleware must be callable", context={"fn": repr(fn)}
            )
        return await self._add("around", fn, priority, mid)

    async def _add(
        self, kind: str, fn: Any, priority: int, mid: Optional[str]
    ) -> str:
        mid = mid or str(uuid.uuid4())

        # Cache signature and analyze parameters
        try:
            signature = inspect.signature(fn)
            param_count = len(signature.parameters)
            has_update = "update" in signature.parameters
            has_client = "client" in signature.parameters
            has_helper = (
                "patch_helper" in signature.parameters
                or "helper" in signature.parameters
            )
        except (ValueError, TypeError):
            # Fallback for callables without proper signature
            signature = None
            param_count = 0
            has_update = has_client = has_helper = False

        entry = MiddlewareEntry(
            id=mid,
            kind=kind,
            fn=fn,
            priority=priority,
            signature=signature,
            param_count=param_count,
            has_update_param=has_update,
            has_client_param=has_client,
            has_helper_param=has_helper,
        )

        async with self._lock:
            self._middlewares.append(entry)
        logger.info(
            "Registered %s middleware id=%s priority=%d (params: %d)",
            kind,
            mid,
            priority,
            param_count,
        )
        return mid

    async def remove(self, mid: str) -> bool:
        """Remove middleware by id."""
        async with self._lock:
            for i, m in enumerate(self._middlewares):
                if m.id == mid:
                    self._middlewares.pop(i)
                    logger.info("Removed middleware id=%s", mid)
                    return True
        return False

    async def list_middlewares(self) -> List[Dict[str, Any]]:
        async with self._lock:
            return [
                {
                    "id": m.id,
                    "kind": m.kind,
                    "priority": m.priority,
                    "fn": repr(m.fn),
                }
                for m in self._middlewares
            ]

    async def execute_middleware(
        self,
        middleware: MiddlewareEntry,
        update: Any,
        client: Any = None,
        helper: Any = None,
    ) -> Any:
        """Execute a middleware using cached signature information for optimal performance."""
        try:
            # Use cached parameter analysis to call with correct signature
            if (
                middleware.has_helper_param
                and helper is not None
                and middleware.has_client_param
                and client is not None
            ):
                return await middleware.fn(update, client, helper)
            elif middleware.has_client_param and client is not None:
                return await middleware.fn(update, client)
            elif middleware.has_update_param or middleware.param_count == 1:
                return await middleware.fn(update)
            else:
                # Fallback: try with update only
                return await middleware.fn(update)
        except TypeError as e:
            # If signature analysis was wrong, fall back to original behavior
            logger.debug(
                "Middleware signature mismatch for %s, falling back: %s",
                middleware.id,
                e,
            )
            if helper is not None and client is not None:
                try:
                    return await middleware.fn(update, client, helper)
                except TypeError:
                    pass
            if client is not None:
                try:
                    return await middleware.fn(update, client)
                except TypeError:
                    pass
            return await middleware.fn(update)
