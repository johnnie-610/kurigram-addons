from __future__ import annotations

import asyncio
import time
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, AsyncIterator, cast

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
        self._storage: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()
        
        # Store state metadata: {key: (state, created_at, updated_at, expires_at)}
        self._state_meta: Dict[str, tuple[str, datetime, datetime, Optional[datetime]]] = {}

    async def _get_state_meta(self, key: str) -> tuple[str, datetime, datetime, Optional[datetime]]:
        """Get state metadata with validation."""
        if key not in self._state_meta:
            raise StateNotFoundError(f"State with key '{key}' not found")
        return self._state_meta[key]

    async def _check_expired(self, key: str) -> bool:
        """Check if a state has expired and clean it up if needed."""
        if key not in self._state_meta:
            return True
            
        _, _, _, expires_at = self._state_meta[key]
        if expires_at and datetime.utcnow() >= expires_at:
            await self.finish_state(key)
            return True
        return False

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
            if key in self._state_meta and not await self._check_expired(key):
                state, _, _, _ = self._state_meta[key]
                return State(state, self, key)
                
            # Create new state
            state = default_state or "*"
            now = datetime.utcnow()
            expires_at = (now + ttl) if ttl else None
            
            self._state_meta[key] = (state, now, now, expires_at)
            if key not in self._storage:
                self._storage[key] = {}
                
            return State(state, self, key)

    async def set_state(
        self,
        state: str,
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the state for a given key."""
        if not state or not isinstance(state, str):
            raise StateValidationError("State must be a non-empty string")
            
        async with self._lock:
            try:
                _, created_at, _, _ = await self._get_state_meta(key)
            except StateNotFoundError:
                created_at = datetime.utcnow()
                
            now = datetime.utcnow()
            expires_at = (now + ttl) if ttl else None
            
            self._state_meta[key] = (
                state,
                created_at,
                now,
                expires_at
            )

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
            if key not in self._state_meta:
                raise StateNotFoundError(f"State with key '{key}' not found")
                
            self._storage[key] = data
            
            # Update TTL if provided
            if ttl is not None:
                state, created_at, updated_at, _ = self._state_meta[key]
                self._state_meta[key] = (
                    state,
                    created_at,
                    datetime.utcnow(),
                    datetime.utcnow() + ttl
                )

    async def get_data(self, key: str) -> Dict[str, Any]:
        """Retrieve the data for a given state."""
        async with self._lock:
            if await self._check_expired(key):
                return {}
                
            return self._storage.get(key, {}).copy()

    async def get_state_data(self, key: str) -> StateData:
        """Retrieve complete state information including metadata."""
        async with self._lock:
            if await self._check_expired(key):
                raise StateNotFoundError(f"State with key '{key}' not found or expired")
                
            state, created_at, updated_at, expires_at = self._state_meta[key]
            data = self._storage.get(key, {})
            
            return StateData(
                state=state,
                data=data.copy(),
                created_at=created_at,
                updated_at=updated_at,
                expires_at=expires_at
            )

    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data."""
        async with self._lock:
            self._storage.pop(key, None)
            self._state_meta.pop(key, None)

    async def cleanup_expired(self) -> int:
        """Remove all expired states."""
        count = 0
        async with self._lock:
            keys = list(self._state_meta.keys())
            for key in keys:
                if await self._check_expired(key):
                    count += 1
        return count

    async def list_states(
        self,
        state: Optional[str] = None,
        created_before: Optional[datetime] = None
    ) -> AsyncIterator[str]:
        """List all state keys matching the given criteria."""
        async with self._lock:
            for key, (s, created_at, _, _) in self._state_meta.items():
                if await self._check_expired(key):
                    continue
                    
                if state is not None and s != state:
                    continue
                    
                if created_before is not None and created_at >= created_before:
                    continue
                    
                yield key
