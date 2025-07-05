import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from pyrogram.types import Message, User, Chat, CallbackQuery
from pyrogram import Client

class TestPatchHelper:
    @pytest.fixture
    def patch_helper(self):
        from pyrogram_patch.patch_helper import PatchHelper
        return PatchHelper()
    
    @pytest.fixture
    def mock_client(self):
        client = MagicMock(spec=Client)
        client.me = MagicMock()
        client.me.id = 12345
        return client
    
    @pytest.fixture
    def message_update(self):
        """Create a mock message update."""
        message = MagicMock(spec=Message)
        message.id = 12345
        message.chat = MagicMock()
        message.chat.id = -1001234567890
        message.from_user = MagicMock()
        message.from_user.id = 54321
        message.text = "/test"
        return message
    
    @pytest.fixture
    def callback_query_update(self):
        """Create a mock callback query update."""
        callback = MagicMock(spec=CallbackQuery)
        callback.id = "test_callback_id"
        callback.message = MagicMock()
        callback.message.id = 12345
        callback.message.chat = MagicMock()
        callback.message.chat.id = -1001234567890
        callback.from_user = MagicMock()
        callback.from_user.id = 54321
        callback.data = "test_data"
        return callback
    
    @pytest.mark.asyncio
    async def test_create_key_message(self, patch_helper, mock_client, message_update):
        """Test the create_key method with a message update."""
        from pyrogram_patch.patch_helper import create_key
        
        # Test with a message update
        key = await create_key(message_update, mock_client)
        assert key == f"{mock_client.me.id}-{message_update.from_user.id}-{message_update.chat.id}"
    
    @pytest.mark.asyncio
    async def test_create_key_callback(self, patch_helper, mock_client, callback_query_update):
        """Test the create_key method with a callback query update."""
        from pyrogram_patch.patch_helper import create_key
        
        # Test with a callback query update
        key = await create_key(callback_query_update, mock_client)
        assert key == f"{mock_client.me.id}-{callback_query_update.from_user.id}-{callback_query_update.message.chat.id}"
    
    @pytest.mark.asyncio
    async def test_skip_handler(self, patch_helper):
        """Test the skip_handler method."""
        from pyrogram import StopPropagation
        with pytest.raises(StopPropagation):
            await patch_helper.skip_handler()
    
    @pytest.mark.asyncio
    async def test_data_property(self, patch_helper):
        """Test the data property."""
        # Initially empty
        assert patch_helper.data == {}
        
        # Add some data
        patch_helper["test_key"] = "test_value"
        assert patch_helper.data == {"test_key": "test_value"}
    
    @pytest.mark.asyncio
    async def test_update_data(self, patch_helper):
        """Test the update_data method."""
        patch_helper.update_data(key1="value1", key2="value2")
        assert patch_helper["key1"] == "value1"
        assert patch_helper["key2"] == "value2"
    
    @pytest.mark.asyncio
    async def test_get_method(self, patch_helper):
        """Test the get method."""
        patch_helper["test_key"] = "test_value"
        assert patch_helper.get("test_key") == "test_value"
        assert patch_helper.get("nonexistent") is None
        assert patch_helper.get("nonexistent", "default") == "default"
    
    @pytest.mark.asyncio
    async def test_dict_like_operations(self, patch_helper):
        """Test dictionary-like operations."""
        # Test __setitem__ and __getitem__
        patch_helper["test"] = "value"
        assert patch_helper["test"] == "value"
        
        # Test __delitem__
        del patch_helper["test"]
        with pytest.raises(KeyError):
            _ = patch_helper["test"]
        
        # Test __contains__
        patch_helper["test"] = "value"
        assert "test" in patch_helper
        assert "nonexistent" not in patch_helper
        
        # Test __len__
        assert len(patch_helper) == 1
    
    @pytest.mark.asyncio
    async def test_get_from_pool(self, message_update):
        """Test the get_from_pool class method."""
        from pyrogram_patch.patch_helper import PatchHelper
        from pyrogram_patch.patch_data_pool import global_pool
        
        # Clear the pool first
        global_pool.clear()
        
        # Test with no helper in pool
        helper = PatchHelper.get_from_pool(message_update)
        assert isinstance(helper, PatchHelper)
        
        # Test with helper in pool
        test_helper = PatchHelper()
        global_pool.include_helper_to_pool(message_update, test_helper)
        
        # Get the helper using the class method
        helper = PatchHelper.get_from_pool(message_update)
        assert helper is test_helper
    
    @pytest.mark.asyncio
    async def test_include_state(self, patch_helper, message_update, mock_client):
        """Test the _include_state method."""
        # Mock storage
        storage = AsyncMock()
        storage.checkup = AsyncMock(return_value="test_state")
        
        # Call the method
        await patch_helper._include_state(message_update, storage, mock_client)
        
        # Check the result
        assert patch_helper.state == "test_state"
        storage.checkup.assert_awaited_once()
    
    @pytest.mark.asyncio
    async def test_process_middleware(self, patch_helper, message_update, mock_client):
        """Test the _process_middleware method."""
        # Create a mock middleware
        async def mock_middleware(update, client, helper):
            return "middleware_result"
        
        # Call the method
        result = await patch_helper._process_middleware(
            message_update, mock_middleware, mock_client
        )
        
        # Check the result
        assert result == "middleware_result"
    
    @pytest.mark.asyncio
    async def test_get_data_for_handler(self, patch_helper):
        """Test the _get_data_for_handler method."""
        import inspect
        
        # Create a test function with various parameters
        async def test_func(a, b, *, state=None, patch_helper=None, other=None):
            pass
        
        # Get the function signature
        sig = inspect.signature(test_func)
        
        # Set some data on the helper
        patch_helper.state = "test_state"
        patch_helper["a"] = 1
        patch_helper["b"] = 2
        patch_helper["other"] = 3
        
        # Call the method
        data = await patch_helper._get_data_for_handler(sig.parameters)
        
        # Check the result
        assert data == {
            "a": 1,
            "b": 2,
            "state": "test_state",
            "patch_helper": patch_helper,
            "other": 3
        }
