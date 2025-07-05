from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, AsyncIterator, cast, Tuple

from redis.asyncio import Redis
from redis.asyncio.connection import ConnectionPool
from redis.exceptions import RedisError

from pyrogram_patch.fsm.base_storage import (
    BaseStorage,
    StateData,
    StorageError,
    StateNotFoundError,
    StateValidationError,
)
from pyrogram_patch.fsm.states import State

logger = logging.getLogger(__name__)

# Redis key prefixes
STATE_PREFIX = "fsm:state"
DATA_PREFIX = "fsm:data"
META_PREFIX = "fsm:meta"


def _key(prefix: str, key: str) -> str:
    """Generate a namespaced Redis key."""
    return f"{prefix}:{key}"


class RedisStorage(BaseStorage):
    """Redis-backed storage for FSM.
    
    This implementation uses Redis hashes to store state metadata and separate
    keys for state data to optimize memory usage and performance.
    """
    
    def __init__(self, redis: Redis, key_prefix: str = "") -> None:
        """Initialize Redis storage.
        
        Args:
            redis: Redis client instance
            key_prefix: Optional prefix for all keys to avoid collisions
        """
        self._redis = redis
        self._key_prefix = key_prefix

    @classmethod
    def from_url(
        cls,
        url: str,
        key_prefix: str = "",
        **connection_kwargs: Any
    ) -> RedisStorage:
        """Create a RedisStorage instance from a Redis URL.
        
        Args:
            url: Redis connection URL
            key_prefix: Optional prefix for all keys
            **connection_kwargs: Additional connection arguments
                
        Returns:
            Configured RedisStorage instance
        """
        pool = ConnectionPool.from_url(url, **connection_kwargs)
        redis = Redis(connection_pool=pool)
        return cls(redis, key_prefix=key_prefix)

    def _get_key(self, prefix: str, key: str) -> str:
        """Get a fully qualified Redis key."""
        return _key(f"{self._key_prefix}:{prefix}" if self._key_prefix else prefix, key)

    async def _get_state_meta(self, key: str) -> Tuple[str, datetime, datetime, Optional[datetime]]:
        """Get state metadata from Redis."""
        meta_key = self._get_key(META_PREFIX, key)
        meta = await self._redis.hgetall(meta_key)

        if not meta:
            raise StateNotFoundError(f"State with key '{key}' not found")

        try:
            # Helper function to safely get and decode a value
            def get_value(field: str, default=None):
                value = meta.get(field.encode() if isinstance(field, str) else field, default)
                if value is not None and not isinstance(value, str):
                    return value.decode()
                return value

            state = get_value('state')
            created_at_str = get_value('created_at')
            updated_at_str = get_value('updated_at')
            expires_at_str = get_value('expires_at')
            
            # Parse datetimes
            created_at = datetime.fromisoformat(created_at_str) if created_at_str else None
            updated_at = datetime.fromisoformat(updated_at_str) if updated_at_str else None
            expires_at = datetime.fromisoformat(expires_at_str) if expires_at_str else None
            
            if not all([state, created_at, updated_at]):
                raise ValueError("Missing required state metadata")
                
            return state, created_at, updated_at, expires_at
            
        except (KeyError, ValueError, AttributeError) as e:
            logger.error(f"Error parsing state metadata for key {key}: {e}")
            raise StateCorruptedError(f"State metadata is corrupted for key '{key}'") from e

    async def _set_state_meta(
        self,
        key: str,
        state: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update state metadata in Redis."""
        meta_key = self._get_key(META_PREFIX, key)
        now = datetime.now(timezone.utc)
        expires_at = (now + ttl) if ttl else None
        
        # Get existing created_at or use current time
        created_at = await self._redis.hget(meta_key, 'created_at')
        if not created_at:
            created_at = now.isoformat()
        
        # Prepare the data to set
        data = {
            'state': state,
            'created_at': created_at,
            'updated_at': now.isoformat(),
        }
        
        if expires_at:
            data['expires_at'] = expires_at.isoformat()
        
        # Get the pipeline and execute commands
        pipe = await self._redis.pipeline()
        
        try:
            # Queue up the commands
            pipe.hset(meta_key, mapping=data)
            
            # Set TTL if provided
            if ttl:
                pipe.expire(meta_key, int(ttl.total_seconds()))
            
            # Execute the pipeline
            await pipe.execute()
        finally:
            # Make sure to reset the pipeline
            await pipe.reset()

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
            state, _, _, _ = await self._get_state_meta(key)
            return State(state, self, key)
        except StateNotFoundError:
            state = default_state or "*"
            await self._set_state_meta(key, state, ttl)
            return State(state, self, key)
        except RedisError as e:
            logger.error(f"Redis error in get_or_create_state: {e}")
            raise StorageError(f"Redis error: {e}") from e

    async def set_state(
        self,
        state: str,
        key: str,
        ttl: Optional[timedelta] = None
    ) -> None:
        """Update the state for a given key."""
        if not state or not isinstance(state, str):
            raise StateValidationError("State must be a non-empty string")
            
        try:
            await self._set_state_meta(key, state, ttl)
        except RedisError as e:
            logger.error(f"Redis error in set_state: {e}")
            raise StorageError(f"Redis error: {e}") from e

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
        data_size = len(json.dumps(data).encode('utf-8'))
        if data_size > self.MAX_DATA_SIZE:
            raise StateValidationError(
                f"Data size {data_size} exceeds maximum allowed {self.MAX_DATA_SIZE}"
            )
            
        try:
            data_key = self._get_key(DATA_PREFIX, key)
            pipe = await self._redis.pipeline()
            
            if data:
                pipe.set(data_key, json.dumps(data))
                if ttl:
                    pipe.expire(data_key, int(ttl.total_seconds()))
            else:
                pipe.delete(data_key)
                
            await pipe.execute()
            
            # Update state TTL if needed
            if ttl is not None:
                await self._set_state_meta(key, (await self._get_state_meta(key))[0], ttl)
                
        except RedisError as e:
            logger.error(f"Redis error in set_data: {e}")
            raise StorageError(f"Redis error: {e}") from e

    async def get_data(self, key: str) -> Dict[str, Any]:
        """Retrieve the data for a given state."""
        try:
            data_key = self._get_key(DATA_PREFIX, key)
            data = await self._redis.get(data_key)
            return json.loads(data) if data else {}
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON data for key {key}: {e}")
            return {}
        except RedisError as e:
            logger.error(f"Redis error in get_data: {e}")
            raise StorageError(f"Redis error: {e}") from e

    async def get_state_data(self, key: str) -> StateData:
        """Retrieve complete state information including metadata."""
        try:
            state, created_at, updated_at, expires_at = await self._get_state_meta(key)
            data = await self.get_data(key)
            
            return StateData(
                state=state,
                data=data,
                created_at=created_at,
                updated_at=updated_at,
                expires_at=expires_at
            )
        except StateNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Error in get_state_data: {e}")
            raise StorageError(f"Failed to get state data: {e}") from e

    async def finish_state(self, key: str) -> None:
        """Remove a state and its associated data."""
        try:
            # Get the pipeline
            pipe = await self._redis.pipeline()
            
            try:
                # Queue up the delete commands
                pipe.delete(self._get_key(META_PREFIX, key))
                pipe.delete(self._get_key(DATA_PREFIX, key))
                
                # Execute the pipeline
                await pipe.execute()
            finally:
                # Make sure to reset the pipeline
                await pipe.reset()
                
        except Exception as e:
            logger.error(f"Error finishing state for key {key}: {e}")
            raise StorageError(f"Redis error: {e}") from e

    async def cleanup_expired(self) -> int:
        """Remove all expired states."""
        # Redis will automatically clean up expired keys
        return 0  # We don't have a direct way to count cleaned up keys

    async def list_states(
        self,
        state: Optional[str] = None,
        created_before: Optional[datetime] = None
    ) -> AsyncIterator[str]:
        """List all state keys matching the given criteria."""
        try:
            pattern = self._get_key(META_PREFIX, "*")
            async for key in self._redis.scan_iter(match=pattern):
                try:
                    state_data = await self.get_state_data(key.decode().split(':', 2)[-1])
                    
                    if state is not None and state_data.state != state:
                        continue
                        
                    if created_before is not None and state_data.created_at >= created_before:
                        continue
                        
                    yield key.decode().split(':', 2)[-1]
                except (StateNotFoundError, StateValidationError):
                    continue
        except RedisError as e:
            logger.error(f"Redis error in list_states: {e}")
            raise StorageError(f"Redis error: {e}") from e
