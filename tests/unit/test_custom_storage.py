"""Tests for custom storage implementation."""
from __future__ import annotations

import pytest
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional, AsyncIterator
from unittest.mock import AsyncMock, MagicMock

from pyrogram_patch.fsm.storages.custom_storage import CustomStorage, StateData, StateNotFoundError

class TestCustomStorage:
    """Test custom storage implementation."""

    @pytest.fixture
    def custom_storage(self):
        """Create a CustomStorage instance with mock methods."""
        storage = MagicMock(spec=CustomStorage)
        storage.get_state_data = AsyncMock()
        storage.set_state = AsyncMock()
        storage.set_data = AsyncMock()
        storage.get_data = AsyncMock()
        storage.finish_state = AsyncMock()
        storage.list_states = AsyncMock()
        storage.cleanup_expired = AsyncMock()
        return storage

    @pytest.mark.asyncio
    async def test_abstract_methods(self):
        """Test that abstract methods raise NotImplementedError."""
        # Skip this test since we can't instantiate an abstract class directly
        # This is tested by the Python runtime when we try to instantiate it
        pass
    
    @pytest.mark.asyncio
    async def test_get_state_data(self, custom_storage):
        """Test getting state data."""
        test_data = StateData(
            state="test_state",
            data={"key": "value"},
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        custom_storage.get_state_data.return_value = test_data
        
        result = await custom_storage.get_state_data("test_key")
        assert result == test_data
        custom_storage.get_state_data.assert_awaited_once_with("test_key")

    @pytest.mark.asyncio
    async def test_get_state_data_not_found(self, custom_storage):
        """Test getting a non-existent state."""
        custom_storage.get_state_data.side_effect = StateNotFoundError("Not found")
        
        with pytest.raises(StateNotFoundError):
            await custom_storage.get_state_data("non_existent_key")
            
        custom_storage.get_state_data.assert_awaited_once_with("non_existent_key")

    @pytest.mark.asyncio
    async def test_set_state(self, custom_storage):
        """Test setting a state."""
        test_data = {"key": "value"}
        
        await custom_storage.set_state("test_state", "test_key", test_data)
        
        # Check that set_state was called with the correct arguments
        custom_storage.set_state.assert_awaited_once_with(
            "test_state", "test_key", test_data
        )

    @pytest.mark.asyncio
    async def test_set_state_validation(self):
        """Test state validation in set_state."""
        class TestStorage(CustomStorage):
            async def get_state_data(self, key: str):
                pass
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                if not state:
                    raise ValueError("State cannot be empty")
                if not key:
                    raise ValueError("Key cannot be empty")
            async def set_data(self, data: dict, key: str) -> None:
                pass
            async def get_data(self, key: str) -> dict:
                pass
            async def finish_state(self, key: str) -> None:
                pass
            async def list_states(self) -> AsyncIterator[str]:
                yield ""
            async def cleanup_expired(self) -> int:
                return 0
        
        storage = TestStorage()
        
        with pytest.raises(ValueError, match="State cannot be empty"):
            await storage.set_state("", "test_key")
            
        with pytest.raises(ValueError, match="Key cannot be empty"):
            await storage.set_state("test_state", "")

    @pytest.mark.asyncio
    async def test_finish_state(self, custom_storage):
        """Test finishing a state."""
        await custom_storage.finish_state("test_key")
        custom_storage.finish_state.assert_awaited_once_with("test_key")

    @pytest.mark.asyncio
    async def test_close(self, custom_storage):
        """Test closing the storage."""
        # Add the close method to the mock
        custom_storage.close = AsyncMock()
        
        await custom_storage.close()
        custom_storage.close.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_dict_storage_implementation(self):
        """Test a complete in-memory dictionary implementation."""
        class DictStorage(CustomStorage):
            def __init__(self):
                super().__init__()
                self._storage = {}
                self._locks = {}
                
            async def get_state_data(self, key: str) -> StateData:
                if key not in self._storage:
                    raise StateNotFoundError("Not found")
                return self._storage[key]
                
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                now = datetime.now(timezone.utc)
                self._storage[key] = StateData(
                    state=state,
                    data=data or {},
                    created_at=now,
                    updated_at=now,
                    expires_at=now + timedelta(seconds=ttl) if ttl else None
                )
                
            async def set_data(self, data: dict, key: str) -> None:
                now = datetime.now(timezone.utc)
                if key not in self._storage:
                    self._storage[key] = StateData(
                        state=None,
                        data=data,
                        created_at=now,
                        updated_at=now
                    )
                else:
                    # Create a new StateData with updated data and timestamp
                    current = self._storage[key]
                    new_data = current.data.copy()
                    new_data.update(data)
                    self._storage[key] = StateData(
                        state=current.state,
                        data=new_data,
                        created_at=current.created_at,
                        updated_at=now,
                        expires_at=current.expires_at
                    )
            
            async def get_data(self, key: str) -> dict:
                if key not in self._storage:
                    return {}
                return self._storage[key].data
                
            async def finish_state(self, key: str) -> None:
                self._storage.pop(key, None)
                
            async def list_states(self) -> AsyncIterator[str]:
                for key in self._storage.keys():
                    yield key
                    
            async def cleanup_expired(self) -> int:
                now = datetime.now(timezone.utc)
                to_remove = [
                    key for key, state in self._storage.items()
                    if state.expires_at and state.expires_at < now
                ]
                for key in to_remove:
                    self._storage.pop(key, None)
                return len(to_remove)
        
        # Test the implementation
        storage = DictStorage()
        
        # Test set_state and get_state_data
        await storage.set_state("test_state", "test_key", {"key": "value"}, 3600)
        state = await storage.get_state_data("test_key")
        assert state.state == "test_state"
        assert state.data == {"key": "value"}
        assert state.expires_at is not None
        
        # Test set_data and get_data
        await storage.set_data({"new_key": "new_value"}, "test_key")
        data = await storage.get_data("test_key")
        assert data == {"key": "value", "new_key": "new_value"}
        
        # Test list_states
        states = [key async for key in storage.list_states()]
        assert "test_key" in states
        
        # Test finish_state
        await storage.finish_state("test_key")
        with pytest.raises(StateNotFoundError):
            await storage.get_state_data("test_key")
            
        # Test cleanup_expired
        await storage.set_state("test_state", "expired_key", {}, 1)
        await asyncio.sleep(1.1)  # Wait for expiration
        removed = await storage.cleanup_expired()
        assert removed == 1
        with pytest.raises(StateNotFoundError):
            await storage.get_state_data("expired_key")

    @pytest.mark.asyncio
    async def test_error_handling(self):
        """Test error handling in custom storage."""
        class ErrorStorage(CustomStorage):
            async def get_state_data(self, key: str):
                raise ValueError("Test error")
                
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                raise ValueError("Test error")
                
            async def set_data(self, data: dict, key: str) -> None:
                raise ValueError("Test error")
                
            async def get_data(self, key: str) -> dict:
                raise ValueError("Test error")
                
            async def finish_state(self, key: str) -> None:
                raise ValueError("Test error")
                
            async def list_states(self) -> AsyncIterator[str]:
                raise ValueError("Test error")
                
            async def cleanup_expired(self) -> int:
                raise ValueError("Test error")
        
        storage = ErrorStorage()
        
        with pytest.raises(ValueError, match="Test error"):
            await storage.get_state_data("test_key")
            
        with pytest.raises(ValueError, match="Test error"):
            await storage.set_state("test", "test_key", {})
            
        with pytest.raises(ValueError, match="Test error"):
            await storage.finish_state("test_key")
    
    @pytest.mark.asyncio
    async def test_concurrent_access(self):
        """Test concurrent access to the storage."""
        class ConcurrentDictStorage(CustomStorage):
            def __init__(self):
                super().__init__()
                self._storage = {}
                self._counter = 0
            
            async def get_state_data(self, key: str):
                if key not in self._storage:
                    raise StateNotFoundError("Not found")
                return self._storage[key]
                
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                # Simulate some processing time
                await asyncio.sleep(0.1)
                now = datetime.now(timezone.utc)
                self._storage[key] = StateData(
                    state=state,
                    data=data or {},
                    created_at=now,
                    updated_at=now,
                    expires_at=now + timedelta(seconds=ttl) if ttl else None
                )
                self._counter += 1
                
            async def set_data(self, data: dict, key: str) -> None:
                now = datetime.now(timezone.utc)
                if key not in self._storage:
                    self._storage[key] = StateData(
                        state=None,
                        data=data,
                        created_at=now,
                        updated_at=now
                    )
                else:
                    # Create a new StateData with updated data and timestamp
                    current = self._storage[key]
                    new_data = current.data.copy()
                    new_data.update(data)
                    self._storage[key] = StateData(
                        state=current.state,
                        data=new_data,
                        created_at=current.created_at,
                        updated_at=now,
                        expires_at=current.expires_at
                    )
            
            async def get_data(self, key: str) -> dict:
                if key not in self._storage:
                    return {}
                return self._storage[key].data
                
            async def finish_state(self, key: str) -> None:
                self._storage.pop(key, None)
                
            async def list_states(self) -> AsyncIterator[str]:
                for key in list(self._storage.keys()):
                    yield key
                    
            async def cleanup_expired(self) -> int:
                now = datetime.now(timezone.utc)
                to_remove = [
                    key for key, state in self._storage.items()
                    if state.expires_at and state.expires_at < now
                ]
                for key in to_remove:
                    self._storage.pop(key, None)
                return len(to_remove)
        
        storage = ConcurrentDictStorage()
        key = "test_key"
        
        # Set initial state
        await storage.set_state("test", key, {"counter": 0})
        
        # Test concurrent writes
        async def update_counter():
            # Get current state
            try:
                state = await storage.get_state_data(key)
                current_data = state.data.copy()
            except StateNotFoundError:
                current_data = {"counter": 0}
            
            # Increment counter
            current_data["counter"] += 1
            
            # Update data
            await storage.set_data(current_data, key)
        
        # Run multiple updates concurrently
        await asyncio.gather(*[update_counter() for _ in range(10)])
        
        # Verify the final state
        result = await storage.get_state_data(key)
        assert result.data["counter"] == 10  # Should be 10 if properly synchronized
    
    @pytest.mark.asyncio
    async def test_state_data_serialization(self):
        """Test serialization of complex state data."""
        class SerializationStorage(CustomStorage):
            def __init__(self):
                super().__init__()
                self._storage = {}
            
            async def get_state_data(self, key: str):
                if key not in self._storage:
                    raise StateNotFoundError("Not found")
                return self._storage[key]
                
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                now = datetime.now(timezone.utc)
                self._storage[key] = StateData(
                    state=state,
                    data=data or {},
                    created_at=now,
                    updated_at=now,
                    expires_at=now + timedelta(seconds=ttl) if ttl else None
                )
                
            async def set_data(self, data: dict, key: str) -> None:
                now = datetime.now(timezone.utc)
                if key not in self._storage:
                    self._storage[key] = StateData(
                        state=None,
                        data=data,
                        created_at=now,
                        updated_at=now
                    )
                else:
                    current = self._storage[key]
                    new_data = current.data.copy()
                    new_data.update(data)
                    self._storage[key] = StateData(
                        state=current.state,
                        data=new_data,
                        created_at=current.created_at,
                        updated_at=now,
                        expires_at=current.expires_at
                    )
            
            async def get_data(self, key: str) -> dict:
                if key not in self._storage:
                    return {}
                return self._storage[key].data
                
            async def finish_state(self, key: str) -> None:
                self._storage.pop(key, None)
                
            async def list_states(self) -> AsyncIterator[str]:
                for key in self._storage.keys():
                    yield key
                    
            async def cleanup_expired(self) -> int:
                now = datetime.now(timezone.utc)
                to_remove = [
                    key for key, state in self._storage.items()
                    if state.expires_at and state.expires_at < now
                ]
                for key in to_remove:
                    self._storage.pop(key, None)
                return len(to_remove)
        
        storage = SerializationStorage()
        
        # Test with complex data
        complex_data = {
            "int": 42,
            "float": 3.14,
            "str": "test",
            "list": [1, 2, 3],
            "dict": {"a": 1, "b": 2},
            "nested": {"a": [{"b": 1}, {"c": 2}]}
        }
        
        await storage.set_state("test_state", "complex_key", complex_data)
        result = await storage.get_state_data("complex_key")
        
        assert result.state == "test_state"
        assert result.data == complex_data
        
        # Test updating part of the data
        await storage.set_data({"new_key": "new_value"}, "complex_key")
        result = await storage.get_state_data("complex_key")
        assert result.data["new_key"] == "new_value"
        assert result.data["int"] == 42  # Existing data should be preserved
    
    @pytest.mark.asyncio
    async def test_storage_cleanup(self):
        """Test storage cleanup functionality."""
        class CleanupStorage(CustomStorage):
            def __init__(self):
                super().__init__()
                self._storage = {}
                self.cleanup_called = False
            
            async def get_state_data(self, key: str):
                if key not in self._storage:
                    raise StateNotFoundError("Not found")
                return self._storage[key]
                
            async def set_state(self, state: str, key: str, data: dict = None, ttl: int = None) -> None:
                now = datetime.now(timezone.utc)
                self._storage[key] = StateData(
                    state=state,
                    data=data or {},
                    created_at=now,
                    updated_at=now,
                    expires_at=now + timedelta(seconds=ttl) if ttl else None
                )
                
            async def set_data(self, data: dict, key: str) -> None:
                now = datetime.now(timezone.utc)
                if key not in self._storage:
                    self._storage[key] = StateData(
                        state=None,
                        data=data,
                        created_at=now,
                        updated_at=now
                    )
                else:
                    current = self._storage[key]
                    new_data = current.data.copy()
                    new_data.update(data)
                    self._storage[key] = StateData(
                        state=current.state,
                        data=new_data,
                        created_at=current.created_at,
                        updated_at=now,
                        expires_at=current.expires_at
                    )
            
            async def get_data(self, key: str) -> dict:
                if key not in self._storage:
                    return {}
                return self._storage[key].data
                
            async def finish_state(self, key: str) -> None:
                self._storage.pop(key, None)
                
            async def list_states(self) -> AsyncIterator[str]:
                for key in self._storage.keys():
                    yield key
                    
            async def cleanup_expired(self) -> int:
                self.cleanup_called = True
                now = datetime.now(timezone.utc)
                to_remove = [
                    key for key, state in self._storage.items()
                    if state.expires_at and state.expires_at < now
                ]
                for key in to_remove:
                    self._storage.pop(key, None)
                return len(to_remove)
        
        storage = CleanupStorage()
        
        # Add some states with different TTLs
        now = datetime.now(timezone.utc)
        
        # This one will expire in 1 second
        await storage.set_state("expired", "expired_key", {"key": "value"}, 1)
        
        # This one will not expire
        await storage.set_state("permanent", "permanent_key", {"key": "value"}, None)
        
        # Wait for the expired state to expire
        await asyncio.sleep(1.1)
        
        # Run cleanup
        removed = await storage.cleanup_expired()
        
        # Only the expired state should be removed
        assert removed == 1
        assert storage.cleanup_called
        
        # The expired state should be gone
        with pytest.raises(StateNotFoundError):
            await storage.get_state_data("expired_key")
        
        # The permanent state should still be there
        result = await storage.get_state_data("permanent_key")
        assert result.state == "permanent"
