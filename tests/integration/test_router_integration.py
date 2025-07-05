import pytest
from unittest.mock import MagicMock, AsyncMock
from pyrogram.types import Message, User, Chat

class TestRouterIntegration:
    @pytest.fixture
    def router(self):
        from pyrogram_patch.router import Router
        return Router()
    
    @pytest.fixture
    def patched_client(self, router):
        """Create a client with the router's handlers registered."""
        from pyrogram import Client
        
        client = MagicMock(spec=Client)
        client.add_handler = MagicMock()
        
        # Set the client for the router
        router.set_client(client)
        return client
    
    @pytest.mark.asyncio
    async def test_router_registration(self, router, patched_client):
        """Test that router correctly registers handlers with the client."""
        # Register a test handler
        @router.on_message()
        async def test_handler(_, __):
            pass
            
        # Set the client to trigger handler registration
        router.set_client(patched_client)
        
        # Check that add_handler was called
        assert patched_client.add_handler.called
        
        # Get the registered handler
        handler = patched_client.add_handler.call_args[0][0]
        assert handler is not None
    
    @pytest.mark.asyncio
    async def test_message_handling(self, router, patched_client, mock_message):
        """Test that messages are correctly routed to handlers."""
        # Create a test handler
        test_handler = AsyncMock(return_value="test_response")
        
        # Register the handler with the router
        @router.on_message()
        async def test_route(_, __):
            return await test_handler(_, __)
        
        # Create a mock update
        update = mock_message
        
        # Simulate message handling
        from pyrogram.handlers import MessageHandler
        handler = patched_client.add_handler.call_args[0][0]
        
        # Call the handler directly
        await handler.callback(patched_client, update)
        
        # Verify the handler was called
        test_handler.assert_awaited_once_with(patched_client, update)
    
    @pytest.mark.asyncio
    async def test_callback_query_handling(self, router, patched_client):
        """Test that callback queries are correctly routed to handlers."""
        from pyrogram.types import CallbackQuery, User
        
        # Create a test handler
        test_handler = AsyncMock(return_value="test_callback_response")
        
        # Register the handler with the router
        @router.on_callback_query()
        async def test_callback_route(_, __):
            return await test_handler(_, __)
        
        # Create a mock callback query
        callback_query = MagicMock(spec=CallbackQuery)
        callback_query.from_user = User(
            id=12345, 
            first_name="Test", 
            is_bot=False
        )
        callback_query.data = "test_data"
        
        # Simulate callback query handling
        from pyrogram.handlers import CallbackQueryHandler
        
        # Find the callback handler
        callback_handler = None
        for call in patched_client.add_handler.call_args_list:
            if isinstance(call[0][0], CallbackQueryHandler):
                callback_handler = call[0][0]
                break
        
        assert callback_handler is not None, "No CallbackQueryHandler found"
        
        # Call the handler directly
        await callback_handler.callback(patched_client, callback_query)
        
        # Verify the handler was called
        test_handler.assert_awaited_once_with(patched_client, callback_query)
