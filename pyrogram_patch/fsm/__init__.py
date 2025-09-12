# pyrogram_patch/fsm/__init__.py
"""Finite State Machine (FSM) utilities for Pyrogram Patch.

This package provides:
    - FSMContext: the runtime interface for managing state and data
    - State and StatesGroup: declarative state definitions
    - Storage backends: MemoryFSMStorage, RedisFSMStorage, BaseStorage
    - Filters: StateFilter, AnyStateFilter, NoStateFilter
"""

from pyrogram_patch.fsm.context import FSMContext
from pyrogram_patch.fsm.states import State, StatesGroup
from pyrogram_patch.fsm.base_storage import BaseStorage
from pyrogram_patch.fsm.filter import StateFilter, AnyStateFilter, NoStateFilter
from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage
from pyrogram_patch.fsm.storages.redis_storage import RedisStorage

__all__ = [
    "FSMContext",
    "State",
    "StatesGroup",
    "BaseStorage",
    "MemoryStorage",
    "RedisStorage",
    "StateFilter",
    "AnyStateFilter",
    "NoStateFilter",
]
