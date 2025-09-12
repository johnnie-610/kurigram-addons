import inspect
import logging
from contextlib import suppress
from typing import Union

import pyrogram
from pyrogram.dispatcher import Dispatcher, log
from pyrogram.handlers import RawUpdateHandler
from .patch_data_pool import PatchDataPool, initialize_global_pool
from pyrogram_patch.fsm import BaseStorage
from pyrogram_patch.middlewares import PatchHelper

logger = logging.getLogger("pyrogram_patch.dispatcher")

class PatchedDispatcher(Dispatcher):
    def __init__(self, client: pyrogram.Client):
        super().__init__(client)
        self._client = client
        # Initialize pool access
        self.pool = None

    async def handler_worker(self, lock):
        # Ensure pool is initialized
        if self.pool is None:
            self.pool = await initialize_global_pool(self._client)

        while True:
            packet = await self.updates_queue.get()

            if packet is None:
                break

            try:
                update, users, chats = packet
                parser = self.update_parsers.get(type(update), None)

                parsed_updates, handler_type = (
                    await parser(update, users, chats)
                    if parser is not None
                    else (None, type(None))
                )

                if parsed_updates is None:
                    continue

                patch_helper = PatchHelper()
                await self.pool.include_helper_to_pool(update=parsed_updates, helper=patch_helper)

                if self.pool.pyrogram_patch_fsm_storage:
                    await patch_helper._include_state(
                        parsed_updates, self.pool.pyrogram_patch_fsm_storage, self._client
                    )

                # process outer middlewares
                for middleware in self.pool.pyrogram_patch_outer_middlewares:
                    if middleware == handler_type:
                        await patch_helper._process_middleware(
                            parsed_updates, middleware, self._client
                        )

                async with lock:
                    for group in self.groups.values():
                        for handler in group:
                            args = None

                            if isinstance(handler, handler_type):
                                try:
                                    # filtering event
                                    if await handler.check(self._client, parsed_updates):
                                        # process middlewares
                                        for middleware in self.pool.pyrogram_patch_middlewares:
                                            if middleware == type(handler):
                                                await patch_helper._process_middleware(
                                                    parsed_updates,
                                                    middleware,
                                                    self._client,
                                                )
                                        args = (parsed_updates,)
                                except Exception as e:
                                    log.exception(e)
                                    await self.pool.exclude_helper_from_pool(parsed_updates, self._client)
                                    continue

                            elif isinstance(handler, RawUpdateHandler):
                                try:
                                    # process middlewares
                                    for middleware in self.pool.pyrogram_patch_middlewares:
                                        if middleware == type(handler):
                                            await patch_helper._process_middleware(
                                                    parsed_updates,
                                                    middleware,
                                                    self._client,
                                                )
                                    args = (update, users, chats)
                                except pyrogram.StopPropagation:
                                    await self.pool.exclude_helper_from_pool(parsed_updates, self._client)
                                    continue
                            if args is None:
                                continue

                            try:
                                # formation kwargs - using fixed signature processing
                                kwargs = await patch_helper._get_data_for_handler(
                                    handler.callback
                                )
                                if inspect.iscoroutinefunction(handler.callback):
                                    await handler.callback(self.client, *args, **kwargs)
                                else:
                                    args_list = list(args)
                                    for v in kwargs.values():
                                        args_list.append(v)
                                    final_args = tuple(args_list)
                                    await self.loop.run_in_executor(
                                        self.client.executor,
                                        handler.callback,
                                        self.client,
                                        *final_args
                                    )
                            except pyrogram.StopPropagation:
                                raise
                            except pyrogram.ContinuePropagation:
                                continue
                            except Exception as e:
                                log.exception(e)
                            finally:
                                await self.pool.exclude_helper_from_pool(parsed_updates, self._client)
                            break
                    await self.pool.exclude_helper_from_pool(parsed_updates, self._client)
            except pyrogram.StopPropagation:
                pass
            except Exception as e:
                log.exception(e)