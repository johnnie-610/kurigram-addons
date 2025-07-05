import pytest
from unittest.mock import MagicMock, AsyncMock
from pyrogram.handlers import MessageHandler

class TestMiddleware:
    @pytest.fixture
    def middleware_manager(self):
        from pyrogram_patch.middlewares import MiddlewareManager
        return MiddlewareManager()
    
    @pytest.fixture
    def mock_message_handler(self):
        from pyrogram.handlers import MessageHandler
        return MessageHandler(None, None)
    
    @pytest.mark.asyncio
    async def test_middleware_flow(self, middleware_manager, mock_message_handler):
        """Test that middleware is called in the correct order."""
        from pyrogram_patch.middlewares.middleware_types.middlewares import BaseMiddleware
        
        # Track the execution order
        execution_order = []
        
        # Create test middlewares as classes
        class Middleware1(BaseMiddleware):
            handler_type = MessageHandler
            
            async def __call__(self, client, update, call_next):
                execution_order.append("pre-middleware1")
                result = await call_next(client, update)
                execution_order.append("post-middleware1")
                return result
        
        class Middleware2(BaseMiddleware):
            handler_type = MessageHandler
            
            async def __call__(self, client, update, call_next):
                execution_order.append("pre-middleware2")
                result = await call_next(client, update)
                execution_order.append("post-middleware2")
                return result
        
        # Register middlewares
        middleware_manager.register(MessageHandler, Middleware1())
        middleware_manager.register(MessageHandler, Middleware2())
        
        # Create a test handler
        async def test_handler(client, update):
            execution_order.append("handler")
            return "test_result"
        
        # Process the update through middlewares
        client = MagicMock()
        update = MagicMock()
        
        # Create a call_next function that calls our test handler
        async def call_next(client, update):
            return await test_handler(client, update)
        
        # Process the update
        result = await middleware_manager.process_update(MessageHandler, client, update, call_next)
        
        # Check the result
        assert result == "test_result"
        
        # Check the execution order
        assert execution_order == [
            "pre-middleware1",
            "pre-middleware2",
            "handler",
            "post-middleware2",
            "post-middleware1",
        ]
    
    @pytest.mark.asyncio
    async def test_middleware_modification(self, middleware_manager, mock_message_handler):
        """Test that middleware can modify the update and result."""
        from pyrogram_patch.middlewares.middleware_types.middlewares import BaseMiddleware
        
        # Create a middleware that modifies the update and result
        class ModifyMiddleware(BaseMiddleware):
            handler_type = MessageHandler
            
            async def __call__(self, client, update, call_next):
                # Modify the update
                update.modified = True
                
                # Call the next middleware/handler
                result = await call_next(client, update)
                
                # Modify the result
                return f"modified_{result}"
        
        # Register the middleware
        middleware_manager.register(MessageHandler, ModifyMiddleware())
        
        # Create a test handler
        async def test_handler(client, update):
            assert hasattr(update, 'modified')
            assert update.modified is True
            return "test_result"
        
        # Process the update
        client = MagicMock()
        update = MagicMock()
        
        # Create a call_next function that calls our test handler
        async def call_next(client, update):
            return await test_handler(client, update)
        
        # Process the update
        result = await middleware_manager.process_update(MessageHandler, client, update, call_next)
        
        # Check the result was modified
        assert result == "modified_test_result"
    
    @pytest.mark.asyncio
    async def test_middleware_exception_handling(self, middleware_manager, mock_message_handler):
        """Test that exceptions in middleware are properly handled."""
        from pyrogram_patch.middlewares.middleware_types.middlewares import BaseMiddleware
        
        # Track cleanup operations
        cleanup = []
        
        # Create a middleware that raises an exception
        class FailingMiddleware(BaseMiddleware):
            handler_type = MessageHandler
            
            async def __call__(self, client, update, call_next):
                cleanup.append("pre-failing")
                try:
                    return await call_next(client, update)
                finally:
                    cleanup.append("post-failing")
        
        # Create a middleware that runs after the failing one
        class CleanupMiddleware(BaseMiddleware):
            handler_type = MessageHandler
            
            async def __call__(self, client, update, call_next):
                cleanup.append("pre-cleanup")
                try:
                    return await call_next(client, update)
                finally:
                    cleanup.append("post-cleanup")
        
        # Register middlewares
        middleware_manager.register(MessageHandler, FailingMiddleware())
        middleware_manager.register(MessageHandler, CleanupMiddleware())
        
        # Create a test handler that raises an exception
        async def test_handler(client, update):
            raise ValueError("Test error")
        
        # Process the update
        client = MagicMock()
        update = MagicMock()
        
        # Create a call_next function that calls our test handler
        async def call_next(client, update):
            return await test_handler(client, update)
        
        # Call the wrapped handler and expect an exception
        with pytest.raises(ValueError, match="Test error"):
            await middleware_manager.process_update(MessageHandler, client, update, call_next)
        
        # Check that cleanup happened in the correct order
        assert cleanup == [
            "pre-failing",
            "pre-cleanup",
            "post-cleanup",
            "post-failing",
        ]
