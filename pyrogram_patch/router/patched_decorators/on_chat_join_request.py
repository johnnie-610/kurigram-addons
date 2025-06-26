# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code



from typing import Callable

import pyrogram

import pyrogram_patch


class OnChatJoinRequest:
    def on_chat_join_request(self=None, filters=None, group: int = 0) -> Callable:
        """Decorator for handling chat join requests.

        This does the same thing as :meth:`~pyrogram.Client.add_handler` using the
        :obj:`~pyrogram.handlers.ChatJoinRequestHandler`.

        Parameters:
            filters (:obj:`~pyrogram.filters`, *optional*):
                Pass one or more filters to allow only a subset of updates to be passed in your function.

            group (``int``, *optional*):
                The group identifier, defaults to 0.
        """

        def decorator(func: Callable) -> Callable:
            if isinstance(self, pyrogram_patch.router.Router):
                if self._app is not None:
                    self._app.add_handler(
                        pyrogram.handlers.ChatJoinRequestHandler(func, filters), group
                    )
                else:
                    self._decorators_storage.append((pyrogram.handlers.ChatJoinRequestHandler(func, filters), group))
            else:
                raise RuntimeError(
                    "you should only use this in routers, and only as a decorator"
                )

            return func

        return decorator
