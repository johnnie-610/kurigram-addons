# Copyright (c) 2025 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the pykeyboard-kurigram library
#
# pykeyboard/visualization.py

import json
import logging
from typing import Any, Dict, Iterable, List, Optional, Tuple

from .inline_keyboard import InlineKeyboard
from .keyboard_base import KeyboardBase
from .reply_keyboard import ReplyKeyboard
from .performance import KeyboardProfiler

logger = logging.getLogger("pykeyboard.visualization")


class KeyboardVisualizer:
    """Advanced keyboard visualization and debugging utilities.

    This class provides comprehensive visualization tools for debugging and
    inspecting keyboard layouts, button structures, and keyboard state.
    Useful for development, testing, and troubleshooting keyboard issues.

    Features:
        - ASCII art keyboard visualization
        - JSON structure inspection
        - Button layout analysis
        - Performance metrics
        - Validation reports
    """

    @staticmethod
    def visualize_keyboard(keyboard: InlineKeyboard | ReplyKeyboard) -> str:
        """Create an ASCII art visualization of the keyboard layout.

        Args:
            keyboard: The keyboard to visualize

        Returns:
            str: ASCII art representation of the keyboard

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add("Yes", "No", "Maybe")
            >>> print(KeyboardVisualizer.visualize_keyboard(keyboard))
            ┌─────┬─────┬─────┐
            │ Yes │ No  │Maybe│
            └─────┴─────┴─────┘
        """
        if not keyboard.keyboard:
            return "┌─── Empty Keyboard ───┐\n│   No buttons added   │\n└──────────────────────┘"

        max_widths = []
        for row in keyboard.keyboard:
            for i, button in enumerate(row):
                if i >= len(max_widths):
                    max_widths.append(0)
                text = button.text if hasattr(button, "text") else str(button)
                max_widths[i] = max(max_widths[i], len(text))

        max_widths = [max(w, 3) for w in max_widths]

        lines = []

        top_border = "┌" + "┬".join("─" * (w + 2) for w in max_widths) + "┐"
        lines.append(top_border)

        for row_idx, row in enumerate(keyboard.keyboard):
            row_parts = []
            for i, button in enumerate(row):
                text = button.text if hasattr(button, "text") else str(button)
                width = max_widths[i]
                row_parts.append(f" {text.center(width)} ")

            row_line = "│" + "│".join(row_parts) + "│"
            lines.append(row_line)

            if row_idx < len(keyboard.keyboard) - 1:
                separator = (
                    "├" + "┼".join("─" * (w + 2) for w in max_widths) + "┤"
                )
                lines.append(separator)

        bottom_border = "└" + "┴".join("─" * (w + 2) for w in max_widths) + "┘"
        lines.append(bottom_border)

        return "\n".join(lines)

    @staticmethod
    def analyze_keyboard(
        keyboard: InlineKeyboard | ReplyKeyboard,
    ) -> Dict[str, Any]:
        """Analyze keyboard structure and provide detailed statistics.

        Args:
            keyboard: The keyboard to analyze

        Returns:
            Dict containing analysis results

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add("A", "B", "C", "D")
            >>> analysis = KeyboardVisualizer.analyze_keyboard(keyboard)
            >>> print(f"Total buttons: {analysis['total_buttons']}")
            Total buttons: 4
        """
        analysis = {
            "keyboard_type": type(keyboard).__name__,
            "total_buttons": 0,
            "total_rows": len(keyboard.keyboard),
            "row_lengths": [],
            "button_types": {},
            "max_row_length": 0,
            "min_row_length": float("inf"),
            "average_row_length": 0,
            "empty_rows": 0,
            "button_texts": [],
            "structure_valid": True,
            "issues": [],
        }

        for row_idx, row in enumerate(keyboard.keyboard):
            row_len = len(row)
            analysis["row_lengths"].append(row_len)
            analysis["total_buttons"] += row_len
            analysis["max_row_length"] = max(
                analysis["max_row_length"], row_len
            )
            analysis["min_row_length"] = min(
                analysis["min_row_length"], row_len
            )

            if row_len == 0:
                analysis["empty_rows"] += 1
                analysis["issues"].append(f"Row {row_idx} is empty")

            for button in row:
                btn_type = type(button).__name__
                analysis["button_types"][btn_type] = (
                    analysis["button_types"].get(btn_type, 0) + 1
                )

                if hasattr(button, "text"):
                    analysis["button_texts"].append(button.text)
                else:
                    analysis["button_texts"].append(str(button))

        if analysis["total_buttons"] > 0:
            analysis["average_row_length"] = (
                analysis["total_buttons"] / analysis["total_rows"]
            )

        if analysis["total_buttons"] == 0:
            analysis["issues"].append("Keyboard has no buttons")
            analysis["structure_valid"] = False

        if analysis["empty_rows"] > 0:
            analysis["structure_valid"] = False

        return analysis

    @staticmethod
    def generate_debug_report(
        keyboard: InlineKeyboard | ReplyKeyboard,
        *,
        include_metrics: bool = False,
        profiler: Optional[KeyboardProfiler] = None,
        profile_operations: Optional[Iterable[str]] = None,
    ) -> str:
        """Generate a comprehensive debug report for the keyboard.

        Args:
            keyboard: The keyboard to debug
        Keyword Args:
            include_metrics: When True, append a performance snapshot to the report.
            profiler: Optional profiler instance to reuse when capturing metrics.
            profile_operations: Iterable of operation names to measure. Defaults to
                a standard set when omitted.

        Returns:
            str: Detailed debug report

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.paginate(5, 3, "page_{number}")
            >>> report = KeyboardVisualizer.generate_debug_report(keyboard)
            >>> print(report)
            === Keyboard Debug Report ===
            Type: InlineKeyboard
            Total Buttons: 5
            ...
        """
        analysis = KeyboardVisualizer.analyze_keyboard(keyboard)
        visualization = KeyboardVisualizer.visualize_keyboard(keyboard)

        report_lines = [
            "=" * 50,
            "KEYBOARD DEBUG REPORT",
            "=" * 50,
            f"Keyboard Type: {analysis['keyboard_type']}",
            f"Total Buttons: {analysis['total_buttons']}",
            f"Total Rows: {analysis['total_rows']}",
            f"Row Lengths: {analysis['row_lengths']}",
            f"Max Row Length: {analysis['max_row_length']}",
            f"Min Row Length: {analysis['min_row_length']}",
            f"Average Row Length: {analysis['average_row_length']:.1f}",
            f"Empty Rows: {analysis['empty_rows']}",
            f"Button Types: {analysis['button_types']}",
            f"Structure Valid: {analysis['structure_valid']}",
            "",
            "BUTTON TEXTS:",
        ]

        for i, text in enumerate(analysis["button_texts"][:20]):
            report_lines.append(f"  {i+1:2d}. {text}")
        if len(analysis["button_texts"]) > 20:
            report_lines.append(
                f"  ... and {len(analysis['button_texts']) - 20} more"
            )

        if analysis["issues"]:
            report_lines.extend(
                [
                    "",
                    "ISSUES FOUND:",
                    *[f"  • {issue}" for issue in analysis["issues"]],
                ]
            )

        if include_metrics:
            _, metrics = KeyboardVisualizer.collect_performance_metrics(
                keyboard,
                profiler=profiler,
                operations=profile_operations,
            )

            if metrics:
                report_lines.extend(["", "PERFORMANCE SNAPSHOT:", "-" * 50])
                for operation, stats in metrics:
                    report_lines.append(f"  Operation: {operation}")
                    for key in (
                        "count",
                        "total_time",
                        "mean",
                        "median",
                        "min",
                        "max",
                        "stdev",
                    ):
                        if key in stats:
                            value = stats[key]
                            if isinstance(value, float):
                                report_lines.append(
                                    f"    {key.title().replace('_', ' ')}: {value:.6f}s"
                                )
                            else:
                                report_lines.append(
                                    f"    {key.title().replace('_', ' ')}: {value}"
                                )
                    if "memory_mean" in stats:
                        report_lines.append(
                            f"    Memory Mean: {stats['memory_mean']:.0f} bytes"
                        )
                    if "memory_median" in stats:
                        report_lines.append(
                            f"    Memory Median: {stats['memory_median']:.0f} bytes"
                        )

        report_lines.extend(["", "VISUALIZATION:", visualization, "", "=" * 50])

        return "\n".join(report_lines)

    @staticmethod
    def collect_performance_metrics(
        keyboard: InlineKeyboard | ReplyKeyboard,
        *,
        profiler: Optional[KeyboardProfiler] = None,
        operations: Optional[Iterable[str]] = None,
    ) -> Tuple[KeyboardProfiler, List[Tuple[str, Dict[str, Any]]]]:
        """Run profiling operations and return collected metrics."""

        profiler = profiler or KeyboardProfiler()
        data_cache: Dict[str, Any] = {}

        def ensure_dict() -> Dict[str, Any]:
            if "dict" not in data_cache:
                data_cache["dict"] = keyboard.to_dict()
            return data_cache["dict"]

        def ensure_json() -> str:
            if "json" not in data_cache:
                data_cache["json"] = keyboard.to_json()
            return data_cache["json"]

        operations_map: Dict[str, Any] = {
            "to_dict": ensure_dict,
            "to_json": ensure_json,
            "from_dict": lambda: type(keyboard).from_dict(ensure_dict()),
            "from_json": lambda: type(keyboard).from_json(ensure_json()),
        }

        if hasattr(keyboard, "pyrogram_markup"):
            operations_map["pyrogram_markup"] = lambda: keyboard.pyrogram_markup

        selected_operations = (
            list(operations)
            if operations is not None
            else list(operations_map.keys())
        )

        executed: List[str] = []
        for operation in selected_operations:
            callback = operations_map.get(operation)
            if callback is None:
                continue

            try:
                with profiler.start_operation(operation):
                    callback()
                executed.append(operation)
            except Exception as exc:  # pragma: no cover - defensive logging
                logger.warning(
                    "Failed to profile operation '%s': %s", operation, exc
                )

        metrics: List[Tuple[str, Dict[str, Any]]] = []
        for operation in executed:
            stats = profiler.get_operation_stats(operation)
            if stats:
                metrics.append((operation, stats))

        return profiler, metrics

    @staticmethod
    def compare_keyboards(
        keyboard1: InlineKeyboard | ReplyKeyboard,
        keyboard2: InlineKeyboard | ReplyKeyboard,
    ) -> Dict[str, Any]:
        """Compare two keyboards and highlight differences.

        Args:
            keyboard1: First keyboard to compare
            keyboard2: Second keyboard to compare

        Returns:
            Dict containing comparison results

        Example:
            >>> kb1 = InlineKeyboard()
            >>> kb1.add("A", "B")
            >>> kb2 = InlineKeyboard()
            >>> kb2.add("A", "C")
            >>> diff = KeyboardVisualizer.compare_keyboards(kb1, kb2)
            >>> print(f"Differences: {diff['differences']}")
        """
        analysis1 = KeyboardVisualizer.analyze_keyboard(keyboard1)
        analysis2 = KeyboardVisualizer.analyze_keyboard(keyboard2)

        comparison = {
            "keyboard1_type": analysis1["keyboard_type"],
            "keyboard2_type": analysis2["keyboard_type"],
            "differences": [],
            "similarities": [],
            "structure_match": True,
        }

        metrics_to_compare = [
            "total_buttons",
            "total_rows",
            "max_row_length",
            "min_row_length",
            "empty_rows",
        ]

        for metric in metrics_to_compare:
            if analysis1[metric] != analysis2[metric]:
                comparison["differences"].append(
                    f"{metric}: {analysis1[metric]} vs {analysis2[metric]}"
                )
            else:
                comparison["similarities"].append(
                    f"{metric}: {analysis1[metric]}"
                )

        if analysis1["row_lengths"] != analysis2["row_lengths"]:
            comparison["differences"].append(
                f"row_lengths: {analysis1['row_lengths']} vs {analysis2['row_lengths']}"
            )
            comparison["structure_match"] = False
        else:
            comparison["similarities"].append("row_lengths: identical")

        if analysis1["button_texts"] != analysis2["button_texts"]:
            comparison["differences"].append("button_texts: different")
            comparison["structure_match"] = False
        else:
            comparison["similarities"].append("button_texts: identical")

        return comparison

    @staticmethod
    def export_keyboard_data(
        keyboard: InlineKeyboard | ReplyKeyboard, format: str = "json"
    ) -> str:
        """Export keyboard data in various formats for debugging.

        Args:
            keyboard: The keyboard to export
            format: Export format ("json", "yaml", "text")

        Returns:
            str: Exported keyboard data

        Example:
            >>> keyboard = InlineKeyboard()
            >>> keyboard.add("Test", "Button")
            >>> json_data = KeyboardVisualizer.export_keyboard_data(keyboard, "json")
            >>> print(json_data)
            {"keyboard": [["Test", "Button"]], ...}
        """
        if format.lower() == "json":
            return keyboard.to_json()
        elif format.lower() == "text":
            return KeyboardVisualizer.generate_debug_report(keyboard)
        elif format.lower() == "yaml":
            try:
                import yaml

                data = keyboard.to_dict()
                return yaml.dump(
                    data, default_flow_style=False, allow_unicode=True
                )
            except ImportError:
                return "YAML export requires PyYAML: pip install PyYAML"
        else:
            return (
                f"Unsupported format: {format}. Use 'json', 'yaml', or 'text'."
            )


def visualize(
    keyboard: InlineKeyboard | ReplyKeyboard,
    *,
    include_metrics: bool = False,
    profiler: Optional[KeyboardProfiler] = None,
    profile_operations: Optional[Iterable[str]] = None,
) -> str:
    """Quick visualization of a keyboard."""

    if include_metrics:
        return KeyboardVisualizer.generate_debug_report(
            keyboard,
            include_metrics=True,
            profiler=profiler,
            profile_operations=profile_operations,
        )

    return KeyboardVisualizer.visualize_keyboard(keyboard)


def debug(
    keyboard: InlineKeyboard | ReplyKeyboard,
    *,
    include_metrics: bool = False,
    profiler: Optional[KeyboardProfiler] = None,
    profile_operations: Optional[Iterable[str]] = None,
) -> str:
    """Quick debug report for a keyboard."""

    return KeyboardVisualizer.generate_debug_report(
        keyboard,
        include_metrics=include_metrics,
        profiler=profiler,
        profile_operations=profile_operations,
    )


def analyze(keyboard: InlineKeyboard | ReplyKeyboard) -> Dict[str, Any]:
    """Quick analysis of a keyboard."""
    return KeyboardVisualizer.analyze_keyboard(keyboard)
