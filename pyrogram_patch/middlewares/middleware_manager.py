# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
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
    has_handler_param: bool = False
    timeout: Optional[float] = None


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
        self._before: List[MiddlewareEntry] = []
        self._after: List[MiddlewareEntry] = []
        self._around: List[MiddlewareEntry] = []
        self._listeners: Dict[str, List[Callable]] = {
            "startup": [],
            "shutdown": [],
        }

    @property
    def has_middlewares(self) -> bool:
        """Whether any middlewares are registered."""
        return bool(self._middlewares)

    def clear(self) -> None:
        """Reset all internal state: middlewares, caches, and listeners."""
        self._middlewares.clear()
        self._before.clear()
        self._after.clear()
        self._around.clear()
        for listeners in self._listeners.values():
            listeners.clear()
        logger.info("MiddlewareManager cleared all state")

    async def add_listener(self, event: str, fn: Callable) -> None:
        """Register a lifecycle listener."""
        if event not in self._listeners:
            raise errors.MiddlewareError(f"Invalid event: {event}")
        self._listeners[event].append(fn)
        logger.info("Registered listener for event: %s", event)

    async def fire_event(self, event: str, *args, **kwargs) -> None:
        """Execute all listeners for the given event."""
        if event not in self._listeners:
            return
        
        for fn in self._listeners[event]:
            try:
                if inspect.iscoroutinefunction(fn):
                    await fn(*args, **kwargs)
                else:
                    fn(*args, **kwargs)
            except Exception as e:
                logger.error("Failed to execute listener for %s: %s", event, e)

    def _rebuild_cache(self) -> None:
        """Rebuild optimized lists of middlewares sorted by priority."""
        sorted_mids = sorted(
            self._middlewares, key=lambda x: x.priority, reverse=True
        )
        self._before = [m for m in sorted_mids if m.kind == "before"]
        self._after = [m for m in sorted_mids if m.kind == "after"]
        self._around = [m for m in sorted_mids if m.kind == "around"]

    # Middleware Execution 

    # Registration API 
    async def add_before(
        self,
        fn: AsyncBefore,
        *,
        priority: int = 0,
        mid: Optional[str] = None,
        timeout: Optional[float] = None,
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
        return await self._add("before", fn, priority, mid, timeout)

    async def add_after(
        self,
        fn: AsyncAfter,
        *,
        priority: int = 0,
        mid: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        """Register an after middleware."""
        # Check if fn is async (either function or callable with async __call__)
        is_async = asyncio.iscoroutinefunction(fn)
        if hasattr(fn, "__call__") and not is_async:
            # Check the __call__ method if it's a callable object
            is_async = asyncio.iscoroutinefunction(fn.__call__)

        if not is_async:
            raise errors.MiddlewareError(
                "after middleware must be async", context={"fn": repr(fn)}
            )
        return await self._add("after", fn, priority, mid, timeout)

    async def add_around(
        self,
        fn: AsyncMiddleware,
        *,
        priority: int = 0,
        mid: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        """Register an around middleware (wraps handler)."""
        if not callable(fn):
            raise errors.MiddlewareError(
                "around middleware must be callable", context={"fn": repr(fn)}
            )
        return await self._add("around", fn, priority, mid, timeout)

    async def _add(
        self,
        kind: str,
        fn: Any,
        priority: int,
        mid: Optional[str],
        timeout: Optional[float] = None,
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
            has_handler = any(
                p in signature.parameters
                for p in ("handler", "next_handler", "next")
            )
            # If it's 'around' and no handler was found by name, 
            # and it has at least 1-2 params, assume the first one IS the handler
            # unless it's explicitly 'update'.
            if kind == "around" and not has_handler and param_count > 0:
                first_param = list(signature.parameters.values())[0]
                if first_param.name != "update":
                    has_handler = True
        except (ValueError, TypeError):
            # Fallback for callables without proper signature
            signature = None
            param_count = 0
            has_update = has_client = has_helper = has_handler = False

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
            has_handler_param=has_handler,
            timeout=timeout,
        )

        self._middlewares.append(entry)
        self._rebuild_cache()
        logger.info(
            "Registered %s middleware id=%s priority=%d (params: %d) timeout=%s",
            kind,
            mid,
            priority,
            param_count,
            timeout,
        )
        return mid

    async def remove(self, mid: str) -> bool:
        """Remove middleware by id."""
        for i, m in enumerate(self._middlewares):
            if m.id == mid:
                self._middlewares.pop(i)
                self._rebuild_cache()
                logger.info("Removed middleware id=%s", mid)
                return True
        return False

    async def list_middlewares(self) -> List[Dict[str, Any]]:
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
        next_handler: Optional[Callable] = None,
        *args,
        **kwargs,
    ) -> Any:
        """Execute a middleware using cached signature information for optimal performance."""
        try:
            from pyrogram_patch.config import get_config
            default_timeout = get_config().middleware.max_execution_time
            timeout = (
                middleware.timeout
                if middleware.timeout is not None
                else default_timeout
            )

            async with asyncio.timeout(timeout):
                # For 'around' middleware, we must pass the next_handler
                if middleware.kind == "around":
                    if next_handler is None:
                        raise errors.MiddlewareError(
                            "Around middleware requires a next_handler"
                        )

                    # Prepare arguments for the middleware function
                    mid_kwargs = {}
                    if middleware.has_client_param and client is not None:
                        mid_kwargs["client"] = client
                    if middleware.has_helper_param and helper is not None:
                        mid_kwargs["patch_helper"] = helper or getattr(
                            helper, "helper", helper
                        )

                    # Create a wrapper for the next handler in the chain
                    async def wrapped_next():
                        return await next_handler(*args, **kwargs)

                    # Robust calling based on parameter detection
                    if middleware.has_handler_param:
                        # Standard around middleware: (handler, update, ...)
                        # We pass both positionally to avoid complex mapping
                        return await middleware.fn(wrapped_next, update, **mid_kwargs)
                    else:
                        # Fallback for around middleware without explicit handler param.
                        # This happens if it was registered as around but shaped like before/after.
                        # We call the middleware, and MUST call wrapped_next to continue the chain.
                        try:
                            # Try to call as a regular hook
                            result = await middleware.fn(update, **mid_kwargs)
                            # Continue the chain because this mid didn't take ctrl of it
                            await wrapped_next()
                            return result
                        except TypeError:
                            # Extreme fallback: try positional
                            # This might still fail but we've tried our best
                            result = await middleware.fn(update, client, helper)
                            await wrapped_next()
                            return result

                # Use cached parameter analysis to call with correct signature for before/after
                if middleware.has_client_param and middleware.has_helper_param:
                    # Optimized positional call for (update, client, helper)
                    return await middleware.fn(update, client, helper)
                elif middleware.has_helper_param:
                    # Optimized positional call for (update, helper)
                    return await middleware.fn(update, helper)
                elif middleware.has_client_param:
                    # Optimized positional call for (update, client)
                    return await middleware.fn(update, client)
                else:
                    # Default: (update)
                    return await middleware.fn(update)

        except TimeoutError:
            logger.error(
                "Middleware %s timed out after %.2fs", middleware.id, timeout
            )
            raise errors.MiddlewareError(
                f"Middleware timed out after {timeout}s",
                context={"middleware_id": middleware.id},
            ) from None
        except TypeError as e:
            logger.debug(
                "Middleware signature mismatch for %s, falling back: %s",
                middleware.id,
                e,
            )

            if middleware.kind == "around" and next_handler:
                async def wrapped_next():
                    return await next_handler(*args, **kwargs)
                
                # Try passing wrapped_next if it seems to take it as first arg
                try:
                    # Use flags for smarter fallback
                    if middleware.has_client_param and middleware.has_helper_param:
                        return await middleware.fn(wrapped_next, update, client, helper)
                    elif middleware.has_helper_param:
                        return await middleware.fn(wrapped_next, update, helper)
                    else:
                        return await middleware.fn(wrapped_next, update, client)
                except TypeError:
                    # Final fallback for around without wrapped_next handling
                    if middleware.has_helper_param:
                        return await middleware.fn(update, helper)
                    return await middleware.fn(update, client)

            if middleware.has_helper_param:
                try:
                    return await middleware.fn(update, helper)
                except TypeError:
                    pass
            
            if middleware.has_client_param:
                try:
                    return await middleware.fn(update, client)
                except TypeError:
                    pass

            return await middleware.fn(update)

    def wrap_handler(
        self,
        handler_callback: Callable,
        update: Any,
        client: Any,
        helper: Any,
    ) -> Callable[..., Awaitable[Any]]:
        """Wrap a handler in the middleware chain.

        Returns a callable that when awaited, executes the entire chain.
        """
        # Optimized sorting: lists are pre-calculated
        before = self._before
        after = self._after
        around = self._around

        async def final_handler(*args, **kwargs):
            # 1. Execute "before" middlewares
            for m in before:
                await self.execute_middleware(m, update, client, helper)

            # 2. Execute the handler (potentially wrapped in "around")
            async def actual_call(*a, **kw):
                return await handler_callback(client, update, **kw)

            # Build around chain
            chain = actual_call
            for m in reversed(around):
                next_step = chain

                async def middleware_step(
                    u=update,
                    c=client,
                    h=helper,
                    mid=m,
                    nxt=next_step,
                    *a,
                    **kw,
                ):
                    return await self.execute_middleware(
                        mid, u, c, h, next_handler=nxt, *a, **kw
                    )

                chain = middleware_step

            result = await chain(*args, **kwargs)

            # 3. Execute "after" middlewares
            for m in after:
                await self.execute_middleware(m, update, client, helper)

            return result

        return final_handler
