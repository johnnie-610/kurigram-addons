# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# pyrogram_patch.errors
# Improved error types, helpers and decorators for pyrogram_patch.

# Goals:
# - Provide clear exception hierarchy for dispatcher, middleware, fsm, storage, patching and compatibility errors.
# - Capture rich traceback/context info in a JSON-able way.
# - Provide helpers/decorators to wrap sync/async call sites and re-raise structured exceptions.
# - Play nicely with async code (no blocking operations), and with logging frameworks.

from __future__ import annotations

import hashlib
import inspect
import json
import linecache
import logging
import traceback
from dataclasses import asdict, dataclass
from datetime import datetime
from functools import wraps
from typing import Any, Callable, Dict, Optional, Type

# Configure module logger (library users can reconfigure root or module logger)
logger = logging.getLogger("pyrogram_patch")
if not logger.handlers:
    # Basic default handler if the application didn't configure logging.
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


@dataclass
class TraceInfo:
    file: str
    line: int
    function: str
    code: str
    stack: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def capture_trace(skip: int = 0) -> Optional[TraceInfo]:
    """
    Capture a single frame trace information (non-blocking).
    skip: how many frames above the current one to skip (0 -> caller of capture_trace).
    Returns None if it cannot retrieve info.
    """
    try:
        frame = inspect.currentframe()
        if frame is None:
            return None
        # Walk up skip + 1 frames to reach call site
        for _ in range(skip + 1):
            frame = frame.f_back
            if frame is None:
                return None

        filename = frame.f_code.co_filename
        lineno = frame.f_lineno
        function = frame.f_code.co_name
        code_line = linecache.getline(filename, lineno).strip()
        stack = "".join(traceback.format_stack(limit=50))
        return TraceInfo(
            file=filename,
            line=lineno,
            function=function,
            code=code_line,
            stack=stack,
        )
    except Exception:
        # Never raise from trace capture - best-effort only
        return None


def format_exception_stack(exc: BaseException) -> str:
    """
    Return formatted exception stack for given exception.
    """
    tb = exc.__traceback__
    return "".join(traceback.format_exception(type(exc), exc, tb))


def make_error_id(error_code: str, trace: Optional[TraceInfo] = None) -> str:
    """
    Produce a short deterministic id for an error instance (useful for logs).
    """
    seed = error_code + (trace.file + str(trace.line) if trace else "")
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return digest[:12]


class PyrogramPatchError(Exception):
    """
    Base error for pyrogram_patch.

    Attributes:
        message: human message
        error_code: short machine code / enum
        context: optional dict of additional metadata (serializable)
        trace: captured TraceInfo (best-effort)
        cause: original exception (if wrapping)
        error_id: short sha id used for cross-referencing logs and reports
    """

    def __init__(
        self,
        message: str,
        *,
        error_code: str = "PYR_PATCH_ERROR",
        context: Optional[Dict[str, Any]] = None,
        trace: Optional[TraceInfo] = None,
        cause: Optional[BaseException] = None,
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.context = context or {}
        # if no trace supplied, capture caller frame
        self.trace = trace or capture_trace(skip=1)
        self.cause = cause
        self.created_at = datetime.utcnow().isoformat() + "Z"
        self.error_id = make_error_id(self.error_code, self.trace)

        # Log right away at appropriate level (subclasses may override)
        logger.error(self.short_log_line())

    def to_dict(self) -> Dict[str, Any]:
        d = {
            "error_id": self.error_id,
            "error_code": self.error_code,
            "message": self.message,
            "context": self.context,
            "created_at": self.created_at,
        }
        if self.trace:
            d["trace"] = self.trace.to_dict()
        if self.cause:
            d["cause"] = {
                "type": type(self.cause).__name__,
                "message": str(self.cause),
                "stack": format_exception_stack(self.cause),
            }
        return d

    def to_json(self, *, indent: Optional[int] = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent, default=str)

    def short_log_line(self) -> str:
        trace_info = (
            f"{self.trace.file}:{self.trace.line}" if self.trace else "unknown"
        )
        return f"[{self.error_id}] {self.error_code}: {self.message} @ {trace_info}"

    def get_help_message(self) -> str:
        """
        Override this in subclasses to give more actionable guidance.
        """
        base = [
            f"Error [{self.error_code}]",
            f"Message: {self.message}",
            "",
            "Context:",
            json.dumps(self.context, default=str, indent=2),
            "",
            "Trace (first line):",
            (self.trace.code if self.trace else "<no trace>"),
            "",
            "Suggested action: check the traceback and logs for details.",
        ]
        return "\n".join(base)

    def log_report(self, level: int = logging.ERROR) -> None:
        """
        Emit full structured report to the logger at given level.
        """
        msg = self.to_json()
        logger.log(level, msg)


# ---- Specific exception types tailored for pyrogram_patch ----


class ValidationError(PyrogramPatchError):
    def __init__(
        self,
        field: str,
        value: Any,
        expected: Optional[str] = None,
        **kwargs,
    ):
        message = (
            f"Validation failed for field '{field}': got {type(value).__name__}"
        )
        if expected:
            message += f", expected {expected}"
        context = kwargs.pop("context", {})
        context.update(
            {"field": field, "value": repr(value), "expected": expected}
        )
        super().__init__(
            message, error_code="VALIDATION_ERROR", context=context, **kwargs
        )

    def get_help_message(self) -> str:
        return (
            f"ValidationError: field '{self.context.get('field')}' received invalid "
            f"value {self.context.get('value')}. Expected: {self.context.get('expected')}. "
            "Check input passed to the API."
        )


class DispatcherError(PyrogramPatchError):
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="DISPATCHER_ERROR", **kwargs)

    def get_help_message(self) -> str:
        return (
            "Dispatcher error occurred. Ensure the dispatcher is patched/initialized correctly. "
            "Check worker counts, queue sizes, and lock usage. If this happens during startup, "
            "the patch may be incompatible with upstream."
        )


