import asyncio
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
pytest.importorskip("pydantic")
from pyrogram.handlers import MessageHandler

from pyrogram_patch.circuit_breaker import CircuitBreakerOpenException
from pyrogram_patch.config import reload_config
from pyrogram_patch.dispatcher import PatchedDispatcher
from pyrogram_patch.middlewares import PatchHelper


class DummyUpdate:
    def __init__(self):
        self.chat = SimpleNamespace(id=123)
        self.from_user = SimpleNamespace(id=456)


async def dummy_parser(update, users, chats):
    return update, MessageHandler


def _build_client(loop):
    return SimpleNamespace(
        loop=loop,
        executor=ThreadPoolExecutor(max_workers=1),
        me=SimpleNamespace(id=1),
    )


@pytest.mark.asyncio
async def test_plain_pyrogram_handler_runs_without_patch_features():
    loop = asyncio.get_running_loop()
    client = _build_client(loop)
    dispatcher = PatchedDispatcher(client)
    dispatcher.update_parsers = {DummyUpdate: dummy_parser}

    results = []

    def sync_handler(app, message):
        results.append((app, message))

    dispatcher.groups = OrderedDict({0: [MessageHandler(sync_handler)]})

    try:
        await dispatcher.updates_queue.put((DummyUpdate(), None, None))
        await dispatcher.updates_queue.put(None)
        await dispatcher.handler_worker(asyncio.Lock())
    finally:
        client.executor.shutdown(wait=True)

    assert len(results) == 1
    _, message = results[0]
    assert isinstance(message, DummyUpdate)


@pytest.mark.asyncio
async def test_patch_helper_injected_for_marked_handler():
    loop = asyncio.get_running_loop()
    client = _build_client(loop)
    dispatcher = PatchedDispatcher(client)
    dispatcher.update_parsers = {DummyUpdate: dummy_parser}

    captured = {}

    async def async_handler(app, message, patch_helper: PatchHelper):
        captured["helper"] = patch_helper
        captured["message"] = message

    handler = MessageHandler(async_handler)
    handler.callback.__pyrogram_patch_requires_helper__ = True
    dispatcher.groups = OrderedDict({0: [handler]})

    try:
        await dispatcher.updates_queue.put((DummyUpdate(), None, None))
        await dispatcher.updates_queue.put(None)
        await dispatcher.handler_worker(asyncio.Lock())
    finally:
        client.executor.shutdown(wait=True)

    assert isinstance(captured.get("helper"), PatchHelper)
    assert isinstance(captured.get("message"), DummyUpdate)


@pytest.mark.asyncio
async def test_circuit_breaker_open_triggers_fallback(monkeypatch):
    loop = asyncio.get_running_loop()
    client = _build_client(loop)
    client.send_message = AsyncMock()

    config = reload_config()
    config.circuit_breaker.fallback_message = "Temporary issue, please try again"

    dispatcher = PatchedDispatcher(client)
    dispatcher.update_parsers = {DummyUpdate: dummy_parser}

    async def failing_prepare(self, parsed_update, handler_type):
        raise CircuitBreakerOpenException("open")

    monkeypatch.setattr(
        dispatcher,
        "_prepare_patch_helper",
        failing_prepare.__get__(dispatcher, PatchedDispatcher),
    )

    stub_pool = SimpleNamespace(
        pyrogram_patch_middlewares=[],
        pyrogram_patch_outer_middlewares=[],
        pyrogram_patch_fsm_storage=None,
        include_helper_to_pool=AsyncMock(),
        exclude_helper_from_pool=AsyncMock(),
    )

    async def fake_initialize(_client):
        return stub_pool

    monkeypatch.setattr(
        "pyrogram_patch.dispatcher.initialize_global_pool", fake_initialize
    )

    async def handler(app, message, patch_helper: PatchHelper):
        pass

    wrapped = MessageHandler(handler)
    wrapped.callback.__pyrogram_patch_requires_helper__ = True
    dispatcher.groups = OrderedDict({0: [wrapped]})

    try:
        await dispatcher.updates_queue.put((DummyUpdate(), None, None))
        await dispatcher.updates_queue.put(None)
        await dispatcher.handler_worker(asyncio.Lock())
    finally:
        client.executor.shutdown(wait=True)

    client.send_message.assert_awaited_once()
    args, _ = client.send_message.await_args
    assert args == (123, "Temporary issue, please try again")
