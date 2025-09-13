# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Decorators module for Pyrogram event handling.
#
# This module provides the PatchedDecorators class that dynamically generates
# decorator methods for all Pyrogram event types using a clean factory pattern.


import logging
from typing import Dict, Tuple

from pyrogram_patch.router.patched_decorators.factory import \
    create_decorator_method

logger = logging.getLogger("pyrogram_patch.router.patched_decorators")

__all__ = ["PatchedDecorators"]

# Handler configuration mapping
HANDLER_CONFIGS: Dict[str, Tuple[str, str, str, str, str]] = {
    "message": (
        "MessageHandler",
        "new messages",
        "client: Client, message: Message",
        "message",
        "Message",
    ),
    "edited_message": (
        "EditedMessageHandler",
        "edited messages",
        "client: Client, message: Message",
        "message",
        "Message",
    ),
    "deleted_messages": (
        "DeletedMessagesHandler",
        "deleted messages",
        "client: Client, deleted_messages: DeletedMessages",
        "deleted_messages",
        "DeletedMessages",
    ),
    "callback_query": (
        "CallbackQueryHandler",
        "callback queries from inline keyboards",
        "client: Client, callback_query: CallbackQuery",
        "callback_query",
        "CallbackQuery",
    ),
    "chat_join_request": (
        "ChatJoinRequestHandler",
        "chat join requests",
        "client: Client, chat_join_request: ChatJoinRequest",
        "chat_join_request",
        "ChatJoinRequest",
    ),
    "chat_member_updated": (
        "ChatMemberUpdatedHandler",
        "chat member status updates",
        "client: Client, chat_member_updated: ChatMemberUpdated",
        "chat_member_updated",
        "ChatMemberUpdated",
    ),
    "chosen_inline_result": (
        "ChosenInlineResultHandler",
        "chosen inline query results",
        "client: Client, chosen_inline_result: ChosenInlineResult",
        "chosen_inline_result",
        "ChosenInlineResult",
    ),
    "inline_query": (
        "InlineQueryHandler",
        "inline queries",
        "client: Client, inline_query: InlineQuery",
        "inline_query",
        "InlineQuery",
    ),
    "poll": (
        "PollHandler",
        "poll updates",
        "client: Client, poll: Poll",
        "poll",
        "Poll",
    ),
    "raw_update": (
        "RawUpdateHandler",
        "raw Telegram updates",
        "client: Client, update: Update, users: Dict[int, User], chats: Dict[int, Chat]",
        "update",
        "Update",
    ),
    "user_status": (
        "UserStatusHandler",
        "user status changes",
        "client: Client, user: User",
        "user",
        "User",
    ),
    "business_message": (
        "BusinessMessageHandler",
        "business account messages",
        "client: Client, business_message: BusinessMessage",
        "business_message",
        "BusinessMessage",
    ),
    "edited_business_message": (
        "EditedBusinessMessageHandler",
        "edited business messages",
        "client: Client, edited_business_message: BusinessMessage",
        "edited_business_message",
        "BusinessMessage",
    ),
    "deleted_business_messages": (
        "DeletedBusinessMessagesHandler",
        "deleted business messages",
        "client: Client, deleted_business_messages: DeletedBusinessMessages",
        "deleted_business_messages",
        "DeletedBusinessMessages",
    ),
    "message_reaction_count": (
        "MessageReactionCountHandler",
        "message reaction count updates",
        "client: Client, message_reaction_count: MessageReactionCount",
        "message_reaction_count",
        "MessageReactionCount",
    ),
    "message_reaction": (
        "MessageReactionHandler",
        "message reaction updates",
        "client: Client, message_reaction: MessageReaction",
        "message_reaction",
        "MessageReaction",
    ),
    "business_connection": (
        "BusinessConnectionHandler",
        "business connection updates",
        "client: Client, business_connection: BusinessConnection",
        "business_connection",
        "BusinessConnection",
    ),
    "story": (
        "StoryHandler",
        "story updates",
        "client: Client, story: Story",
        "story",
        "Story",
    ),
    "chat_boost": (
        "ChatBoostHandler",
        "chat boost notifications",
        "client: Client, chat_boost: ChatBoost",
        "chat_boost",
        "ChatBoost",
    ),
    "pre_checkout_query": (
        "PreCheckoutQueryHandler",
        "pre-checkout queries for payments",
        "client: Client, pre_checkout_query: PreCheckoutQuery",
        "pre_checkout_query",
        "PreCheckoutQuery",
    ),
    "purchased_paid_media": (
        "PurchasedPaidMediaHandler",
        "purchased paid media notifications",
        "client: Client, purchased_paid_media: PurchasedPaidMedia",
        "purchased_paid_media",
        "PurchasedPaidMedia",
    ),
    "shipping_query": (
        "ShippingQueryHandler",
        "shipping queries for payments",
        "client: Client, shipping_query: ShippingQuery",
        "shipping_query",
        "ShippingQuery",
    ),
    # Client lifecycle events
    "start": (
        "StartHandler",
        "client start events",
        "client: Client",
        "client",
        "Client",
    ),
    "stop": (
        "StopHandler",
        "client stop events",
        "client: Client",
        "client",
        "Client",
    ),
    "connect": (
        "ConnectHandler",
        "client connection events",
        "client: Client",
        "client",
        "Client",
    ),
    "disconnect": (
        "DisconnectHandler",
        "client disconnection events",
        "client: Client",
        "client",
        "Client",
    ),
}


