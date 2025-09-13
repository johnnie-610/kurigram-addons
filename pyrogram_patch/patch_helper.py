# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

import asyncio
import inspect
import logging
from typing import Any, Awaitable, Callable, Dict, Optional, TypeVar, Union

from pydantic import BaseModel
from pydantic import ValidationError as PydanticValidationError
from pyrogram import Client, StopPropagation
from pyrogram.handlers.handler import Handler
from pyrogram.types import Update

from pyrogram_patch import errors
from pyrogram_patch.fsm import BaseStorage
from pyrogram_patch.fsm.context import FSMContext

# Type variables
T = TypeVar("T")
UpdateT = TypeVar("UpdateT", bound=Update)
HandlerT = TypeVar("HandlerT", bound=Handler)
MiddlewareFunc = Callable[[UpdateT, Client, "PatchHelper"], Awaitable[Any]]

logger = logging.getLogger("pyrogram_patch.patch_helper")


class HelperData(BaseModel):
    """Pydantic model for PatchHelper data validation."""

    state: str
    data: Dict[str, Any] = {}


class PatchHelperData(BaseModel):
    """Pydantic model for serialized helper state."""

    state: str = "*"
    data: Dict[str, Any] = {}


async def create_key(parsed_update: Update, client: Client) -> str:
    """Generate a unique key for state management based on the update and client."""
    chat_id = "unknown"
    user_id = "unknown"

    # Extract user ID
    if (
        hasattr(parsed_update, "from_user")
        and parsed_update.from_user is not None
    ):
        user_id_raw = parsed_update.from_user.id
        if not _validate_telegram_id(user_id_raw):
            raise errors.ValidationError(
                field="user_id",
                value=user_id_raw,
                expected="valid Telegram user ID",
            )
        user_id = str(user_id_raw)
    elif (
        hasattr(parsed_update, "message") and parsed_update.message is not None
    ):
        if parsed_update.message.from_user is not None:
            user_id_raw = parsed_update.message.from_user.id
            if not _validate_telegram_id(user_id_raw):
                raise errors.ValidationError(
                    field="user_id",
                    value=user_id_raw,
                    expected="valid Telegram user ID",
                )
            user_id = str(user_id_raw)
        else:
            raise ValueError("No user ID found in update")

    # Extract chat ID
    if hasattr(parsed_update, "chat") and parsed_update.chat is not None:
        chat_id_raw = parsed_update.chat.id
        if not _validate_telegram_id(chat_id_raw):
            raise errors.ValidationError(
                field="chat_id",
                value=chat_id_raw,
                expected="valid Telegram chat ID",
            )
        chat_id = str(chat_id_raw)
    elif (
        hasattr(parsed_update, "message") and parsed_update.message is not None
    ):
        if (
            hasattr(parsed_update.message, "chat")
            and parsed_update.message.chat is not None
        ):
            chat_id_raw = parsed_update.message.chat.id
            if not _validate_telegram_id(chat_id_raw):
                raise errors.ValidationError(
                    field="chat_id",
                    value=chat_id_raw,
                    expected="valid Telegram chat ID",
                )
            chat_id = str(chat_id_raw)
        else:
            raise ValueError("No chat ID found in update")

    return f"{client.me.id}-{user_id}-{chat_id}"


def _validate_telegram_id(id_value: int) -> bool:
    """Validate that a Telegram ID is reasonable.

    Telegram IDs should be positive integers within a reasonable range.
    User IDs are typically 5-10 digits, chat IDs can be negative for groups/channels.
    """
    if not isinstance(id_value, int):
        return False

    # Telegram user IDs are positive and typically between 5-10 digits
    # Chat IDs can be negative (for groups/channels) or positive (for users)
    # Allow IDs from -2^31 to 2^31-1 (32-bit signed integer range)
    return -(2**31) <= id_value <= 2**31 - 1 and id_value != 0


