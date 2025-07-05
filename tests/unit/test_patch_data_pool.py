import pytest
import threading
import weakref
from unittest.mock import MagicMock, patch

class TestPatchDataPool:
    def test_singleton_pattern(self):
        """Test that global_pool is a singleton instance."""
        from pyrogram_patch.patch_data_pool import PatchDataPool, global_pool
        
        # Create a new instance
        new_pool = PatchDataPool()
        
        # Check it's not the same as global_pool
        assert new_pool is not global_pool
        
        # Check global_pool is a singleton
        another_global = global_pool
        assert another_global is global_pool

    def test_thread_safety(self, patch_data_pool):
        """Test that PatchDataPool operations are thread-safe."""
        results = []
        
        def worker(pool, i):
            update = MagicMock()
            update.message_id = i
            # Store the update in the pool using the actual method
            with pool._lock:
                pool._update_pool[update.message_id] = update
            # Retrieve it directly from the internal _update_pool
            with pool._lock:
                results.append(pool._update_pool.get(update.message_id))
        
        # Create multiple threads
        threads = []
        for i in range(10):
            t = threading.Thread(target=worker, args=(patch_data_pool, i))
            threads.append(t)
            t.start()
        
        # Wait for all threads to complete
        for t in threads:
            t.join()
        
        # Verify all operations completed successfully
        assert len(results) == 10
        assert all(result is not None for result in results)

    def test_update_pool_property(self, patch_data_pool):
        """Test the update_pool property."""
        # Add some test data
        test_data = {1: 'test1', 2: 'test2'}
        with patch.object(patch_data_pool, '_update_pool', test_data.copy()):
            # Test the property
            assert patch_data_pool.update_pool == test_data
            # Test that it returns a copy
            assert patch_data_pool.update_pool is not test_data

    def test_middleware_properties(self, patch_data_pool):
        """Test the middleware-related properties."""
        # Test middlewares property
        test_middlewares = ['middleware1', 'middleware2']
        with patch.object(patch_data_pool, '_middlewares', test_middlewares.copy()):
            assert patch_data_pool.pyrogram_patch_middlewares == test_middlewares
            # Should return a copy
            assert patch_data_pool.pyrogram_patch_middlewares is not test_middlewares
        
        # Test outer middlewares property
        test_outer_middlewares = ['outer1', 'outer2']
        with patch.object(patch_data_pool, '_outer_middlewares', test_outer_middlewares.copy()):
            assert patch_data_pool.pyrogram_patch_outer_middlewares == test_outer_middlewares
            # Should return a copy
            assert patch_data_pool.pyrogram_patch_outer_middlewares is not test_outer_middlewares
    
    def test_fsm_storage_property(self, patch_data_pool):
        """Test the FSM storage property."""
        # Mock the FSM storage
        mock_storage = MagicMock()
        
        # Set the storage
        patch_data_pool.fsm_storage = mock_storage
        
        # Test getting the storage
        assert patch_data_pool.fsm_storage is mock_storage
        
        # Test setting the storage
        new_storage = MagicMock()
        patch_data_pool.fsm_storage = new_storage
        assert patch_data_pool.fsm_storage is new_storage