class PatchedDecoratorsMeta(type):
    """Metaclass that dynamically creates decorator methods for all Pyrogram events."""

    def __new__(mcs, name: str, bases: tuple, namespace: dict) -> type:
        # Generate decorator methods for each handler configuration
        for event_key, config in HANDLER_CONFIGS.items():
            (
                handler_class_name,
                description,
                signature,
                param_name,
                type_name,
            ) = config

            # Create the decorator method
            method = create_decorator_method(
                handler_class_name=handler_class_name,
                event_description=description,
                callback_signature=signature,
                event_parameter=param_name,
                event_type=type_name,
            )

            # Add to class namespace
            method_name = f"on_{event_key}"
            namespace[method_name] = method

        return super().__new__(mcs, name, bases, namespace)


class PatchedDecorators(metaclass=PatchedDecoratorsMeta):
    """Base class providing all Pyrogram event decorators.

    This class automatically generates decorator methods for all supported Pyrogram
    events through metaclass magic. Each decorator method follows the pattern:
    `on_{event_name}(filters=None, group=0)`.

    Available decorators:
        - on_message(): Handle new messages
        - on_edited_message(): Handle message edits
        - on_deleted_messages(): Handle message deletions
        - on_callback_query(): Handle inline keyboard callbacks
        - on_chat_join_request(): Handle chat join requests
        - on_chat_member_updated(): Handle member status changes
        - on_chosen_inline_result(): Handle chosen inline results
        - on_inline_query(): Handle inline queries
        - on_poll(): Handle poll updates
        - on_raw_update(): Handle raw Telegram updates
        - on_user_status(): Handle user status changes
        - on_business_message(): Handle business messages
        - on_edited_business_message(): Handle edited business messages
        - on_deleted_business_messages(): Handle deleted business messages
        - on_message_reaction_count(): Handle reaction count updates
        - on_message_reaction(): Handle reaction updates
        - on_business_connection(): Handle business connections
        - on_story(): Handle story updates
        - on_chat_boost(): Handle chat boosts
        - on_pre_checkout_query(): Handle payment pre-checkout queries
        - on_purchased_paid_media(): Handle paid media purchases
        - on_shipping_query(): Handle payment shipping queries
        - on_start(): Handle client start events
        - on_stop(): Handle client stop events
        - on_connect(): Handle client connection events
        - on_disconnect(): Handle client disconnection events

    Example:
        .. code-block:: python

            from pyrogram_patch.router import Router

            router = Router()

            @router.on_message(filters=filters.text)
            async def handle_text_message(client, message):
                await message.reply("Hello!")

            @router.on_callback_query()
            async def handle_callback(client, callback_query):
                await callback_query.answer("Button clicked!")
    """

    def __init_subclass__(cls, **kwargs):
        """Ensure proper inheritance of decorator methods."""
        super().__init_subclass__(**kwargs)

    @classmethod
    def get_supported_events(cls) -> list[str]:
        """Get list of all supported event types.

        Returns:
            List of event names that have decorators available
        """
        return list(HANDLER_CONFIGS.keys())

    @classmethod
    def get_event_info(cls, event_name: str) -> dict:
        """Get information about a specific event type.

        Args:
            event_name: Name of the event (e.g., 'message', 'callback_query')

        Returns:
            Dictionary with event information

        Raises:
            KeyError: If event_name is not supported
        """
        if event_name not in HANDLER_CONFIGS:
            raise KeyError(f"Unknown event type: {event_name}")

        handler_class, description, signature, param_name, type_name = (
            HANDLER_CONFIGS[event_name]
        )

        return {
            "handler_class": handler_class,
            "description": description,
            "callback_signature": signature,
            "parameter_name": param_name,
            "type_name": type_name,
            "decorator_name": f"on_{event_name}",
        }
