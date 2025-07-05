"""Tests for MemoryStorage implementation."""
import pytest
import asyncio
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, AsyncMock

from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
from pyrogram_patch.fsm.base_storage import StateData, StateNotFoundError

class TestMemoryStorage:
    """Test MemoryStorage implementation."""
    
    @pytest.fixture
    def current_time(self):
        """Return current time for testing."""
        return datetime.now(timezone.utc)

    @pytest.fixture
    async def storage(self, current_time):
        """Create a MemoryStorage instance for testing."""
        storage = MemoryStorage()
        # Store current_time in storage for later use in tests
        storage._test_current_time = current_time
        yield storage
        if hasattr(storage, 'close'):
            await storage.close()
    
    @pytest.mark.asyncio
    async def test_set_get_state(self, storage, current_time):
        """Test setting and getting a state."""
        key = 'test_key'
        state_data = StateData(
            state='test_state', 
            data={'key': 'value'},
            created_at=current_time,
            updated_at=current_time
        )
        
        # Set state
        await storage.set_state(key, state_data)
        
        # Get state
        result = await storage.get_state(key)
        
        assert result is not None
        assert result.state == 'test_state'
        assert result.data == {'key': 'value'}
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_state(self, storage):
        """Test getting a non-existent state."""
        result = await storage.get_state('non_existent_key')
        assert result is None
        
        with pytest.raises(StateNotFoundError):
            await storage.get_state('non_existent_key', raise_on_not_found=True)
    
    @pytest.mark.asyncio
    async def test_delete_state(self, storage, current_time):
        """Test deleting a state."""
        key = 'test_key'
        state_data = StateData(
            state='test_state', 
            data={},
            created_at=current_time,
            updated_at=current_time
        )
        
        # Set state
        await storage.set_state(key, state_data)
        
        # Verify state exists
        assert await storage.get_state(key) is not None
        
        # Delete state
        await storage.delete_state(key)
        
        # Verify state is deleted
        assert await storage.get_state(key) is None
    
    @pytest.mark.asyncio
    async def test_cleanup(self, storage, current_time):
        """Test cleanup of expired states."""
        # Set a state with a short TTL
        storage.ttl = 0.1  # 100ms
        key = 'test_key'
        state_data = StateData(
            state='test_state', 
            data={},
            created_at=current_time,
            updated_at=current_time
        )
        
        await storage.set_state(key, state_data)
        assert await storage.get_state(key) is not None
        
        # Wait for TTL to expire
        await asyncio.sleep(0.2)
        
        # Cleanup should remove the expired state
        await storage._cleanup()
        assert await storage.get_state(key) is None
    
    @pytest.mark.asyncio
    async def test_concurrent_access(self, storage, current_time):
        """Test concurrent access to the storage."""
        key = 'test_key'
        state_data = StateData(
            state='test_state', 
            data={'counter': 0},
            created_at=current_time,
            updated_at=current_time
        )
        
        # Set initial state
        await storage.set_state(key, state_data)
        
        # Define a coroutine that increments the counter
        async def increment_counter():
            for _ in range(100):
                data = await storage.get_state(key)
                data.data['counter'] += 1
                await storage.set_state(key, data)
                await asyncio.sleep(0)
        
        # Run multiple incrementers concurrently
        tasks = [asyncio.create_task(increment_counter()) for _ in range(10)]
        await asyncio.gather(*tasks)
        
        # Verify the final counter value
        result = await storage.get_state(key)
        assert result.data['counter'] == 1000  # 100 increments * 10 tasks
    
    @pytest.mark.asyncio
    async def test_close(self, storage):
        """Test closing the storage."""
        if hasattr(storage, 'close'):
            await storage.close()
        # Should not raise any exceptions
        assert True
    
    @pytest.mark.asyncio
    async def test_state_data_serialization(self, storage, current_time):
        """Test serialization of complex state data."""
        key = 'complex_key'
        complex_data = {
            'nested': {'a': 1, 'b': [1, 2, 3], 'c': {'d': 'test'}},
            'date': current_time,
            'number': 123.45,
            'boolean': True,
            'none': None
        }
        
        state_data = StateData(
            state='complex_state', 
            data=complex_data,
            created_at=current_time,
            updated_at=current_time
        )
        
        # Set state with complex data
        await storage.set_state(key, state_data)
        
        # Get state and verify data
        result = await storage.get_state(key)
        assert result is not None
        assert result.state == 'complex_state'
        assert result.data == complex_data
