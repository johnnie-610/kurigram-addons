from dataclasses import dataclass
from typing import Any, Dict, Optional, TypeVar, Type, TYPE_CHECKING
import asyncio
from functools import wraps

if TYPE_CHECKING:
    from .base_storage import BaseStorage

T = TypeVar('T', bound='State')


def synchronized(coro):
    """Decorator to make coroutine thread-safe using a lock."""
    @wraps(coro)
    async def wrapper(self, *args, **kwargs):
        async with self._lock:
            return await coro(self, *args, **kwargs)
    return wrapper


class State:
    """A class representing a state in a finite state machine.
    
    This class provides thread-safe state management with asynchronous storage operations.
    """
    def __init__(self, name: str, storage: "BaseStorage", key: str) -> None:
        """Initialize a new State instance.
        
        Args:
            name: The initial name/identifier of the state.
            storage: The storage backend to persist state data.
            key: Unique identifier for this state instance.
        """
        self._name = name
        self.__storage = storage
        self.__key = key
        self._lock = asyncio.Lock()

    @synchronized
    async def set_state(self, state: str) -> None:
        """Set the current state in the storage and update the instance's state.

        Args:
            state: The new state to set. Must be a string identifier.
            
        Raises:
            ValueError: If state is not a string or is empty.
            StorageError: If the storage operation fails.
        """
        if not isinstance(state, str) or not state.strip():
            raise ValueError("State must be a non-empty string")
            
        try:
            await self.__storage.set_state(state, self.__key)
            self._name = state
        except Exception as e:
            raise type(e)(f"Failed to set state: {e}") from e

    @synchronized
    async def set_data(self, data: Dict[str, Any]) -> None:
        """Store data in the state storage.

        Args:
            data: Dictionary containing the data to be stored.
                
        Raises:
            TypeError: If data is not a dictionary.
            StorageError: If the storage operation fails.
        """
        if not isinstance(data, dict):
            raise TypeError("Data must be a dictionary")
            
        try:
            await self.__storage.set_data(data, self.__key)
        except Exception as e:
            raise type(e)(f"Failed to set data: {e}") from e

    @synchronized
    async def get_data(self) -> Dict[str, Any]:
        """Retrieve the stored data from the state storage.

        Returns:
            dict: The data stored in the state, or an empty dict if no data exists.
            
        Raises:
            StorageError: If the storage operation fails.
        """
        try:
            data = await self.__storage.get_data(self.__key)
            return data if isinstance(data, dict) else {}
        except Exception as e:
            raise type(e)(f"Failed to get data: {e}") from e

    @synchronized
    async def finish(self) -> None:
        """Clean up and finalize the current state in the storage.
        
        This removes the state data from storage and resets the instance state.
        
        Raises:
            StorageError: If the storage operation fails.
        """
        try:
            await self.__storage.finish_state(self.__key)
            self._name = ""
        except Exception as e:
            raise type(e)(f"Failed to finish state: {e}") from e

    @classmethod
    async def create_state(cls: Type[T], key: str, **kwargs) -> T:
        """Create and initialize a new state instance with the given key.

        Args:
            key: The unique identifier for the new state.
            **kwargs: Additional arguments to pass to the storage's checkup method.

        Returns:
            State: A new State instance associated with the given key.
            
        Raises:
            StorageError: If the storage operation fails.
        """
        if not key:
            raise ValueError("Key cannot be empty")
            
        try:
            storage = kwargs.pop('storage')
            return await storage.checkup(key, **kwargs)
        except Exception as e:
            raise type(e)(f"Failed to create state: {e}") from e

    def __str__(self) -> str:
        """Return a string representation of the state."""
        return f"State(name='{self._name}', key='{self.__key}')"

    def __repr__(self) -> str:
        """Return the official string representation of the state."""
        return f"State(name='{self._name}', key='{self.__key}')"

    @property
    def name(self) -> str:
        """Get the current state name."""
        return self._name

    @property
    def state(self) -> str:
        """Get the current state name (alias for name property)."""
        return self._name

    def __repr__(self) -> str:
        return f"State(name - {self.name} | key - {self.__key})"

    @property
    def state(self) -> str:
        return self.name


class StateItem:
    """A descriptor for defining states within a StatesGroup.
    
    This descriptor generates unique state identifiers in the format:
    'StatesGroup_<class_name>_State_<attribute_name>'
    """
    def __get__(self, obj: Any, cls: type) -> str:
        """Get the fully qualified state name.
        
        Args:
            obj: The instance that the attribute was accessed through, or None.
            cls: The class that this descriptor is defined in.
                
        Returns:
            str: A string in the format 'StatesGroup_<class_name>_State_<attribute_name>'
            
        Raises:
            AttributeError: If the descriptor is not found in the class.
        """
        for name, value in vars(cls).items():
            if value is self:
                return f"StatesGroup_{cls.__name__}_State_{name}"
        raise AttributeError(
            f"{self.__class__.__name__} descriptor not found in {cls.__name__}"
        )


@dataclass(init=False, frozen=True)
class StatesGroup:
    """Base class for creating state groups.
    
    Example:
        class AuthStates(StatesGroup):
            waiting_for_phone = StateItem()
            waiting_for_code = StateItem()
            
        # Usage:
        state = AuthStates.waiting_for_phone  # Returns 'StatesGroup_AuthStates_State_waiting_for_phone'
    """
    __slots__ = ()  # Prevent creation of instance attributes
    
    def __init_subclass__(cls, **kwargs: Any) -> None:
        """Initialize a new StatesGroup subclass.
        
        Args:
            **kwargs: Additional keyword arguments passed to the parent class.
            
        Raises:
            TypeError: If any attribute is not a StateItem instance.
        """
        super().__init_subclass__(**kwargs)
        for name, value in vars(cls).items():
            if not name.startswith('_') and not isinstance(value, StateItem):
                raise TypeError(
                    f"{cls.__name__}.{name} must be a StateItem instance, "
                    f"not {type(value).__name__}"
                )
