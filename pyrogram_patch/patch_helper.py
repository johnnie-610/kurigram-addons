import inspect
from typing import Any, Dict, Optional, TypeVar, Union, Callable, Awaitable, Type, Tuple
from contextlib import suppress
import weakref
from threading import RLock

from pyrogram import Client, StopPropagation
from pyrogram.handlers.handler import Handler
from pyrogram.types import Update, User, Chat

from .patch_data_pool import PatchDataPool

# Type variables for better type hints
T = TypeVar('T')
UpdateT = TypeVar('UpdateT', bound=Update)
HandlerT = TypeVar('HandlerT', bound=Handler)
MiddlewareFunc = Callable[[UpdateT, Client, 'PatchHelper'], Awaitable[Any]]

async def create_key(parsed_update: Update, client: Client) -> str:
    """Generate a unique key for state management based on the update and client.
    
    Args:
        parsed_update: The parsed update object from Pyrogram
        client: The Pyrogram client instance
        
    Returns:
        A string key in the format: "client_id-user_id-chat_id"
    """
    chat_id = "unknown"
    user_id = "unknown"
    
    # Extract user ID
    if hasattr(parsed_update, "from_user") and parsed_update.from_user is not None:
        user_id = str(parsed_update.from_user.id)
    elif hasattr(parsed_update, "message") and parsed_update.message is not None:
        if parsed_update.message.from_user is not None:
            user_id = str(parsed_update.message.from_user.id)
    
    # Extract chat ID
    if hasattr(parsed_update, "chat") and parsed_update.chat is not None:
        chat_id = str(parsed_update.chat.id)
    elif hasattr(parsed_update, "message") and parsed_update.message is not None:
        if hasattr(parsed_update.message, "chat") and parsed_update.message.chat is not None:
            chat_id = str(parsed_update.message.chat.id)
    
    return f"{client.me.id}-{user_id}-{chat_id}"

class PatchHelper:
    """Helper class for managing update processing in Pyrogram Patch.
    
    This class provides utilities for working with updates, middleware, and state management
    in a Pyrogram application using the patch system.
    """
    
    __slots__ = ('_data', 'state', '_lock')
    
    def __init__(self) -> None:
        """Initialize a new PatchHelper instance."""
        self._data: Dict[str, Any] = {}
        self.state: str = "*"
        self._lock: RLock = RLock()
    
    async def skip_handler(self) -> None:
        """Skip the current handler execution.
        
        Raises:
            StopPropagation: Always raises this to stop handler execution
        """
        raise StopPropagation(
            "Handler execution skipped by PatchHelper.skip_handler(). "
            "This is an expected behavior when skipping handlers."
        )
    
    async def _get_data_for_handler(self, arguments: inspect.Signature.parameters) -> Dict[str, Any]:
        """Prepare data to be passed to a handler based on its signature.
        
        Args:
            arguments: The parameters of the handler function
            
        Returns:
            A dictionary of arguments to pass to the handler
        """
        kwargs = {}
        
        # Always include state and self if needed
        if "state" in arguments:
            kwargs["state"] = self.state
        if "patch_helper" in arguments:
            kwargs["patch_helper"] = self
        
        # Include any additional data that matches the handler's parameters
        with self._lock:
            if self._data:
                kwargs.update({
                    k: v for k, v in self._data.items() 
                    if k in arguments
                })
                
        return kwargs
    
    async def _process_middleware(
        self, 
        parsed_update: UpdateT, 
        middleware: MiddlewareFunc, 
        client: Client
    ) -> Any:
        """Process a middleware with the given update and client.
        
        Args:
            parsed_update: The update to process
            middleware: The middleware function to call
            client: The Pyrogram client instance
            
        Returns:
            The result of the middleware processing
        """
        return await middleware(parsed_update, client, self)
    
    async def _include_state(
        self, 
        parsed_update: Update, 
        storage: Any, 
        client: Client
    ) -> None:
        """Include state from storage for the given update.
        
        Args:
            parsed_update: The update to get state for
            storage: The storage backend to use
            client: The Pyrogram client instance
        """
        if storage is not None:
            self.state = await storage.checkup(await create_key(parsed_update, client))
    
    @classmethod
    def get_from_pool(cls, update: Update) -> 'PatchHelper':
        """Get a PatchHelper instance from the update pool.
        
        Args:
            update: The update to get the helper for
            
        Returns:
            An existing PatchHelper instance or a new one if not found
        """
        from .patch_data_pool import global_pool
        helper = global_pool.get_helper_from_pool(update)
        return helper if helper is not None else cls()
    
    @staticmethod
    def generate_state_key(
        client_id: int, 
        user_id: Union[int, str] = "unknown", 
        chat_id: Union[int, str] = "unknown"
    ) -> str:
        """Generate a state key from the given components.
        
        Args:
            client_id: The client ID
            user_id: The user ID (default: "unknown")
            chat_id: The chat ID (default: "unknown")
            
        Returns:
            A string key in the format: "client_id-user_id-chat_id"
        """
        return f"{client_id}-{user_id}-{chat_id}"
    
    @property
    def data(self) -> Dict[str, Any]:
        """Get the helper's data dictionary.
        
        Returns:
            A copy of the internal data dictionary
        """
        with self._lock:
            return self._data.copy()
    
    def update_data(self, **kwargs: Any) -> None:
        """Update the helper's data with the given key-value pairs.
        
        Args:
            **kwargs: Key-value pairs to update
        """
        with self._lock:
            self._data.update(kwargs)
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get a value from the helper's data.
        
        Args:
            key: The key to get
            default: The default value if key doesn't exist
            
        Returns:
            The value for the key or the default
        """
        with self._lock:
            return self._data.get(key, default)
    
    def __getitem__(self, key: str) -> Any:
        """Get an item from the helper's data.
        
        Args:
            key: The key to get
            
        Returns:
            The value for the key
            
        Raises:
            KeyError: If the key doesn't exist
        """
        with self._lock:
            return self._data[key]
    
    def __setitem__(self, key: str, value: Any) -> None:
        """Set an item in the helper's data.
        
        Args:
            key: The key to set
            value: The value to set
        """
        with self._lock:
            self._data[key] = value
    
    def __delitem__(self, key: str) -> None:
        """Delete an item from the helper's data.
        
        Args:
            key: The key to delete
            
        Raises:
            KeyError: If the key doesn't exist
        """
        with self._lock:
            del self._data[key]
    
    def __contains__(self, key: str) -> bool:
        """Check if a key exists in the helper's data.
        
        Args:
            key: The key to check
            
        Returns:
            True if the key exists, False otherwise
        """
        with self._lock:
            return key in self._data
    
    def __len__(self) -> int:
        """Get the number of items in the helper's data.
        
        Returns:
            The number of items
        """
        with self._lock:
            return len(self._data)
    
    def __repr__(self) -> str:
        """Get a string representation of the helper.
        
        Returns:
            A string representation
        """
        with self._lock:
            return f"PatchHelper(state={self.state!r}, data={self._data!r})"
    
    def __str__(self) -> str:
        """Get a user-friendly string representation.
        
        Returns:
            A user-friendly string
        """
        return self.__repr__()