class PatchError(PyrogramPatchError):
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="PATCH_ERROR", **kwargs)

    def get_help_message(self) -> str:
        return (
            "Patch/install error. The patch may have partially applied and left the client in an "
            "inconsistent state. You should call the library's 'unpatch' function (if available) "
            "or restart the client. See patch logs for details."
        )


class LockError(PyrogramPatchError):
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="LOCK_ERROR", **kwargs)

    def get_help_message(self) -> str:
        return (
            "Locking error: likely caused by use of blocking primitives in async context or "
            "a deadlock. Replace blocking locks with asyncio.Lock or AsyncLockMap."
        )


class RedisStorageError(PyrogramPatchError):
    def __init__(
        self,
        message: str,
        *,
        context: Optional[Dict[str, Any]] = None,
        **kwargs,
    ):
        ctx = context or {}
        ctx.setdefault("backend", "redis")
        super().__init__(
            message, error_code="REDIS_STORAGE_ERROR", context=ctx, **kwargs
        )

    def get_help_message(self) -> str:
        return (
            "Redis storage error. Ensure redis client is compatible (async client usage), "
            "pipelines are used correctly (don't `await` pipeline() when not awaitable), "
            "and that network/credentials are correct."
        )


class FSMTransitionError(PyrogramPatchError):
    def __init__(self, message: str, *, state: Optional[str] = None, **kwargs):
        ctx = kwargs.pop("context", {}) or {}
        if state:
            ctx["state"] = state
        super().__init__(
            message, error_code="FSM_TRANSITION_ERROR", context=ctx, **kwargs
        )

    def get_help_message(self) -> str:
        return (
            "FSM transition failed. This can be due to race conditions or missing atomic checks. "
            "If you use Redis, ensure transitions are atomic (Lua script or WATCH/MULTI/EXEC)."
        )


class MiddlewareError(PyrogramPatchError):
    def __init__(
        self, message: str, *, middleware: Optional[str] = None, **kwargs
    ):
        ctx = kwargs.pop("context", {}) or {}
        if middleware:
            ctx["middleware"] = middleware
        super().__init__(
            message, error_code="MIDDLEWARE_ERROR", context=ctx, **kwargs
        )

    def get_help_message(self) -> str:
        return (
            "Middleware execution failed. Check middleware's sync/async compatibility and ordering. "
            "Make sure middleware returns or raises appropriately."
        )


class RouterError(PyrogramPatchError):
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="ROUTER_ERROR", **kwargs)

    def get_help_message(self) -> str:
        return "Router error. Ensure route filters match the expected update shapes (message_thread_id, story updates, etc.)"


class UpstreamCompatibilityError(PyrogramPatchError):
    def __init__(
        self, message: str, *, upstream_version: Optional[str] = None, **kwargs
    ):
        ctx = kwargs.pop("context", {}) or {}
        if upstream_version:
            ctx["upstream_version"] = upstream_version
        super().__init__(
            message, error_code="UPSTREAM_COMPAT", context=ctx, **kwargs
        )

    def get_help_message(self) -> str:
        return (
            "Compatibility issue between pyrogram_patch and the upstream Pyrogram version. "
            "Check upstream changes (new update types, rename of internals) and update the patch accordingly."
        )


