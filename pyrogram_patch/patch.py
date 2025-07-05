from typing import Any, Type, TypeVar, Optional, TYPE_CHECKING
from pyrogram import Client
from pyrogram.handlers.handler import Handler

from .dispatcher import PatchedDispatcher
from .router import Router
from .patch_data_pool import PatchDataPool, global_pool

if TYPE_CHECKING:
    from .fsm.base_storage import BaseStorage

# Type variable for middleware type
MiddlewareT = TypeVar('MiddlewareT', bound=Any)  # More specific type could be used

class PatchManager:
    """Manages patching of Pyrogram client and middleware registration.
    
    This class provides an interface to:
    - Apply patches to the Pyrogram client
    - Register middlewares for request/response processing
    - Configure state management storage
    - Include routers for organized handler registration
    """
    
    def __init__(self, client: Client) -> None:
        """Initialize the PatchManager.
        
        Args:
            client: The Pyrogram client instance to patch
        """
        self.client = client
        self.dispatcher: PatchedDispatcher = client.dispatcher
        
    def include_middleware(self, middleware: MiddlewareT) -> None:
        """Register a middleware to process updates before handlers.
        
        Args:
            middleware: The middleware instance to register
        """
        # Use the global pool instance to add middleware
        with global_pool._lock:
            global_pool._middlewares.append(middleware)
        
    def include_outer_middleware(self, middleware: MiddlewareT) -> None:
        """Register an outer middleware that runs before regular middlewares.
        
        Args:
            middleware: The middleware instance to register
        """
        # Use the global pool instance to add outer middleware
        with global_pool._lock:
            global_pool._outer_middlewares.append(middleware)
        
    def set_storage(self, storage: 'BaseStorage') -> None:
        """Set the storage backend for FSM (Finite State Machine).
        
        Args:
            storage: The storage implementation to use
        """
        # Use the global pool instance to set FSM storage
        with global_pool._lock:
            global_pool._fsm_storage = storage
        
    def include_router(self, router: Router) -> None:
        """Register a router with the client.
        
        Args:
            router: The router instance to register
        """
        router.set_client(self.client)
        
    def __repr__(self) -> str:
        """Return a string representation of the PatchManager."""
        return f"<PatchManager client={self.client!r}>"


def patch(app: Client) -> PatchManager:
    """Apply patches to a Pyrogram client.
    
    This function:
    1. Replaces the default dispatcher with a patched version
    2. Returns a PatchManager instance for further configuration
    
    Args:
        app: The Pyrogram client instance to patch
        
    Returns:
        PatchManager: An instance for configuring patches
        
    Example:
        >>> from pyrogram import Client
        >>> from pyrogram_patch import patch
        >>> 
        >>> app = Client("my_account")
        >>> patch_manager = patch(app)
        >>> # Configure patches...
    """
    if not isinstance(app, Client):
        raise TypeError(f"Expected Client instance, got {type(app).__name__}")
        
    if hasattr(app, '_patched'):
        raise RuntimeError("This client has already been patched")
        
    # Replace the default dispatcher
    original_dispatcher = app.dispatcher
    app.dispatcher = PatchedDispatcher(app)
    
    # Store reference to original dispatcher for potential unpatching
    app._original_dispatcher = original_dispatcher
    app._patched = True
    
    return PatchManager(app)


def unpatch(app: Client) -> None:
    """Revert patches applied to a Pyrogram client.
    
    Args:
        app: The Pyrogram client to un-patch
        
    Raises:
        RuntimeError: If the client hasn't been patched
        AttributeError: If the original dispatcher is missing
    """
    if not getattr(app, '_patched', False):
        raise RuntimeError("This client has not been patched")
        
    if not hasattr(app, '_original_dispatcher'):
        raise AttributeError("Original dispatcher not found")
        
    # Restore the original dispatcher
    app.dispatcher = app._original_dispatcher
    
    # Clean up
    del app._original_dispatcher
    del app._patched