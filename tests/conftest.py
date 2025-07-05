import asyncio
import pytest
import os
import sys
from unittest.mock import MagicMock, patch, AsyncMock
from typing import Tuple, Any, Dict

import pytest_asyncio
from pyrogram import Client
from pyrogram.types import Message, User, Chat

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Test configuration
TEST_API_ID = 12345
TEST_API_HASH = "test_api_hash_123"
TEST_BOT_TOKEN = "test_bot_token_123"

@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_client():
    """Create a mock Pyrogram client for testing."""
    client = MagicMock(spec=Client)
    client.dispatcher = AsyncMock()
    client.me = MagicMock()
    client.me.id = 12345
    return client

@pytest.fixture
def mock_message():
    """Create a mock Pyrogram message for testing."""
    message = MagicMock(spec=Message)
    message.id = 12345
    message.chat = MagicMock(spec=Chat)
    message.chat.id = -1001234567890
    message.chat.type = "private"
    message.from_user = MagicMock(spec=User)
    message.from_user.id = 123456789
    message.from_user.first_name = "Test"
    message.text = "/test"
    return message

@pytest.fixture
def patch_manager(mock_client):
    """Create a fresh PatchManager instance for testing."""
    with patch('pyrogram_patch.patch.PatchedDispatcher', new_callable=AsyncMock) as mock_dispatcher:
        from pyrogram_patch.patch import PatchManager
        manager = PatchManager(client=mock_client)
        manager.dispatcher = mock_dispatcher
        return manager

@pytest.fixture
def patch_helper(patch_manager, mock_message):
    """Create a PatchHelper instance for testing."""
    from pyrogram_patch.helper import PatchHelper
    return PatchHelper(patch_manager, mock_message)

# Redis test server fixture
@pytest.fixture(scope="session")
def redis_server():
    """Fixture that provides a Redis server for testing."""
    import redis
    from redis.exceptions import ConnectionError
    
    host = os.getenv("REDIS_HOST", "localhost")
    port = int(os.getenv("REDIS_PORT", 6379))
    
    # Test connection
    try:
        r = redis.Redis(host=host, port=port, db=0, socket_connect_timeout=1)
        r.ping()
        return host, port
    except (ConnectionError, ConnectionRefusedError):
        pytest.skip("Redis server not available")

# MongoDB test server fixture
@pytest.fixture(scope="session")
def mongodb_server():
    """Fixture that provides a MongoDB server for testing."""
    import pymongo
    from pymongo import MongoClient
    
    host = os.getenv("MONGO_HOST", "localhost")
    port = int(os.getenv("MONGO_PORT", 27017))
    
    # Test connection
    try:
        client = MongoClient(host=host, port=port, serverSelectionTimeoutMS=1000)
        client.server_info()  # Will raise an exception if can't connect
        return host, port
    except (pymongo.errors.ServerSelectionTimeoutError, pymongo.errors.ConnectionFailure):
        pytest.skip("MongoDB server not available")

# Redis storage fixture
@pytest_asyncio.fixture
async def redis_storage(redis_server):
    """Fixture that provides a RedisStorage instance for testing."""
    from pyrogram_patch.fsm.storages.redis_storage import RedisStorage
    
    host, port = redis_server
    storage = RedisStorage(
        host=host,
        port=port,
        db=1,  # Use a different DB for tests
        prefix="test_fsm:",
        ttl=3600
    )
    
    # Clean up before tests
    await storage._redis.flushdb()
    
    yield storage
    
    # Clean up after tests
    await storage._redis.flushdb()
    await storage.close()

# MongoDB storage fixture
@pytest_asyncio.fixture
async def mongo_storage(mongodb_server):
    """Fixture that provides a MongoStorage instance for testing."""
    from pyrogram_patch.fsm.storages.mongo_storage import MongoStorage
    
    host, port = mongodb_server
    storage = MongoStorage(
        f"mongodb://{host}:{port}",
        "test_db",
        "test_collection",
        ttl=3600
    )
    
    # Clean up before tests
    await storage._collection.drop()
    
    yield storage
    
    # Clean up after tests
    await storage._collection.drop()
    await storage.close()

# Memory storage fixture
@pytest_asyncio.fixture
async def memory_storage():
    """Fixture that provides a MemoryStorage instance for testing."""
    from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
    
    storage = MemoryStorage()
    
    yield storage
    
    # Clean up
    await storage.close()

@pytest.fixture
def patch_data_pool():
    """Create a fresh PatchDataPool instance for testing."""
    from pyrogram_patch.patch_data_pool import PatchDataPool
    return PatchDataPool()

@pytest.fixture
def dispatcher():
    """Create a fresh Dispatcher instance for testing."""
    from pyrogram_patch.dispatcher import Dispatcher
    return Dispatcher()
