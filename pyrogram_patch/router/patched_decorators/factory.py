# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Factory module for creating Pyrogram event decorators.
#
# This module provides a clean, type-safe implementation for creating decorator methods
# that can be used with the Router class. It includes proper validation, error handling,
# and handler management.


from __future__ import annotations

import functools
import inspect
import logging
from typing import Any, Callable, Optional, Type, TypeVar, Union

T = TypeVar("T", bound=Callable[..., Any])
HandlerTuple = tuple[Any, int]  # (handler_instance, group)

try:
    import pyrogram
    import pyrogram.handlers as handlers_module
    from pyrogram import Client
    from pyrogram.filters import Filter as PyrogramFilter
    from pyrogram.handlers.handler import Handler as PyrogramHandlerBase

    PYROGRAM_AVAILABLE = True
except ImportError:
    pyrogram = None
    Client = object
    PyrogramFilter = object
    PyrogramHandlerBase = object
    handlers_module = None
    PYROGRAM_AVAILABLE = False

logger = logging.getLogger(__name__)


class HandlerRegistrationError(Exception):
    """Raised when handler registration fails."""

    pass


class InvalidFilterError(TypeError):
    """Raised when invalid filters are provided."""

    pass


def get_handler_class(handler_name: str) -> Optional[Type[PyrogramHandlerBase]]:
    """Get handler class from pyrogram.handlers module.

    Args:
        handler_name: Name of the handler class (e.g., 'MessageHandler')

    Returns:
        Handler class if available, None otherwise
    """
    if not PYROGRAM_AVAILABLE or handlers_module is None:
        return None

    return getattr(handlers_module, handler_name, None)


def validate_filters(filters: Any) -> None:
    """Validate that filters are of acceptable types.

    Args:
        filters: Filter object to validate

    Raises:
        InvalidFilterError: If filters are not valid
    """
    if filters is None:
        return

    # Import state filters if available
    try:
        from pyrogram_patch.fsm.filter import (AnyStateFilter, CombinedFilter,
                                               NoStateFilter, StateFilter)

        state_filter_types = (
            StateFilter,
            NoStateFilter,
            AnyStateFilter,
            CombinedFilter,
        )
    except ImportError:
        state_filter_types = ()

    valid_types = (
        (PyrogramFilter,) + state_filter_types
        if PYROGRAM_AVAILABLE
        else state_filter_types
    )

    if not isinstance(filters, valid_types):
        raise InvalidFilterError(
            f"Filters must be a valid Pyrogram or pyrogram_patch filter. "
            f"Got {type(filters).__name__}"
        )


def create_handler_instance(
    handler_class: Type[PyrogramHandlerBase],
    callback: Callable,
    filters: Optional[Any],
) -> PyrogramHandlerBase:
    """Create a handler instance with proper error handling.

    Args:
        handler_class: The handler class to instantiate
        callback: The callback function
        filters: Optional filters

    Returns:
        Handler instance

    Raises:
        HandlerRegistrationError: If handler creation fails
    """
    try:
        # Try creating handler with filters
        return handler_class(callback, filters)
    except TypeError as e:
        if filters is not None:
            # Try without filters as fallback
            try:
                logger.warning(
                    f"Handler {handler_class.__name__} doesn't support filters, ignoring"
                )
                return handler_class(callback)
            except TypeError:
                pass

        raise HandlerRegistrationError(
            f"Failed to create {handler_class.__name__}: {e}"
        ) from e


