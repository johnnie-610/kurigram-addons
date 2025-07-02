#! /usr/bin/env python3
# 
# File: pyrogram_patch/fsm/storages/mongo_storage.py
# 
# This file is part of the Kurigram addons library. 
# 
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.


from __future__ import annotations

from loguru import logger
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, AsyncIterator, cast

from pymongo import AsyncMongoClient
from pymongo.errors import PyMongoError
from pymongo.collection import Collection
from pymongo.asynchronous.database import Database
from pymongo.server_api import ServerApi


from pyrogram_patch.fsm.base_storage import (
    BaseStorage,
    StateData,
    StorageError,
    StateNotFoundError,
    StateValidationError,
)
from pyrogram_patch.fsm.states import State



DEFAULT_DATABASE = "fsm_storage"
DEFAULT_COLLECTION = "states"


class MongoStorage(BaseStorage):
    """MongoDB-backed storage for FSM.
    
    This implementation uses MongoDB to store state data with TTL support.
    It creates a TTL index on the 'expires_at' field for automatic cleanup.
    """
    
    def __init__(
        self,
        client: AsyncMongoClient,
        database: str = DEFAULT_DATABASE,
        collection: str = DEFAULT_COLLECTION,
        **kwargs: Any
    ) -> None:
        """Initialize MongoDB storage.
        
        Args:
            client: Async MongoDB client instance
            database: Database name (default: 'fsm_storage')
            collection: Collection name (default: 'states')
            **kwargs: Additional arguments for collection configuration
        """
        self.client = client
        self.database = database
        self.collection_name = collection
        self._collection: Optional[Collection] = None
        
        # Collection configuration
        self._collection_kwargs = kwargs
        self._ensure_indexes_done = False

    @property
    def collection(self) -> Collection:
        """Get the MongoDB collection with lazy initialization."""
        if self._collection is None:
            self._collection = self.client[self.database][self.collection_name]
        return self._collection

    @classmethod
    def from_uri(
        cls,
        uri: str,
        database: str = DEFAULT_DATABASE,
        collection: str = DEFAULT_COLLECTION,
        **kwargs: Any
    ) -> 'MongoStorage':
        """Create a MongoStorage instance from a MongoDB connection URI.
        
        Args:
            uri: MongoDB connection URI
            database: Database name (default: 'fsm_storage')
            collection: Collection name (default: 'states')
            **kwargs: Additional arguments for AsyncMongoClient
            
        Returns:
            Configured MongoStorage instance
        """
        client = AsyncMongoClient(uri, server_api=ServerApi(
        version='1', strict=True, deprecation_errors=True), **kwargs)
        return cls(client, database=database, collection=collection)

    async def _ensure_indexes(self) -> None:
        """Create necessary indexes if they don't exist."""
        if self._ensure_indexes_done:
            return
            
        try:
            # Create TTL index for automatic document expiration
            await self.collection.create_index(
                "expires_at",
                expireAfterSeconds=0,  # Delete documents immediately when they expire
                background=True
            )
            
            # Create index for faster state lookups
            await self.collection.create_index(
                [("key", 1)],
                unique=True,
                background=True
            )
            
            self._ensure_indexes_done = True
            
        except PyMongoError as e:
            logger.error(f"Failed to create indexes: {e}")
            raise StorageError("Failed to create database indexes") from e

    async def _get_state_document(self, key: str) -> Dict[str, Any]:
        """Get the state document from MongoDB."""
        try:
            await self._ensure_indexes()
            doc = await self.collection.find_one({"key": key})
            
            if not doc:
                raise StateNotFoundError(f"State with key '{key}' not found")
                
            # Check if document is expired
            if doc.get('expires_at') and doc['expires_at'] < datetime.now(datetime.timezone.utc):
                await self.finish_state(key)
                raise StateNotFoundError(f"State with key '{key}' has expired")
                
            return doc
            
        except PyMongoError as e:
            logger.error(f"MongoDB error in _get_state_document: {e}")
            raise StorageError(f"Database error: {e}") from e

    async def get_or_create_state(
        self,
        key: str,
        default_state: Optional[str] = None,
        ttl: Optional[timedelta] = None
    ) -> State:
        """Get an existing state or create a new one if it doesn't exist."""
        if not key:
            raise StateValidationError("Key cannot be empty")
            
        try:
            doc = await self._get_state_document(key)
            return State(doc['state'], self, key)
            
        except StateNotFoundError:
            # Create new state
            state = default_state or "*"
            now = datetime.now(datetime.timezone.utc)
            expires_at = (now + ttl) if ttl else None
            
            document = {
                'key': key,
                'state': state,
                'data': {},
                'created_at': now,
                'updated_at': now,
                'expires_at': expires_at
            }
            
            try:
                await self.collection.insert_one(document)
                return State(state, self, key)
                
            except PyMongoError as e:
                logger.error(f"MongoDB error in get_or_create_state: {e}")
                raise StorageError(f"Failed to create state: {e}") from e

    async def set_state(
        self,
        state: str,
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the state for a given key."""
        if not state or not isinstance(state, str):
            raise StateValidationError("State must be a non-empty string")
            
        now = datetime.now(datetime.timezone.utc)
        update = {
            '$set': {
                'state': state,
                'updated_at': now
            }
        }
        
        if ttl is not None:
            update['$set']['expires_at'] = now + ttl
            
        try:
            result = await self.collection.update_one(
                {'key': key},
                update,
                upsert=True
            )
            
            if result.matched_count == 0 and not result.upserted_id:
                raise StateNotFoundError(f"State with key '{key}' not found")
                
        except PyMongoError as e:
            logger.error(f"MongoDB error in set_state: {e}")
            raise StorageError(f"Failed to update state: {e}") from e

    async def set_data(
        self,
        data: Dict[str, Any],
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the data for a given state."""
        if not isinstance(data, dict):
            raise StateValidationError("Data must be a dictionary")
            
        # Check data size
        data_size = len(str(data).encode('utf-8'))
        if data_size > self.MAX_DATA_SIZE:
            raise StateValidationError(
                f"Data size {data_size} exceeds maximum allowed {self.MAX_DATA_SIZE}"
            )
            
        now = datetime.now(datetime.timezone.utc)
        update = {
            '$set': {
                'data': data,
                'updated_at': now
            }
        }
        
        if ttl is not None:
            update['$set']['expires_at'] = now + ttl
            
        try:
            result = await self.collection.update_one(
                {'key': key},
                update
            )
            
            if result.matched_count == 0:
                raise StateNotFoundError(f"State with key '{key}' not found")
                
        except PyMongoError as e:
            logger.error(f"MongoDB error in set_data: {e}")
            raise StorageError(f"Failed to update data: {e}") from e

    async def get_data(self, key: str) -> Dict[str, Any]:
        """Retrieve the data for a given state."""
        try:
            doc = await self._get_state_document(key)
            return doc.get('data', {})
            
        except StateNotFoundError:
            return {}
            
        except PyMongoError as e:
            logger.error(f"MongoDB error in get_data: {e}")
            raise StorageError(f"Failed to get data: {e}") from e

    async def get_state_data(self, key: str) -> StateData:
        """Retrieve complete state information including metadata."""
        try:
            doc = await self._get_state_document(key)
            
            return StateData(
                state=doc['state'],
                data=doc.get('data', {}),
                created_at=doc['created_at'],
                updated_at=doc['updated_at'],
                expires_at=doc.get('expires_at')
            )
            
        except KeyError as e:
            logger.error(f"Invalid document structure: {e}")
            raise StateValidationError(f"Invalid document structure: {e}") from e
            
        except PyMongoError as e:
            logger.error(f"MongoDB error in get_state_data: {e}")
            raise StorageError(f"Database error: {e}") from e

    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data."""
        try:
            result = await self.collection.delete_one({"key": key})
            if result.deleted_count == 0:
                raise StateNotFoundError(f"State with key '{key}' not found")
                
        except PyMongoError as e:
            logger.error(f"MongoDB error in finish_state: {e}")
            raise StorageError(f"Failed to delete state: {e}") from e

    async def cleanup_expired(self) -> int:
        """Remove all expired states."""
        try:
            result = await self.collection.delete_many({
                "expires_at": {"$lt": datetime.now(datetime.timezone.utc)}
            })
            return result.deleted_count
            
        except PyMongoError as e:
            logger.error(f"MongoDB error in cleanup_expired: {e}")
            raise StorageError(f"Failed to clean up expired states: {e}") from e

    async def list_states(
        self,
        state: Optional[str] = None,
        created_before: Optional[datetime] = None
    ) -> AsyncIterator[str]:
        """List all state keys matching the given criteria."""
        query = {}
        
        if state is not None:
            query['state'] = state
            
        if created_before is not None:
            query['created_at'] = {'$lt': created_before}
            
        try:
            cursor = self.collection.find(
                query,
                projection=['key']
            )
            
            async for doc in cursor:
                yield doc['key']
                
        except PyMongoError as e:
            logger.error(f"MongoDB error in list_states: {e}")
            raise StorageError(f"Failed to list states: {e}") from e