# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


from __future__ import annotations

import logging
from typing import Any, Callable, Optional

logger = logging.getLogger("pyrogram_patch.middleware_types")


try:
    from pyrogram.handlers import (BusinessConnectionHandler,
                                   BusinessMessageHandler, CallbackQueryHandler,
                                   ChatBoostHandler, ChatJoinRequestHandler,
                                   ChatMemberUpdatedHandler,
                                   ChosenInlineResultHandler, ConnectHandler,
                                   DeletedBusinessMessagesHandler,
                                   DeletedMessagesHandler, DisconnectHandler,
                                   EditedBusinessMessageHandler,
                                   EditedMessageHandler, InlineQueryHandler,
                                   MessageHandler, MessageReactionCountHandler,
                                   MessageReactionHandler, PollHandler,
                                   PreCheckoutQueryHandler,
                                   PurchasedPaidMediaHandler, RawUpdateHandler,
                                   ShippingQueryHandler, StartHandler,
                                   StopHandler, StoryHandler, UserStatusHandler)
except Exception:  # pragma: no cover - optional dependency
    CallbackQueryHandler = object
    ChatJoinRequestHandler = object
    ChatMemberUpdatedHandler = object
    ChosenInlineResultHandler = object
    DeletedMessagesHandler = object
    EditedMessageHandler = object
    InlineQueryHandler = object
    MessageHandler = object
    PollHandler = object
    RawUpdateHandler = object
    UserStatusHandler = object
    BusinessConnectionHandler = object
    BusinessMessageHandler = object
    ChatBoostHandler = object
    DeletedBusinessMessagesHandler = object
    StartHandler = object
    StopHandler = object
    ConnectHandler = object
    DisconnectHandler = object
    EditedBusinessMessageHandler = object
    MessageReactionCountHandler = object
    MessageReactionHandler = object
    PreCheckoutQueryHandler = object
    PurchasedPaidMediaHandler = object
    ShippingQueryHandler = object
    StoryHandler = object


class BaseMiddleware:
    """Lightweight facade representing middleware that targets specific Pyrogram handler types.

    This class is a compatibility aid: old code that registered middleware by handler classes
    can instantiate these facades and register them as *around* middleware with the new manager.
    The facade's `as_around()` returns an async wrapper factory suitable for `MiddlewareManager.add_around`.
    """

    def __init__(self, *handler_types: type):
        if not handler_types:
            raise ValueError("At least one handler type must be provided")
        self._handler_types = handler_types

    def matches(self, handler: Any) -> bool:
        """Return True if a pyrogram.Handler instance/class matches any of the handler types."""
        try:
            # handler may be a Handler class or instance
            htype = getattr(handler, "__class__", handler)
            return any(
                issubclass(htype, t)
                for t in self._handler_types
                if isinstance(t, type)
            )
        except Exception:
            return False

    def as_around(self, predicate: Optional[Callable[[Any], bool]] = None):
        """Return an `around` middleware function that wraps handlers matching the target types.

        The returned function has signature: async def around(next_handler) -> wrapped_handler
        """

        def make_around(next_handler):
            async def wrapped(update):
                # Basic compatibility: do not alter update; simply call next_handler
                await next_handler(update)

            return wrapped

        return make_around


# Convenience facades for common handler groups (thin wrappers)
def OnMessageMiddleware():
    return BaseMiddleware(MessageHandler)


def OnEditedMessageMiddleware():
    return BaseMiddleware(EditedMessageHandler)


def OnCallbackQueryMiddleware():
    return BaseMiddleware(CallbackQueryHandler)


def OnInlineQueryMiddleware():
    return BaseMiddleware(InlineQueryHandler)


def OnRawUpdateMiddleware():
    return BaseMiddleware(RawUpdateHandler)


def OnPollMiddleware():
    return BaseMiddleware(PollHandler)


def OnDeletedMessagesMiddleware():
    return BaseMiddleware(DeletedMessagesHandler)


def OnChosenInlineResultMiddleware():
    return BaseMiddleware(ChosenInlineResultHandler)


def OnChatMemberUpdatedMiddleware():
    return BaseMiddleware(ChatMemberUpdatedHandler)


def OnChatJoinRequestMiddleware():
    return BaseMiddleware(ChatJoinRequestHandler)


def OnUserStatusMiddleware():
    return BaseMiddleware(UserStatusHandler)


def OnBusinessConnectionMiddleware():
    return BaseMiddleware(BusinessConnectionHandler)


def OnBusinessMessageMiddleware():
    return BaseMiddleware(BusinessMessageHandler)


def OnChatBoostMiddleware():
    return BaseMiddleware(ChatBoostHandler)


def OnDeletedBusinessMessagesMiddleware():
    return BaseMiddleware(DeletedBusinessMessagesHandler)


def OnStartMiddleware():
    return BaseMiddleware(StartHandler)


def OnStopMiddleware():
    return BaseMiddleware(StopHandler)


def OnConnectMiddleware():
    return BaseMiddleware(ConnectHandler)


def OnDisconnectMiddleware():
    return BaseMiddleware(DisconnectHandler)


def OnEditedBusinessMessageMiddleware():
    return BaseMiddleware(EditedBusinessMessageHandler)


def OnMessageReactionCountMiddleware():
    return BaseMiddleware(MessageReactionCountHandler)


def OnMessageReactionMiddleware():
    return BaseMiddleware(MessageReactionHandler)


def OnPreCheckoutQueryMiddleware():
    return BaseMiddleware(PreCheckoutQueryHandler)


def OnPurchasedPaidMediaMiddleware():
    return BaseMiddleware(PurchasedPaidMediaHandler)


def OnShippingQueryMiddleware():
    return BaseMiddleware(ShippingQueryHandler)


def OnStoryMiddleware():
    return BaseMiddleware(StoryHandler)


class MixedMiddleware(BaseMiddleware):
    # TODO: implement
    pass
