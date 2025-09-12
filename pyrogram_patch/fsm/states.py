# pyrogram_patch/fsm/states.py
from __future__ import annotations

import logging
from typing import Dict, Optional

logger = logging.getLogger("pyrogram_patch.fsm.states")

class State:
    """Represents a single FSM state.

    States are immutable objects that belong to a StatesGroup.

    Example:
        class Registration(StatesGroup):
            name = State()
            confirm = State()

        state = Registration.name
        print(str(state))  # 'Registration:name'
    """

    def __init__(self, name: Optional[str] = None) -> None:
        self._name = name
        self._group: Optional[str] = None

    def __str__(self) -> str:
        if self._group:
            return f"{self._group}:{self._name}"
        return self._name or "unnamed"

    def __eq__(self, other: object) -> bool:
        if isinstance(other, State):
            return str(self) == str(other)
        if isinstance(other, str):
            return str(self) == other
        return False

    def __hash__(self) -> int:
        return hash(str(self))

    @property
    def name(self) -> str:
        return str(self)


class StatesGroupMeta(type):
    """Metaclass that collects State attributes and assigns their group name."""

    def __new__(mcs, name, bases, namespace: Dict[str, object]):
        cls = super().__new__(mcs, name, bases, namespace)
        for attr, value in namespace.items():
            if isinstance(value, State):
                value._name = attr
                value._group = name
        return cls


class StatesGroup(metaclass=StatesGroupMeta):
    """Base class for grouping related FSM states."""

    def __iter__(self):
        for value in vars(self.__class__).values():
            if isinstance(value, State):
                yield value
