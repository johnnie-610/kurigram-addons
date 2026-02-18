import asyncio
from types import SimpleNamespace

import pytest
pytest.importorskip("pydantic")

from pyrogram_patch.config import reload_config
from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
from pyrogram_patch.patch_data_pool import PatchDataPool
from pyrogram_patch.patch_helper import PatchHelper


@pytest.mark.asyncio
async def test_helper_ttl_cleanup_removes_stale_entries():
    config = reload_config()
    config.fsm.helper_session_ttl = 0.05
    config.fsm.persist_helpers = False

    pool = PatchDataPool()
    await pool._initialize()

    update = SimpleNamespace(
        chat=SimpleNamespace(id=100), from_user=SimpleNamespace(id=200)
    )
    client = SimpleNamespace(me=SimpleNamespace(id=300))

    helper = PatchHelper()
    await pool.include_helper_to_pool(update, helper, client)
    initial_stats = await pool.get_statistics()
    assert initial_stats["active_helpers"] == 1

    await asyncio.sleep(0.06)

    await pool.get_helper_from_pool(update, client)
    refreshed_stats = await pool.get_statistics()

    assert refreshed_stats["active_helpers"] == 1
    assert refreshed_stats["expired_helpers"] >= 1
    assert refreshed_stats["total_helpers_created"] >= 2


@pytest.mark.asyncio
async def test_helper_snapshots_persist_to_storage():
    config = reload_config()
    config.fsm.helper_session_ttl = 0.1
    config.fsm.persist_helpers = True

    storage = MemoryStorage()

    pool = PatchDataPool()
    await pool._initialize()
    pool.set_fsm_storage(storage)

    update = SimpleNamespace(
        chat=SimpleNamespace(id=111), from_user=SimpleNamespace(id=222)
    )
    client = SimpleNamespace(me=SimpleNamespace(id=333))

    helper = PatchHelper()
    helper.state = "awaiting_input"
    await helper.update_data(step="start")

    await pool.include_helper_to_pool(update, helper, client)
    await pool.exclude_helper_from_pool(update, client)

    recovered_helper = await pool.get_helper_from_pool(update, client)

    assert recovered_helper.state == "awaiting_input"
    assert await recovered_helper.get("step") == "start"
