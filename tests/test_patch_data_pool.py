import pytest
from pyrogram_patch.patch_data_pool import PatchDataPool, PoolConfig
import asyncio

@pytest.mark.asyncio
async def test_pool_eviction_and_middleware():
    cfg = PoolConfig(max_entries=2, eviction_policy="LRU")
    pool = PatchDataPool(config=cfg)
    await pool.add_update("a", {"x": 1})
    await pool.add_update("b", {"x": 2})
    # access a to make it recent
    _ = await pool.get_update("a")
    await pool.add_update("c", {"x": 3})
    keys = await pool.keys()
    assert "a" in keys and "c" in keys and "b" not in keys

    async def mw(u):
        pass

    await pool.register_middleware("m1", mw)
    mids = await pool.get_middlewares()
    assert len(mids) == 1
