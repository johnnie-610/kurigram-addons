# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Configuration management system for pyrogram_patch.
#
# This module provides centralized configuration using Pydantic settings
# with support for environment variables, validation, and type safety.


from typing import Any, Dict, List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class CircuitBreakerConfig(BaseSettings):
    """Configuration for circuit breaker behavior."""

    failure_threshold: int = Field(
        default=5, description="Failures before opening circuit"
    )
    recovery_timeout: float = Field(
        default=60.0, description="Seconds to wait before trying again"
    )
    success_threshold: int = Field(
        default=3, description="Successes needed to close circuit"
    )
    timeout: float = Field(
        default=10.0, description="Operation timeout in seconds"
    )
    fallback_message: str = Field(
        default=(
            "⚠️ We're experiencing temporary issues. Please try again in a moment."
        ),
        description="Message sent to end users when a circuit breaker is open",
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_CB_"


class MetricsConfig(BaseSettings):
    """Configuration for metrics collection."""

    enabled: bool = Field(default=True, description="Enable metrics collection")
    max_samples: int = Field(
        default=1000, description="Maximum number of samples to keep"
    )
    prometheus_port: Optional[int] = Field(
        default=None, description="Port for Prometheus metrics endpoint"
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_METRICS_"


class FSMConfig(BaseSettings):
    """Configuration for FSM behavior."""

    default_ttl: int = Field(
        default=0, description="Default TTL for FSM states (0 = no expiry)"
    )
    max_state_size: int = Field(
        default=1024 * 1024, description="Maximum state size in bytes"
    )
    cleanup_interval: float = Field(
        default=300.0, description="State cleanup interval in seconds"
    )
    helper_session_ttl: float = Field(
        default=900.0,
        description="Seconds to keep helper sessions in memory before cleanup",
    )
    persist_helpers: bool = Field(
        default=False,
        description="Persist helper snapshots to storage for session recovery",
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_FSM_"


class StorageConfig(BaseSettings):
    """Configuration for storage backends."""

    redis_url: Optional[str] = Field(
        default=None, description="Redis connection URL"
    )
    redis_prefix: str = Field(default="fsm", description="Redis key prefix")
    mongo_uri: Optional[str] = Field(
        default=None, description="MongoDB connection URI"
    )
    memory_cleanup_interval: float = Field(
        default=5.0, description="Memory cleanup interval"
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_STORAGE_"


class MiddlewareConfig(BaseSettings):
    """Configuration for middleware behavior."""

    max_execution_time: float = Field(
        default=30.0, description="Maximum middleware execution time"
    )
    enable_circuit_breaker: bool = Field(
        default=True, description="Enable circuit breaker for middleware"
    )
    signature_cache_size: int = Field(
        default=100, description="Size of signature cache"
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_MIDDLEWARE_"


class LoggingConfig(BaseSettings):
    """Configuration for logging."""

    level: str = Field(default="INFO", description="Logging level")
    format: str = Field(
        default="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        description="Log format",
    )
    enable_debug_logs: bool = Field(
        default=False, description="Enable debug logging"
    )

    @field_validator("level")
    def validate_level(cls, v):
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v.upper()

    class Config:
        env_prefix = "PYROGRAM_PATCH_LOG_"


class PyrogramPatchConfig(BaseSettings):
    """Main configuration class for pyrogram_patch."""

    # Sub-configurations
    circuit_breaker: CircuitBreakerConfig = Field(
        default_factory=CircuitBreakerConfig
    )
    metrics: MetricsConfig = Field(default_factory=MetricsConfig)
    fsm: FSMConfig = Field(default_factory=FSMConfig)
    storage: StorageConfig = Field(default_factory=StorageConfig)
    middleware: MiddlewareConfig = Field(default_factory=MiddlewareConfig)
    logging: LoggingConfig = Field(default_factory=LoggingConfig)

    # General settings
    debug: bool = Field(default=False, description="Enable debug mode")
    max_workers: int = Field(
        default=4, description="Maximum number of worker threads"
    )
    enable_telemetry: bool = Field(
        default=False, description="Enable telemetry collection"
    )

    # Plugin settings
    plugins: List[str] = Field(
        default_factory=list, description="List of enabled plugins"
    )
    plugin_config: Dict[str, Any] = Field(
        default_factory=dict, description="Plugin-specific configuration"
    )

    class Config:
        env_prefix = "PYROGRAM_PATCH_"
        case_sensitive = False

    def get_plugin_config(self, plugin_name: str) -> Dict[str, Any]:
        """Get configuration for a specific plugin."""
        return self.plugin_config.get(plugin_name, {})

    def set_plugin_config(
        self, plugin_name: str, config: Dict[str, Any]
    ) -> None:
        """Set configuration for a specific plugin."""
        self.plugin_config[plugin_name] = config


# Global configuration instance
_config: Optional[PyrogramPatchConfig] = None


def get_config() -> PyrogramPatchConfig:
    """Get the global configuration instance."""
    global _config
    if _config is None:
        _config = PyrogramPatchConfig()
    return _config


def reload_config() -> PyrogramPatchConfig:
    """Reload configuration from environment variables."""
    global _config
    _config = PyrogramPatchConfig()
    return _config


def update_config(updates: Dict[str, Any]) -> PyrogramPatchConfig:
    """Update configuration with new values."""
    global _config
    if _config is None:
        _config = PyrogramPatchConfig()

    # Update nested configurations
    for key, value in updates.items():
        if hasattr(_config, key):
            setattr(_config, key, value)
        elif key in _config.__dict__:
            _config.__dict__[key] = value

    return _config


# Environment variable helpers
def print_env_vars() -> None:
    """Print all available environment variables for configuration."""
    config = PyrogramPatchConfig()
    print("PyrogramPatch Configuration Environment Variables:")
    print("=" * 60)

    def print_config_section(section_name: str, section_config: BaseSettings):
        print(f"\n{section_name.upper()}:")
        for field_name, field in section_config.__fields__.items():
            env_name = (
                f"{section_config.__config__.env_prefix}{field_name.upper()}"
            )
            default = field.default
            description = field.field_info.description or ""
            print(f"  {env_name}={default}  # {description}")

    print_config_section("Circuit Breaker", config.circuit_breaker)
    print_config_section("Metrics", config.metrics)
    print_config_section("FSM", config.fsm)
    print_config_section("Storage", config.storage)
    print_config_section("Middleware", config.middleware)
    print_config_section("Logging", config.logging)

    print("\nGeneral:")
    for field_name, field in PyrogramPatchConfig.__fields__.items():
        if field_name not in [
            "circuit_breaker",
            "metrics",
            "fsm",
            "storage",
            "middleware",
            "logging",
        ]:
            env_name = f"PYROGRAM_PATCH_{field_name.upper()}"
            default = field.default
            description = field.field_info.description or ""
            print(f"  {env_name}={default}  # {description}")


# Configuration validation
def validate_config(config: PyrogramPatchConfig) -> List[str]:
    """Validate configuration and return list of warnings/errors."""
    warnings = []

    # Validate circuit breaker settings
    if config.circuit_breaker.failure_threshold < 1:
        warnings.append("Circuit breaker failure_threshold should be >= 1")

    if config.circuit_breaker.recovery_timeout < 1:
        warnings.append(
            "Circuit breaker recovery_timeout should be >= 1 second"
        )

    # Validate FSM settings
    if config.fsm.max_state_size < 1024:
        warnings.append("FSM max_state_size should be at least 1024 bytes")

    # Validate storage settings
    if config.storage.redis_url and not config.storage.redis_url.startswith(
        ("redis://", "rediss://")
    ):
        warnings.append("Redis URL should start with redis:// or rediss://")

    # Validate middleware settings
    if config.middleware.max_execution_time < 1:
        warnings.append("Middleware max_execution_time should be >= 1 second")

    return warnings
