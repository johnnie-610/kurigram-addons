import pytest
from unittest.mock import MagicMock, AsyncMock
from pyrogram.handlers import MessageHandler

class TestPatchManager:
    def test_patch_manager_initialization(self, patch_manager, mock_client):
        """Test that PatchManager initializes correctly."""
        assert patch_manager is not None
        assert patch_manager.client == mock_client
        assert isinstance(patch_manager.dispatcher, AsyncMock)  # Mocked in fixture

    def test_include_middleware(self, patch_manager):
        """Test that include_middleware adds middleware to PatchDataPool."""
        from pyrogram_patch.patch_data_pool import global_pool
        
        # Create a test middleware
        async def test_middleware(update, client, helper):
            return "test_middleware"
            
        # Add the middleware
        patch_manager.include_middleware(test_middleware)
        
        # Check that middleware was added to PatchDataPool
        middlewares = global_pool.pyrogram_patch_middlewares
        assert test_middleware in middlewares
        
    def test_include_outer_middleware(self, patch_manager):
        """Test that include_outer_middleware adds outer middleware to PatchDataPool."""
        from pyrogram_patch.patch_data_pool import global_pool
        
        # Create a test outer middleware
        async def test_outer_middleware(update, client, helper):
            return "test_outer_middleware"
            
        # Add the outer middleware
        patch_manager.include_outer_middleware(test_outer_middleware)
        
        # Check that outer middleware was added to PatchDataPool
        outer_middlewares = global_pool.pyrogram_patch_outer_middlewares
        assert test_outer_middleware in outer_middlewares

    def test_include_router(self, patch_manager, mock_client):
        """Test that include_router adds router's handlers to the client."""
        from pyrogram_patch.router import Router
        from pyrogram.handlers import MessageHandler
        
        # Create a test router with a handler
        router = Router()
        
        # Create a test handler function
        async def test_handler(client, message):
            return "test_handler"
            
        # Add the handler directly to the router's internal storage
        # This is a workaround since we can't use the decorator in tests
        handler = MessageHandler(test_handler)
        router._decorators_storage.append((handler, 0))
        
        # Mock the client's add_handler method
        mock_client.add_handler = MagicMock()
        
        # Add the router
        patch_manager.include_router(router)
        
        # Check that the router's handlers were added to the client
        mock_client.add_handler.assert_called_once_with(handler, 0)

    def test_patch_twice_raises_error(self, mock_client):
        """Test that patching a client twice raises an error."""
        from pyrogram_patch.patch import patch
        
        # First patch should work
        patch(mock_client)
        
        # Second patch should raise an error
        with pytest.raises(RuntimeError, match="already been patched"):
            patch(mock_client)
