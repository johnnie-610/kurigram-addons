# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from typing import Optional, TypeVar, Union

from pyrogram.filters import Filter

from pyrogram_patch.fsm.filter import (AnyStateFilter, CombinedFilter,
                                       NoStateFilter, StateFilter)
from pyrogram_patch.router.patched_decorators.decorators import \
    PatchedDecorators

PyrogramPatchFilters = Union[
    StateFilter, NoStateFilter, AnyStateFilter, CombinedFilter
]

PyrogramFilters = TypeVar("PyrogramFilters", bound=Filter)

class Router(PatchedDecorators):
    def on_message(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling new messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_message(filters=filters.text)
            >>> async def handler(client: Client, message: Message):
            ...     print(message)

        """
        ...

    def on_edited_message(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling edited messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_edited_message(filters=filters.text)
            >>> async def handler(client: Client, message: Message):
            ...     print(message)

        """
        ...

    def on_deleted_messages(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling deleted messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_deleted_messages(filters=filters.text)
            >>> async def handler(client: Client, message: Message):
            ...     print(message)

        """
        ...

    def on_callback_query(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling callback queries.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_callback_query(filters=filters.text)
            >>> async def handler(client: Client, callback_query: CallbackQuery):
            ...     print(callback_query)

        """
        ...

    def on_chat_join_request(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling chat join requests.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_chat_join_request(filters=filters.text)
            >>> async def handler(client: Client, chat_join_request: ChatJoinRequest):
            ...     print(chat_join_request)

        """
        ...

    def on_chat_member_updated(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling chat member status changes.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_chat_member_updated(filters=filters.text)
            >>> async def handler(client: Client, chat_member_updated: ChatMemberUpdated):
            ...     print(chat_member_updated)

        """
        ...

    def on_chosen_inline_result(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling chosen inline query results.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_chosen_inline_result(filters=filters.text)
            >>> async def handler(client: Client, chosen_inline_result: ChosenInlineResult):
            ...     print(chosen_inline_result)

        """
        ...

    def on_inline_query(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling inline queries.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_inline_query(filters=filters.text)
            >>> async def handler(client: Client, inline_query: InlineQuery):
            ...     print(inline_query)

        """
        ...

    def on_poll(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling poll updates.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_poll(filters=filters.text)
            >>> async def handler(client: Client, poll: Poll):
            ...     print(poll)

        """
        ...

    def on_raw_update(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling raw Telegram updates.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_raw_update(filters=filters.text)
            >>> async def handler(client: Client, update: Update, users: Dict[int, User], chats: Dict[int, Chat]):
            ...     print(update)

        """
        ...

    def on_user_status(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling user status changes.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_user_status(filters=filters.text)
            >>> async def handler(client: Client, user: User):
            ...     print(user)

        """
        ...

    def on_business_message(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling business account messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_business_message(filters=filters.text)
            >>> async def handler(client: Client, business_message: BusinessMessage):
            ...     print(business_message)

        """
        ...

    def on_edited_business_message(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling edited business account messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_edited_business_message(filters=filters.text)
            >>> async def handler(client: Client, edited_business_message: BusinessMessage):
            ...     print(edited_business_message)

        """
        ...

    def on_deleted_business_messages(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling deleted business account messages.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_deleted_business_messages(filters=filters.text)
            >>> async def handler(client: Client, deleted_business_messages: DeletedBusinessMessages):
            ...     print(deleted_business_messages)

        """
        ...

    def on_message_reaction_count(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling message reaction count updates.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_message_reaction_count(filters=filters.text)
            >>> async def handler(client: Client, message_reaction_count: MessageReactionCount):
            ...     print(message_reaction_count)

        """
        ...

    def on_message_reaction(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling message reactions.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_message_reaction(filters=filters.text)
            >>> async def handler(client: Client, message_reaction: MessageReaction):
            ...     print(message_reaction)

        """
        ...

    def on_business_connection(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling business account connections.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_business_connection(filters=filters.text)
            >>> async def handler(client: Client, business_connection: BusinessConnection):
            ...     print(business_connection)

        """
        ...

    def on_story(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling stories.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_story(filters=filters.text)
            >>> async def handler(client: Client, story: Story):
            ...     print(story)

        """
        ...

    def on_chat_boost(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling chat boosts.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_chat_boost(filters=filters.text)
            >>> async def handler(client: Client, chat_boost: ChatBoost):
            ...     print(chat_boost)

        """
        ...

    def on_pre_checkout_query(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling pre-checkout queries.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_pre_checkout_query(filters=filters.text)
            >>> async def handler(client: Client, pre_checkout_query: PreCheckoutQuery):
            ...     print(pre_checkout_query)

        """
        ...

    def on_purchased_paid_media(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling purchased paid media.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_purchased_paid_media(filters=filters.text)
            >>> async def handler(client: Client, purchased_paid_media: PurchasedPaidMedia):
            ...     print(purchased_paid_media)

        """
        ...

    def on_shipping_query(
        self,
        filters: Optional[Union[PyrogramFilters, PyrogramPatchFilters]] = None,
        group: int = 0,
    ):
        """
        Decorator for handling shipping queries.

        Args:
            filters: Optional filters to apply to the handler.
            group: Optional group to assign to the handler. Defaults to 0.

        Examples:
            >>> @router.on_shipping_query(filters=filters.text)
            >>> async def handler(client: Client, shipping_query: ShippingQuery):
            ...     print(shipping_query)

        """
        ...

    def on_start(
        self,
    ):
        """
        Decorator for handling start events.
        """
        ...

    def on_stop(
        self,
    ):
        """
        Decorator for handling stop events.
        """
        ...

    def on_connect(
        self,
    ):
        """
        Decorator for handling connect events.
        """
        ...

    def on_disconnect(self):
        """
        Decorator for handling disconnect events.
        """
        ...
