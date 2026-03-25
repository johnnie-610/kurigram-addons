# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Test helpers for kurigram-addons bots.

Provides factory functions for creating mock Pyrogram objects so you can
unit-test handlers, conversations, and middleware without hitting Telegram's
API.

Example::

    import pytest
    from kurigram_addons.testing import make_message, make_callback_query, MockClient

    @pytest.mark.asyncio
    async def test_start_handler():
        client = MockClient()
        message = make_message(text="/start", user_id=123, chat_id=456)

        await start_handler(client, message)

        assert client.sent[0]["text"] == "Hello!"

Usage with Conversation flows::

    from kurigram_addons.testing import ConversationTester

    async def test_registration():
        tester = ConversationTester(Registration)
        ctx = await tester.start(user_id=1, chat_id=1)
        assert tester.current_state == "Registration:name"

        ctx = await tester.send_message("Alice")
        assert tester.current_state == "Registration:age"
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from unittest.mock import AsyncMock, MagicMock


# ── Low-level mock builders ──────────────────────────────────────────────────

def make_user(
    user_id: int = 1,
    first_name: str = "Test",
    last_name: str = "User",
    username: str = "testuser",
    is_bot: bool = False,
) -> MagicMock:
    """Create a mock Pyrogram User object."""
    user = MagicMock()
    user.id = user_id
    user.first_name = first_name
    user.last_name = last_name
    user.username = username
    user.is_bot = is_bot
    user.full_name = f"{first_name} {last_name}".strip()
    user.mention = f"@{username}"
    user.language_code = "en"
    return user


def make_chat(
    chat_id: int = 100,
    chat_type: str = "private",
    title: Optional[str] = None,
    username: Optional[str] = None,
) -> MagicMock:
    """Create a mock Pyrogram Chat object."""
    chat = MagicMock()
    chat.id = chat_id
    chat.type = chat_type
    chat.title = title or f"Chat {chat_id}"
    chat.username = username
    return chat


def make_message(
    text: str = "",
    *,
    message_id: int = 1,
    user_id: int = 1,
    chat_id: int = 100,
    chat_type: str = "private",
    date: Optional[float] = None,
    caption: Optional[str] = None,
    **kwargs: Any,
) -> MagicMock:
    """Create a mock Pyrogram Message object.

    Args:
        text: Message text.
        message_id: Message ID (default: 1).
        user_id: Sender user ID (default: 1).
        chat_id: Chat ID (default: 100).
        chat_type: Chat type string (default: ``"private"``).
        date: Unix timestamp (defaults to now).
        caption: Optional photo/document caption.
        **kwargs: Extra attributes set on the mock.

    Returns:
        A ``MagicMock`` shaped like a Pyrogram ``Message``.
    """
    msg = MagicMock()
    msg.id = message_id
    msg.message_id = message_id
    msg.text = text
    msg.caption = caption
    msg.date = date or time.time()
    msg.from_user = make_user(user_id=user_id)
    msg.chat = make_chat(chat_id=chat_id, chat_type=chat_type)
    msg.reply = AsyncMock(return_value=None)
    msg.reply_text = AsyncMock(return_value=None)
    msg.delete = AsyncMock(return_value=True)
    msg.pin = AsyncMock(return_value=True)
    for k, v in kwargs.items():
        setattr(msg, k, v)
    return msg


def make_callback_query(
    data: str = "test_data",
    *,
    query_id: str = "cq_1",
    user_id: int = 1,
    chat_id: int = 100,
    message_text: str = "button message",
    **kwargs: Any,
) -> MagicMock:
    """Create a mock Pyrogram CallbackQuery object.

    Args:
        data: Callback data string.
        query_id: Query ID string (default: ``"cq_1"``).
        user_id: User ID of the button clicker.
        chat_id: Chat ID.
        message_text: Text of the message containing the button.
        **kwargs: Extra attributes set on the mock.

    Returns:
        A ``MagicMock`` shaped like a Pyrogram ``CallbackQuery``.
    """
    cq = MagicMock()
    cq.id = query_id
    cq.data = data
    cq.from_user = make_user(user_id=user_id)
    cq.message = make_message(text=message_text, chat_id=chat_id)
    cq.answer = AsyncMock(return_value=None)
    cq.edit_message_text = AsyncMock(return_value=None)
    cq.edit_message_reply_markup = AsyncMock(return_value=None)
    for k, v in kwargs.items():
        setattr(cq, k, v)
    return cq


