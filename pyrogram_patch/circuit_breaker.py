# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Circuit Breaker pattern implementation for storage backend resilience.

# This module provides a circuit breaker that can wrap storage operations
# to provide fault tolerance and automatic recovery.


import asyncio
import logging
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass
from enum import Enum
from typing import Callable, Dict, Generic, Optional, TypeVar

logger = logging.getLogger("pyrogram_patch.circuit_breaker")

T = TypeVar("T")


class CircuitState(Enum):
    """Circuit breaker states."""

    CLOSED = "closed"  # Normal operation
    OPEN = "open"  # Failing, requests rejected
    HALF_OPEN = "half_open"  # Testing if service recovered


@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker behavior.

    Note:
        For new code, prefer using ``pyrogram_patch.config.CircuitBreakerConfig``
        (Pydantic settings) which supports environment variable loading.
        This dataclass is kept for backwards compatibility.
    """

    failure_threshold: int = 5  # Failures before opening
    recovery_timeout: float = 60.0  # Seconds to wait before trying again
    success_threshold: int = 3  # Successes needed to close circuit
    timeout: float = 10.0  # Operation timeout in seconds


class CircuitBreakerOpenException(Exception):
    """Exception raised when circuit breaker is open."""

    pass


class AsyncCircuitBreaker(Generic[T]):
    """
    Asynchronous circuit breaker for storage operations.

    This implementation provides:
    - Automatic failure detection
    - Fast-fail when backend is down
    - Automatic recovery testing
    - Configurable thresholds and timeouts
    """

    def __init__(self, config: Optional[CircuitBreakerConfig] = None):
        # Accept Pydantic CircuitBreakerConfig from config.py or local dataclass
        if config is None:
            config = CircuitBreakerConfig()
        elif hasattr(config, 'model_fields'):
            # Pydantic model — extract fields to local dataclass for consistency
            config = CircuitBreakerConfig(
                failure_threshold=config.failure_threshold,
                recovery_timeout=config.recovery_timeout,
                success_threshold=config.success_threshold,
                timeout=config.timeout,
            )
        self.config = config
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[float] = None
        self._lock = asyncio.Lock()

    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt a reset.

        Deliberately synchronous: this method only reads a float and compares
        it against the wall clock.  It must never become async — it is called
        while ``self._lock`` is held, and acquiring the lock again inside an
        awaited coroutine would deadlock (``_record_success`` / ``_record_failure``
        also acquire the same lock).
        """
        if self.last_failure_time is None:
            return False
        return (
            time.time() - self.last_failure_time >= self.config.recovery_timeout
        )

    async def _record_success(self) -> None:
        """Record a successful operation."""
        async with self._lock:
            self.failure_count = 0
            if self.state == CircuitState.HALF_OPEN:
                self.success_count += 1
                if self.success_count >= self.config.success_threshold:
                    self.state = CircuitState.CLOSED
                    self.success_count = 0
                    logger.info("Circuit breaker closed - service recovered")

    async def _record_failure(self) -> None:
        """Record a failed operation."""
        async with self._lock:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.OPEN
                self.success_count = 0
                logger.warning("Circuit breaker opened - recovery failed")
            elif (
                self.state == CircuitState.CLOSED
                and self.failure_count >= self.config.failure_threshold
            ):
                self.state = CircuitState.OPEN
                logger.warning(
                    "Circuit breaker opened - failure threshold exceeded"
                )

    async def call(self, func: Callable[..., T], *args, **kwargs) -> T:
        """
        Execute a function with circuit breaker protection.

        Args:
            func: The async function to execute
            *args: Positional arguments for the function
            **kwargs: Keyword arguments for the function

        Returns:
            The result of the function call

        Raises:
            CircuitBreakerOpenException: If circuit is open
            Exception: Any exception from the wrapped function
        """
        async with self._lock:
            if self.state == CircuitState.OPEN:
                if self._should_attempt_reset():
                    self.state = CircuitState.HALF_OPEN
                    logger.info("Circuit breaker half-open - testing recovery")
                else:
                    raise CircuitBreakerOpenException("Circuit breaker is open")

        try:
            # Execute with timeout
            result = await asyncio.wait_for(
                func(*args, **kwargs), timeout=self.config.timeout
            )
            await self._record_success()
            return result

        except asyncio.TimeoutError:
            logger.warning("Operation timed out")
            await self._record_failure()
            raise
        except Exception as e:
            logger.warning("Operation failed: %s", e)
            await self._record_failure()
            raise

    @asynccontextmanager
    async def protect(self):
        """
        Context manager for protecting a block of code.

        Usage:
            async with circuit_breaker.protect():
                # Your storage operations here
                await storage.set_state(...)
        """
        # Check state under lock, then release before yielding.
        # _record_success/_record_failure acquire the lock internally,
        # so we must NOT hold it across the yield.
        async with self._lock:
            if self.state == CircuitState.OPEN:
                if self._should_attempt_reset():
                    self.state = CircuitState.HALF_OPEN
                    logger.info("Circuit breaker half-open - testing recovery")
                else:
                    raise CircuitBreakerOpenException("Circuit breaker is open")
        # Lock released here — safe to call _record_* which re-acquire it.
        try:
            yield
            await self._record_success()
        except Exception as e:
            logger.warning("Protected block failed: %s", e)
            await self._record_failure()
            raise

    def get_stats(self) -> dict:
        """Get circuit breaker statistics."""
        return {
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "last_failure_time": self.last_failure_time,
            "config": {
                "failure_threshold": self.config.failure_threshold,
                "recovery_timeout": self.config.recovery_timeout,
                "success_threshold": self.config.success_threshold,
                "timeout": self.config.timeout,
            },
        }


