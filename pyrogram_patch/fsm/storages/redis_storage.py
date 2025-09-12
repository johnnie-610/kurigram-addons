# pyrogram_patch/fsm/storages/redis_storage.py
from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional

import redis.asyncio as aioredis  # modern redis client

from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch import errors

logger = logging.getLogger("pyrogram_patch.fsm.redis_storage")


class RedisStorage(BaseStorage):
    """Redis-backed FSM storage with async API."""

    def __init__(self, redis: aioredis.Redis, *, prefix: str = "fsm", default_ttl: int = 0) -> None:
        self._redis = redis
        self._prefix = prefix
        self._default_ttl = default_ttl

    def _key(self, identifier: str) -> str:
        return f"{self._prefix}:{identifier}"

    async def set_state(self, identifier: str, state: Dict[str, Any], *, ttl: Optional[int] = None) -> None:
        key = self._key(identifier)
        value = json.dumps(state)
        ttl_use = self._default_ttl if ttl is None else ttl
        if ttl_use and ttl_use > 0:
            await self._redis.set(key, value, ex=ttl_use)
        else:
            await self._redis.set(key, value)

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        key = self._key(identifier)
        raw = await self._redis.get(key)
        if not raw:
            return None
        try:
            return json.loads(raw)
        except Exception as e:
            raise errors.FSMContextError("Failed to decode Redis state", cause=e, context={"id": identifier}) from e

    async def delete_state(self, identifier: str) -> bool:
        key = self._key(identifier)
        res = await self._redis.delete(key)
        return res > 0

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        key = self._key(identifier)
        new_val = json.dumps(new_state)
        ttl_use = self._default_ttl if ttl is None else ttl

        async with self._redis.pipeline(transaction=True) as pipe:
            while True:
                try:
                    await pipe.watch(key)
                    raw = await pipe.get(key)
                    if expected_state is None:
                        if raw is not None:
                            await pipe.unwatch()
                            return False
                    else:
                        if not raw:
                            await pipe.unwatch()
                            return False
                        cur = json.loads(raw)
                        if cur != expected_state:
                            await pipe.unwatch()
                            return False

                    pipe.multi()
                    if ttl_use and ttl_use > 0:
                        pipe.set(key, new_val, ex=ttl_use)
                    else:
                        pipe.set(key, new_val)
                    await pipe.execute()
                    return True
                except aioredis.WatchError:
                    continue
                finally:
                    await pipe.reset()

    async def list_keys(self, pattern: str = "*") -> list[str]:
        full_pattern = f"{self._prefix}:{pattern}"
        keys = await self._redis.keys(full_pattern)
        return [k.decode().split(":", 1)[1] for k in keys]

    async def clear_namespace(self) -> int:
        keys = await self._redis.keys(f"{self._prefix}:*")
        if not keys:
            return 0
        deleted = await self._redis.delete(*keys)
        return int(deleted)
