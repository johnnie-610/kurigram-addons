# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Plugin architecture for pyrogram_patch.
#
# This module provides a plugin system that allows third-party extensions
# to add custom middleware, storage backends, and other components.


import asyncio
import importlib
import inspect
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Type, TypeVar

from pyrogram_patch import errors

logger = logging.getLogger("pyrogram_patch.plugins")

T = TypeVar("T")


class PluginError(errors.PyrogramPatchError):
    """Error raised for plugin-related issues."""

    pass


class PluginBase(ABC):
    """Base class for all plugins."""

    def __init__(self, name: str, version: str = "1.0.0"):
        self.name = name
        self.version = version
        self.logger = logging.getLogger(f"pyrogram_patch.plugins.{name}")

    @abstractmethod
    async def initialize(self, config: Dict[str, Any]) -> None:
        """Initialize the plugin with configuration."""
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """Shutdown the plugin and cleanup resources."""
        pass

    def get_info(self) -> Dict[str, Any]:
        """Get plugin information."""
        return {
            "name": self.name,
            "version": self.version,
            "description": getattr(self, "__doc__", ""),
            "capabilities": self.get_capabilities(),
        }

    def get_capabilities(self) -> List[str]:
        """Get list of plugin capabilities."""
        return []


class MiddlewarePlugin(PluginBase):
    """Plugin that provides custom middleware."""

    async def get_middleware(self, config: Dict[str, Any]) -> Any:
        """Return middleware instance for the given configuration."""
        raise NotImplementedError


class StoragePlugin(PluginBase):
    """Plugin that provides custom storage backends."""

    async def get_storage(self, config: Dict[str, Any]) -> Any:
        """Return storage instance for the given configuration."""
        raise NotImplementedError


class MetricsPlugin(PluginBase):
    """Plugin that provides custom metrics collection."""

    async def record_metric(
        self, name: str, value: Any, labels: Dict[str, str]
    ) -> None:
        """Record a metric."""
        pass


