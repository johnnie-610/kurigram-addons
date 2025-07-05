"""FSM context for managing state in a conversation."""
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Type, TypeVar, Union

from pyrogram.types import Message, CallbackQuery

from .base_storage import BaseStorage, StateData, StateNotFoundError
from .states import State, StatesGroup

T = TypeVar('T', bound=StatesGroup)

class FSMContext:
    """Context manager for finite state machine."""
    
    def __init__(self, storage: BaseStorage):
        self.storage = storage
    
    def _get_key(self, update: Union[Message, CallbackQuery]) -> str:
        """Generate a unique key for chat/user pair."""
        chat_id = update.chat.id if hasattr(update, 'chat') else update.message.chat.id
        user_id = update.from_user.id
        return f"{chat_id}:{user_id}"
    
    async def get_state(self, update: Union[Message, CallbackQuery]) -> Optional[State]:
        """Get current state for the chat/user."""
        key = self._get_key(update)
        try:
            data = await self.storage.get_state(key)
            return data.state if data else None
        except StateNotFoundError:
            return None
    
    async def set_state(
        self, 
        update: Union[Message, CallbackQuery], 
        state: Union[State, str, None],
        data: Optional[Dict[str, Any]] = None
    ) -> None:
        """Set state for the chat/user.
        
        Args:
            update: The update object (Message or CallbackQuery)
            state: The state to set (State enum, string, or None to clear)
            data: Optional data to store with the state
        """
        key = self._get_key(update)
        now = datetime.now(timezone.utc)
        
        if state is None:
            await self.storage.delete_state(key)
        else:
            state_value = state.value if isinstance(state, State) else state
            # Try to get existing state to preserve created_at and existing data
            existing_data = await self.storage.get_state(key)
            if existing_data is not None:
                created_at = existing_data.created_at
                current_data = existing_data.data
                # Update with new data if provided
                if data is not None:
                    current_data.update(data)
                else:
                    current_data = current_data or {}
            else:
                created_at = now
                current_data = data or {}
            
            state_data = StateData(
                state=state_value,
                data=current_data,
                created_at=created_at,
                updated_at=now
            )
            await self.storage.set_state(key, state_data)
            
    async def set_data(
        self,
        update: Union[Message, CallbackQuery],
        data: Dict[str, Any]
    ) -> None:
        """Set data for the chat/user.
        
        Args:
            update: The update object (Message or CallbackQuery)
            data: Data to store
        """
        key = self._get_key(update)
        now = datetime.now(timezone.utc)
        
        # Get existing state to preserve it
        existing_data = await self.storage.get_state(key)
        if existing_data is not None:
            state_data = StateData(
                state=existing_data.state,
                data=data,
                created_at=existing_data.created_at,
                updated_at=now,
                expires_at=existing_data.expires_at
            )
        else:
            # Create new state with default values
            state_data = StateData(
                state=None,
                data=data,
                created_at=now,
                updated_at=now
            )
            
        await self.storage.set_state(key, state_data)
    
    async def get_data(self, update: Union[Message, CallbackQuery]) -> dict:
        """Get data for the chat/user."""
        key = self._get_key(update)
        try:
            data = await self.storage.get_state(key)
            return data.data if data else {}
        except StateNotFoundError:
            return {}
    
    async def update_data(
        self, 
        update: Union[Message, CallbackQuery], 
        data: Optional[Dict[str, Any]] = None,
        **kwargs: Any
    ) -> None:
        """Update data for the chat/user.
        
        Args:
            update: The update object (Message or CallbackQuery)
            data: Data to update (will be merged with existing data)
            **kwargs: Additional data to update (alternative to data parameter)
        """
        if data is None:
            data = {}
        data.update(kwargs)
            
        key = self._get_key(update)
        now = datetime.now(timezone.utc)
        
        # Get existing state or create a new one
        existing_data = await self.storage.get_state(key)
        if existing_data is not None:
            # Update existing data
            updated_data = {**existing_data.data, **data}
            state_data = StateData(
                state=existing_data.state,
                data=updated_data,
                created_at=existing_data.created_at,
                updated_at=now,
                expires_at=existing_data.expires_at
            )
        else:
            # Create new state with the provided data
            state_data = StateData(
                state=None,
                data=data,
                created_at=now,
                updated_at=now
            )
            
        await self.storage.set_state(key, state_data)
    
    async def finish(self, update: Union[Message, CallbackQuery]) -> None:
        """Finish conversation and clear state and data."""
        key = self._get_key(update)
        await self.storage.delete_state(key)
    
    async def get_state_data(self, update: Union[Message, CallbackQuery]) -> tuple[Optional[State], dict]:
        """Get both state and data for the chat/user."""
        key = self._get_key(update)
        try:
            data = await self.storage.get_state(key)
            if data is None:
                return None, {}
            return data.state, data.data
        except StateNotFoundError:
            return None, {}
    
    async def set_state_data(
        self,
        update: Union[Message, CallbackQuery],
        state: Optional[Union[State, str]] = None,
        **data: Any
    ) -> None:
        """Set both state and data for the chat/user.
        
        Args:
            update: The update object (Message or CallbackQuery)
            state: The state to set (State enum, string, or None to clear)
            **data: Data to store with the state
        """
        key = self._get_key(update)
        now = datetime.now(timezone.utc)
        
        if state is None:
            await self.storage.delete_state(key)
            return
            
        state_value = state.value if isinstance(state, State) else state
        
        try:
            # Try to get existing state to preserve created_at
            existing_data = await self.storage.get_state(key)
            created_at = existing_data.created_at
        except StateNotFoundError:
            created_at = now
            
        state_data = StateData(
            state=state_value,
            data=data or {},
            created_at=created_at,
            updated_at=now
        )
        await self.storage.set_state(key, state_data)
