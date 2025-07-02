#! /usr/bin/env python3
# 
# File: pyrogram_patch/fsm/storages/custom_storage.py
# 
# This file is part of the Kurigram addons library. 
# 
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

"""
Custom Storage Implementation Template

This module provides an abstract base class for implementing custom storage backends
for the Pyrogram Patch FSM (Finite State Machine) system.

To create a custom storage backend, subclass `CustomStorage` and implement all
abstract methods. The base class provides thread-safe wrappers and common
functionality, while the concrete implementation only needs to handle the actual
storage operations.

Example:
    ```python
    class MyCustomStorage(CustomStorage):
        def __init__(self, connection_string: str):
            super().__init__()
            # Initialize your storage client here
            self.client = MyStorageClient(connection_string)
        
        async def _get_raw_data(self, key: str) -> Dict[str, Any]:
            # Implement data retrieval
            pass
            
        async def _set_raw_data(self, key: str, data: Dict[str, Any]) -> None:
            # Implement data storage
            pass
            
        async def _delete_raw_data(self, key: str) -> None:
            # Implement data deletion
            pass
            
        async def _get_keys(self, pattern: str) -> AsyncIterator[str]:
            # Implement key pattern matching
            pass
    ```
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, AsyncIterator, cast, List
from abc import ABC, abstractmethod

from pyrogram_patch.fsm.base_storage import (
    BaseStorage,
    StateData,
    StorageError,
    StateNotFoundError,
    StateValidationError,
)
from pyrogram_patch.fsm.states import State


logger = logging.getLogger(__name__)

class CustomStorage(BaseStorage, ABC):
    """Abstract base class for implementing custom storage backends.
    
    This class provides a template for creating custom storage implementations.
    Subclasses must implement all abstract methods to provide the actual storage logic.
    
    The storage is responsible for persisting state data between requests. It must
    handle concurrent access safely and efficiently.
    
    Note:
        All methods that modify state should be implemented in a thread-safe manner.
        The base class provides a lock (`self._lock`) that can be used with the
        `@synchronized` decorator or as a context manager.
    
    Example:
        ```python
        class MyCustomStorage(CustomStorage):
            def __init__(self, connection_string: str):
                super().__init__()
                self.client = MyStorageClient(connection_string)
            
            async def get_state_data(self, key: str) -> StateData:
                data = await self.client.get(key)
                if data is None:
                    raise StateNotFoundError(f"State not found: {key}")
                return StateData(**json.loads(data))
            
            async def set_state_data(self, key: str, state_data: StateData) -> None:
                await self.client.set(key, json.dumps(state_data.__dict__))
            
            async def finish_state(self, key: str) -> None:
                await self.client.delete(key)
            
            async def list_states(self, state: Optional[str] = None, 
                               created_before: Optional[datetime] = None) -> AsyncIterator[str]:
                # Implement state listing logic here
                pass
                
            async def cleanup_expired(self) -> int:
                # Implement cleanup logic here
                return 0
        ```
    """
    
    def __init__(self, **kwargs: Any) -> None:
        """Initialize the custom storage.
        
        Args:
            **kwargs: Additional storage-specific arguments that might be needed
                     for the concrete implementation.
        """
        super().__init__(**kwargs)
        self._lock = asyncio.Lock()
    
    # ===== Required abstract methods from BaseStorage =====
    
    @abstractmethod
    async def get_state_data(self, key: str) -> StateData:
        """Retrieve complete state information including metadata.
        
        Args:
            key: The key identifying the state.
                
        Returns:
            StateData: Complete state information.
            
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def set_state(self, state: str, key: str, data: Optional[Dict[str, Any]] = None, 
                       ttl: Optional[int] = None) -> None:
        """Update the state for a given key.
        
        Args:
            state: The new state to set.
            key: The key identifying the state to update.
            data: Optional data to associate with the state.
            ttl: Optional time-to-live in seconds for the state.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StateValidationError: If the state is invalid.
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def set_data(self, data: Dict[str, Any], key: str) -> None:
        """Update the data for a given state.
        
        Args:
            data: Dictionary of data to store.
            key: The key identifying the state to update.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StateValidationError: If the data is too large or invalid.
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def get_data(self, key: str) -> Dict[str, Any]:
        """Retrieve the data for a given state.
        
        Args:
            key: The key identifying the state.
                
        Returns:
            dict: The stored data, or an empty dict if no data exists.
            
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data.
        
        Args:
            key: The key identifying the state to remove.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def cleanup_expired(self) -> int:
        """Remove all expired states.
        
        Returns:
            int: Number of states removed.
            
        Raises:
            StorageError: For any storage-related errors.
        """
        pass
    
    @abstractmethod
    async def list_states(
        self,
        state: Optional[str] = None,
        created_before: Optional[datetime] = None
    ) -> AsyncIterator[str]:
        """List all state keys matching the given criteria.
        
        Args:
            state: If provided, only return states with this value.
            created_before: If provided, only return states created before this time.
            
        Yields:
            str: Keys of matching states.
            
        Raises:
            StorageError: For any storage-related errors.
        """
        pass
    
    # ===== Helper methods with default implementations =====
    
    async def get_or_create_state(
        self,
        key: str,
        default_state: Optional[str] = None,
        ttl: Optional[timedelta] = None
    ) -> State:
        """Get an existing state or create a new one if it doesn't exist.
        
        Args:
            key: Unique identifier for the state.
            default_state: Initial state if creating a new state.
            ttl: Time-to-live for the state. Uses DEFAULT_TTL if None.
                
        Returns:
            State: The existing or newly created state.
            
        Raises:
            StateValidationError: If the key or state is invalid.
            StorageError: For any storage-related errors.
        """
        try:
            state_data = await self.get_state_data(key)
            if state_data.is_expired:
                await self.finish_state(key)
                raise StateNotFoundError(f"State expired: {key}")
            return State(storage=self, key=key, _state=state_data.state)
        except StateNotFoundError:
            if default_state is not None:
                await self.set_state(default_state, key, ttl=ttl.total_seconds() if ttl else None)
                return State(storage=self, key=key, _state=default_state)
            return State(storage=self, key=key, _state=None)
    
    async def state_exists(self, key: str) -> bool:
        """Check if a state exists and is not expired."""
        try:
            state_data = await self.get_state_data(key)
            return not state_data.is_expired
        except StateNotFoundError:
            return False
    
    # ===== Thread-safe wrappers =====
    
    async def _with_lock(self, coro):
        """Execute a coroutine with the storage lock."""
        async with self._lock:
            return await coro
    
    # ===== Context manager support =====
    
    async def __aenter__(self):
        """Support for async context manager."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Clean up resources when exiting the context."""
        try:
            await self.cleanup_expired()
        except Exception as e:
            logger.error(f"Error during storage cleanup: {e}")
            # Don't propagate cleanup errors
            return False
        return False