class PluginManager:
    """Manages plugin loading, initialization, and lifecycle."""

    def __init__(self):
        self.plugins: Dict[str, PluginBase] = {}
        self.initialized_plugins: set = set()
        self._lock = asyncio.Lock()

    async def load_plugin(
        self,
        plugin_class: Type[PluginBase],
        config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Load and initialize a plugin.

        Args:
            plugin_class: The plugin class to instantiate
            config: Configuration for the plugin

        Returns:
            Plugin name

        Raises:
            PluginError: If plugin loading fails
        """
        config = config or {}

        try:
            # Instantiate plugin
            plugin = plugin_class()

            # Initialize plugin
            await plugin.initialize(config)

            async with self._lock:
                self.plugins[plugin.name] = plugin
                self.initialized_plugins.add(plugin.name)

            logger.info("Loaded plugin: %s v%s", plugin.name, plugin.version)
            return plugin.name

        except Exception as e:
            raise PluginError(
                f"Failed to load plugin {plugin_class.__name__}", cause=e
            ) from e

    async def load_plugin_from_module(
        self,
        module_name: str,
        class_name: str,
        config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Load a plugin from a module.

        Args:
            module_name: Name of the module containing the plugin
            class_name: Name of the plugin class
            config: Configuration for the plugin

        Returns:
            Plugin name
        """
        try:
            module = importlib.import_module(module_name)
            plugin_class = getattr(module, class_name)

            if not inspect.isclass(plugin_class) or not issubclass(
                plugin_class, PluginBase
            ):
                raise PluginError(
                    f"Class {class_name} is not a valid PluginBase subclass"
                )

            return await self.load_plugin(plugin_class, config)

        except ImportError as e:
            raise PluginError(
                f"Failed to import module {module_name}", cause=e
            ) from e
        except AttributeError as e:
            raise PluginError(
                f"Class {class_name} not found in module {module_name}", cause=e
            ) from e

    async def unload_plugin(self, name: str) -> bool:
        """
        Unload a plugin.

        Args:
            name: Name of the plugin to unload

        Returns:
            True if plugin was unloaded, False if not found
        """
        async with self._lock:
            if name not in self.plugins:
                return False

            plugin = self.plugins[name]

            try:
                await plugin.shutdown()
                del self.plugins[name]
                self.initialized_plugins.discard(name)
                logger.info("Unloaded plugin: %s", name)
                return True
            except Exception as e:
                logger.error("Error unloading plugin %s: %s", name, e)
                return False

    def get_plugin(self, name: str) -> Optional[PluginBase]:
        """Get a loaded plugin by name."""
        return self.plugins.get(name)

    def list_plugins(self) -> List[Dict[str, Any]]:
        """List all loaded plugins with their information."""
        return [plugin.get_info() for plugin in self.plugins.values()]

    async def get_middleware_from_plugins(
        self, middleware_name: str, config: Dict[str, Any]
    ) -> Optional[Any]:
        """Get middleware from plugins."""
        for plugin in self.plugins.values():
            if isinstance(plugin, MiddlewarePlugin):
                try:
                    middleware = await plugin.get_middleware(config)
                    if middleware.__class__.__name__ == middleware_name:
                        return middleware
                except Exception as e:
                    logger.debug(
                        "Plugin %s failed to provide middleware %s: %s",
                        plugin.name,
                        middleware_name,
                        e,
                    )
        return None

    async def get_storage_from_plugins(
        self, storage_name: str, config: Dict[str, Any]
    ) -> Optional[Any]:
        """Get storage backend from plugins."""
        for plugin in self.plugins.values():
            if isinstance(plugin, StoragePlugin):
                try:
                    storage = await plugin.get_storage(config)
                    if storage.__class__.__name__ == storage_name:
                        return storage
                except Exception as e:
                    logger.debug(
                        "Plugin %s failed to provide storage %s: %s",
                        plugin.name,
                        storage_name,
                        e,
                    )
        return None

    async def record_metric_from_plugins(
        self, name: str, value: Any, labels: Dict[str, str]
    ) -> None:
        """Record metric using available metrics plugins."""
        for plugin in self.plugins.values():
            if isinstance(plugin, MetricsPlugin):
                try:
                    await plugin.record_metric(name, value, labels)
                except Exception as e:
                    logger.debug(
                        "Plugin %s failed to record metric: %s", plugin.name, e
                    )

    async def shutdown_all(self) -> None:
        """Shutdown all loaded plugins."""
        plugin_names = list(self.plugins.keys())
        for name in plugin_names:
            await self.unload_plugin(name)


# Global plugin manager
_plugin_manager = PluginManager()


def get_plugin_manager() -> PluginManager:
    """Get the global plugin manager."""
    return _plugin_manager


# Plugin discovery helpers
def discover_plugins_in_module(module_name: str) -> List[Type[PluginBase]]:
    """
    Discover plugin classes in a module.

    Args:
        module_name: Name of the module to search

    Returns:
        List of plugin classes found
    """
    try:
        module = importlib.import_module(module_name)
        plugins = []

        for name, obj in inspect.getmembers(module):
            if (
                inspect.isclass(obj)
                and issubclass(obj, PluginBase)
                and obj != PluginBase
                and obj != MiddlewarePlugin
                and obj != StoragePlugin
                and obj != MetricsPlugin
            ):
                plugins.append(obj)

        return plugins

    except ImportError:
        logger.warning(
            "Failed to import module %s for plugin discovery", module_name
        )
        return []


def discover_plugins_in_package(package_name: str) -> List[Type[PluginBase]]:
    """
    Discover plugins in a package and its submodules.

    Args:
        package_name: Name of the package to search

    Returns:
        List of plugin classes found
    """
    try:
        package = importlib.import_module(package_name)
        plugins = []

        # Check the package itself
        plugins.extend(discover_plugins_in_module(package_name))

        # Check for __init__.py plugins
        if hasattr(package, "__path__"):
            # This is a package, look for plugins in submodules
            try:
                import pkgutil

                for importer, modname, ispkg in pkgutil.iter_modules(
                    package.__path__
                ):
                    submodule_name = f"{package_name}.{modname}"
                    plugins.extend(discover_plugins_in_module(submodule_name))
            except Exception as e:
                logger.debug(
                    "Failed to discover plugins in package %s: %s",
                    package_name,
                    e,
                )

        return plugins

    except ImportError:
        logger.warning(
            "Failed to import package %s for plugin discovery", package_name
        )
        return []


# Auto-loading helper
async def load_plugins_from_config(config: Dict[str, Any]) -> List[str]:
    """
    Load plugins specified in configuration.

    Args:
        config: Configuration dictionary with 'plugins' key

    Returns:
        List of loaded plugin names
    """
    loaded_plugins = []

    if "plugins" not in config:
        return loaded_plugins

    plugin_specs = config["plugins"]
    plugin_configs = config.get("plugin_configs", {})

    for spec in plugin_specs:
        try:
            if ":" in spec:
                # Format: module:class
                module_name, class_name = spec.split(":", 1)
                plugin_config = plugin_configs.get(spec, {})
                plugin_name = await _plugin_manager.load_plugin_from_module(
                    module_name, class_name, plugin_config
                )
            else:
                # Assume it's a module with a default plugin class
                plugins = discover_plugins_in_module(spec)
                if plugins:
                    plugin_config = plugin_configs.get(spec, {})
                    plugin_name = await _plugin_manager.load_plugin(
                        plugins[0], plugin_config
                    )
                else:
                    logger.warning("No plugins found in module %s", spec)
                    continue

            loaded_plugins.append(plugin_name)

        except Exception as e:
            logger.error("Failed to load plugin %s: %s", spec, e)

    return loaded_plugins
