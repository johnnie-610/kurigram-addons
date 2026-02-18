# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


from __future__ import annotations

import abc
from typing import Any, Dict, Optional, Protocol


class BaseStorage(abc.ABC):
    """Abstract base class / interface for FSM storage backends.

    Implementations must be fully asynchronous and follow the method
    semantics described here. This interface is intentionally small and
    maps directly to the operations required by FSMContext.

    Implementations should not perform long blocking work inside methods;
    use async IO primitives instead.

    Methods:
        set_state(identifier, state, ttl=None)
        get_state(identifier)
        delete_state(identifier)
        compare_and_set(identifier, new_state, expected_state=None, ttl=None)
        list_keys(pattern="*")
        clear_namespace()
        start() (optional)
        stop() (optional)
    """

    # lifecycle (optional)
    async def start(self) -> None:
        """Optional startup hook. Backends may open connections or start background tasks."""
        return None

    async def stop(self) -> None:
        """Optional shutdown hook. Backends should cleanup and stop background tasks."""
        return None

    async def health(self) -> bool:
        """Check if storage is healthy and accessible."""
        return True

    # core API
    @abc.abstractmethod
    async def set_state(
        self,
        identifier: str,
        state: Dict[str, Any],
        *,
        ttl: Optional[int] = None,
    ) -> None:
        """Persist the state for `identifier`.

        Args:
            identifier: unique key (e.g. 'chat:123' or 'user:456').
            state: JSON-serialisable mapping describing state, e.g. {'name': 'awaiting', 'data': {...}}.
            ttl: optional TTL in seconds (0 or None => no expiry).

        Raises:
            errors.PyrogramPatchError (or subclass) on failure.
        """
        raise NotImplementedError

    @abc.abstractmethod
    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        """Return the stored state dict for `identifier` or None if absent.

        Raises:
            errors.PyrogramPatchError on failure.
        """
        raise NotImplementedError

    @abc.abstractmethod
    async def delete_state(self, identifier: str) -> bool:
        """Remove the state for `identifier`. Return True if a key was removed.

        Raises:
            errors.PyrogramPatchError on failure.
        """
        raise NotImplementedError

    @abc.abstractmethod
    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        """Atomically set `new_state` only if the current value equals `expected_state`.

        Args:
            identifier: key.
            new_state: mapping to set.
            expected_state: mapping expected to currently be present (None means absent).
            ttl: optional TTL override.

        Returns:
            True if the new_state was set (condition matched), False otherwise.

        Raises:
            errors.PyrogramPatchError on backend failures.
        """
        raise NotImplementedError

    @abc.abstractmethod
    async def list_keys(self, pattern: str = "*") -> list[str]:
        """Return a list of identifiers stored (pattern matching left to backend).

        Note:
            Patterns and scanning semantics depend on the backend. For Redis-like backends,
            pattern is applied to keys after the namespace/prefix. Backends should document behavior.

        Raises:
            errors.PyrogramPatchError on failure.
        """
        raise NotImplementedError

    @abc.abstractmethod
    async def clear_namespace(self) -> int:
        """Delete all keys in this storage's namespace and return the number deleted.

        Raises:
            errors.PyrogramPatchError on failure.
        """
        raise NotImplementedError


# Optional: a Protocol for duck-typing (useful in tests)
class BaseStorageProtocol(Protocol):
    """Protocol describing the async storage shape for static typing."""

    async def set_state(
        self,
        identifier: str,
        state: Dict[str, Any],
        *,
        ttl: Optional[int] = None,
    ) -> None: ...

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]: ...

    async def delete_state(self, identifier: str) -> bool: ...

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool: ...

    async def list_keys(self, pattern: str = "*") -> list[str]: ...

    async def clear_namespace(self) -> int: ...
