# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional

import redis.asyncio as aioredis
from pydantic import BaseModel
from pydantic import ValidationError as PydanticValidationError

from pyrogram_patch import errors
from pyrogram_patch.circuit_breaker import (CircuitBreakerConfig,
                                            get_circuit_breaker)
from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.fsm.redis_storage")


class FSMStateModel(BaseModel):
    """Pydantic model for validating FSM state data structure."""

    name: Optional[str] = None
    data: Dict[str, Any] = {}


class RedisStorage(BaseStorage):
    """Redis-backed FSM storage with async API."""

    def __init__(
        self,
        redis: aioredis.Redis,
        *,
        prefix: str = "fsm",
        default_ttl: int = 0,
        circuit_breaker_config: Optional[CircuitBreakerConfig] = None,
    ) -> None:
        self._redis = redis
        self._prefix = prefix
        self._default_ttl = default_ttl
        self._circuit_breaker = get_circuit_breaker(
            "redis", circuit_breaker_config
        )

    def _key(self, identifier: str) -> str:
        return f"{self._prefix}:{identifier}"

    async def health(self) -> bool:
        """Check if Redis is accessible."""
        try:
            await self._redis.ping()
            return True
        except Exception:
            return False

    async def set_state(
        self,
        identifier: str,
        state: Dict[str, Any],
        *,
        ttl: Optional[int] = None,
    ) -> None:
        async def _set_state_impl() -> None:
            key = self._key(identifier)
            value = json.dumps(state)
            ttl_use = self._default_ttl if ttl is None else ttl
            if ttl_use and ttl_use > 0:
                await self._redis.set(key, value, ex=ttl_use)
            else:
                await self._redis.set(key, value)

        await self._circuit_breaker.call(_set_state_impl)

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        async def _get_state_impl() -> Optional[Dict[str, Any]]:
            key = self._key(identifier)
            raw = await self._redis.get(key)
            if not raw:
                return None
            try:
                parsed_data = json.loads(raw)
                # Validate the structure using Pydantic
                validated = FSMStateModel(**parsed_data)
                return validated.model_dump()
            except (json.JSONDecodeError, PydanticValidationError) as e:
                logger.warning(
                    "Invalid state data for identifier %s: %s", identifier, e
                )
                raise errors.FSMContextError(
                    "Failed to decode or validate Redis state",
                    cause=e,
                    context={"id": identifier},
                ) from e

        return await self._circuit_breaker.call(_get_state_impl)

    async def delete_state(self, identifier: str) -> bool:
        async def _delete_state_impl() -> bool:
            key = self._key(identifier)
            res = await self._redis.delete(key)
            return res > 0

        return await self._circuit_breaker.call(_delete_state_impl)

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        async def _compare_and_set_impl() -> bool:
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
                            # Validate current state structure
                            try:
                                current_validated = FSMStateModel(**cur)
                                current_dict = current_validated.model_dump()
                            except PydanticValidationError:
                                # If current state is invalid, consider it different
                                await pipe.unwatch()
                                return False

                            # Validate expected state structure
                            try:
                                expected_validated = FSMStateModel(
                                    **expected_state
                                )
                                expected_dict = (
                                    expected_validated.model_dump()
                                )
                            except PydanticValidationError as e:
                                logger.warning(
                                    "Invalid expected state structure: %s", e
                                )
                                await pipe.unwatch()
                                return False

                            if current_dict != expected_dict:
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

        return await self._circuit_breaker.call(_compare_and_set_impl)

    async def list_keys(self, pattern: str = "*") -> list[str]:
        async def _list_keys_impl() -> list[str]:
            full_pattern = f"{self._prefix}:{pattern}"
            keys = await self._redis.keys(full_pattern)
            return [k.decode().split(":", 1)[1] for k in keys]

        return await self._circuit_breaker.call(_list_keys_impl)

    async def clear_namespace(self) -> int:
        async def _clear_namespace_impl() -> int:
            keys = await self._redis.keys(f"{self._prefix}:*")
            if not keys:
                return 0
            deleted = await self._redis.delete(*keys)
            return int(deleted)

        return await self._circuit_breaker.call(_clear_namespace_impl)
