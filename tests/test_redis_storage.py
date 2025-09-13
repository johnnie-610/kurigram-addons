import asyncio

import fakeredis.aioredis as aioredis
import pytest

from pyrogram_patch.fsm.redis_storage import RedisFSMStorage, RedisStorageConfig


@pytest.mark.asyncio
async def test_compare_and_set_and_basic_ops():
    r = aioredis.FakeRedis()
    cfg = RedisStorageConfig(key_prefix="test:patch", default_ttl=0)
    store = RedisFSMStorage(redis_client=r, config=cfg)
    await store.clear_namespace()

    ok = await store.compare_and_set(
        "user:1", {"state": "A"}, expected_state=None
    )
    assert ok is True
    state = await store.get_state("user:1")
    assert state["state"] == "A"

    ok2 = await store.compare_and_set(
        "user:1", {"state": "B"}, expected_state={"state": "A"}
    )
    assert ok2 is True
    # wrong expected
    ok3 = await store.compare_and_set(
        "user:1", {"state": "C"}, expected_state={"state": "X"}
    )
    assert ok3 is False
