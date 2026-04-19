# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Strongly-typed callback data factory.

Eliminates the silent breakage that occurs when format-string patterns
change, and removes the need to manually parse ``callback_data`` strings
in handlers.

Example::

    from pykeyboard import CallbackData

    class Page(CallbackData, prefix="pg"):
        num: int
        total: int

    # Encoding — used when building keyboards
    btn = Page(num=3, total=10).button("Page 3")
    # btn.callback_data == "pg:3:10"

    # Decoding — used in handlers
    @router.on_callback_query(Page.filter())
    async def paginate(client, query):
        data = Page.unpack(query.data)
        print(data.num, data.total)   # 3, 10

    # Optional field-level filtering
    @router.on_callback_query(Page.filter(num=3))
    async def only_page_3(client, query): ...
"""

from __future__ import annotations

import re
from typing import Any, ClassVar, Dict, Optional, Type, TypeVar
from pyrogram import filters
from pyrogram.types import InlineKeyboardButton
from pyrogram.enums import ButtonStyle


T = TypeVar("T", bound="CallbackData")

# Telegram's hard limit for callback_data is 64 bytes.
_CALLBACK_LIMIT = 64
_SEP = ":"
_SEP_RE = re.compile(re.escape(_SEP))


class CallbackDataMeta(type):
    """Metaclass that collects field annotations and validates the prefix."""

    def __new__(
        mcs,
        name: str,
        bases: tuple,
        namespace: Dict[str, Any],
        prefix: str = "",   # absorbed here; also stored directly on the class
        **kwargs: Any,
    ) -> "CallbackDataMeta":
        cls = super().__new__(mcs, name, bases, namespace, **kwargs)

        if name == "CallbackData":
            return cls

        # Store the prefix now — __init_subclass__ runs too late for __new__
        # validation, so we set it directly on the class here.
        if prefix:
            cls.__callback_prefix__ = prefix

        if not getattr(cls, "__callback_prefix__", ""):
            raise TypeError(
                f"{name}: CallbackData subclasses must specify a prefix via "
                f"the class keyword argument: "
                f"class {name}(CallbackData, prefix='my_prefix'): ..."
            )

        # Collect annotated fields (in declaration order, Python 3.7+)
        annotations: Dict[str, type] = {}
        for base in reversed(cls.__mro__):
            annotations.update(getattr(base, "__annotations__", {}))
        fields = {
            k: v
            for k, v in annotations.items()
            if not k.startswith("_") and k not in ("prefix",)
        }
        cls.__callback_fields__ = fields

        return cls


class CallbackData(metaclass=CallbackDataMeta):
    """Base class for strongly-typed callback data.

    Subclass this and annotate fields with their types.  The class handles
    serialisation (``pack()``) and deserialisation (``unpack()``) to/from the
    Telegram ``callback_data`` string automatically.

    Supported field types: ``str``, ``int``, ``float``, ``bool``.

    Example::

        class Action(CallbackData, prefix="act"):
            item_id: int
            action: str

        packed = Action(item_id=42, action="delete").pack()
        # "act:42:delete"

        obj = Action.unpack(packed)
        assert obj.item_id == 42
        assert obj.action == "delete"
    """

    # Set by metaclass
    __callback_prefix__: ClassVar[str] = ""
    __callback_fields__: ClassVar[Dict[str, type]] = {}

    _COERCIONS: ClassVar[Dict[type, Any]] = {
        int: int,
        float: float,
        bool: lambda v: v.lower() not in ("0", "false", "no", ""),
        str: str,
    }

    def __init__(self, **kwargs: Any) -> None:
        for field, ftype in self.__callback_fields__.items():
            if field not in kwargs:
                raise ValueError(
                    f"{self.__class__.__name__}: missing required field '{field}'"
                )
            value = kwargs[field]
            # Light coercion — ensure the stored value matches the annotation
            if ftype in (int, float, bool, str):
                value = ftype(value)
            object.__setattr__(self, field, value)

    def __setattr__(self, key: str, value: Any) -> None:
        raise AttributeError(
            "CallbackData instances are immutable after construction."
        )

    def pack(self) -> str:
        """Serialise to a ``callback_data`` string.

        Raises:
            ValueError: If the resulting string exceeds Telegram's 64-byte
                        limit.
        """
        parts = [self.__callback_prefix__]
        for field in self.__callback_fields__:
            parts.append(str(getattr(self, field)))
        result = _SEP.join(parts)
        if len(result.encode("utf-8")) > _CALLBACK_LIMIT:
            raise ValueError(
                f"{self.__class__.__name__}.pack(): result '{result}' exceeds "
                f"Telegram's {_CALLBACK_LIMIT}-byte callback_data limit. "
                "Use shorter field values or a shorter prefix."
            )
        return result

    @classmethod
    def unpack(cls: Type[T], data: str) -> T:
        """Deserialise from a ``callback_data`` string.

        Raises:
            ValueError: If the string doesn't match this class's prefix or
                        field count.
        """
        prefix = cls.__callback_prefix__
        if not data.startswith(prefix + _SEP):
            raise ValueError(
                f"Cannot unpack '{data}' as {cls.__name__}: "
                f"expected prefix '{prefix}'"
            )
        rest = data[len(prefix) + len(_SEP):]
        field_names = list(cls.__callback_fields__.keys())
        # Split only as many times as there are fields so the last field may
        # contain the separator character if it is a str.
        raw_parts = rest.split(_SEP, len(field_names) - 1) if field_names else []

        if len(raw_parts) != len(field_names):
            raise ValueError(
                f"Cannot unpack '{data}' as {cls.__name__}: "
                f"expected {len(field_names)} fields, got {len(raw_parts)}"
            )

        kwargs: Dict[str, Any] = {}
        for name, ftype, raw in zip(field_names, cls.__callback_fields__.values(), raw_parts):
            coerce = cls._COERCIONS.get(ftype, str)
            try:
                kwargs[name] = coerce(raw)
            except (ValueError, TypeError) as e:
                raise ValueError(
                    f"Cannot coerce field '{name}' value '{raw}' to {ftype.__name__}: {e}"
                ) from e

        return cls(**kwargs)

    def button(self, text: str, style: ButtonStyle = ButtonStyle.DEFAULT) -> InlineKeyboardButton:
        """Convenience method: create an :class:`InlineKeyboardButton` with
        this instance as the ``callback_data``.

        Args:
            text: Button label displayed to the user.
            style: Button style (default: :attr:`ButtonStyle.DEFAULT`).

        Example::

            from pykeyboard.callback_data import CallbackData

            class Action(CallbackData, prefix="act"):
                name: str

            btn = Action(name="confirm").button("✅ Confirm")
            btn_cancel = Action(name="cancel").button("❌ Cancel")
        """
        from pykeyboard.keyboard_base import InlineButton
        return InlineButton(
            text=text,
            callback_data=self.pack(),
            style=style,
        )

    @classmethod
    def filter(cls, **field_values: Any):
        """Return a Pyrogram filter that matches callback queries for this class.

        Optionally restrict to specific field values::

            # Match any Action callback
            @router.on_callback_query(Action.filter())
            async def any_action(client, query): ...

            # Match only Action callbacks where action == "delete"
            @router.on_callback_query(Action.filter(action="delete"))
            async def on_delete(client, query): ...
        """
        prefix = cls.__callback_prefix__

        async def _filter_func(_, __, query) -> bool:  # type: ignore[misc]
            data = getattr(query, "data", None)
            if not data:
                return False
            if not data.startswith(prefix + _SEP):
                return False
            if not field_values:
                return True
            try:
                obj = cls.unpack(data)
            except ValueError:
                return False
            return all(
                str(getattr(obj, k, None)) == str(v)
                for k, v in field_values.items()
            )

        return filters.create(_filter_func, name=f"{cls.__name__}Filter")

    def __repr__(self) -> str:
        fields = ", ".join(
            f"{k}={getattr(self, k)!r}" for k in self.__callback_fields__
        )
        return f"{self.__class__.__name__}({fields})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, self.__class__):
            return NotImplemented
        return all(
            getattr(self, k) == getattr(other, k)
            for k in self.__callback_fields__
        )

    def __hash__(self) -> int:
        return hash(self.pack())
