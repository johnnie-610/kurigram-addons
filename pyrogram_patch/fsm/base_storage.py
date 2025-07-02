from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, TypeVar, AsyncIterator, Generic, Type
from dataclasses import dataclass
from datetime import datetime, timedelta

# Type variables for generic return types
T = TypeVar('T')
StateT = TypeVar('StateT', bound='State')


@dataclass(frozen=True)
class StateData:
    """Container for state-related data.
    
    Attributes:
        state: The current state identifier.
        data: Dictionary containing arbitrary state data.
        created_at: When the state was first created.
        updated_at: When the state was last modified.
        expires_at: When the state should expire (optional).
    """
    state: str
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime] = None

    @property
    def is_expired(self) -> bool:
        """Check if the state has expired."""
        if self.expires_at is None:
            return False
        return datetime.utcnow() >= self.expires_at


class StorageError(Exception):
    """Base exception for storage-related errors."""
    pass


class StateNotFoundError(StorageError):
    """Raised when a requested state is not found in storage."""
    pass


class StateValidationError(StorageError):
    """Raised when state data fails validation."""
    pass


class BaseStorage(ABC):
    """Abstract base class for state storage backends.
    
    Implementations must be thread-safe and support concurrent access.
    """
    
    # Maximum allowed size for state data in bytes
    MAX_DATA_SIZE: int = 1024 * 1024  # 1MB
    
    # Default TTL for states (None means no expiration)
    DEFAULT_TTL: Optional[timedelta] = timedelta(days=1)

    @abstractmethod
    async def get_or_create_state(
        self,
        key: str,
        default_state: Optional[str] = None,
        ttl: Optional[timedelta] = None
    ) -> StateT:
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
        ...

    @abstractmethod
    async def set_state(
        self,
        state: str,
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the state for a given key.
        
        Args:
            state: The new state to set.
            key: The key identifying the state to update.
            ttl: Optional time-to-live for the state.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StateValidationError: If the state is invalid.
            StorageError: For any storage-related errors.
        """
        ...

    @abstractmethod
    async def set_data(
        self,
        data: Dict[str, Any],
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the data for a given state.
        
        Args:
            data: Dictionary of data to store.
            key: The key identifying the state to update.
            ttl: Optional time-to-live for the state.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StateValidationError: If the data is too large or invalid.
            StorageError: For any storage-related errors.
        """
        ...

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
        ...

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
        ...

    @abstractmethod
    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data.
        
        Args:
            key: The key identifying the state to remove.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StorageError: For any storage-related errors.
        """
        ...

    @abstractmethod
    async def cleanup_expired(self) -> int:
        """Remove all expired states.
        
        Returns:
            int: Number of states removed.
            
        Raises:
            StorageError: For any storage-related errors.
        """
        ...

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
        ...

    # Helper methods with default implementations
    
    async def state_exists(self, key: str) -> bool:
        """Check if a state exists.
        
        Args:
            key: The key to check.
                
        Returns:
            bool: True if the state exists, False otherwise.
        """
        try:
            await self.get_state_data(key)
            return True
        except StateNotFoundError:
            return False

    async def update_ttl(
        self,
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the TTL for a state.
        
        Args:
            key: The key identifying the state.
            ttl: New TTL value. If None, uses the default TTL.
                
        Raises:
            StateNotFoundError: If the state doesn't exist.
            StorageError: For any storage-related errors.
        """
        state_data = await self.get_state_data(key)
        if ttl is None:
            ttl = self.DEFAULT_TTL
            
        if ttl is not None:
            await self.set_state(
                state=state_data.state,
                key=key,
                ttl=ttl
            )