# ---------------------------------------------------------------------------
# Global circuit breaker registry
#
# DEPRECATED — do not use get_circuit_breaker() for new code.
#
# The registry is process-global: all Client instances share the same breaker
# for a given name.  In multi-account bots this means a Redis failure for one
# client trips the breaker and blocks every other client's storage operations.
#
# The correct pattern is to instantiate AsyncCircuitBreaker directly inside
# each storage backend instance (see RedisStorage.__init__).  The registry
# and get_circuit_breaker() are kept only for backwards compatibility and will
# be removed in a future major version.
# ---------------------------------------------------------------------------
_storage_circuit_breakers: dict = {}


def get_circuit_breaker(
    name: str, config: Optional[CircuitBreakerConfig] = None
) -> AsyncCircuitBreaker:
    """Get or create a **process-global** circuit breaker by name.

    .. deprecated::
        This function returns a shared breaker that is visible to all Client
        instances in the same process.  Prefer instantiating
        ``AsyncCircuitBreaker`` directly inside your storage class so each
        storage instance owns its own isolated breaker.
    """
    import warnings
    warnings.warn(
        "get_circuit_breaker() returns a process-global circuit breaker shared "
        "across all Client instances.  Instantiate AsyncCircuitBreaker directly "
        "inside your storage class instead.",
        DeprecationWarning,
        stacklevel=2,
    )
    if name not in _storage_circuit_breakers:
        _storage_circuit_breakers[name] = AsyncCircuitBreaker(config)
    return _storage_circuit_breakers[name]


async def reset_circuit_breaker(name: str) -> bool:
    """
    Reset a circuit breaker to closed state.

    Args:
        name: Circuit breaker identifier

    Returns:
        True if reset was successful, False if not found
    """
    if name in _storage_circuit_breakers:
        cb = _storage_circuit_breakers[name]
        async with cb._lock:
            cb.state = CircuitState.CLOSED
            cb.failure_count = 0
            cb.success_count = 0
            cb.last_failure_time = None
        logger.info("Circuit breaker '%s' reset to closed state", name)
        return True
    return False


def list_circuit_breakers() -> Dict[str, AsyncCircuitBreaker]:
    """Return a mapping of registered circuit breakers."""

    return dict(_storage_circuit_breakers)
