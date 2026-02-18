# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import contextvars
import logging
import weakref
from typing import Any, Dict, Optional, Set

logger = logging.getLogger("pyrogram_patch.middlewares.context")

# Use a token-based approach for better isolation
_middleware_context: contextvars.ContextVar[Optional[Dict[str, Any]]] = (
    contextvars.ContextVar("middleware_context", default=None)
)



class MiddlewareContext:
    """
    Request-scoped storage for middlewares and handlers with proper isolation.

    This class provides isolated context storage that prevents data leakage
    between concurrent requests in async environments.
    """



    @classmethod
    def initialize_context(cls) -> contextvars.Token:
        """
        Initialize a new isolated context for the current request.

        Returns:
            A token that can be used to reset the context
        """
        token = _middleware_context.set({})
        logger.debug("Initialized new middleware context")
        return token

    @classmethod
    def reset_context(cls, token: contextvars.Token) -> None:
        """
        Reset the context using the provided token.

        Args:
            token: The token returned by initialize_context
        """
        try:
            _middleware_context.reset(token)
            logger.debug("Reset middleware context")
        except (ValueError, RuntimeError) as e:
            logger.warning("Failed to reset middleware context: %s", e)

    @classmethod
    def ensure_context(cls) -> None:
        """Ensure a context exists, creating one if necessary."""
        if _middleware_context.get() is None:
            cls.initialize_context()

    @classmethod
    def set(cls, key: str, value: Any) -> None:
        """Set a value in the current context."""
        cls.ensure_context()
        ctx = _middleware_context.get()
        if ctx is not None:
            ctx[key] = value
            _middleware_context.set(ctx)

    @classmethod
    def get(cls, key: str, default: Optional[Any] = None) -> Any:
        """Get a value from the current context."""
        ctx = _middleware_context.get()
        if ctx is not None:
            return ctx.get(key, default)
        return default

    @classmethod
    def all(cls) -> Dict[str, Any]:
        """Get all values from the current context."""
        ctx = _middleware_context.get()
        return dict(ctx) if ctx is not None else {}

    @classmethod
    def clear(cls) -> None:
        """Clear all values from the current context."""
        ctx = _middleware_context.get()
        if ctx is not None:
            ctx.clear()
            _middleware_context.set(ctx)

    @classmethod
    def has_key(cls, key: str) -> bool:
        """Check if a key exists in the current context."""
        ctx = _middleware_context.get()
        return ctx is not None and key in ctx

    @classmethod
    def delete(cls, key: str) -> bool:
        """Delete a key from the current context."""
        ctx = _middleware_context.get()
        if ctx is not None and key in ctx:
            del ctx[key]
            _middleware_context.set(ctx)
            return True
        return False

    @classmethod
    def get_context_id(cls) -> Optional[int]:
        """Get the ID of the current context dict for debugging."""
        ctx = _middleware_context.get()
        return id(ctx) if ctx is not None else None

    @classmethod
    def get_stats(cls) -> Dict[str, Any]:
        """Get statistics about context usage."""
        return {
            "current_context_id": cls.get_context_id(),
            "has_context": _middleware_context.get() is not None,
        }


# Context manager for automatic cleanup
class MiddlewareContextManager:
    """Context manager for middleware context lifecycle."""

    def __init__(self):
        self._token: Optional[contextvars.Token] = None

    async def __aenter__(self):
        self._token = MiddlewareContext.initialize_context()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self._token:
            MiddlewareContext.reset_context(self._token)
