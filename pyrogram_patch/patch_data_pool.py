from dataclasses import dataclass, field
from typing import Dict, List, Optional, TypeVar, Generic, Any, Type
from contextlib import suppress
import weakref
from threading import RLock

from pyrogram_patch.fsm import BaseStorage

# Type variable for the update type
T = TypeVar('T')

@dataclass
class PatchDataPool:
    """A thread-safe pool for managing Pyrogram update handlers and middleware.
    
    This class provides a centralized storage for:
    - Update handlers and their associated helpers
    - Middleware components
    - FSM storage
    
    The pool is designed to be thread-safe and efficient for high-load scenarios.
    """
    
    # Use weakref.WeakValueDictionary to avoid memory leaks from abandoned updates
    _update_pool: Dict[int, Any] = field(default_factory=weakref.WeakValueDictionary)
    
    # Middleware lists
    _middlewares: List[Any] = field(default_factory=list)
    _outer_middlewares: List[Any] = field(default_factory=list)
    
    # FSM storage
    _fsm_storage: Optional[BaseStorage] = None
    
    # Thread safety
    _lock: RLock = field(default_factory=RLock)
    
    @property
    def update_pool(self) -> Dict[int, Any]:
        """Thread-safe access to the update pool."""
        with self._lock:
            return dict(self._update_pool)
    
    @property
    def pyrogram_patch_middlewares(self) -> List[Any]:
        """Thread-safe access to middlewares."""
        with self._lock:
            return self._middlewares.copy()
    
    @property
    def pyrogram_patch_outer_middlewares(self) -> List[Any]:
        """Thread-safe access to outer middlewares."""
        with self._lock:
            return self._outer_middlewares.copy()
    
    @property
    def pyrogram_patch_fsm_storage(self) -> Optional[BaseStorage]:
        """Thread-safe access to FSM storage."""
        with self._lock:
            return self._fsm_storage
    
    @pyrogram_patch_fsm_storage.setter
    def pyrogram_patch_fsm_storage(self, value: Optional[BaseStorage]) -> None:
        """Thread-safe setter for FSM storage."""
        with self._lock:
            self._fsm_storage = value
    
    def include_helper_to_pool(self, update: Any, patch_helper: Any) -> None:
        """Add a helper to the update pool.
        
        Args:
            update: The update object to associate with the helper.
            patch_helper: The helper object to store.
            
        Note:
            The update object must be hashable.
        """
        with self._lock:
            self._update_pool[id(update)] = patch_helper
    
    def exclude_helper_from_pool(self, update: Any) -> None:
        """Remove a helper from the update pool.
        
        Args:
            update: The update object whose helper should be removed.
        """
        with self._lock:
            with suppress(KeyError):
                del self._update_pool[id(update)]
    
    def get_helper_from_pool(self, update: Any) -> Optional[Any]:
        """Retrieve a helper from the update pool.
        
        Args:
            update: The update object whose helper to retrieve.
            
        Returns:
            The associated helper object, or None if not found.
        """
        with self._lock:
            return self._update_pool.get(id(update))
    
    def clear(self) -> None:
        """Clear all data from the pool."""
        with self._lock:
            self._update_pool.clear()
            self._middlewares.clear()
            self._outer_middlewares.clear()
            self._fsm_storage = None

# Create a global instance for backward compatibility
global_pool = PatchDataPool()

# Maintain backward compatibility with the old API
update_pool = global_pool._update_pool
pyrogram_patch_middlewares = global_pool._middlewares
pyrogram_patch_outer_middlewares = global_pool._outer_middlewares
pyrogram_patch_fsm_storage = global_pool._fsm_storage