class DeprecationNotice(PyrogramPatchError, DeprecationWarning):
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="DEPRECATION_NOTICE", **kwargs)

    def get_help_message(self) -> str:
        return f"Deprecated: {self.message}"


class AsyncHandlerRequiredError(RouterError):
    def __init__(
        self, message: str = "Handler must be an async function", **kwargs
    ):
        super().__init__(message, error_code="ASYNC_HANDLER_REQUIRED", **kwargs)

    def get_help_message(self) -> str:
        return (
            "Router requires async handlers for full async compatibility. "
            "Convert your handler to 'async def handler(client, event):'."
        )


class HandlerRegistrationError(RouterError):
    def __init__(self, message: str, **kwargs):
        super().__init__(
            message, error_code="HANDLER_REGISTRATION_ERROR", **kwargs
        )

    def get_help_message(self) -> str:
        return (
            "Failed to register handler with Pyrogram client. "
            "Verify client is initialized, no conflicting handlers, and Pyrogram version compatibility."
        )


class FSMContextError(PyrogramPatchError):
    def __init__(
        self,
        message: str,
        *,
        error_code: str = "FSM_CONTEXT_ERROR",
        context: Optional[Dict[str, Any]] = None,
        trace: Optional[TraceInfo] = None,
        cause: Optional[BaseException] = None,
    ):
        super().__init__(
            message,
            error_code=error_code,
            context=context,
            trace=trace,
            cause=cause,
        )

    def get_help_message(self) -> str:
        return (
            "FSMContext error. Ensure the identifier is valid and the storage is initialized. "
            "Check your FSMContext usage and storage configuration."
        )


def _wrap_exception(
    exc_type: Type[PyrogramPatchError], message: Optional[str], **wrap_kwargs
):
    """
    Factory returning a decorator that wraps exceptions in the given exc_type.
    """

    def decorator(func: Callable):
        if inspect.iscoroutinefunction(func):

            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                try:
                    return await func(*args, **kwargs)
                except PyrogramPatchError:
                    # Don't double-wrap if already our structured exception
                    raise
                except Exception as e:
                    msg = (
                        message
                        or f"Unhandled exception in {func.__name__}: {e}"
                    )
                    # capture trace from caller frame
                    trace = capture_trace(skip=1)
                    raise exc_type(
                        msg,
                        cause=e,
                        trace=trace,
                        context=wrap_kwargs.get("context"),
                    ) from e

            return async_wrapper
        else:

            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except PyrogramPatchError:
                    raise
                except Exception as e:
                    msg = (
                        message
                        or f"Unhandled exception in {func.__name__}: {e}"
                    )
                    trace = capture_trace(skip=1)
                    raise exc_type(
                        msg,
                        cause=e,
                        trace=trace,
                        context=wrap_kwargs.get("context"),
                    ) from e

            return sync_wrapper

    return decorator


def wrap_with_dispatcher_error(message: Optional[str] = None, **ctx):
    return _wrap_exception(DispatcherError, message, **ctx)


def wrap_with_patch_error(message: Optional[str] = None, **ctx):
    return _wrap_exception(PatchError, message, **ctx)


def wrap_with_redis_error(message: Optional[str] = None, **ctx):
    return _wrap_exception(RedisStorageError, message, **ctx)


def wrap_with_middleware_error(message: Optional[str] = None, **ctx):
    return _wrap_exception(MiddlewareError, message, **ctx)


def safe_dict(obj: Any) -> Dict[str, Any]:
    """
    Try to convert an object to a JSON safe dict for logging/context.
    """
    try:
        if isinstance(obj, dict):
            return obj
        if hasattr(obj, "__dict__"):
            return {
                k: safe_dict(v)
                for k, v in vars(obj).items()
                if not k.startswith("_")
            }
        return {"value": repr(obj)}
    except Exception:
        return {"value": "<unserializable>"}


__all__ = [
    "TraceInfo",
    "capture_trace",
    "format_exception_stack",
    "PyrogramPatchError",
    "ValidationError",
    "DispatcherError",
    "PatchError",
    "LockError",
    "RedisStorageError",
    "FSMTransitionError",
    "MiddlewareError",
    "RouterError",
    "UpstreamCompatibilityError",
    "DeprecationNotice",
    "AsyncHandlerRequiredError",
    "HandlerRegistrationError",
    "wrap_with_dispatcher_error",
    "wrap_with_patch_error",
    "wrap_with_redis_error",
    "wrap_with_middleware_error",
    "safe_dict",
]
