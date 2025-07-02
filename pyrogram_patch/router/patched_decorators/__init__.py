# SPDX-License-Identifier: MIT

# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

"""
Patched decorators module for Pyrogram.

This module provides a collection of decorator classes that can be used to handle
various Telegram events in a more Pythonic way. These decorators are designed to
work with the Pyrogram framework and provide a clean interface for registering
event handlers.
"""

from typing import Type

# Import all handler classes
from .on_callback_query import OnCallbackQuery
from .on_chat_join_request import OnChatJoinRequest
from .on_chat_member_updated import OnChatMemberUpdated
from .on_chosen_inline_result import OnChosenInlineResult
from .on_deleted_messages import OnDeletedMessages
from .on_disconnect import OnDisconnect
from .on_edited_message import OnEditedMessage
from .on_inline_query import OnInlineQuery
from .on_message import OnMessage
from .on_poll import OnPoll
from .on_raw_update import OnRawUpdate
from .on_user_status import OnUserStatus

__all__ = [
    'PatchedDecorators',
    'OnCallbackQuery',
    'OnChatJoinRequest',
    'OnChatMemberUpdated',
    'OnChosenInlineResult',
    'OnDeletedMessages',
    'OnDisconnect',
    'OnEditedMessage',
    'OnInlineQuery',
    'OnMessage',
    'OnPoll',
    'OnRawUpdate',
    'OnUserStatus'
]


class PatchedDecorators(
    OnMessage,
    OnEditedMessage,
    OnDeletedMessages,
    OnCallbackQuery,
    OnRawUpdate,
    OnDisconnect,
    OnUserStatus,
    OnInlineQuery,
    OnPoll,
    OnChosenInlineResult,
    OnChatMemberUpdated,
    OnChatJoinRequest,
):
    """
    A composite class that combines all available Pyrogram event decorators.
    
    This class provides a single interface to access all Pyrogram event decorators
    through multiple inheritance. It's designed to be used as a mixin class in
    custom router implementations.
    
    Example:
        ```python
        from pyrogram import Client
        from pyrogram_patch.router import Router
        from pyrogram_patch.router.patched_decorators import PatchedDecorators
        
        class MyRouter(Router, PatchedDecorators):
            pass
            
        router = MyRouter()
        
        @router.on_message()
        async def handle_message(client, message):
            print(f"Received message: {message.text}")
        ```
    """
    __slots__ = ()  # Prevent creation of __dict__ for memory efficiency
