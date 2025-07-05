import pytest
from unittest.mock import MagicMock, AsyncMock
from enum import Enum, auto

class TestFSM:
    class TestStates(Enum):
        START = auto()
        MIDDLE = auto()
        END = auto()
    
    @pytest.fixture
    def fsm_storage(self):
        from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
        return MemoryStorage()
    
    @pytest.fixture
    def fsm(self, fsm_storage):
        from pyrogram_patch.fsm import FSMContext
        return FSMContext(storage=fsm_storage)
    
    @pytest.fixture
    def update(self):
        update = MagicMock()
        update.chat = MagicMock()
        update.chat.id = 12345
        update.from_user = MagicMock()
        update.from_user.id = 54321
        return update
    
    @pytest.mark.asyncio
    async def test_state_management(self, fsm, update):
        """Test basic state management operations."""
        # Set initial state
        await fsm.set_state(update, self.TestStates.START)
        
        # Check state was set
        state = await fsm.get_state(update)
        assert state == self.TestStates.START
        
        # Update state
        await fsm.set_state(update, self.TestStates.MIDDLE)
        
        # Check state was updated
        state = await fsm.get_state(update)
        assert state == self.TestStates.MIDDLE
        
        # Reset state
        await fsm.finish(update)
        
        # Check state was reset
        state = await fsm.get_state(update)
        assert state is None
    
    @pytest.mark.asyncio
    async def test_data_management(self, fsm, update):
        """Test data storage and retrieval."""
        # Set some data
        test_data = {"key1": "value1", "key2": 42}
        await fsm.set_data(update, test_data)
        
        # Get all data
        data = await fsm.get_data(update)
        assert data == test_data
        
        # Update data
        await fsm.update_data(update, {"key2": 100, "key3": [1, 2, 3]})
        
        # Check updated data
        data = await fsm.get_data(update)
        assert data == {"key1": "value1", "key2": 100, "key3": [1, 2, 3]}
        
        # Clear data
        await fsm.finish(update)
        data = await fsm.get_data(update)
        assert data == {}
    
    @pytest.mark.asyncio
    async def test_state_with_data(self, fsm, update):
        """Test that state and data can be managed together."""
        # Set state with data
        state_data = {"counter": 0, "items": []}
        await fsm.set_state(update, self.TestStates.START, state_data)
        
        # Check both state and data
        state = await fsm.get_state(update)
        data = await fsm.get_data(update)
        
        assert state == self.TestStates.START
        assert data == state_data
        
        # Update state with new data
        new_data = {"counter": 1, "items": ["item1"], "new_field": "test"}
        await fsm.set_state(update, self.TestStates.MIDDLE, new_data)
        
        # Check updates
        state = await fsm.get_state(update)
        data = await fsm.get_data(update)
        
        assert state == self.TestStates.MIDDLE
        assert data == new_data
    
    @pytest.mark.asyncio
    async def test_multiple_chats(self, fsm):
        """Test that FSM works with multiple chat contexts."""
        # Create updates for different chats
        update1 = MagicMock()
        update1.chat = MagicMock()
        update1.chat.id = 11111
        update1.from_user = MagicMock()
        update1.from_user.id = 22222
        
        update2 = MagicMock()
        update2.chat = MagicMock()
        update2.chat.id = 33333
        update2.from_user = MagicMock()
        update2.from_user.id = 44444
        
        # Set different states for different chats
        await fsm.set_state(update1, self.TestStates.START, {"chat": "first"})
        await fsm.set_state(update2, self.TestStates.END, {"chat": "second"})
        
        # Verify states are maintained separately
        state1 = await fsm.get_state(update1)
        data1 = await fsm.get_data(update1)
        
        state2 = await fsm.get_state(update2)
        data2 = await fsm.get_data(update2)
        
        assert state1 == self.TestStates.START
        assert data1 == {"chat": "first"}
        
        assert state2 == self.TestStates.END
        assert data2 == {"chat": "second"}
