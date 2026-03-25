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

# Module-level cache for handler parameter → injection-rule mappings.
#
# Keyed by id(handler) rather than the handler object itself to avoid holding
# a strong reference (which would prevent garbage collection).  The values
# are plain dicts — safe to read concurrently because they are written once
# (first call) and then only ever read.
#
# Using a module-level dict instead of setattr(handler, ...) prevents the
# data race where two concurrent coroutines both find the attribute absent,
# both build the map, and both write it to the same shared function object.
# With this dict, the worst case is two coroutines build an identical map and
# one overwrites the other — both are correct, and the dict assignment is
# atomic in CPython.
_handler_data_maps: Dict[int, Dict[str, str]] = {}


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
            raise errors.ValidationError(
                field="user_id",
                value=None,
                expected="update with from_user or message.from_user",
            )

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
            raise errors.ValidationError(
                field="chat_id",
                value=None,
                expected="update with chat or message.chat",
            )

    return f"{client.me.id}-{user_id}-{chat_id}"


def _validate_telegram_id(id_value: int) -> bool:
    """Validate that a Telegram ID falls within a realistic range.

    The previous implementation accepted the full 64-bit signed integer range
    (−2⁶³ … 2⁶³−1).  That is far too permissive: a crafted or malformed update
    with ``from_user.id = -9223372036854775808`` would pass validation, produce
    a nonsensical storage key, and could collide with legitimate keys or bypass
    per-user rate limits.

    Telegram ID ranges (as documented and observed in production):

    * User IDs:          positive, currently up to ~7 × 10⁹ (growing)
    * Bot IDs:           positive, same namespace as users
    * Basic group IDs:   positive (shown as negative in old MTProto; Pyrogram
                         normalises them)
    * Supergroup / channel IDs: negative, prefixed with -100; representable as
                         −100_000_000_000_000 … −1_000_000_000 (13-digit bound)
    * Forum topic IDs:  small positive integers

    We use a generous upper bound of 10¹³ for positive IDs and −10¹³ for
    negative IDs to leave plenty of headroom for Telegram's growing ID space
    while still rejecting values that cannot plausibly be real Telegram IDs.
    """
    if not isinstance(id_value, int) or isinstance(id_value, bool):
        return False

    _MAX_ID = 10 ** 13   # 10 trillion — well above any current Telegram ID
    _MIN_ID = -(10 ** 13)

    return _MIN_ID <= id_value <= _MAX_ID and id_value != 0


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
            logger.debug("Using FSM storage")
            return self._fsm_storage
        # Fallback to global pool
        try:
            from .patch_data_pool import global_pool
            if global_pool and getattr(global_pool, "_fsm_storage", None):
                logger.debug("Using global pool FSM storage")
                return global_pool._fsm_storage
        except ImportError:
            pass
        return None



    async def _get_data_for_handler(self, handler: Callable) -> Dict[str, Any]:
        """Prepare and validate data for handler based on its signature."""

        handler_id = id(handler)
        data_map = _handler_data_maps.get(handler_id)

        if data_map is None:
            try:
                sig = inspect.signature(handler)
                data_map = {}

                for param_name, param in sig.parameters.items():
                    annotation = param.annotation

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

                # Store in the module-level dict (atomic in CPython; safe under
                # concurrent access — worst case two coroutines build the same
                # map and one clobbers the other, both values are correct).
                _handler_data_maps[handler_id] = data_map

            except Exception:
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



    async def get_data(
        self,
        model: Optional[type] = None,
    ) -> Any:
        """Return the helper's data dictionary, optionally validated as a Pydantic model.

        Args:
            model: An optional Pydantic ``BaseModel`` subclass.  When provided
                   the raw data dict is passed to the model constructor and the
                   validated model instance is returned.  This gives full IDE
                   autocomplete and automatic schema validation at the point of
                   use instead of working with an untyped dict.

        Returns:
            A copy of the data dict when *model* is ``None``, or a validated
            model instance when *model* is given.

        Example::

            class UserData(BaseModel):
                name: str
                age: int

            user = await helper.get_data(model=UserData)
            print(user.name)   # type-safe, IDE-autocompleted

        Previously exposed as an (invalid) ``async`` property named ``data``;
        use ``await helper.get_data()`` going forward.
        """
        async with self._lock:
            data_copy = self._data.copy()

        if model is not None:
            from pydantic import BaseModel as _BaseModel
            if not (isinstance(model, type) and issubclass(model, _BaseModel)):
                raise TypeError(
                    f"get_data(model=...) expects a Pydantic BaseModel subclass, "
                    f"got {model!r}"
                )
            return model(**data_copy)

        return data_copy

    async def set_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Replace the entire data dict with *kwargs* and sync to FSM storage.

        Unlike ``update_data`` (which merges), this overwrites all existing
        keys.  Useful when you want a clean slate rather than an incremental
        update.

        Returns:
            A copy of the new data dict.
        """
        if self._fsm_ctx is not None:
            try:
                # Clear existing data then set the new values atomically.
                await self._fsm_ctx.clear_data()
                if kwargs:
                    await self._fsm_ctx.update_data(**kwargs)
            except Exception as e:
                raise errors.FSMTransitionError(
                    "Failed to sync set_data to FSM", cause=e
                ) from e

        async with self._lock:
            self._data.clear()
            self._data.update(kwargs)
            return self._data.copy()

    async def update_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Merge *kwargs* into the helper's data dict and return the new dict.

        Order of operations (R-3 fix):
        1. Write to FSM storage first (durable, CAS-safe via FSMContext).
        2. Only update the in-memory dict after the storage write succeeds.

        If the FSM write fails the in-memory dict is left unchanged, keeping
        the two sources in sync.  Callers receive a copy, not a live reference.
        """
        if self._fsm_ctx is not None:
            try:
                await self._fsm_ctx.update_data(**kwargs)
            except Exception as e:
                raise errors.FSMTransitionError(
                    "Failed to sync data to FSM", cause=e
                ) from e

        async with self._lock:
            self._data.update(kwargs)
            logger.debug("Updated patch_helper data with %d keys", len(kwargs))
            return self._data.copy()

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

    def __repr__(self) -> str:
        """Get a string representation of the helper."""
        return (
            f"PatchHelper(state={self.state!r}, data_len={len(self._data)})"
        )

    def __str__(self) -> str:
        """Get a user-friendly string representation."""
        return f"PatchHelper(state='{self.state}', data_len={len(self._data)})"
