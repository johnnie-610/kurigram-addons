# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from typing import Callable, Optional, TypeVar, Any, cast
from functools import wraps

import pyrogram
from pyrogram.filters import Filter as PyrogramFilter
from pyrogram.handlers import DeletedMessagesHandler
import pyrogram_patch

T = TypeVar('T', bound=Callable[..., Any])

__all__ = ['OnDeletedMessages']


class OnDeletedMessages:
    """A class providing decorators for handling on deleted messages in Pyrogram.

    This class provides the `on_deleted_messages` decorator which can be used to
    register on deleted messages handlers in a Pyrogram application.
    """
    
    __slots__ = ()  # For memory efficiency

    def on_deleted_messages(
        self=None,
        filters: Optional[PyrogramFilter] = None,
        group: int = 0
    ) -> Callable[[T], T]:
        """Decorator for handling on deleted messages.

    This does the same thing as :meth:`~pyrogram.Client.add_handler` using the
    :obj:`~pyrogram.handlers.DeletedMessagesHandler`.

    The decorated function should have the following signature:
        async def callback(client: Client, messages: list[pyrogram.types.Message]) -> Any:

    Parameters:
        filters: One or more filters to allow only a subset of on deleted messages
            to be passed in your function. Must be a valid Pyrogram filter.
        group: The group identifier. Defaults to 0.

    Returns:
        The decorated function.

    Raises:
        RuntimeError: If the decorator is not used in a Router instance or as a decorator.
        TypeError: If the filters are not valid Pyrogram filters.
        AttributeError: If the Router instance is not properly initialized.
    """
        def decorator(func: T) -> T:
            if not callable(func):
                raise TypeError("The decorated object must be callable")

            if not isinstance(self, pyrogram_patch.router.Router):
                raise RuntimeError(
                    "This decorator must be used as a method within a Router instance."
                )

            if not hasattr(self, '_app') or not hasattr(self, '_decorators_storage'):
                raise AttributeError(
                    "Router instance is not properly initialized. "
                    "Missing required attributes: _app or _decorators_storage"
                )

            if filters is not None and not isinstance(filters, PyrogramFilter):
                raise TypeError(
                    f"filters must be a Pyrogram filter, got {type(filters).__name__}"
                )

            @wraps(func)
            async def wrapper(client: 'pyrogram.Client', messages: 'pyrogram.types.list[pyrogram.types.Message]') -> Any:
                return await func(client, messages)

            handler = DeletedMessagesHandler(wrapper, filters)
            
            if self._app is not None:
                self._app.add_handler(handler, group)
            else:
                self._decorators_storage.append((handler, group))
            
            return cast(T, wrapper)
            
        return decorator
