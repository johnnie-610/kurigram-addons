from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
pytest.importorskip("pydantic")

from pyrogram_patch.health import create_health_router
from pyrogram_patch.metrics import get_global_metrics


@pytest.mark.asyncio
async def test_health_router_reports_status(monkeypatch):
    metrics = get_global_metrics()
    metrics.clear()
    await metrics.record_counter(
        "storage_operations_total",
        labels={"operation": "get", "storage": "redis", "status": "success"},
    )
    await metrics.record_histogram(
        "middleware_execution_duration_seconds", 0.2, labels={"middleware": "foo"}
    )

    class StubPool:
        async def get_statistics(self):
            return {
                "active_helpers": 2,
                "session_ttl": 120,
                "persist_helpers": True,
                "uptime": 90,
                "expired_helpers": 1,
                "total_helpers_created": 3,
            }

    class StubBreaker:
        def get_stats(self):
            return {"state": "closed", "failure_count": 0}

    async def fake_pool(_client):
        return StubPool()

    monkeypatch.setattr("pyrogram_patch.health.initialize_global_pool", fake_pool)
    monkeypatch.setattr(
        "pyrogram_patch.health.list_circuit_breakers",
        lambda: {"redis": StubBreaker()},
    )

    router = create_health_router(command="status", allowed_user_ids=[5])
    assert router._pending_handlers
    handler = router._pending_handlers[0][1]

    message = SimpleNamespace(
        from_user=SimpleNamespace(id=5),
        chat=SimpleNamespace(id=10),
        reply_text=AsyncMock(),
    )
    client = SimpleNamespace(routers=["r1", "r2"])

    await handler(client, message)

    message.reply_text.assert_awaited_once()
    (text,), _ = message.reply_text.await_args
    assert "🩺 Bot status overview" in text
    assert "Active helpers: 2" in text
    assert "Circuit breakers:" in text
