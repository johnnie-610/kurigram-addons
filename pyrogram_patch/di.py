# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie

"""Dependency Injection (DI) for Pyrogram handlers.

Handlers typically receive only ``(client, update)``.  This module lets
them declare any extra dependencies by type annotation — the DI container
resolves and injects them automatically, eliminating per-handler boilerplate.

Example::

    from pyrogram_patch.di import Depends, DIContainer

    # 1. Create a container and register providers
    container = DIContainer()

    async def get_db() -> AsyncSession:
        async with SessionLocal() as session:
            yield session           # generator providers are supported

    container.register(AsyncSession, get_db)

    # 2. Attach the container to your client
    app = KurigramClient("bot", ...)
    container.attach(app)

    # 3. Handlers declare what they need
    @router.on_message(filters.command("stats"))
    async def show_stats(client, message, db: AsyncSession):
        count = await db.scalar(select(func.count(User.id)))
        await message.reply(f"Total users: {count}")

Providers can be:
* Plain async functions  ``async def provider() -> T``
* Generator functions   ``async def provider(): yield value``
* Plain values          ``container.register(MyConfig, my_config_instance)``
* Subclass factories    ``container.register(BaseRepo, ConcreteRepo)``
"""

from __future__ import annotations

import inspect
import logging
from typing import Any, Callable, Dict, Optional, Type, TypeVar

logger = logging.getLogger("pyrogram_patch.di")

T = TypeVar("T")

# Sentinel — marks a function parameter as "inject this"
_INJECT = object()


class Depends:
    """Marker for explicit dependency declaration (optional).

    When used as a default value, the DI container recognises the parameter
    and injects the resolved dependency even if its annotation alone is
    ambiguous::

        async def handler(client, message, repo=Depends(UserRepository)):
            users = await repo.all()
    """

    def __init__(self, provider: Callable) -> None:
        self.provider = provider

    def __repr__(self) -> str:
        return f"Depends({self.provider!r})"


class DIContainer:
    """Lightweight dependency injection container.

    Providers are registered by type.  At dispatch time the container
    inspects each handler's signature and resolves parameters whose
    annotation matches a registered type (or whose default is
    :class:`Depends`).

    Thread-safety: the container is read-only after the initial setup
    phase, so concurrent async access is safe without locks.
    """

    def __init__(self) -> None:
        # Maps type -> provider callable or value
        self._providers: Dict[type, Any] = {}
        # Cache of resolved singletons (for non-generator providers)
        self._singletons: Dict[type, Any] = {}

    def register(self, type_: type, provider: Any) -> "DIContainer":
        """Register a provider for *type_*.

        Args:
            type_: The type to inject (used as the lookup key).
            provider: One of:
                - An async generator function (``async def f(): yield value``)
                - A plain async function (``async def f() -> value``)
                - A class (called with no args to produce the instance)
                - A plain value (returned directly)

        Returns:
            ``self`` for chaining.
        """
        self._providers[type_] = provider
        return self

    def register_value(self, type_: type, value: Any) -> "DIContainer":
        """Register a concrete value (no factory call needed)."""
        self._singletons[type_] = value
        self._providers[type_] = value
        return self

    async def resolve(self, type_: type) -> Any:
        """Resolve a single dependency by type.

        Raises:
            KeyError: If no provider is registered for *type_*.
        """
        # Return cached singleton first
        if type_ in self._singletons:
            return self._singletons[type_]

        provider = self._providers[type_]

        # Plain value (not callable)
        if not callable(provider):
            return provider

        # Async generator: call it and return the yielded value
        if inspect.isasyncgenfunction(provider):
            gen = provider()
            value = await gen.__anext__()
            # We don't cache generators — each resolve gets a fresh instance
            return value

        # Async function
        if inspect.iscoroutinefunction(provider):
            value = await provider()
            return value

        # Sync callable / class
        value = provider()
        return value

    async def inject(
        self,
        handler: Callable,
        update: Any,
        client: Any,
        patch_helper: Any,
    ) -> Dict[str, Any]:
        """Build the extra kwargs to inject into *handler*.

        Inspects the handler's signature and resolves any parameter whose:
        - annotation is a registered type in this container, OR
        - default value is a :class:`Depends` instance.

        The ``client`` and ``update`` positional parameters are skipped.

        Returns:
            A dict of ``{param_name: resolved_value}`` ready to unpack into
            the handler call.
        """
        try:
            sig = inspect.signature(handler)
        except (ValueError, TypeError):
            return {}

        kwargs: Dict[str, Any] = {}
        params = list(sig.parameters.values())

        # Skip first two positional params (client, update) - these are always provided by dispatcher
        injectable = params[2:] if len(params) >= 2 else params

        for param in injectable:
            annotation = param.annotation
            default = param.default

            # Explicit Depends() marker
            if isinstance(default, Depends):
                try:
                    kwargs[param.name] = await self.resolve_provider(default.provider)
                except Exception as exc:
                    logger.warning(
                        "DI: failed to resolve Depends(%r) for param '%s': %s",
                        default.provider, param.name, exc,
                    )
                continue

            # Type-annotated injection
            if annotation is not inspect.Parameter.empty and annotation in self._providers:
                try:
                    kwargs[param.name] = await self.resolve(annotation)
                except Exception as exc:
                    logger.warning(
                        "DI: failed to resolve type %r for param '%s': %s",
                        annotation, param.name, exc,
                    )

        return kwargs

    async def resolve_provider(self, provider: Callable) -> Any:
        """Resolve a provider directly (used by :class:`Depends`)."""
        if inspect.isasyncgenfunction(provider):
            gen = provider()
            return await gen.__anext__()
        if inspect.iscoroutinefunction(provider):
            return await provider()
        return provider()

    def attach(self, client: Any) -> None:
        """Attach this container to a KurigramClient or PatchManager.

        After attaching, the container is stored as ``client._di_container``
        and picked up automatically by the dispatcher.
        """
        client._di_container = self
        logger.info("DIContainer attached to client '%s'", getattr(client, "name", repr(client)))

    def __repr__(self) -> str:
        return f"DIContainer(providers={list(self._providers.keys())})"


__all__ = ["Depends", "DIContainer"]
