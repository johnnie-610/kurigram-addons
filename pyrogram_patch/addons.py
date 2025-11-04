# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Addon architecture for pyrogram_patch.
#
# This module provides an addon system that allows third-party extensions
# to add custom middleware, storage backends, and other components.

import asyncio
import importlib
import inspect
import logging
import pkgutil
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Set, Type

from pyrogram_patch import errors

logger = logging.getLogger("pyrogram_patch.addons")

class AddonError(errors.PyrogramPatchError):
    """Error raised for addon-related issues."""

    pass


class AddonBase(ABC):
    """Base class for all addons."""

    def __init__(self, name: str, version: str = "1.0.0"):
        self.name = name
        self.version = version
        self.logger = logging.getLogger(f"pyrogram_patch.addons.{name}")

    @abstractmethod
    async def initialize(self, config: Dict[str, Any]) -> None:
        """Initialize the addon with configuration."""

    @abstractmethod
    async def shutdown(self) -> None:
        """Shutdown the addon and clean up resources."""

    def get_info(self) -> Dict[str, Any]:
        """Get addon information."""
        return {
            "name": self.name,
            "version": self.version,
            "description": getattr(self, "__doc__", ""),
            "capabilities": self.get_capabilities(),
        }

    def get_capabilities(self) -> List[str]:
        """Get list of addon capabilities."""
        return []


class MiddlewareAddon(AddonBase):
    """Addon that provides custom middleware."""

    async def get_middleware(self, config: Dict[str, Any]) -> Any:
        """Return middleware instance for the given configuration."""
        raise NotImplementedError


class StorageAddon(AddonBase):
    """Addon that provides custom storage backends."""

    async def get_storage(self, config: Dict[str, Any]) -> Any:
        """Return storage instance for the given configuration."""
        raise NotImplementedError


class MetricsAddon(AddonBase):
    """Addon that provides custom metrics collection."""

    async def record_metric(self, name: str, value: Any, labels: Dict[str, str]) -> None:
        """Record a metric."""

        pass


