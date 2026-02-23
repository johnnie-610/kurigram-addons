# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code


import os as _os
import warnings as _warnings

# Only warn when imported directly by user code, not by kurigram_addons
_caller = _os.environ.get("_KURIGRAM_ADDONS_INTERNAL")
if not _caller:
    _warnings.warn(
        "Importing from 'pyrogram_patch' is deprecated. "
        "Use 'from kurigram_addons import ...' instead. "
        "This shim will be removed in v1.0.0.",
        DeprecationWarning,
        stacklevel=2,
    )

from pyrogram_patch.patch import PatchManager, patch

__all__ = [
    # patch
    "PatchManager",
    "patch",
    # middlewares
    "middleware_types",
]