def make_inline_query(
    query_str: str = "",
    *,
    query_id: str = "iq_1",
    user_id: int = 1,
    **kwargs: Any,
) -> MagicMock:
    """Create a mock Pyrogram InlineQuery object."""
    iq = MagicMock()
    iq.id = query_id
    iq.query = query_str
    iq.from_user = make_user(user_id=user_id)
    iq.answer = AsyncMock(return_value=None)
    for k, v in kwargs.items():
        setattr(iq, k, v)
    return iq


# ── MockClient ───────────────────────────────────────────────────────────────

class MockClient:
    """Minimal Pyrogram Client mock for testing handlers.

    Records all ``send_message``, ``send_photo``, etc. calls so tests can
    assert on them without making real API requests.

    Example::

        client = MockClient(me_id=999)
        await my_handler(client, make_message(text="/start"))
        assert client.sent[0]["chat_id"] == 100
        assert "Hello" in client.sent[0]["text"]
    """

    def __init__(self, me_id: int = 999) -> None:
        self.me = make_user(user_id=me_id, first_name="Bot", is_bot=True)
        self.sent: List[Dict[str, Any]] = []
        self.edited: List[Dict[str, Any]] = []
        self.deleted: List[Any] = []

    async def send_message(
        self,
        chat_id: Any,
        text: str,
        **kwargs: Any,
    ) -> MagicMock:
        entry = {"chat_id": chat_id, "text": text, **kwargs}
        self.sent.append(entry)
        return make_message(text=text, chat_id=int(chat_id) if str(chat_id).lstrip("-").isdigit() else 0)

    async def send_photo(self, chat_id: Any, photo: Any, **kwargs: Any) -> MagicMock:
        self.sent.append({"chat_id": chat_id, "photo": photo, **kwargs})
        return make_message(chat_id=int(chat_id) if str(chat_id).lstrip("-").isdigit() else 0)

    async def send_document(self, chat_id: Any, document: Any, **kwargs: Any) -> MagicMock:
        self.sent.append({"chat_id": chat_id, "document": document, **kwargs})
        return make_message(chat_id=int(chat_id) if str(chat_id).lstrip("-").isdigit() else 0)

    async def edit_message_text(
        self,
        chat_id: Any,
        message_id: int,
        text: str,
        **kwargs: Any,
    ) -> MagicMock:
        self.edited.append({"chat_id": chat_id, "message_id": message_id, "text": text, **kwargs})
        return make_message(text=text)

    async def delete_messages(self, chat_id: Any, message_ids: Any, **kwargs: Any) -> bool:
        self.deleted.append({"chat_id": chat_id, "message_ids": message_ids})
        return True

    async def get_me(self) -> MagicMock:
        return self.me

    def reset(self) -> None:
        """Clear all recorded calls — useful between test cases."""
        self.sent.clear()
        self.edited.clear()
        self.deleted.clear()

    # Allow attribute access for things we haven't explicitly mocked
    def __getattr__(self, name: str) -> AsyncMock:
        return AsyncMock(return_value=None)


# ── ConversationTester ───────────────────────────────────────────────────────

