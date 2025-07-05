"""Tests for Redis storage implementation."""
import pytest
import asyncio
import json
from datetime import datetime, timezone
from unittest.mock import patch, MagicMock, AsyncMock

from pyrogram_patch.fsm.storages.redis_storage import RedisStorage
from pyrogram_patch.fsm.base_storage import StateData
from pyrogram_patch.fsm.states import State

class TestRedisStorage:
    """Test Redis storage implementation."""
    
    @pytest.fixture
    def redis_mock(self):
        """Create a mock Redis client with pipeline support."""
        # Create the Redis mock
        mock = AsyncMock()
        
        # Create a mock for the pipeline
        class PipelineMock:
            def __init__(self):
                self.hset = AsyncMock(return_value=self)
                self.expire = AsyncMock(return_value=self)
                self.delete = AsyncMock(return_value=self)
                self.execute = AsyncMock(return_value=[1, 1])  # Return values for multiple operations
                self.reset = AsyncMock()
                
            async def __aenter__(self):
                return self
                
            async def __aexit__(self, exc_type, exc_val, exc_tb):
                pass
        
        # Create the pipeline instance
        pipeline_instance = PipelineMock()
        
        # Configure the pipeline method to return our pipeline instance
        async def pipeline():
            return pipeline_instance
            
        mock.pipeline = AsyncMock(side_effect=pipeline)
        
        # Mock basic Redis methods
        mock.get = AsyncMock(return_value=None)
        mock.set = AsyncMock(return_value=True)
        mock.delete = AsyncMock(return_value=1)
        mock.close = AsyncMock()
        mock.aclose = AsyncMock()
        mock.hget = AsyncMock(return_value=None)
        
        return mock, pipeline_instance
    
    @pytest.fixture
    def state_data(self):
        """Create a test state data object."""
        now = datetime.now(timezone.utc)
        return StateData(
            state='test_state',
            data={'key': 'value'},
            created_at=now,
            updated_at=now
        )
    
    @pytest.fixture
    async def redis_storage(self, redis_mock):
        """Create a RedisStorage instance with mock Redis client."""
        mock, _ = redis_mock
        storage = RedisStorage(redis=mock, key_prefix='test')
        yield storage
        if hasattr(storage, 'close'):
            await storage.close()
    
    @pytest.mark.asyncio
    async def test_set_get_state(self, redis_storage, redis_mock, state_data):
        """Test setting and getting a state."""
        mock, pipe_mock = redis_mock
        key = 'test_key'

        # Mock the hgetall response to return the state metadata
        mock.hgetall.return_value = {
            b'state': b'test_state',
            b'created_at': state_data.created_at.isoformat().encode(),
            b'updated_at': state_data.updated_at.isoformat().encode(),
            b'expires_at': b''
        }
        
        # Mock the get_data method to return the expected data
        with patch.object(redis_storage, 'get_data', new_callable=AsyncMock) as mock_get_data:
            mock_get_data.return_value = state_data.data
            
            # Get state data
            result = await redis_storage.get_state_data(key)
            
            # Verify the result
            assert result is not None
            assert result.state == state_data.state
            assert result.data == state_data.data
            assert result.created_at == state_data.created_at
            assert result.updated_at == state_data.updated_at
            
            # Verify hgetall was called with the correct key
            mock.hgetall.assert_awaited_once_with('test:fsm:meta:test_key')
            
            # Verify get_data was called with the correct key
            mock_get_data.assert_awaited_once_with(key)

    @pytest.mark.asyncio
    async def test_finish_state(self, redis_storage, redis_mock):
        """Test finishing a state (deleting it)."""
        mock, pipe_mock = redis_mock
        key = 'test_key'

        # Test finishing a state
        await redis_storage.finish_state(key)

        # Verify pipeline was used
        mock.pipeline.assert_called_once()

        # Verify delete was called with the correct keys
        assert pipe_mock.delete.call_count == 2
        
        # Get all delete calls
        delete_calls = pipe_mock.delete.call_args_list
        
        # Extract the keys that were deleted
        deleted_keys = [call[0][0] for call in delete_calls]
        
        # Check that both expected keys were deleted (order doesn't matter)
        assert 'test:fsm:meta:test_key' in deleted_keys
        assert 'test:fsm:data:test_key' in deleted_keys
        
        # Verify execute was called on the pipeline
        pipe_mock.execute.assert_awaited_once()
    
    @pytest.mark.asyncio
    async def test_close(self, redis_storage, redis_mock):
        """Test closing the storage."""
        mock, _ = redis_mock
        if hasattr(redis_storage, 'close'):
            await redis_storage.close()
            mock.aclose.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_connection_pool(self):
        """Test connection pool creation."""
        mock_redis = AsyncMock()
        with patch('redis.asyncio.Redis', return_value=mock_redis) as mock_redis_class:
            storage = RedisStorage(redis=mock_redis)
            assert storage._redis is mock_redis
            if hasattr(storage, 'close'):
                await storage.close()
    
    @pytest.mark.parametrize('key,prefix,expected', [
        ('test:key', 'fsm:state', 'test:fsm:state:test:key'),
        ('key', 'fsm:data', 'test:fsm:data:key'),
        (None, 'fsm:state', 'test:fsm:state:'),
    ])
    def test_get_key(self, redis_storage, key, prefix, expected):
        """Test key generation with prefix."""
        # The key format is: <key_prefix>:<prefix>:<key>
        # Where key_prefix is 'test' from the fixture
        result = redis_storage._get_key(prefix, key or '')
        assert result == expected, f"Expected {expected}, got {result}"
