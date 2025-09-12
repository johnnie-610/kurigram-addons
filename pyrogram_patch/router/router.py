# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

"""Router module for managing Pyrogram event handlers.

This module provides the main Router class that manages Pyrogram event handlers
with a clean, decorator-based interface. It handles both immediate registration
when a client is available and deferred registration for later setup.
"""

import logging
from typing import Any, Dict, List, Optional, Set, Tuple, Union

from pyrogram_patch.router.patched_decorators.decorators import PatchedDecorators

# Type imports with fallbacks
try:
    from pyrogram import Client
    from pyrogram.handlers.handler import Handler as PyrogramHandler
    PYROGRAM_AVAILABLE = True
except ImportError:
    Client = object
    PyrogramHandler = object
    PYROGRAM_AVAILABLE = False

logger = logging.getLogger(__name__)

# Type aliases
HandlerInfo = Tuple[str, Any, Optional[Any], int]  # (class_name, callback, filters, group)
HandlerEntry = Tuple[PyrogramHandler, int]  # (handler, group)

class Router(PatchedDecorators):
    """A router class for managing Pyrogram event handlers with decorators.

    This class provides a clean interface for registering event handlers using
    decorators. It supports both immediate registration (when a client is set)
    and deferred registration (handlers stored until client is available).

    Features:
        - Type-safe decorator methods for all Pyrogram events
        - Automatic handler registration and deregistration
        - Duplicate handler prevention
        - Proper error handling and logging
        - Support for handler groups and priorities

    Example:
        .. code-block:: python

            from pyrogram import Client
            from pyrogram_patch.router import Router

            app = Client("my_account")
            router = Router()

            @router.on_message()
            async def handle_message(client, message):
                await message.reply(f"Hello! You said: {message.text}")

            @router.on_callback_query()
            async def handle_callback(client, query):
                await query.answer("Button clicked!")

            # Register all handlers with the client
            router.set_client(app)

            # Run the client
            app.run()
    """

    def __init__(self) -> None:
        """Initialize a new Router instance."""
        super().__init__()

        # Client and registration state
        self._client: Optional[Client] = None
        self._is_registered: bool = False

        # Handler storage
        self._registered_handlers: List[HandlerEntry] = []
        self._pending_handlers: List[HandlerInfo] = []
        self._handler_ids: Set[int] = set()

        # Statistics
        self._registration_stats: Dict[str, int] = {
            'registered': 0,
            'failed': 0,
            'duplicates_prevented': 0
        }

        logger.debug("Router initialized")

    @property
    def client(self) -> Optional[Client]:
        """Get the currently assigned Pyrogram client."""
        return self._client

    @property
    def is_registered(self) -> bool:
        """Check if handlers are registered with a client."""
        return self._is_registered

    @property
    def handler_count(self) -> int:
        """Get the total number of registered handlers."""
        return len(self._registered_handlers)

    @property
    def pending_count(self) -> int:
        """Get the number of handlers awaiting registration."""
        return len(self._pending_handlers)

    def get_stats(self) -> Dict[str, Any]:
        """Get router statistics.

        Returns:
            Dictionary containing registration statistics and handler counts
        """
        return {
            'registered_handlers': len(self._registered_handlers),
            'pending_handlers': len(self._pending_handlers),
            'client_attached': self._client is not None,
            'is_registered': self._is_registered,
            **self._registration_stats
        }

    def set_client(self, client: Client) -> None:
        """Set the Pyrogram client and register all handlers.

        This method assigns a Pyrogram client to the router and immediately
        registers all stored handlers. If handlers were already registered
        with a different client, they will be unregistered first.

        Args:
            client: The Pyrogram client instance to use

        Raises:
            TypeError: If client is not a valid Pyrogram Client
            RuntimeError: If handler registration fails
        """
        if not PYROGRAM_AVAILABLE:
            raise RuntimeError("Pyrogram is not available")

        if not hasattr(client, 'add_handler') or not hasattr(client, 'remove_handler'):
            raise TypeError(
                f"Expected a Pyrogram Client with add_handler/remove_handler methods, "
                f"got {type(client).__name__}"
            )

        # Unregister from previous client if necessary
        if self._client is not None and self._is_registered:
            logger.info("Switching clients, unregistering existing handlers")
            self.unregister_handlers()

        self._client = client
        logger.info(f"Client set: {type(client).__name__}")

        # Register all pending handlers
        if self._pending_handlers:
            self._register_pending_handlers()

        self._is_registered = True
        logger.info(f"Router registered with {self.handler_count} handlers")

    def unregister_handlers(self) -> None:
        """Unregister all handlers from the current client.

        This method removes all registered handlers from the client but keeps
        them stored in the router for potential re-registration with a different
        client.
        """
        if not self._client or not self._is_registered:
            logger.warning("No client or handlers to unregister")
            return

        failed_removals = 0
        for handler, group in self._registered_handlers:
            try:
                self._client.remove_handler(handler, group)
            except Exception as e:
                logger.error(f"Failed to remove handler {handler}: {e}")
                failed_removals += 1

        removed_count = len(self._registered_handlers) - failed_removals
        logger.info(f"Unregistered {removed_count} handlers ({failed_removals} failed)")

        self._is_registered = False

    def clear_handlers(self) -> None:
        """Clear all handlers from the router.

        This method removes all handlers from both the client (if registered)
        and the router's internal storage. This action cannot be undone.
        """
        if self._is_registered:
            self.unregister_handlers()

        cleared_registered = len(self._registered_handlers)
        cleared_pending = len(self._pending_handlers)

        self._registered_handlers.clear()
        self._pending_handlers.clear()
        self._handler_ids.clear()

        logger.info(f"Cleared {cleared_registered} registered and {cleared_pending} pending handlers")

    def _register_handler(self, handler: PyrogramHandler, group: int) -> None:
        """Register a single handler with the client.

        Args:
            handler: The Pyrogram handler instance
            group: The handler group

        Raises:
            RuntimeError: If registration fails
        """
        # Prevent duplicate handlers
        handler_id = id(handler)
        if handler_id in self._handler_ids:
            self._registration_stats['duplicates_prevented'] += 1
            logger.debug("Prevented duplicate handler registration")
            return

        if self._client is not None:
            try:
                self._client.add_handler(handler, group)
                self._registered_handlers.append((handler, group))
                self._handler_ids.add(handler_id)
                self._registration_stats['registered'] += 1
                logger.debug(f"Registered {type(handler).__name__} to group {group}")
            except Exception as e:
                self._registration_stats['failed'] += 1
                logger.error(f"Failed to register handler: {e}")
                raise RuntimeError(f"Handler registration failed: {e}") from e
        else:
            logger.warning("No client available, handler registration skipped")

    def _store_handler_info(
        self,
        handler_class_name: str,
        callback: Any,
        filters: Optional[Any],
        group: int
    ) -> None:
        """Store handler information for later registration.

        Args:
            handler_class_name: Name of the handler class
            callback: The callback function
            filters: Optional filters
            group: Handler group
        """
        handler_info = (handler_class_name, callback, filters, group)
        self._pending_handlers.append(handler_info)
        logger.debug(f"Stored {handler_class_name} for later registration")

    def _register_pending_handlers(self) -> None:
        """Register all pending handlers with the current client."""
        if not self._client:
            logger.error("Cannot register pending handlers: no client set")
            return

        registered = 0
        failed = 0

        for handler_class_name, callback, filters, group in self._pending_handlers:
            try:
                # Get handler class directly from pyrogram.handlers
                if not PYROGRAM_AVAILABLE:
                    logger.error("Pyrogram not available for handler registration")
                    failed += 1
                    continue

                # Import handlers module dynamically
                import pyrogram.handlers as handlers_module
                handler_class = getattr(handlers_module, handler_class_name, None)

                if handler_class is None:
                    logger.error(f"Handler class not found: {handler_class_name}")
                    failed += 1
                    continue

                # Create handler instance
                try:
                    handler = handler_class(callback, filters)
                except TypeError:
                    # Some handlers don't accept filters
                    try:
                        handler = handler_class(callback)
                    except Exception as e:
                        logger.error(f"Failed to create handler {handler_class_name}: {e}")
                        failed += 1
                        continue

                self._register_handler(handler, group)
                registered += 1

            except Exception as e:
                logger.error(f"Failed to register pending handler {handler_class_name}: {e}")
                failed += 1

        # Clear pending handlers after registration attempt
        self._pending_handlers.clear()

        logger.info(f"Registered {registered} pending handlers ({failed} failed)")

    def __repr__(self) -> str:
        """Return string representation of the router."""
        client_name = type(self._client).__name__ if self._client else "None"
        return (
            f"Router(client={client_name}, "
            f"handlers={self.handler_count}, "
            f"pending={self.pending_count}, "
            f"registered={self._is_registered})"
        )

    def __enter__(self) -> 'Router':
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        """Context manager exit with cleanup."""
        if self._is_registered:
            self.unregister_handlers()