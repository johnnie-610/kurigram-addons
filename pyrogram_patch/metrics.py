# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Metrics and monitoring system for pyrogram_patch.
#
# This module provides Prometheus-compatible metrics collection
# for middleware execution, FSM operations, and storage performance.


import asyncio
import logging
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

logger = logging.getLogger("pyrogram_patch.metrics")


@dataclass
class MetricSample:
    """A single metric measurement."""

    name: str
    value: float
    timestamp: float
    labels: Dict[str, str]


class MetricsCollector:
    """
    Collects and aggregates metrics for pyrogram_patch operations.

    Provides counters, histograms, and gauges for monitoring:
    - Middleware execution times and counts
    - FSM state transitions
    - Storage operation performance
    - Error rates and types
    """

    def __init__(self, max_samples: int = 1000):
        self.max_samples = max_samples
        self.samples: deque[MetricSample] = deque(maxlen=max_samples)

        # Aggregated metrics
        self.counters: Dict[str, Dict[str, int]] = defaultdict(
            lambda: defaultdict(int)
        )
        self.histograms: Dict[str, List[float]] = defaultdict(list)
        self.gauges: Dict[str, float] = {}

        self._lock = asyncio.Lock()

    async def record_counter(
        self,
        name: str,
        value: float = 1.0,
        labels: Optional[Dict[str, str]] = None,
    ) -> None:
        """Record a counter metric."""
        labels = labels or {}
        label_key = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))

        async with self._lock:
            self.counters[name][label_key] += int(value)

            sample = MetricSample(
                name=f"{name}_total",
                value=self.counters[name][label_key],
                timestamp=time.time(),
                labels=labels,
            )
            self.samples.append(sample)

    async def record_histogram(
        self, name: str, value: float, labels: Optional[Dict[str, str]] = None
    ) -> None:
        """Record a histogram metric."""
        labels = labels or {}

        async with self._lock:
            self.histograms[name].append(value)

            sample = MetricSample(
                name=name, value=value, timestamp=time.time(), labels=labels
            )
            self.samples.append(sample)

    async def record_gauge(
        self, name: str, value: float, labels: Optional[Dict[str, str]] = None
    ) -> None:
        """Record a gauge metric."""
        labels = labels or {}

        async with self._lock:
            self.gauges[name] = value

            sample = MetricSample(
                name=name, value=value, timestamp=time.time(), labels=labels
            )
            self.samples.append(sample)

    async def record_timer(
        self,
        name: str,
        duration: float,
        labels: Optional[Dict[str, str]] = None,
    ) -> None:
        """Record a timer metric (duration in seconds)."""
        await self.record_histogram(name, duration, labels)

    def get_counter_value(
        self, name: str, labels: Optional[Dict[str, str]] = None
    ) -> int:
        """Get current counter value."""
        labels = labels or {}
        label_key = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
        return self.counters[name][label_key]

    def get_histogram_stats(self, name: str) -> Dict[str, float]:
        """Get histogram statistics."""
        values = self.histograms[name]
        if not values:
            return {"count": 0, "sum": 0.0, "avg": 0.0, "min": 0.0, "max": 0.0}

        return {
            "count": len(values),
            "sum": sum(values),
            "avg": sum(values) / len(values),
            "min": min(values),
            "max": max(values),
        }

    def get_gauge_value(self, name: str) -> float:
        """Get current gauge value."""
        return self.gauges.get(name, 0.0)

    def get_recent_samples(self, limit: int = 100) -> List[MetricSample]:
        """Get recent metric samples."""
        return list(self.samples)[-limit:]

    def get_counter_totals(self) -> Dict[str, int]:
        """Return aggregated counter totals across all labels."""

        return {
            name: sum(label_values.values())
            for name, label_values in self.counters.items()
        }

    def get_histogram_counts(self) -> Dict[str, int]:
        """Return observation counts for each histogram."""

        return {name: len(values) for name, values in self.histograms.items()}

    def get_prometheus_format(self) -> str:
        """Export metrics in Prometheus format."""
        lines = []

        # Counters
        for name, label_counters in self.counters.items():
            for label_key, value in label_counters.items():
                if label_key:
                    lines.append(f"# HELP {name}_total Counter for {name}")
                    lines.append(f"# TYPE {name}_total counter")
                    lines.append(f"{name}_total{{{label_key}}} {value}")
                else:
                    lines.append(f"# HELP {name}_total Counter for {name}")
                    lines.append(f"# TYPE {name}_total counter")
                    lines.append(f"{name}_total {value}")

        # Histograms
        for name, values in self.histograms.items():
            if values:
                stats = self.get_histogram_stats(name)
                lines.append(f"# HELP {name} Histogram for {name}")
                lines.append(f"# TYPE {name} histogram")
                lines.append(f"{name}_count {stats['count']}")
                lines.append(f"{name}_sum {stats['sum']}")
                lines.append(f"{name}_bucket{{le=\"+Inf\"}} {stats['count']}")

        # Gauges
        for name, value in self.gauges.items():
            lines.append(f"# HELP {name} Gauge for {name}")
            lines.append(f"# TYPE {name} gauge")
            lines.append(f"{name} {value}")

        return "\n".join(lines)

    def clear(self) -> None:
        """Clear all metrics."""
        self.samples.clear()
        self.counters.clear()
        self.histograms.clear()
        self.gauges.clear()