@dataclass
class ConversationTester:
    """High-level helper for testing :class:`~kurigram_addons.Conversation` flows.

    Instantiates the conversation, sets up an in-memory FSM store, and
    drives the flow by simulating user messages and callback queries.

    Example::

        async def test_registration():
            tester = ConversationTester(Registration)
            await tester.start(user_id=1, chat_id=1)
            assert tester.current_state == "Registration:name"

            await tester.send_message("Alice")
            assert tester.current_state == "Registration:age"

            await tester.send_message("30")
            assert tester.current_state == "Registration:confirm"
    """

    conversation_cls: type
    user_id: int = 1
    chat_id: int = 1

    _conversation: Any = field(default=None, init=False, repr=False)
    _client: MockClient = field(default_factory=MockClient, init=False, repr=False)
    _storage: Any = field(default=None, init=False, repr=False)
    _helper: Any = field(default=None, init=False, repr=False)

    def __post_init__(self) -> None:
        from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
        from pyrogram_patch.patch_helper import PatchHelper

        self._conversation = self.conversation_cls()
        self._storage = MemoryStorage()
        self._helper = PatchHelper(fsm_storage=self._storage)

    @property
    def current_state(self) -> str:
        """The current FSM state string."""
        return self._helper.state

    @property
    def data(self) -> Dict[str, Any]:
        """Synchronous snapshot of the current helper data (for assertions)."""
        return dict(self._helper._data)

    async def start(self, user_id: Optional[int] = None, chat_id: Optional[int] = None) -> Any:
        """Enter the conversation's initial state.

        Returns the ConversationContext that was passed to the on_enter hook.
        """
        from kurigram_addons.conversation import ConversationContext

        if user_id is not None:
            self.user_id = user_id
        if chat_id is not None:
            self.chat_id = chat_id

        msg = make_message(text="", user_id=self.user_id, chat_id=self.chat_id)
        ctx = ConversationContext(
            client=self._client,
            message=msg,
            helper=self._helper,
        )
        await self._conversation.start(ctx)
        return ctx

    async def send_message(self, text: str, **kwargs: Any) -> Any:
        """Simulate the user sending a message while in the current state."""
        from kurigram_addons.conversation import ConversationContext

        msg = make_message(text=text, user_id=self.user_id, chat_id=self.chat_id, **kwargs)
        ctx = ConversationContext(
            client=self._client,
            message=msg,
            helper=self._helper,
        )

        current = self._helper.state
        if current == "*":
            raise RuntimeError("No active conversation state.  Call start() first.")

        # Find and invoke the on_message hook for the current state
        hooks = self._conversation._conv_hooks
        for state_name, state_hooks in hooks.items():
            state_obj = self._conversation._conv_states[state_name]
            if state_obj.state_string == current:
                method_name = state_hooks.get("on_message")
                if method_name:
                    method = getattr(self._conversation, method_name)
                    await method(ctx)
                break

        return ctx

    async def send_callback(self, data: str, **kwargs: Any) -> Any:
        """Simulate the user clicking a button with the given callback data."""
        from kurigram_addons.conversation import ConversationContext

        cq = make_callback_query(data=data, user_id=self.user_id, chat_id=self.chat_id)
        ctx = ConversationContext(
            client=self._client,
            callback_query=cq,
            helper=self._helper,
        )

        current = self._helper.state
        if current == "*":
            raise RuntimeError("No active conversation state.  Call start() first.")

        hooks = self._conversation._conv_hooks
        for state_name, state_hooks in hooks.items():
            state_obj = self._conversation._conv_states[state_name]
            if state_obj.state_string == current:
                method_name = state_hooks.get("on_callback")
                if method_name:
                    method = getattr(self._conversation, method_name)
                    await method(ctx)
                break

        return ctx

    def assert_replied(self, text: str) -> None:
        """Assert that the bot sent a message containing *text*."""
        all_text = " ".join(m.get("text", "") for m in self._client.sent)
        assert text in all_text, (
            f"Expected reply containing {text!r} but got: "
            + repr([m.get("text") for m in self._client.sent])
        )

    def reset_sent(self) -> None:
        """Clear recorded sent messages."""
        self._client.reset()


__all__ = [
    "make_user",
    "make_chat",
    "make_message",
    "make_callback_query",
    "make_inline_query",
    "MockClient",
    "ConversationTester",
]