class AddonManager:
    """Manages addon loading, initialization, and lifecycle."""

    def __init__(self):
        self.addons: Dict[str, AddonBase] = {}
        self.initialized_addons: Set[str] = set()
        self._lock = asyncio.Lock()

    async def load_addon(
        self,
        addon_class: Type[AddonBase],
        config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Load and initialize an addon."""

        config = config or {}

        try:
            addon = addon_class()
            await addon.initialize(config)

            async with self._lock:
                self.addons[addon.name] = addon
                self.initialized_addons.add(addon.name)

            logger.info("Loaded addon: %s v%s", addon.name, addon.version)
            return addon.name

        except Exception as e:  # pragma: no cover - defensive
            raise AddonError(
                f"Failed to load addon {addon_class.__name__}", cause=e
            ) from e

    async def load_addon_from_module(
        self,
        module_name: str,
        class_name: str,
        config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Load an addon from a module."""

        try:
            module = importlib.import_module(module_name)
            addon_class = getattr(module, class_name)

            if not inspect.isclass(addon_class) or not issubclass(
                addon_class, AddonBase
            ):
                raise AddonError(
                    f"Class {class_name} is not a valid AddonBase subclass"
                )

            return await self.load_addon(addon_class, config)

        except ImportError as e:  # pragma: no cover - defensive
            raise AddonError(
                f"Failed to import module {module_name}", cause=e
            ) from e
        except AttributeError as e:  # pragma: no cover - defensive
            raise AddonError(
                f"Class {class_name} not found in module {module_name}", cause=e
            ) from e

    async def unload_addon(self, name: str) -> bool:
        """Unload an addon."""

        async with self._lock:
            if name not in self.addons:
                return False

            addon = self.addons[name]

            try:
                await addon.shutdown()
                del self.addons[name]
                self.initialized_addons.discard(name)
                logger.info("Unloaded addon: %s", name)
                return True
            except Exception as e:  # pragma: no cover - defensive
                raise AddonError(f"Failed to unload addon {name}", cause=e) from e

    def get_addon(self, name: str) -> Optional[AddonBase]:
        """Get a loaded addon by name."""

        return self.addons.get(name)

    def list_addons(self) -> List[Dict[str, Any]]:
        """List all loaded addons with their information."""

        return [addon.get_info() for addon in self.addons.values()]

    async def get_middleware_from_addons(
        self, middleware_name: str, config: Dict[str, Any]
    ) -> Optional[Any]:
        """Get middleware from addons."""

        for addon in self.addons.values():
            if isinstance(addon, MiddlewareAddon):
                try:
                    middleware = await addon.get_middleware(config)
                    if middleware.__class__.__name__ == middleware_name:
                        return middleware
                except Exception as e:  # pragma: no cover - defensive
                    logger.debug(
                        "Addon %s failed to provide middleware %s: %s",
                        addon.name,
                        middleware_name,
                        e,
                    )

        return None

    async def get_storage_from_addons(
        self, storage_name: str, config: Dict[str, Any]
    ) -> Optional[Any]:
        """Get storage backend from addons."""

        for addon in self.addons.values():
            if isinstance(addon, StorageAddon):
                try:
                    storage = await addon.get_storage(config)
                    if storage.__class__.__name__ == storage_name:
                        return storage
                except Exception as e:  # pragma: no cover - defensive
                    logger.debug(
                        "Addon %s failed to provide storage %s: %s",
                        addon.name,
                        storage_name,
                        e,
                    )

        return None

    async def record_metric_from_addons(
        self, name: str, value: Any, labels: Dict[str, str]
    ) -> None:
        """Record metric using available metrics addons."""

        for addon in self.addons.values():
            if isinstance(addon, MetricsAddon):
                try:
                    await addon.record_metric(name, value, labels)
                except Exception as e:  # pragma: no cover - defensive
                    logger.debug(
                        "Addon %s failed to record metric: %s", addon.name, e
                    )

    async def shutdown_all(self) -> None:
        """Shutdown all loaded addons."""

        addon_names = list(self.addons.keys())

        for name in addon_names:
            await self.unload_addon(name)


_addon_manager = AddonManager()


def get_addon_manager() -> AddonManager:
    """Get the global addon manager instance."""

    return _addon_manager


# Addon discovery helpers
def discover_addons_in_module(module_name: str) -> List[Type[AddonBase]]:
    """Discover addon classes in a module."""

    try:
        module = importlib.import_module(module_name)
        addons: List[Type[AddonBase]] = []

        for _, obj in inspect.getmembers(module):
            if (
                inspect.isclass(obj)
                and issubclass(obj, AddonBase)
                and obj not in {AddonBase, MiddlewareAddon, StorageAddon, MetricsAddon}
            ):
                addons.append(obj)

        return addons

    except ImportError:  # pragma: no cover - defensive
        logger.warning(
            "Failed to import module %s for addon discovery", module_name
        )
        return []


def discover_addons_in_package(package_name: str) -> List[Type[AddonBase]]:
    """Discover addons in a package and its submodules."""

    try:
        package = importlib.import_module(package_name)
        addons: List[Type[AddonBase]] = []

        addons.extend(discover_addons_in_module(package_name))

        if hasattr(package, "__path__"):
            try:
                for _, modname, _ in pkgutil.iter_modules(package.__path__):
                    submodule_name = f"{package_name}.{modname}"
                    addons.extend(discover_addons_in_module(submodule_name))
            except Exception as e:  # pragma: no cover - defensive
                logger.debug(
                    "Failed to discover addons in package %s: %s",
                    package_name,
                    e,
                )

        return addons

    except ImportError:  # pragma: no cover - defensive
        logger.warning(
            "Failed to import package %s for addon discovery", package_name
        )
        return []


async def load_addons_from_config(config: Dict[str, Any]) -> List[str]:
    """Load addons specified in configuration."""

    loaded_addons: List[str] = []

    if "addons" not in config:
        return loaded_addons

    addon_specs = config["addons"]
    addon_configs = config.get("addon_configs", {})

    for spec in addon_specs:
        try:
            if ":" in spec:
                module_name, class_name = spec.split(":", 1)
                addon_config = addon_configs.get(spec, {})
                addon_name = await _addon_manager.load_addon_from_module(
                    module_name, class_name, addon_config
                )
            else:
                addons = discover_addons_in_module(spec)
                if addons:
                    addon_config = addon_configs.get(spec, {})
                    addon_name = await _addon_manager.load_addon(
                        addons[0], addon_config
                    )
                else:
                    logger.warning("No addons found in module %s", spec)
                    continue

            loaded_addons.append(addon_name)

        except Exception as e:  # pragma: no cover - defensive
            logger.error("Failed to load addon %s: %s", spec, e)

    return loaded_addons

