# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Command parser — typed argument parsing for bot commands.

Automatically parse ``/command arg1 arg2`` into typed Python values
using function signature introspection.

Example::

    from kurigram_addons import Router

    router = Router()

    @router.on_command("ban")
    async def ban(client, message, user_id: int, reason: str = "No reason"):
        # /ban 12345 spamming
        # → user_id=12345, reason="spamming"
        await message.reply(f"Banned {user_id}: {reason}")

Or use the standalone parser::

    from kurigram_addons.command_parser import parse_command

    args = parse_command("/ban 12345 spamming", user_id=int, reason=str)
    # → {"user_id": 12345, "reason": "spamming"}
"""

from __future__ import annotations

import inspect
import logging
import shlex
import typing
from typing import Any, Callable, Dict, Optional, Tuple, Type, Union, get_type_hints

logger = logging.getLogger("kurigram.command_parser")

# Types we know how to parse from strings
_PARSEABLE_TYPES: Dict[Type, Callable[[str], Any]] = {
    int: int,
    float: float,
    str: str,
    bool: lambda s: s.lower() in ("true", "1", "yes", "on"),
}


def _unwrap_optional(tp: Type) -> Tuple[Type, bool]:
    """Unwrap Optional[T] or Union[T, None] to (T, is_optional).

    Returns:
        Tuple of (inner_type, is_optional). If the type is not Optional,
        returns (tp, False).
    """
    origin = getattr(tp, "__origin__", None)
    if origin is Union:
        args = [a for a in tp.__args__ if a is not type(None)]
        if len(args) == 1:
            return args[0], True
    return tp, False


class CommandParseError(Exception):
    """Raised when command arguments cannot be parsed."""

    def __init__(
        self,
        message: str,
        *,
        command: str = "",
        usage: str = "",
    ) -> None:
        super().__init__(message)
        self.command = command
        self.usage = usage


def parse_command(
    text: str,
    *,
    skip: int = 1,
    **type_hints: Type,
) -> Dict[str, Any]:
    """Parse command text into a typed dictionary.

    Args:
        text: Full message text (e.g. ``/ban 12345 spamming``).
        skip: Number of leading tokens to skip (default: 1 for the command itself).
        **type_hints: Parameter name → type mapping.  All are treated
            as required unless the type is ``Optional[T]``.

    Returns:
        Dictionary of parsed argument values.

    Raises:
        CommandParseError: If parsing fails or required arguments are missing.
    """
    try:
        parts = shlex.split(text)
    except ValueError:
        parts = text.split()

    args = parts[skip:]
    result: Dict[str, Any] = {}
    command_name = parts[0] if parts else ""

    for i, (name, raw_type) in enumerate(type_hints.items()):
        inner_type, is_optional = _unwrap_optional(raw_type)

        if i < len(args):
            parser = _PARSEABLE_TYPES.get(inner_type, inner_type)
            try:
                result[name] = parser(args[i])
            except (ValueError, TypeError) as e:
                raise CommandParseError(
                    f"Cannot parse '{args[i]}' as {inner_type.__name__} "
                    f"for parameter '{name}'",
                    command=command_name,
                ) from e
        elif is_optional:
            result[name] = None
        else:
            # Required argument is missing
            raise CommandParseError(
                f"Missing required argument '{name}' "
                f"(expected {inner_type.__name__})",
                command=command_name,
            )

    return result


def extract_handler_params(
    handler: Callable,
) -> Tuple[Dict[str, Type], Dict[str, Any]]:
    """Extract parseable parameter types and defaults from a handler.

    Skips the first two parameters (``client``, ``message``) and any
    parameter with a default that is a ``Depends()`` instance.

    Args:
        handler: The handler function.

    Returns:
        Tuple of (type_hints dict, defaults dict).
    """
    sig = inspect.signature(handler)
    params = list(sig.parameters.values())

    # Skip client, message (first 2 params)
    parseable = params[2:]

    type_hints: Dict[str, Type] = {}
    defaults: Dict[str, Any] = {}

    try:
        hints = get_type_hints(handler)
    except Exception:
        hints = {}

    for param in parseable:
        # Skip **kwargs, *args
        if param.kind in (
            inspect.Parameter.VAR_POSITIONAL,
            inspect.Parameter.VAR_KEYWORD,
        ):
            continue

        # Skip Depends() parameters
        if param.default is not inspect.Parameter.empty:
            from kurigram_addons.depends import Depends

            if isinstance(param.default, Depends):
                continue
            defaults[param.name] = param.default

        # Get type hint
        hint = hints.get(param.name, str)
        if hint in _PARSEABLE_TYPES:
            type_hints[param.name] = hint

    return type_hints, defaults


__all__ = [
    "CommandParseError",
    "extract_handler_params",
    "parse_command",
]
