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


class OnDisconnect:
    def on_disconnect(self=None) -> Callable:
        """Decorator for handling disconnections.

        This does the same thing as :meth:`~pyrogram.Client.add_handler` using the
        :obj:`~pyrogram.handlers.DisconnectHandler`.
        """

        def decorator(func: Callable) -> Callable:
            if isinstance(self, pyrogram_patch.router.Router):
                if self._app is not None:
                    self._app.add_handler(pyrogram.handlers.DisconnectHandler(func))
                else:
                    self._decorators_storage.append(pyrogram.handlers.DisconnectHandler(func))
            else:
                raise RuntimeError(
                    "you should only use this in routers, and only as a decorator"
                )

            return func

        return decorator
