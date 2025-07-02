"""Finite State Machine (FSM) implementation for Pyrogram.

This module provides a flexible and extensible framework for managing stateful
interactions in Pyrogram bots, supporting various storage backends.
"""

import sys
from typing import TYPE_CHECKING

# Re-export main components
from .base_storage import (
    BaseStorage,
    StateData,
    StorageError,
    StateNotFoundError,
    StateValidationError,
)
from .states import State, StateItem, StatesGroup

# Add version if not in type checking mode
if not TYPE_CHECKING:
    try:
        from importlib.metadata import version, PackageNotFoundError
        
        try:
            __version__ = version("pyrogram-fsm")
        except PackageNotFoundError:
            __version__ = "0.1.0"  # Fallback version
    except ImportError:
        __version__ = "0.1.0"  # Fallback for Python < 3.8

# Define public API
__all__ = [
    # Core components
    "State",
    "StatesGroup",
    "StateItem",
    
    # Storage
    "BaseStorage",
    "StateData",
    
    # Exceptions
    "StorageError",
    "StateNotFoundError",
    "StateValidationError",
]

# Add __all__ to the module's __dict__ for better IDE support
if not TYPE_CHECKING:
    globals().update({k: k for k in __all__})

# Clean up the namespace
del sys, TYPE_CHECKING
