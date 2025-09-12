# pyrogram_patch.middlewares.context
from __future__ import annotations
import contextvars
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger("pyrogram_patch.middlewares.context")

_middleware_context: contextvars.ContextVar[Dict[str, Any]] = contextvars.ContextVar("middleware_context", default={})

class MiddlewareContext:
    """Request-scoped storage for middlewares and handlers."""
    @classmethod
    def set(cls, key: str, value: Any) -> None:
        ctx = _middleware_context.get().copy()
        ctx[key] = value
        _middleware_context.set(ctx)

    @classmethod
    def get(cls, key: str, default: Optional[Any] = None) -> Any:
        return _middleware_context.get().get(key, default)

    @classmethod
    def all(cls) -> Dict[str, Any]:
        return dict(_middleware_context.get())

    @classmethod
    def clear(cls) -> None:
        _middleware_context.set({})