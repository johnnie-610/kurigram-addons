from typing import Optional, List, Tuple, Any, TypeVar
from pyrogram import Client
from pyrogram.handlers.handler import Handler

from .patched_decorators import PatchedDecorators

# Type variable for handler groups (0-99 as per Pyrogram's convention)
GroupT = TypeVar('GroupT', bound=int)


from .patched_decorators import PatchedDecorators

class Router(PatchedDecorators):
    """
    A router class that manages Pyrogram event handlers with a clean decorator interface.
    
    This class combines all the patched decorators and provides a way to manage
    the Pyrogram client and its handlers. It's designed to be used as a base class
    for creating custom routers in Pyrogram applications.
    
    Example:
        ```python
        from pyrogram import Client
        from pyrogram_patch.router import Router
        
        app = Client("my_account")
        router = Router()
        
        @router.on_message()
        async def handle_message(client, message):
            print(f"Received message: {message.text}")
            
        router.set_client(app)
        app.run()
        ```
    """
    __slots__ = ('_app', '_decorators_storage')
    
    def __init__(self) -> None:
        """Initialize a new Router instance."""
        self._app: Optional[Client] = None
        self._decorators_storage: List[Tuple[Handler, GroupT]] = []

    @property
    def client(self) -> Optional[Client]:
        """Get the current Pyrogram client instance.
        
        Returns:
            Optional[Client]: The current Pyrogram client, or None if not set.
        """
        return self._app

    def set_client(self, client: Client) -> None:
        """Set the Pyrogram client and register all stored handlers.
        
        Args:
            client: The Pyrogram client instance to use.
            
        Raises:
            TypeError: If the provided client is not a Pyrogram Client instance.
            RuntimeError: If there's an error adding a handler to the client.
        """
        if not isinstance(client, Client):
            raise TypeError(f"Expected a Pyrogram Client instance, got {type(client).__name__}")
            
        self._app = client
        
        for handler, group in self._decorators_storage:
            try:
                self._app.add_handler(handler, group)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to add handler {handler.__class__.__name__} to client: {str(e)}"
                ) from e
    
    def clear_handlers(self) -> None:
        """Clear all registered handlers from the client."""
        if self._app is not None:
            self._app.dispatcher.handlers.clear()
        self._decorators_storage.clear()