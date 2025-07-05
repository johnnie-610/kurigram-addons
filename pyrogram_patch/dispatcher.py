import asyncio
import inspect
import logging
from contextlib import suppress
from typing import Any, Dict, List, Optional, Set, Type, Union, cast

import pyrogram
from pyrogram.dispatcher import Dispatcher as PyrogramDispatcher
from pyrogram.handlers.handler import Handler
from pyrogram.handlers import RawUpdateHandler
from pyrogram.types import Update, User, Chat

from .patch_data_pool import PatchDataPool
from .patch_helper import PatchHelper
from pyrogram_patch.fsm.base_storage import BaseStorage

# Type aliases for better readability
HandlerType = Type[Handler]
MiddlewareType = Any  # Could be more specific based on middleware implementation

logger = logging.getLogger(__name__)

class PatchedDispatcher(PyrogramDispatcher):
    """Enhanced dispatcher with middleware support and improved update handling.
    
    This class extends Pyrogram's default dispatcher to add:
    - Middleware support for processing updates
    - Better error handling and logging
    - Thread-safe operations
    - Improved type hints and documentation
    """
    
    def __init__(self, client: pyrogram.Client):
        """Initialize the patched dispatcher.
        
        Args:
            client: The Pyrogram client instance
        """
        super().__init__(client)
        self._is_running = False
        self._tasks: Set[asyncio.Task] = set()
        
    async def start(self) -> None:
        """Start the dispatcher and its worker tasks."""
        if self._is_running:
            logger.warning("Dispatcher is already running")
            return
            
        self._is_running = True
        # Start multiple workers for better concurrency
        for _ in range(5):  # Configurable number of workers
            task = asyncio.create_task(self._worker())
            self._tasks.add(task)
            task.add_done_callback(self._tasks.discard)
            
    async def stop(self) -> None:
        """Stop the dispatcher and clean up resources."""
        if not self._is_running:
            return
            
        self._is_running = False
        # Signal workers to stop
        for _ in self._tasks:
            await self.updates_queue.put(None)
            
        # Wait for all tasks to complete
        if self._tasks:
            await asyncio.wait(self._tasks)
            
    async def _worker(self) -> None:
        """Worker coroutine that processes updates from the queue."""
        while self._is_running:
            try:
                packet = await self.updates_queue.get()
                if packet is None:  # Shutdown signal
                    break
                    
                await self._process_packet(packet)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.exception("Error in worker: %s", str(e))
                
    async def _process_packet(self, packet: tuple) -> None:
        """Process a single update packet.
        
        Args:
            packet: A tuple containing (update, users, chats)
        """
        update, users, chats = packet
        parser = self.update_parsers.get(type(update))
        
        if parser is None:
            return
            
        try:
            parsed_updates, handler_type = await parser(update, users, chats)
            if parsed_updates is None:
                return
                
            async with self.locks[0]:  # Use the first lock for now
                await self._process_update(update, parsed_updates, handler_type, users, chats)
                
        except Exception as e:
            logger.exception("Error processing update: %s", str(e))
            
    async def _process_update(
        self,
        update: Update,
        parsed_updates: Any,
        handler_type: Type[Handler],
        users: Dict[int, User],
        chats: Dict[int, Chat]
    ) -> None:
        """Process a single update with the appropriate handlers.
        
        Args:
            update: The raw update object
            parsed_updates: The parsed update(s)
            handler_type: The type of handler to use
            users: User dictionary from the update
            chats: Chat dictionary from the update
        """
        # Create and register the patch helper
        patch_helper = PatchHelper()
        PatchDataPool.include_helper_to_pool(parsed_updates, patch_helper)

        try:
            # Process FSM state if storage is available
            if PatchDataPool.pyrogram_patch_fsm_storage:
                await patch_helper._include_state(
                    parsed_updates,
                    PatchDataPool.pyrogram_patch_fsm_storage,
                    self.client
                )

            # Process outer middlewares
            for middleware in PatchDataPool.pyrogram_patch_outer_middlewares:
                if middleware == handler_type:
                    await self._process_middleware(
                        middleware, parsed_updates, patch_helper
                    )

            # Process handlers
            for group in self.groups.values():
                for handler in group:
                    if isinstance(handler, handler_type):
                        await self._process_handler(
                            handler, parsed_updates, patch_helper
                        )
                    elif isinstance(handler, RawUpdateHandler):
                        await self._process_raw_handler(
                            handler, update, users, chats, patch_helper
                        )

        except Exception as e:
            logger.exception("Error in update processing: %s", str(e))
        finally:
            # Clean up
            PatchDataPool.exclude_helper_from_pool(parsed_updates)
            
    async def _process_middleware(
        self,
        middleware: MiddlewareType,
        update: Any,
        patch_helper: PatchHelper
    ) -> None:
        """Process a middleware with the given update.
        
        Args:
            middleware: The middleware to process
            update: The update to process
            patch_helper: The patch helper instance
        """
        try:
            await patch_helper._process_middleware(
                update, middleware, self.client
            )
        except Exception as e:
            logger.exception("Error in middleware %s: %s", middleware.__name__, str(e))
            
    async def _process_handler(
        self,
        handler: Handler,
        parsed_updates: Any,
        patch_helper: PatchHelper
    ) -> None:
        """Process a handler with the given update.
        
        Args:
            handler: The handler to process
            parsed_updates: The parsed update(s)
            patch_helper: The patch helper instance
        """
        try:
            if await self._should_process_handler(handler, parsed_updates, patch_helper):
                await self._execute_handler(handler, parsed_updates, patch_helper)
        except Exception as e:
            logger.exception("Error in handler %s: %s", handler.callback.__name__, str(e))
            
    async def _process_raw_handler(
        self,
        handler: RawUpdateHandler,
        update: Update,
        users: Dict[int, User],
        chats: Dict[int, Chat],
        patch_helper: PatchHelper
    ) -> None:
        """Process a raw update handler.
        
        Args:
            handler: The raw update handler
            update: The raw update
            users: User dictionary
            chats: Chat dictionary
            patch_helper: The patch helper instance
        """
        try:
            await self._execute_raw_handler(handler, update, users, chats, patch_helper)
        except Exception as e:
            logger.exception("Error in raw handler: %s", str(e))
            
    async def _should_process_handler(
        self,
        handler: Handler,
        parsed_updates: Any,
        patch_helper: PatchHelper
    ) -> bool:
        """Check if a handler should process the update.
        
        Args:
            handler: The handler to check
            parsed_updates: The parsed update(s)
            patch_helper: The patch helper instance
            
        Returns:
            bool: True if the handler should process the update
        """
        try:
            return await handler.check(self.client, parsed_updates)
        except Exception as e:
            logger.exception("Error in handler check: %s", str(e))
            return False
            
    async def _execute_handler(
        self,
        handler: Handler,
        parsed_updates: Any,
        patch_helper: PatchHelper
    ) -> None:
        """Execute a handler with the given update.
        
        Args:
            handler: The handler to execute
            parsed_updates: The parsed update(s)
            patch_helper: The patch helper instance
        """
        kwargs = await patch_helper._get_data_for_handler(
            handler.callback.__code__.co_varnames
        )
        
        if inspect.iscoroutinefunction(handler.callback):
            await handler.callback(self.client, parsed_updates, **kwargs)
        else:
            # Run synchronous callbacks in executor
            await self.loop.run_in_executor(
                self.client.executor,
                handler.callback,
                self.client,
                parsed_updates,
                **kwargs
            )
            
    async def _execute_raw_handler(
        self,
        handler: RawUpdateHandler,
        update: Update,
        users: Dict[int, User],
        chats: Dict[int, Chat],
        patch_helper: PatchHelper
    ) -> None:
        """Execute a raw update handler.
        
        Args:
            handler: The raw update handler
            update: The raw update
            users: User dictionary
            chats: Chat dictionary
            patch_helper: The patch helper instance
        """
        kwargs = await patch_helper._get_data_for_handler(
            handler.callback.__code__.co_varnames
        )
        
        if inspect.iscoroutinefunction(handler.callback):
            await handler.callback(self.client, update, users, chats, **kwargs)
        else:
            # Run synchronous callbacks in executor
            await self.loop.run_in_executor(
                self.client.executor,
                handler.callback,
                self.client,
                update,
                users,
                chats,
                **kwargs
            )
