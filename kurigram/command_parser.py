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

    from kurigram import Router

    router = Router()

    @router.on_command("ban")
    async def ban(client, message, user_id: int, reason: str = "No reason"):
        # /ban 12345 spamming
        # → user_id=12345, reason="spamming"
        await message.reply(f"Banned {user_id}: {reason}")

Or use the standalone parser::

    from kurigram.command_parser import parse_command

    args = parse_command("/ban 12345 spamming", user_id=int, reason=str)
    # → {"user_id": 12345, "reason": "spamming"}
"""

from __future__ import annotations

import inspect
import logging
import shlex
from typing import Any, Callable, Dict, Optional, Tuple, Type, get_type_hints

logger = logging.getLogger("kurigram.command_parser")

# Types we know how to parse from strings
_PARSEABLE_TYPES: Dict[Type, Callable[[str], Any]] = {
    int: int,
    float: float,
    str: str,
    bool: lambda s: s.lower() in ("true", "1", "yes", "on"),
}


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
        **type_hints: Parameter name → type mapping.

    Returns:
        Dictionary of parsed argument values.

    Raises:
        CommandParseError: If parsing fails.
    """
    try:
        parts = shlex.split(text)
    except ValueError:
        parts = text.split()

    args = parts[skip:]
    result: Dict[str, Any] = {}

    for i, (name, target_type) in enumerate(type_hints.items()):
        if i < len(args):
            parser = _PARSEABLE_TYPES.get(target_type, target_type)
            try:
                result[name] = parser(args[i])
            except (ValueError, TypeError) as e:
                raise CommandParseError(
                    f"Cannot parse '{args[i]}' as {target_type.__name__} "
                    f"for parameter '{name}'",
                    command=parts[0] if parts else "",
                ) from e
        # Missing args left for default values

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
            from kurigram.depends import Depends

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
