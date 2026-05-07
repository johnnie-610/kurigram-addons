# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


import inspect
import logging
import time
from typing import Any, Dict, Iterable, Optional

import pyrogram
from pyrogram.dispatcher import Dispatcher, log
from pyrogram.handlers import RawUpdateHandler
from pyrogram.types import CallbackQuery, Message

from pyrogram_patch.middlewares import PatchHelper

from .circuit_breaker import CircuitBreakerOpenException
from .config import get_config
from .patch_data_pool import initialize_global_pool

logger = logging.getLogger("pyrogram_patch.dispatcher")


class PatchedDispatcher(Dispatcher):
    def __init__(self, client: pyrogram.Client):
        super().__init__(client)
        # Initialize pool access
        self.pool = None

    async def start(self) -> None:
        """Override start to trigger startup hooks."""
        if self.pool is None:
            self.pool = await initialize_global_pool(self.client)
        
        await self.pool.trigger_event("startup")
        await super().start()

    async def stop(self, clear_handlers: bool = True) -> None:
        """Override stop to trigger shutdown hooks."""
        if self.pool:
            await self.pool.trigger_event("shutdown")
        await super().stop(clear_handlers=clear_handlers)

    async def handler_worker(self, lock):
        """Process update packets using either patched or plain handling."""

        if self.pool is None:
            self.pool = await initialize_global_pool(self.client)

        while True:
            packet = await self.updates_queue.get()

            if packet is None:
                break

            try:
                update, users, chats = packet
                parser = self.update_parsers.get(type(update))

                parsed_update, handler_type = (
                    await parser(update, users, chats)
                    if parser is not None
                    else (None, type(None))
                )

                # Preparation phase (concurrency optimization)
                # We prepare the helper outside the lock if we might need it.
                # If there are no middlewares and no handler needs it, we skip it.
                # However, to avoid double-calculating requires_patch, we just 
                # check if middlewares exist.
                
                patch_helper: Optional[PatchHelper] = None
                if self.pool._middleware_manager.has_middlewares:
                    patch_helper = await self._prepare_patch_helper(
                        parsed_update, handler_type
                    )

                async with lock:
                    handled = False

                    for group in self.groups.values():
                        for handler in group:
                            try:
                                use_patch = self._handler_requires_patch_features(
                                    handler, handler_type
                                )

                                if use_patch:
                                    if patch_helper is None:
                                        # Lazy initialization if not already prepared
                                        patch_helper = await self._prepare_patch_helper(
                                            parsed_update, handler_type
                                        )

                                    if patch_helper is None:
                                        continue

                                    handled = await self._execute_with_patch(
                                        handler,
                                        parsed_update,
                                        update,
                                        users,
                                        chats,
                                        handler_type,
                                        patch_helper,
                                    )
                                else:
                                    handled = await self._execute_plain(
                                        handler,
                                        parsed_update,
                                        update,
                                        users,
                                        chats,
                                        handler_type,
                                    )
                            except pyrogram.ContinuePropagation:
                                continue
                            except pyrogram.StopPropagation:
                                raise
                            except CircuitBreakerOpenException as cb_exc:
                                log.warning(
                                    "Circuit breaker open while handling %s: %s",
                                    type(parsed_update).__name__ if parsed_update else "RawUpdate",
                                    cb_exc,
                                )
                                notified = await self._handle_circuit_breaker_failure(
                                    parsed_update or update, cb_exc
                                )
                                if patch_helper is not None:
                                    await self.pool.exclude_helper_from_pool(
                                        parsed_update or update, self.client
                                    )

                                handled = notified
                                break
                            except Exception as e:
                                log.exception(e)
                                continue

                            if handled:
                                break

                        if handled:
                            break

                if patch_helper is not None:
                    await self.pool.exclude_helper_from_pool(
                        parsed_update or update, self.client
                    )

            except pyrogram.StopPropagation:
                pass
            except Exception as e:
                log.exception(e)

    def _handler_requires_patch_features(
        self, handler, handler_type: type
    ) -> bool:
        """Determine whether a handler should be executed with patch features."""

        callback = handler.callback
        
        # Check for cached result or explicit flag
        requires_helper = getattr(callback, "__pyrogram_patch_requires_helper__", None)
        if requires_helper is not None:
            return requires_helper

        # If there are global middlewares, the answer is always yes for now
        # because middlewares might need the helper/state.
        if self.pool._middleware_manager.has_middlewares:
            # We don't cache this strictly because middlewares might be added/removed
            # (though normally they are static after setup)
            return True

        try:
            signature = inspect.signature(callback)
            parameters = signature.parameters
            
            result = False
            if "patch_helper" in parameters:
                result = True
            elif "state" in parameters and self.pool.pyrogram_patch_fsm_storage:
                result = True
            
            # Cache the result for next time
            try:
                callback.__pyrogram_patch_requires_helper__ = result
            except (AttributeError, TypeError):
                # Fallback if we can't set attribute (e.g. some built-ins or slots)
                pass
                
            return result
        except (TypeError, ValueError):
            return False

    async def _prepare_patch_helper(
        self, parsed_update, handler_type: type
    ) -> Optional[PatchHelper]:
        """Create and register a PatchHelper for the current update."""

        try:
            patch_helper = PatchHelper()
            # Record receipt timestamp for latency analysis
            await patch_helper.update_data(__received_at__=time.time())
            
            await self.pool.include_helper_to_pool(
                update=parsed_update, helper=patch_helper, client=self.client
            )

            if self.pool.pyrogram_patch_fsm_storage:
                await patch_helper._include_state(
                    parsed_update,
                    self.pool.pyrogram_patch_fsm_storage,
                    self.client,
                )

            return patch_helper
        except Exception as e:  # pragma: no cover - defensive logging
            log.exception(e)
            return None

    async def _execute_with_patch(
        self,
        handler,
        parsed_update,
        update,
        users,
        chats,
        handler_type: type,
        patch_helper: PatchHelper,
    ) -> bool:
        """Execute a handler with patch-helper enhancements inside the middleware chain."""

        if isinstance(handler, handler_type):
            update_to_check = parsed_update
        elif isinstance(handler, RawUpdateHandler):
            update_to_check = update
        else:
            return False

        try:
            if not await handler.check(self.client, update_to_check):
                return False

            # Run per-handler middleware chain first.
            # These are middlewares attached directly to the handler function
            # via @use_middleware(...) — they execute before the global chain.
            from pyrogram_patch.middlewares.per_handler import run_handler_middlewares
            await run_handler_middlewares(
                handler.callback, parsed_update, self.client, patch_helper
            )

            # Wrap the remaining execution in the global middleware chain
            chain_executor = self.pool._middleware_manager.wrap_handler(
                handler.callback,
                parsed_update,
                self.client,
                patch_helper
            )

            kwargs = await patch_helper._get_data_for_handler(handler.callback)

            # Merge DI-injected dependencies if a container is attached
            di_container = getattr(self.client, "_di_container", None)
            if di_container is not None:
                try:
                    di_kwargs = await di_container.inject(
                        handler.callback, parsed_update, self.client, patch_helper
                    )
                    kwargs.update(di_kwargs)
                except Exception as di_exc:
                    log.warning("DI injection failed: %s", di_exc)

            # The chain returns the result of the handler
            await chain_executor(**kwargs)

        except pyrogram.StopPropagation:
            raise
        except pyrogram.ContinuePropagation:
            return False
        except Exception as e:
            log.exception(e)
            return False

        return True

    async def _execute_plain(
        self,
        handler,
        parsed_update,
        update,
        users,
        chats,
        handler_type: type,
    ) -> bool:
        """Execute a handler using vanilla Pyrogram behaviour."""

        args: Optional[tuple] = None

        if isinstance(handler, handler_type):
            try:
                if await handler.check(self.client, parsed_update):
                    args = (parsed_update,)
            except Exception as e:
                log.exception(e)
                return False
        elif isinstance(handler, RawUpdateHandler):
            try:
                if await handler.check(self.client, update):
                    args = (update, users, chats)
            except Exception as e:
                log.exception(e)
                return False
        else:
            return False

        if args is None:
            return False

        try:
            if inspect.iscoroutinefunction(handler.callback):
                await handler.callback(self.client, *args)
            else:
                await self.client.loop.run_in_executor(
                    self.client.executor,
                    handler.callback,
                    self.client,
                    *args,
                )
        except pyrogram.StopPropagation:
            raise
        except pyrogram.ContinuePropagation:
            return False
        except Exception as e:
            log.exception(e)
            return False

        return True

    async def _handle_circuit_breaker_failure(
        self, parsed_update, exc: CircuitBreakerOpenException
    ) -> bool:
        """Notify end users when a circuit breaker prevents handler execution."""

        fallback = get_config().circuit_breaker.fallback_message.strip()
        if not fallback:
            return False

        notified = False

        try:
            # Try to handle as Message
            if isinstance(parsed_update, Message):
                chat = getattr(parsed_update, "chat", None)
                chat_id = getattr(chat, "id", None)
                if chat_id is not None:
                    await self.client.send_message(chat_id, fallback)
                    notified = True

            # Try to handle as CallbackQuery
            if isinstance(parsed_update, CallbackQuery):
                try:
                    await parsed_update.answer(fallback, show_alert=True)
                except TypeError:
                    await parsed_update.answer(fallback)
                notified = True
            
            # Try to handle via message attribute (e.g. EditedMessage)
            elif not notified:
                message = getattr(parsed_update, "message", None)
                if message is not None:
                    chat = getattr(message, "chat", None)
                    chat_id = getattr(chat, "id", None)
                    if chat_id is not None:
                        await self.client.send_message(chat_id, fallback)
                        notified = True

            # Fallback: duck typing for chat attribute (for custom updates or tests)
            if not notified:
                chat = getattr(parsed_update, "chat", None)
                chat_id = getattr(chat, "id", None)
                if chat_id is not None:
                    await self.client.send_message(chat_id, fallback)
                    notified = True

        except Exception as notify_error:  # pragma: no cover - defensive
            logger.warning(
                "Failed to deliver circuit breaker notification: %s",
                notify_error,
            )

        return notified
