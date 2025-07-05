from __future__ import annotations

import asyncio
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, AsyncIterator, cast, Union

from pyrogram_patch.fsm.base_storage import (
    BaseStorage,
    StateData,
    StorageError,
    StateNotFoundError,
    StateValidationError,
)
from pyrogram_patch.fsm.states import State


class MemoryStorage(BaseStorage):
    """In-memory implementation of BaseStorage.
    
    This implementation stores all state data in memory and is not persistent
    between application restarts. It's suitable for development and testing.
    
    Note: This implementation is thread-safe.
    """
    
    def __init__(self) -> None:
        """Initialize a new MemoryStorage instance."""
        self._storage: Dict[str, StateData] = {}
        self._lock = asyncio.Lock()

    async def _get_state_data(self, key: str) -> StateData:
        """Get state data with validation."""
        if key not in self._storage:
            raise StateNotFoundError(f"State with key '{key}' not found")
        return self._storage[key]

    async def _check_expired(self, key: str) -> bool:
        """Check if a state has expired and clean it up if needed."""
        try:
            state_data = await self._get_state_data(key)
            if state_data.expires_at and datetime.now(timezone.utc) >= state_data.expires_at:
                await self.finish_state(key)
                return True
            return False
        except StateNotFoundError:
            return True

    async def get_or_create_state(
        self,
        key: str,
        default_state: Optional[str] = None,
        ttl: Optional[timedelta] = None
    ) -> State:
        """Get an existing state or create a new one if it doesn't exist."""
        if not key:
            raise StateValidationError("Key cannot be empty")
            
        async with self._lock:
            try:
                state_data = await self._get_state_data(key)
                if not await self._check_expired(key):
                    return State(state_data.state, self, key)
            except StateNotFoundError:
                pass
                
            # Create new state
            now = datetime.now(timezone.utc)
            state = default_state or "*"
            expires_at = (now + ttl) if ttl else None
            
            state_data = StateData(
                state=state,
                data={},
                created_at=now,
                updated_at=now,
                expires_at=expires_at
            )
            
            self._storage[key] = state_data
            return State(state, self, key)

    async def get_state(self, key: str, raise_on_not_found: bool = False) -> Optional[StateData]:
        """Get the state data for a given key.
        
        Args:
            key: The key to identify the state
            raise_on_not_found: If True, raises StateNotFoundError when key is not found
            
        Returns:
            The StateData object if found, None otherwise
            
        Raises:
            StateNotFoundError: If the key is not found and raise_on_not_found is True
        """
        try:
            return await self._get_state_data(key)
        except StateNotFoundError:
            if raise_on_not_found:
                raise
            return None

    async def set_state(
        self,
        key: str,
        state_data: StateData,
    ) -> None:
        """Set state for a given key.
        
        Args:
            key: The key to identify the state
            state_data: The state data to store
        """
        if not isinstance(state_data, StateData):
            raise ValueError("state_data must be an instance of StateData")
            
        now = datetime.now(timezone.utc)
        expires_at = None
        
        # Set expires_at if TTL is configured
        if hasattr(self, 'ttl') and self.ttl > 0:
            expires_at = now + timedelta(seconds=self.ttl)
            
        # Create a new StateData with updated timestamps
        updated_state_data = StateData(
            state=state_data.state,
            data=state_data.data,
            created_at=state_data.created_at or now,
            updated_at=now,
            expires_at=expires_at if expires_at else state_data.expires_at
        )
            
        async with self._lock:
            self._storage[key] = updated_state_data

    async def set_data(
        self,
        data: Dict[str, Any],
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the data for a given state."""
        if not isinstance(data, dict):
            raise StateValidationError("Data must be a dictionary")
            
        # Check data size
        data_size = len(str(data).encode('utf-8'))
        if data_size > self.MAX_DATA_SIZE:
            raise StateValidationError(
                f"Data size {data_size} exceeds maximum allowed {self.MAX_DATA_SIZE}"
            )
            
        async with self._lock:
            now = datetime.now(timezone.utc)
            expires_at = (now + ttl) if ttl else None
            
            try:
                existing_data = await self._get_state_data(key)
                state_data = StateData(
                    state=existing_data.state,
                    data=data,
                    created_at=existing_data.created_at,
                    updated_at=now,
                    expires_at=expires_at
                )
            except StateNotFoundError:
                state_data = StateData(
                    state="*",
                    data=data,
                    created_at=now,
                    updated_at=now,
                    expires_at=expires_at
                )
            
            self._storage[key] = state_data

    async def get_data(self, key: str) -> Dict[str, Any]:
        """Get the data for a given key."""
        async with self._lock:
            if await self._check_expired(key):
                return {}
                
            try:
                state_data = await self._get_state_data(key)
                return state_data.data
            except StateNotFoundError:
                return {}

    async def get_state_data(self, key: str) -> StateData:
        """Get the state data for a given key."""
        async with self._lock:
            if await self._check_expired(key):
                raise StateNotFoundError(f"State with key '{key}' not found or expired")
                
            state_data = self._storage[key]
            # Return a copy to prevent modification of internal state
            return StateData(
                state=state_data.state,
                data=state_data.data.copy(),
                created_at=state_data.created_at,
                updated_at=state_data.updated_at,
                expires_at=state_data.expires_at
            )

    async def finish_state(self, key: str) -> None:
        """Remove the state for a given key."""
        async with self._lock:
            self._storage.pop(key, None)
            
    async def delete_state(self, key: str) -> None:
        """Alias for finish_state for compatibility with tests."""
        await self.finish_state(key)
        
    async def _cleanup(self) -> None:
        """Internal method to clean up expired states."""
        if not hasattr(self, 'ttl') or self.ttl <= 0:
            return
            
        async with self._lock:
            now = datetime.now(timezone.utc)
            keys_to_remove = []
            
            for key, state_data in list(self._storage.items()):
                if state_data.expires_at and state_data.expires_at <= now:
                    keys_to_remove.append(key)
                    
            for key in keys_to_remove:
                self._storage.pop(key, None)

    async def cleanup_expired(self) -> int:
        """Remove all expired states and return the count of removed states."""
        count = 0
        async with self._lock:
            keys_to_remove = []
            for key in list(self._storage.keys()):
                if await self._check_expired(key):
                    keys_to_remove.append(key)
                    
            for key in keys_to_remove:
                self._storage.pop(key, None)
                count += 1
            for key in keys:
                if key in self._storage and await self._check_expired(key):
                    count += 1
        return count

    async def list_states(
        self,
        state: Optional[str] = None,
        created_before: Optional[datetime] = None
    ) -> AsyncIterator[str]:
        """List all states matching the given criteria."""
        async with self._lock:
            for key, state_data in self._storage.items():
                if state is not None and state_data.state != state:
                    continue
                if created_before is not None and state_data.created_at >= created_before:
                    continue
                if not await self._check_expired(key):
                    yield key
