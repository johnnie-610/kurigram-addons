# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code

from __future__ import annotations

import logging
import warnings
from typing import Any, Dict, Optional
from pyrogram_patch.fsm.filter import StateFilter

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
        self._group_cls: Optional[Any] = None

    def __str__(self) -> str:
        if self._group:
            return f"{self._group}:{self._name}"
        return self._name or "unnamed"

    def __eq__(self, other: object) -> bool:
        if isinstance(other, State):
            if self._name is None and other._name is None:
                return self is other
            return str(self) == str(other)
        if isinstance(other, str):
            return str(self) == other
        return False

    def __hash__(self) -> int:
        if self._name is None:
            return id(self)
        return hash(str(self))

    @property
    def name(self) -> str:
        return str(self)

    def filter(self) -> "StateFilter":
        """Return a :class:`~pyrogram_patch.fsm.filter.StateFilter` bound to this state.

        Allows the ergonomic shorthand::

            @router.on_message(Registration.name.filter())
            async def handler(client, message, patch_helper): ...

        instead of the stringly-typed::

            @router.on_message(StateFilter("Registration:name"))
            async def handler(client, message, patch_helper): ...
        """
        from pyrogram_patch.fsm.filter import StateFilter
        return StateFilter(str(self))


class StatesGroupMeta(type):
    """Metaclass that collects State attributes and assigns their group name."""

    def __new__(mcs, name, bases, namespace: Dict[str, object]):
        cls = super().__new__(mcs, name, bases, namespace)
        for attr, value in namespace.items():
            if isinstance(value, State):
                value._name = attr
                value._group = name
                value._group_cls = cls
        
        
        # Rebuild transitions to fix hash mismatch caused by mutable state objects
        if hasattr(cls, "transitions") and isinstance(cls.transitions, dict):
            new_transitions = {}
            for src, targets in cls.transitions.items():
                new_transitions[src] = targets
            setattr(cls, "transitions", new_transitions)

        return cls

    def __iter__(cls):
        for value in vars(cls).values():
            if isinstance(value, State):
                yield value


class StatesGroup(metaclass=StatesGroupMeta):
    """Base class for grouping related FSM states."""

    def __iter__(self):
        for value in vars(self.__class__).values():
            if isinstance(value, State):
                yield value


# Compatibility alias (deprecated)
StateItem = State