class PatchHelper:
    """Helper class for managing update processing with FSM integration."""

    __slots__ = (
        "_data",
        "state",
        "_fsm_ctx",
        "_lock",
        "_fsm_storage",
        "__weakref__",
    )

    def __init__(self, fsm_storage: Optional[BaseStorage] = None) -> None:
        """Initialize a new PatchHelper instance."""
        self._data: Dict[str, Any] = {}
        self.state: str = "*"
        self._fsm_ctx: Optional[FSMContext] = None
        self._lock: asyncio.Lock = asyncio.Lock()
        if fsm_storage:
            self._fsm_storage = fsm_storage

    async def skip_handler(self) -> None:
        """Skip the current handler execution."""
        raise StopPropagation(
            "Handler execution skipped by PatchHelper.skip_handler()."
        )

    async def _get_data_for_handler(self, handler: Callable) -> Dict[str, Any]:
        """Prepare and validate data for handler based on its signature."""
        try:
            sig = inspect.signature(handler)
            kwargs: Dict[str, Any] = {}

            # Always include patch_helper
            if "patch_helper" in sig.parameters:
                kwargs["patch_helper"] = self

            # Inject FSMContext for state parameter when available
            if "state" in sig.parameters:
                if self._fsm_ctx is not None:
                    kwargs["state"] = self._fsm_ctx
                else:
                    kwargs["state"] = self.state

            # Add user data from helper (filtered by signature)
            for param_name in sig.parameters:
                if param_name not in [
                    "client",
                    "message",
                    "query",
                    "state",
                    "patch_helper",
                ]:
                    if param_name in self._data:
                        kwargs[param_name] = self._data[param_name]

            return kwargs
        except Exception as e:
            raise errors.DispatcherError(
                "Handler signature processing failed", cause=e
            ) from e

    async def _process_middleware(
        self, parsed_update: UpdateT, middleware: MiddlewareFunc, client: Client
    ) -> Any:
        """Process a middleware with the given update and client."""
        try:
            return await middleware(parsed_update, client, self)
        except Exception as e:
            raise errors.MiddlewareError(
                "Middleware processing failed", cause=e
            ) from e

    async def _include_state(
        self, parsed_update: Update, storage: BaseStorage, client: Client
    ) -> None:
        """Include FSM state and data from storage using FSMContextManager."""
        logger.debug(
            "_include_state called with storage type: %s",
            type(storage).__name__,
        )
        logger.debug("Parsed update type: %s", type(parsed_update).__name__)

        if not isinstance(storage, BaseStorage):
            raise errors.ValidationError(
                field="storage",
                value=type(storage).__name__,
                expected="BaseStorage",
            )

        # Use FSMContextManager to get FSMContext
        from .patch_data_pool import initialize_global_pool

        pool = await initialize_global_pool(client)
        if pool._fsm_manager is None:
            raise errors.ValidationError(
                field="fsm_manager", value=None, expected="FSMContextManager"
            )

        self._fsm_ctx = await pool._fsm_manager.from_update(parsed_update)
        logger.debug(
            "FSMContext created via manager: %s", self._fsm_ctx is not None
        )

        state_data = await self._fsm_ctx.get_state_and_data()
        logger.debug("State data retrieved: %s", bool(state_data))

        if state_data:
            try:
                # Map storage keys to HelperData keys
                mapped_data = {
                    "state": str(state_data.get("name", "*")),
                    "data": state_data.get("data", {}),
                }
                validated = HelperData(**mapped_data)
                self.state = validated.state
                async with self._lock:
                    self._data.update(validated.data)
                logger.debug("FSM state loaded: %s", self.state)
            except PydanticValidationError as ve:
                logger.debug("Validation error in _include_state: %s", ve)
                raise errors.ValidationError(
                    field="state_data",
                    value=state_data,
                    expected="dict with 'name' and 'data' keys",
                    cause=ve,
                ) from ve
        else:
            self.state = "*"
            logger.debug("No state data found, using default '*' state")

    @classmethod
    async def get_from_pool(
        cls, update: Update, client: Client
    ) -> "PatchHelper":
        """Get a PatchHelper instance from the update pool asynchronously."""
        try:
            from .patch_data_pool import initialize_global_pool

            pool = await initialize_global_pool(client)
            return await pool.get_helper_from_pool(update, client)
        except Exception as e:
            raise errors.DispatcherError(
                "Failed to get helper from pool", cause=e
            ) from e

    @staticmethod
    def generate_state_key(
        client_id: int,
        user_id: Union[int, str] = "unknown",
        chat_id: Union[int, str] = "unknown",
    ) -> str:
        """Generate a state key from the given components."""
        return f"{client_id}-{user_id}-{chat_id}"

    @property
    async def data(self) -> Dict[str, Any]:
        """Get the helper's validated data dictionary asynchronously."""
        async with self._lock:
            return self._data.copy()

    async def update_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Update the helper's data with validation and FSM sync."""
        async with self._lock:
            self._data.update(kwargs)
            logger.debug("Updated patch_helper data with %d keys", len(kwargs))

        if self._fsm_ctx is not None:
            try:
                await self._fsm_ctx.update_data(**kwargs)
            except Exception as e:
                raise errors.FSMTransitionError(
                    "Failed to sync data to FSM", cause=e
                ) from e

        return self._data

    async def get(self, key: str, default: Any = None) -> Any:
        """Get a value from the helper's data."""
        async with self._lock:
            return self._data.get(key, default)

    async def __getitem__(self, key: str) -> Any:
        """Get an item from the helper's data asynchronously."""
        async with self._lock:
            if key not in self._data:
                raise KeyError(f"Key '{key}' not in helper data")
            return self._data[key]

    async def __setitem__(self, key: str, value: Any) -> None:
        """Set an item in the helper's data with validation."""
        async with self._lock:
            self._data[key] = value

    async def __delitem__(self, key: str) -> None:
        """Delete an item from the helper's data."""
        async with self._lock:
            if key not in self._data:
                raise KeyError(f"Key '{key}' not in helper data")
            del self._data[key]

    async def __contains__(self, key: str) -> bool:
        """Check if a key exists in the helper's data."""
        async with self._lock:
            return key in self._data

    async def __len__(self) -> int:
        """Get the number of items in the helper's data."""
        async with self._lock:
            return len(self._data)

    async def __repr__(self) -> str:
        """Get a string representation of the helper asynchronously."""
        async with self._lock:
            return (
                f"PatchHelper(state={self.state!r}, data_len={len(self._data)})"
            )

    def __str__(self) -> str:
        """Get a user-friendly string representation."""
        return f"PatchHelper(state='{self.state}', data_len={len(self._data)})"
