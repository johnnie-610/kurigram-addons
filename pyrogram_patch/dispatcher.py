# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


import inspect
import logging
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
        self._client = client
        # Initialize pool access
        self.pool = None

    async def handler_worker(self, lock):
        """Process update packets using either patched or plain handling."""

        if self.pool is None:
            self.pool = await initialize_global_pool(self._client)

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

                if parsed_update is None:
                    continue

                patch_helper: Optional[PatchHelper] = None
                helper_in_pool = False

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
                                        patch_helper = await self._prepare_patch_helper(
                                            parsed_update, handler_type
                                        )
                                        helper_in_pool = patch_helper is not None

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
                                    type(parsed_update).__name__,
                                    cb_exc,
                                )
                                notified = await self._handle_circuit_breaker_failure(
                                    parsed_update, cb_exc
                                )
                                if helper_in_pool and patch_helper is not None:
                                    await self.pool.exclude_helper_from_pool(
                                        parsed_update, self._client
                                    )
                                    helper_in_pool = False

                                handled = notified
                                break
                            except Exception as e:
                                log.exception(e)
                                continue

                            if handled:
                                break

                        if handled:
                            break

                if helper_in_pool and patch_helper is not None:
                    await self.pool.exclude_helper_from_pool(
                        parsed_update, self._client
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

        if getattr(callback, "__pyrogram_patch_requires_helper__", False):
            return True

        middlewares: Iterable[Any] = getattr(
            self.pool, "pyrogram_patch_middlewares", []
        )
        for middleware in middlewares:
            if middleware in (handler_type, type(handler)):
                return True

        outer_middlewares: Iterable[Any] = getattr(
            self.pool, "pyrogram_patch_outer_middlewares", []
        )
        for middleware in outer_middlewares:
            if middleware == handler_type:
                return True

        try:
            signature = inspect.signature(callback)
        except (TypeError, ValueError):
            return False

        parameters = signature.parameters

        if "patch_helper" in parameters:
            return True

        if "state" in parameters and self.pool.pyrogram_patch_fsm_storage:
            return True

        return False

    async def _prepare_patch_helper(
        self, parsed_update, handler_type: type
    ) -> Optional[PatchHelper]:
        """Create and register a PatchHelper for the current update."""

        try:
            patch_helper = PatchHelper()
            await self.pool.include_helper_to_pool(
                update=parsed_update, helper=patch_helper, client=self._client
            )

            if self.pool.pyrogram_patch_fsm_storage:
                await patch_helper._include_state(
                    parsed_update,
                    self.pool.pyrogram_patch_fsm_storage,
                    self._client,
                )

            for middleware in getattr(
                self.pool, "pyrogram_patch_outer_middlewares", []
            ):
                if middleware == handler_type:
                    await patch_helper._process_middleware(
                        parsed_update, middleware, self._client
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
        """Execute a handler with patch-helper enhancements."""

        args: Optional[tuple] = None

        if isinstance(handler, handler_type):
            try:
                if not await handler.check(self._client, parsed_update):
                    return False

                await self._process_inner_middlewares(
                    handler, parsed_update, patch_helper
                )
                args = (parsed_update,)
            except Exception as e:
                log.exception(e)
                return False
        elif isinstance(handler, RawUpdateHandler):
            try:
                if not await handler.check(self._client, update):
                    return False

                await self._process_inner_middlewares(
                    handler, parsed_update, patch_helper
                )
                args = (update, users, chats)
            except Exception as e:
                log.exception(e)
                return False
        else:
            return False

        try:
            kwargs: Dict[str, Any] = await patch_helper._get_data_for_handler(
                handler.callback
            )

            if inspect.iscoroutinefunction(handler.callback):
                await handler.callback(self.client, *args, **kwargs)
            else:
                final_args = args + tuple(kwargs.values())
                await self.client.loop.run_in_executor(
                    self.client.executor,
                    handler.callback,
                    self.client,
                    *final_args,
                )
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

    async def _process_inner_middlewares(
        self, handler, parsed_update, patch_helper: PatchHelper
    ) -> None:
        """Run inner middlewares for a handler if any are registered."""

        for middleware in getattr(self.pool, "pyrogram_patch_middlewares", []):
            if middleware in (type(handler), handler):
                await patch_helper._process_middleware(
                    parsed_update, middleware, self._client
                )

    async def _handle_circuit_breaker_failure(
        self, parsed_update, exc: CircuitBreakerOpenException
    ) -> bool:
        """Notify end users when a circuit breaker prevents handler execution."""

        fallback = get_config().circuit_breaker.fallback_message.strip()
        if not fallback:
            return False

        notified = False

        try:
            if isinstance(parsed_update, Message):
                chat = getattr(parsed_update, "chat", None)
                chat_id = getattr(chat, "id", None)
                if chat_id is not None:
                    await self.client.send_message(chat_id, fallback)
                    notified = True

            if isinstance(parsed_update, CallbackQuery):
                try:
                    await parsed_update.answer(fallback, show_alert=True)
                except TypeError:
                    await parsed_update.answer(fallback)
                notified = True
            elif not notified:
                message = getattr(parsed_update, "message", None)
                if message is not None:
                    chat = getattr(message, "chat", None)
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
