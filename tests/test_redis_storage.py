import pytest

pytest.importorskip("pydantic")

from pyrogram_patch.fsm.storages.redis_storage import RedisStorage


@pytest.mark.asyncio
async def test_compare_and_set_and_basic_ops():
    """Test RedisStorage basic operations using fakeredis."""
    aioredis = pytest.importorskip(
        "fakeredis.aioredis",
        reason="fakeredis is required for redis storage tests",
    )

    r = aioredis.FakeRedis()
    store = RedisStorage(redis=r, prefix="test:patch", default_ttl=0)
    await store.clear_namespace()

    ok = await store.compare_and_set(
        "user:1", {"state": "A"}, expected_state=None
    )
    assert ok is True
    state = await store.get_state("user:1")
    assert state["name"] == "A"

    ok2 = await store.compare_and_set(
        "user:1", {"state": "B"}, expected_state={"state": "A"}
    )
    assert ok2 is True
    # wrong expected
    ok3 = await store.compare_and_set(
        "user:1", {"state": "C"}, expected_state={"state": "X"}
    )
    assert ok3 is False
