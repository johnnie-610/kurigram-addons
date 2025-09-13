# SPDX-License-Identifier: MIT

# This file is part of the kurigram-addons library
#
# Copyright (c) 2025 Johnnie
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code
#
# Patched decorators module for Pyrogram.
#
# This module provides a collection of decorator classes that can be used to handle
# various Telegram events in a more Pythonic way. These decorators are designed to
# work with the Pyrogram framework and provide a clean interface for registering
# event handlers.


from pyrogram_patch.router.patched_decorators.decorators import \
    PatchedDecorators

__all__ = ["PatchedDecorators"]
