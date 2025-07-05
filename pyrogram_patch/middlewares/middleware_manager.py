#! usr/bin/env python3
# 
#
# 
# 



from typing import List, Type, Any, Callable, Awaitable, Dict, TypeVar, Optional
from pyrogram.handlers.handler import Handler
from .middleware_types.middlewares import BaseMiddleware

T = TypeVar('T', bound=Handler)

class MiddlewareManager:
    """
    Manages registration and execution of middlewares for Pyrogram handlers.
    
    This class is responsible for:
    - Registering middlewares for specific handler types
    - Executing middlewares in the correct order
    - Managing the middleware chain
    """
    
    def __init__(self):
        # Dictionary to store middlewares by handler type
        self._middlewares: Dict[Type[Handler], List[BaseMiddleware]] = {}
    
    def register(self, handler_type: Type[T], middleware: BaseMiddleware) -> None:
        """
        Register a middleware for a specific handler type.
        
        Args:
            handler_type: The Pyrogram handler type this middleware should handle
            middleware: The middleware instance to register
        """
        if not issubclass(handler_type, Handler):
            raise TypeError(f"Expected a Handler subclass, got {handler_type.__name__}")
            
        if not isinstance(middleware, BaseMiddleware):
            raise TypeError(f"Expected a BaseMiddleware instance, got {type(middleware).__name__}")
        
        print(f"Registering middleware {middleware.__class__.__name__} for handler type {handler_type.__name__}")
        
        # Initialize the list for this handler type if it doesn't exist
        if handler_type not in self._middlewares:
            print(f"Creating new middleware list for handler type {handler_type.__name__}")
            self._middlewares[handler_type] = []
        
        # Check if a middleware of the same type is already registered
        middleware_class = middleware.__class__
        existing_middlewares = [mw for mw in self._middlewares[handler_type] if mw.__class__ == middleware_class]
        
        if not existing_middlewares:
            print(f"Adding middleware {middleware_class.__name__} to the list")
            self._middlewares[handler_type].append(middleware)
        else:
            print(f"Middleware {middleware_class.__name__} is already registered for {handler_type.__name__}")
    
    def unregister(self, handler_type: Type[T], middleware: BaseMiddleware) -> None:
        """
        Unregister a middleware for a specific handler type.
        
        Args:
            handler_type: The handler type to unregister the middleware from
            middleware: The middleware instance to unregister
        """
        if handler_type in self._middlewares:
            if middleware in self._middlewares[handler_type]:
                self._middlewares[handler_type].remove(middleware)
                # Remove the handler type entry if no more middlewares are registered
                if not self._middlewares[handler_type]:
                    del self._middlewares[handler_type]
    
    def get_middlewares(self, handler_type: Type[T]) -> List[BaseMiddleware]:
        """
        Get all middlewares registered for a specific handler type.
        
        Args:
            handler_type: The handler type to get middlewares for
            
        Returns:
            List of middlewares for the specified handler type, in the order they were registered
        """
        print(f"\nGetting middlewares for handler type: {handler_type.__name__}")
        
        # Get middlewares for the specific handler type
        specific_middlewares = self._middlewares.get(handler_type, []).copy()
        print(f"Found {len(specific_middlewares)} specific middlewares for {handler_type.__name__}")
        
        # Also include middlewares registered for all handler types (None key)
        all_middlewares = self._middlewares.get(None, []).copy()
        print(f"Found {len(all_middlewares)} global middlewares")
        
        # Combine both lists, with specific middlewares first
        combined = specific_middlewares + all_middlewares
        print(f"Total middlewares to execute: {len(combined)}")
        for i, mw in enumerate(combined):
            print(f"  {i}. {mw.__class__.__name__}")
            
        return combined
    
    async def process_update(
        self,
        handler_type: Type[T],
        client: Any,
        update: Any,
        call_next: Callable[[Any, Any], Awaitable[Any]]
    ) -> Any:
        """
        Process an update through all registered middlewares.
        
        Args:
            handler_type: The type of handler processing this update
            client: The Pyrogram client instance
            update: The update to process
            call_next: The next middleware or handler to call
            
        Returns:
            The result of processing the update
        """
        print(f"\n=== Starting to process update for {handler_type.__name__} ===")
        
        # Get all middlewares for this handler type
        middlewares = self.get_middlewares(handler_type)
        
        # If no middlewares, just call the next handler
        if not middlewares:
            print("No middlewares found, calling final handler directly")
            return await call_next(client, update)
        
        # Create a chain of middleware calls
        async def invoke_middleware(middleware_index: int, c, u):
            # If we've processed all middlewares, call the final handler
            if middleware_index >= len(middlewares):
                print(f"\n=== Reached end of middleware chain, calling final handler ===")
                result = await call_next(c, u)
                print(f"=== Final handler returned: {result} ===")
                return result
            
            # Get the current middleware
            current_middleware = middlewares[middleware_index]
            print(f"\n=== Executing middleware {middleware_index}: {current_middleware.__class__.__name__} ===")
            
            # Create a next function that will call the next middleware in the chain
            async def next_middleware(c_next=None, u_next=None):
                # Use the provided client/update or fall back to the current ones
                next_c = c_next if c_next is not None else c
                next_u = u_next if u_next is not None else u
                print(f"  {current_middleware.__class__.__name__}: Calling next middleware in chain...")
                # Call the next middleware in the chain
                return await invoke_middleware(middleware_index + 1, next_c, next_u)
            
            # Call the current middleware with the next function
            try:
                print(f"  {current_middleware.__class__.__name__}: Calling middleware with client and update")
                result = await current_middleware(c, u, next_middleware)
                print(f"  {current_middleware.__class__.__name__}: Middleware completed with result: {result}")
                return result
            except Exception as e:
                print(f"  {current_middleware.__class__.__name__}: Middleware raised exception: {e}")
                raise
        
        # Start the middleware chain with the first middleware
        print("\n=== Starting middleware chain ===")
        try:
            result = await invoke_middleware(0, client, update)
            print("\n=== Middleware chain completed successfully ===")
            return result
        except Exception as e:
            print(f"\n=== Middleware chain failed with exception: {e} ===")
            raise
    
    def clear(self) -> None:
        """Clear all registered middlewares."""
        self._middlewares.clear()
