import asyncio
import inspect
import logging
from typing import Any, Dict, Optional, TypeVar, Union, Callable, Awaitable
from contextlib import suppress
import weakref

from pydantic import BaseModel, ValidationError as PydanticValidationError

from pyrogram import Client, StopPropagation
from pyrogram.handlers.handler import Handler
from pyrogram.types import Update

from pyrogram_patch import errors
from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm import BaseStorage

# Type variables
T = TypeVar('T')
UpdateT = TypeVar('UpdateT', bound=Update)
HandlerT = TypeVar('HandlerT', bound=Handler)
MiddlewareFunc = Callable[[UpdateT, Client, 'PatchHelper'], Awaitable[Any]]

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
    if hasattr(parsed_update, "from_user") and parsed_update.from_user is not None:
        user_id = str(parsed_update.from_user.id)
    elif hasattr(parsed_update, "message") and parsed_update.message is not None:
        if parsed_update.message.from_user is not None:
            user_id = str(parsed_update.message.from_user.id)
        else:
            raise ValueError("No user ID found in update")

    # Extract chat ID
    if hasattr(parsed_update, "chat") and parsed_update.chat is not None:
        chat_id = str(parsed_update.chat.id)
    elif hasattr(parsed_update, "message") and parsed_update.message is not None:
        if hasattr(parsed_update.message, "chat") and parsed_update.message.chat is not None:
            chat_id = str(parsed_update.message.chat.id)
        else:
            raise ValueError("No chat ID found in update")

    return f"{client.me.id}-{user_id}-{chat_id}"


class PatchHelper:
    """Helper class for managing update processing with FSM integration."""

    __slots__ = ('_data', 'state', '_fsm_ctx', '_lock', '__weakref__')

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
        raise StopPropagation("Handler execution skipped by PatchHelper.skip_handler().")

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
                if param_name not in ["client", "message", "query", "state", "patch_helper"]:
                    if param_name in self._data:
                        kwargs[param_name] = self._data[param_name]

            return kwargs
        except Exception as e:
            raise errors.DispatcherError("Handler signature processing failed", cause=e) from e

    async def _process_middleware(
        self,
        parsed_update: UpdateT,
        middleware: MiddlewareFunc,
        client: Client
    ) -> Any:
        """Process a middleware with the given update and client."""
        try:
            return await middleware(parsed_update, client, self)
        except Exception as e:
            raise errors.MiddlewareError("Middleware processing failed", cause=e) from e

    async def _include_state(
        self,
        parsed_update: Update,
        storage: BaseStorage,
        client: Client
    ) -> None:
        """Include FSM state and data from storage using FSMContextManager."""
        print(f"[DEBUG] _include_state called with storage type: {type(storage)}")
        print(f"[DEBUG] Parsed update: {type(parsed_update)}")

        if not isinstance(storage, BaseStorage):
            raise errors.ValidationError(field="storage", value=type(storage).__name__, expected="BaseStorage")

        # Use FSMContextManager to get FSMContext
        from .patch_data_pool import initialize_global_pool
        pool = await initialize_global_pool(client)
        if pool._fsm_manager is None:
            raise errors.ValidationError(field="fsm_manager", value=None, expected="FSMContextManager")

        self._fsm_ctx = await pool._fsm_manager.from_update(parsed_update)
        print(f"[DEBUG] FSMContext created via manager: {self._fsm_ctx is not None}")

        state_data = await self._fsm_ctx.get_state_and_data()
        print(f"[DEBUG] State data: {state_data}")

        if state_data:
            try:
                # Map storage keys to HelperData keys
                mapped_data = {
                    "state": str(state_data.get("name", "*")),
                    "data": state_data.get("data", {})
                }
                validated = HelperData(**mapped_data)
                self.state = validated.state
                async with self._lock:
                    self._data.update(validated.data)
                print(f"[DEBUG] FSM state loaded: {self.state}")
            except PydanticValidationError as ve:
                print(f"[DEBUG] Validation error in _include_state: {ve}")
                raise errors.ValidationError(field="state_data", value=state_data, expected="dict with 'name' and 'data' keys", cause=ve) from ve
        else:
            self.state = "*"
            print("[DEBUG] No state data found, using default '*' state")

    @classmethod
    async def get_from_pool(cls, update: Update, client: Client) -> 'PatchHelper':
        """Get a PatchHelper instance from the update pool asynchronously."""
        try:
            from .patch_data_pool import initialize_global_pool
            pool = await initialize_global_pool(client)
            return await pool.get_helper_from_pool(update, client)
        except Exception as e:
            raise errors.DispatcherError("Failed to get helper from pool", cause=e) from e

    @staticmethod
    def generate_state_key(
        client_id: int,
        user_id: Union[int, str] = "unknown",
        chat_id: Union[int, str] = "unknown"
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
            print(f"[DEBUG] updated patch_helper data: {self._data}")

        if self._fsm_ctx:
            try:
                await self._fsm_ctx.update_data(**kwargs)
            except Exception as e:
                raise errors.FSMTransitionError("Failed to sync data to FSM", cause=e) from e

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
            return f"PatchHelper(state={self.state!r}, data_len={len(self._data)})"

    def __str__(self) -> str:
        """Get a user-friendly string representation."""
        return f"PatchHelper(state='{self.state}', data_len={len(self._data)})"