def create_decorator_method(
    handler_class_name: str,
    event_description: str,
    callback_signature: str,
    event_parameter: str,
    event_type: str,
) -> Callable:
    """Create a complete decorator method for a specific Pyrogram event.

    Args:
        handler_class_name: Name of the Pyrogram handler class
        event_description: Human-readable description of the event
        callback_signature: Function signature for documentation
        event_parameter: Name of the event parameter
        event_type: Type name of the event

    Returns:
        Decorator method function
    """
    handler_class = get_handler_class(handler_class_name)

    def decorator_method(
        self,
        filters: Optional[Union[PyrogramFilter, Any]] = None,
        group: int = 0,
    ) -> Callable[[T], T]:
        """The actual decorator method that gets attached to Router instances."""

        # Import here to avoid circular imports
        from pyrogram_patch.router.router import Router

        if not isinstance(self, Router):
            raise TypeError(
                f"This decorator must be called on a Router instance. "
                f"Usage: @router.{decorator_method.__name__}(). "
                f"Missing required attributes: _client or _store_handler_info"
            )

        # Validate filters
        validate_filters(filters)

        def decorator(func: T) -> T:
            if not callable(func):
                raise TypeError("Decorated object must be callable")

            if not inspect.iscoroutinefunction(func):
                raise TypeError(
                    f"Handler function must be async. "
                    f"Change 'def {func.__name__}' to 'async def {func.__name__}'"
                )

            # Create wrapper function
            @functools.wraps(func)
            async def wrapper(client: Client, event: Any, **kwargs) -> Any:
                """Wrapper that forwards to the original handler."""
                try:
                    return await func(client, event, **kwargs)
                except Exception as e:
                    logger.error(f"Error in handler {func.__name__}: {e}")
                    raise

            # Mark wrapper so dispatcher knows to supply patch features
            wrapper.__pyrogram_patch_requires_helper__ = True

            # Always try to register or store the handler
            if handler_class is not None and PYROGRAM_AVAILABLE:
                # If client is already set, register immediately
                if hasattr(self, "_client") and self._client is not None:
                    try:
                        handler = create_handler_instance(
                            handler_class, wrapper, filters
                        )
                        self._register_handler(handler, group)
                        logger.debug(
                            f"Immediately registered handler {func.__name__}"
                        )
                    except HandlerRegistrationError as e:
                        logger.error(
                            f"Failed to register handler {func.__name__}: {e}"
                        )
                        raise
                else:
                    # Store for later registration when client is set
                    self._store_handler_info(
                        handler_class_name, wrapper, filters, group
                    )
                    logger.debug(
                        f"Stored handler {func.__name__} for later registration"
                    )
            else:
                # Pyrogram not available, store for later
                logger.debug(
                    f"Pyrogram not available, storing handler for later: {func.__name__}"
                )
                self._store_handler_info(
                    handler_class_name, wrapper, filters, group
                )

            return func  # Return original function, not wrapper

        return decorator

    # Set up method metadata
    decorator_method.__name__ = f"on_{event_parameter}"
    decorator_method.__qualname__ = f"Router.on_{event_parameter}"

    # Create detailed docstring
    decorator_method.__doc__ = f"""Decorator for handling {event_description}.

This decorator registers a handler for {event_description} using Pyrogram's
{handler_class_name}.

Args:
    filters: Optional filter to restrict which {event_description} trigger the handler.
        Must be a valid Pyrogram filter or pyrogram_patch state filter.
    group: Handler group for priority ordering. Lower numbers have higher priority.
        Defaults to 0.

Returns:
    The decorated function unchanged.

Example:
    .. code-block:: python

        @router.on_{event_parameter}()
        async def handle_{event_parameter}({callback_signature}):
            # Handle the {event_parameter.replace('_', ' ')}
            pass

Raises:
    TypeError: If the decorated function is not async or filters are invalid.
    HandlerRegistrationError: If handler registration fails.
"""

    # Set up method signature for better IDE support
    parameters = [
        inspect.Parameter("self", inspect.Parameter.POSITIONAL_OR_KEYWORD),
        inspect.Parameter(
            "filters",
            inspect.Parameter.KEYWORD_ONLY,
            default=None,
            annotation=Optional[Union[PyrogramFilter, Any]],
        ),
        inspect.Parameter(
            "group", inspect.Parameter.KEYWORD_ONLY, default=0, annotation=int
        ),
    ]
    decorator_method.__signature__ = inspect.Signature(parameters)
    decorator_method.__annotations__ = {
        "filters": Optional[Union[PyrogramFilter, Any]],
        "group": int,
        "return": Callable[[T], T],
    }

    return decorator_method
