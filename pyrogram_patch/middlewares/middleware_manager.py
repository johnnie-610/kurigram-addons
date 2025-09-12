# pyrogram_patch.middlewares.middleware_manager
from __future__ import annotations

import asyncio
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
    async def add_before(self, fn: AsyncBefore, *, priority: int = 0, mid: Optional[str] = None) -> str:
        """Register a before middleware."""
        # Check if fn is async (either function or callable with async __call__)
        is_async = asyncio.iscoroutinefunction(fn)
        if hasattr(fn, '__call__') and not is_async:
            # Check the __call__ method if it's a callable object
            is_async = asyncio.iscoroutinefunction(fn.__call__)

        if not is_async:
            raise errors.MiddlewareError("before middleware must be async", context={"fn": repr(fn)})
        return await self._add("before", fn, priority, mid)

    async def add_after(self, fn: AsyncAfter, *, priority: int = 0, mid: Optional[str] = None) -> str:
        """Register an after middleware."""
        if not asyncio.iscoroutinefunction(fn):
            raise errors.MiddlewareError("after middleware must be async", context={"fn": repr(fn)})
        return await self._add("after", fn, priority, mid)

    async def add_around(self, fn: AsyncMiddleware, *, priority: int = 0, mid: Optional[str] = None) -> str:
        """Register an around middleware (wraps handler)."""
        if not callable(fn):
            raise errors.MiddlewareError("around middleware must be callable", context={"fn": repr(fn)})
        return await self._add("around", fn, priority, mid)

    async def _add(self, kind: str, fn: Any, priority: int, mid: Optional[str]) -> str:
        mid = mid or str(uuid.uuid4())
        entry = MiddlewareEntry(id=mid, kind=kind, fn=fn, priority=priority)
        async with self._lock:
            self._middlewares.append(entry)
        logger.info("Registered %s middleware id=%s priority=%d", kind, mid, priority)
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
            return [{"id": m.id, "kind": m.kind, "priority": m.priority, "fn": repr(m.fn)} for m in self._middlewares]
