# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
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
    # Channel IDs can be -100XXXXXXXXXX, exceeding 32-bit range
    # Allow IDs within 64-bit signed integer range
    return -(2**63) <= id_value <= 2**63 - 1 and id_value != 0


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
        self._fsm_storage: Optional[BaseStorage] = fsm_storage

    @property
    def storage(self) -> Optional[BaseStorage]:
        """Get the FSM storage instance."""
        if getattr(self, "_fsm_storage", None) is not None:
            print("Using FSM storage")
            return self._fsm_storage
        # Fallback to global pool
        try:
             from .patch_data_pool import global_pool
             if global_pool and getattr(global_pool, "_fsm_storage", None):
                print("Using global pool FSM storage")
                return global_pool._fsm_storage
        except ImportError:
             pass
        return None



    async def _get_data_for_handler(self, handler: Callable) -> Dict[str, Any]:
        """Prepare and validate data for handler based on its signature."""
        
        # Check for cached mapping
        attr_name = "__pyrogram_patch_handler_data_map__"
        data_map = getattr(handler, attr_name, None)
        
        if data_map is None:
            try:
                sig = inspect.signature(handler)
                data_map = {}
                
                for param_name, param in sig.parameters.items():
                    annotation = param.annotation
                    
                    # Store injection rule
                    if annotation is FSMContext:
                        data_map[param_name] = "fsm_ctx"
                    elif annotation is PatchHelper:
                        data_map[param_name] = "patch_helper"
                    elif param_name == "patch_helper":
                        data_map[param_name] = "patch_helper"
                    elif param_name == "state":
                        if annotation is str:
                            data_map[param_name] = "state_str"
                        else:
                            data_map[param_name] = "state_obj"
                    elif param_name in self._data:
                        data_map[param_name] = "data_custom"
                
                # Cache the mapping
                try:
                    setattr(handler, attr_name, data_map)
                except (AttributeError, TypeError):
                    pass
                    
            except Exception as e:
                # Fallback to empty if signature fails
                data_map = {}

        # Construct kwargs based on mapping
        kwargs: Dict[str, Any] = {}
        for param_name, rule in data_map.items():
            if rule == "fsm_ctx":
                kwargs[param_name] = self._fsm_ctx
            elif rule == "patch_helper":
                kwargs[param_name] = self
            elif rule == "state_str":
                kwargs[param_name] = self.state
            elif rule == "state_obj":
                kwargs[param_name] = self._fsm_ctx if self._fsm_ctx is not None else self.state
            elif rule == "data_custom":
                if param_name in self._data:
                    kwargs[param_name] = self._data[param_name]
        
        return kwargs


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

    async def set_state(self, state: str) -> None:
        """Set the FSM state.

        Args:
            state: The new state to set.
        """
        self.state = state
        if self._fsm_ctx is not None:
            await self._fsm_ctx.set_state(state)

    async def finish(self) -> None:
        """Finish the current FSM state (clear state and data)."""
        self.state = "*"
        async with self._lock:
            self._data.clear()
        if self._fsm_ctx is not None:
            await self._fsm_ctx.clear_data()
            await self._fsm_ctx.clear_state()

    async def export_snapshot(self) -> PatchHelperData:
        """Create a serialisable snapshot of the helper state."""

        async with self._lock:
            payload = PatchHelperData(state=self.state, data=self._data.copy())
        return payload

    async def apply_snapshot(self, snapshot: PatchHelperData) -> None:
        """Load helper state from a previously exported snapshot."""

        validated = PatchHelperData(**snapshot.model_dump())
        self.state = validated.state
        async with self._lock:
            self._data = validated.data.copy()

    async def get(self, key: str, default: Any = None) -> Any:
        """Get a value from the helper's data."""
        async with self._lock:
            return self._data.get(key, default)

    def __getitem__(self, key: str) -> Any:
        """Get an item from the helper's data."""
        if key not in self._data:
            raise KeyError(f"Key '{key}' not in helper data")
        return self._data[key]

    def __setitem__(self, key: str, value: Any) -> None:
        """Set an item in the helper's data."""
        self._data[key] = value

    def __delitem__(self, key: str) -> None:
        """Delete an item from the helper's data."""
        if key not in self._data:
            raise KeyError(f"Key '{key}' not in helper data")
        del self._data[key]

    def __contains__(self, key: str) -> bool:
        """Check if a key exists in the helper's data."""
        return key in self._data

    def __len__(self) -> int:
        """Get the number of items in the helper's data."""
        return len(self._data)

    def __repr__(self) -> str:
        """Get a string representation of the helper."""
        return (
            f"PatchHelper(state={self.state!r}, data_len={len(self._data)})"
        )

    def __str__(self) -> str:
        """Get a user-friendly string representation."""
        return f"PatchHelper(state='{self.state}', data_len={len(self._data)})"