# Global metrics collector
_global_metrics = MetricsCollector()


def get_global_metrics() -> MetricsCollector:
    """Get the global metrics collector."""
    return _global_metrics


# Convenience functions for common metrics
async def record_middleware_execution(
    middleware_name: str, execution_time: float, success: bool = True
) -> None:
    """Record middleware execution metrics."""
    labels = {
        "middleware": middleware_name,
        "status": "success" if success else "error",
    }
    await _global_metrics.record_counter(
        "middleware_executions_total", labels=labels
    )
    await _global_metrics.record_histogram(
        "middleware_execution_duration_seconds", execution_time, labels=labels
    )


async def record_fsm_transition(
    from_state: str, to_state: str, success: bool = True
) -> None:
    """Record FSM transition metrics."""
    labels = {
        "from_state": from_state,
        "to_state": to_state,
        "status": "success" if success else "error",
    }
    await _global_metrics.record_counter("fsm_transitions_total", labels=labels)


async def record_storage_operation(
    operation: str,
    storage_type: str,
    execution_time: float,
    success: bool = True,
) -> None:
    """Record storage operation metrics."""
    labels = {
        "operation": operation,
        "storage": storage_type,
        "status": "success" if success else "error",
    }
    await _global_metrics.record_counter(
        "storage_operations_total", labels=labels
    )
    await _global_metrics.record_histogram(
        "storage_operation_duration_seconds", execution_time, labels=labels
    )


async def record_error(
    error_type: str, component: str, error_message: str = ""
) -> None:
    """Record error metrics."""
    labels = {"error_type": error_type, "component": component}
    await _global_metrics.record_counter("errors_total", labels=labels)


# Timer context manager for easy timing
class Timer:
    """Context manager for timing operations."""

    def __init__(self, name: str, labels: Optional[Dict[str, str]] = None):
        self.name = name
        self.labels = labels or {}
        self.start_time: Optional[float] = None

    async def __aenter__(self):
        self.start_time = time.time()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.start_time is not None:
            duration = time.time() - self.start_time
            success = exc_type is None
            await _global_metrics.record_timer(
                self.name, duration, {**self.labels, "success": str(success)}
            )


# Middleware timing decorator
def timed_middleware(func):
    """Decorator to time middleware execution."""

    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            await record_middleware_execution(
                func.__name__, duration, success=True
            )
            return result
        except Exception as e:
            duration = time.time() - start_time
            await record_middleware_execution(
                func.__name__, duration, success=False
            )
            raise

    return wrapper
