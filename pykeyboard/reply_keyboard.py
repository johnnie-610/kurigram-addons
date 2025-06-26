# Copyright (c) 2025 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
# 
# This file is part of the pykeyboard-kurigram library
# 
# pykeyboard/reply_keyboard.py

from dataclasses import dataclass
from pyrogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardRemove,
    ForceReply,
    KeyboardButtonPollType,
    KeyboardButtonRequestUsers,
    KeyboardButtonRequestChat,
    WebAppInfo,
)
from .keyboard_base import KeyboardBase, Button


@dataclass
class ReplyKeyboard(ReplyKeyboardMarkup, KeyboardBase):
    is_persistent: bool | None = None
    resize_keyboard: bool | None = None
    one_time_keyboard: bool | None = None
    selective: bool | None = None
    placeholder: str | None = None

    def __post_init__(self):
        super().__init__(
            keyboard=self.keyboard,
            is_persistent=self.is_persistent,
            resize_keyboard=self.resize_keyboard,
            one_time_keyboard=self.one_time_keyboard,
            selective=self.selective,
            placeholder=self.placeholder,
        )
    
    def _update_keyboard(self):
        """Update the underlying ReplyKeyboardMarkup keyboard"""
        # Update the inline_keyboard attribute that Pyrogram uses
        if hasattr(self, 'keyboard'):
            object.__setattr__(self, 'keyboard', self.keyboard)


@dataclass
class ReplyButton(KeyboardButton, Button):
    request_contact: bool | None = None
    request_location: bool | None = None
    request_poll: KeyboardButtonPollType | None = None
    request_users: KeyboardButtonRequestUsers | None = None
    request_chat: KeyboardButtonRequestChat | None = None
    web_app: WebAppInfo | None = None

    def __post_init__(self):
        Button.__post_init__(self)
        # Fix: Use direct initialization instead of super() chain
        KeyboardButton.__init__(
            self,
            text=self.text,
            request_contact=self.request_contact,
            request_location=self.request_location,
            request_poll=self.request_poll,
            request_users=self.request_users,
            request_chat=self.request_chat,
            web_app=self.web_app,
        )


@dataclass
class PyReplyKeyboardRemove(ReplyKeyboardRemove):
    selective: bool | None = None

    def __post_init__(self):
        super().__init__(selective=self.selective)


@dataclass
class PyForceReply(ForceReply):
    selective: bool | None = None
    placeholder: str | None = None

    def __post_init__(self):
        super().__init__(selective=self.selective, placeholder=self.placeholder)