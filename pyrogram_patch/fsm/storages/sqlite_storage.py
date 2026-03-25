# SPDX-License-Identifier: MIT
#
# This file is part of the kurigram-addons library
#
# Copyright (c) 2025-2026 Johnnie

"""SQLite-backed FSM storage.

Provides persistent FSM state storage using a local SQLite database via
``aiosqlite``.  No external services required — ideal for single-server bots
that need state to survive restarts without the operational overhead of Redis.

Example::

    from pyrogram_patch.fsm.storages.sqlite_storage import SQLiteStorage
    from kurigram_addons import KurigramClient

    app = KurigramClient(
        "my_bot",
        api_id=...,
        api_hash="...",
        storage=SQLiteStorage("fsm.db"),
    )
    app.run()
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, Dict, List, Optional

try:
    import aiosqlite
except ImportError as _exc:  # pragma: no cover
    raise ImportError(
        "SQLiteStorage requires 'aiosqlite'.  "
        "Install it with: pip install aiosqlite"
    ) from _exc

from pyrogram_patch import errors
from pyrogram_patch.fsm.base_storage import BaseStorage

logger = logging.getLogger("pyrogram_patch.fsm.sqlite_storage")

_DDL = """
CREATE TABLE IF NOT EXISTS fsm_state (
    identifier  TEXT    PRIMARY KEY,
    state_json  TEXT    NOT NULL,
    expires_at  REAL            -- Unix timestamp; NULL = no expiry
);

CREATE TABLE IF NOT EXISTS fsm_counter (
    identifier  TEXT    PRIMARY KEY,
    value       INTEGER NOT NULL DEFAULT 0,
    expires_at  REAL
);
"""


class SQLiteStorage(BaseStorage):
    """SQLite-backed FSM storage.

    Thread-safe and process-safe for a single writer process.  For
    multi-process deployments use :class:`RedisStorage` instead.

    Args:
        path: Path to the SQLite database file.  Use ``":memory:"`` for an
              in-memory database (useful in tests — not persistent).
        cleanup_interval: Seconds between automatic expired-row cleanup runs
                          (default: 300 seconds / 5 minutes).
    """

    def __init__(
        self,
        path: str = "fsm.db",
        *,
        cleanup_interval: float = 300.0,
    ) -> None:
        self._path = path
        self._cleanup_interval = cleanup_interval
        self._db: Optional[aiosqlite.Connection] = None
        self._lock = asyncio.Lock()
        self._cleanup_task: Optional[asyncio.Task] = None

    # ── lifecycle ────────────────────────────────────────────────────────────

    async def start(self) -> None:
        """Open the database connection and run schema migrations."""
        self._db = await aiosqlite.connect(self._path)
        self._db.row_factory = aiosqlite.Row
        # WAL mode: readers do not block writers; better concurrency.
        await self._db.execute("PRAGMA journal_mode=WAL")
        await self._db.executescript(_DDL)
        await self._db.commit()
        logger.info("SQLiteStorage opened at '%s'", self._path)

        if self._cleanup_task is None or self._cleanup_task.done():
            self._cleanup_task = asyncio.create_task(self._periodic_cleanup())

    async def stop(self) -> None:
        """Cancel the cleanup task and close the database connection."""
        if self._cleanup_task and not self._cleanup_task.done():
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        if self._db:
            await self._db.close()
            self._db = None
            logger.info("SQLiteStorage closed")

    async def health(self) -> bool:
        """Return True if the database is accessible."""
        try:
            if self._db is None:
                return False
            await self._db.execute("SELECT 1")
            return True
        except Exception:
            return False

    # ── helpers ──────────────────────────────────────────────────────────────

    def _require_db(self) -> aiosqlite.Connection:
        if self._db is None:
            raise errors.FSMContextError(
                "SQLiteStorage is not started.  "
                "Call await storage.start() (done automatically by KurigramClient)."
            )
        return self._db

    @staticmethod
    def _exp(ttl: Optional[int]) -> Optional[float]:
        if ttl and ttl > 0:
            return time.time() + ttl
        return None

    # ── core API ─────────────────────────────────────────────────────────────

    async def set_state(
        self,
        identifier: str,
        state: Dict[str, Any],
        *,
        ttl: Optional[int] = None,
    ) -> None:
        db = self._require_db()
        payload = json.dumps(state)
        exp = self._exp(ttl)
        async with self._lock:
            await db.execute(
                """
                INSERT INTO fsm_state (identifier, state_json, expires_at)
                VALUES (?, ?, ?)
                ON CONFLICT(identifier) DO UPDATE SET
                    state_json = excluded.state_json,
                    expires_at = excluded.expires_at
                """,
                (identifier, payload, exp),
            )
            await db.commit()

    async def get_state(self, identifier: str) -> Optional[Dict[str, Any]]:
        db = self._require_db()
        now = time.time()
        async with self._lock:
            async with db.execute(
                "SELECT state_json, expires_at FROM fsm_state WHERE identifier = ?",
                (identifier,),
            ) as cur:
                row = await cur.fetchone()

            if row is None:
                return None

            exp = row["expires_at"]
            if exp is not None and exp <= now:
                await db.execute(
                    "DELETE FROM fsm_state WHERE identifier = ?", (identifier,)
                )
                await db.commit()
                return None

            try:
                return json.loads(row["state_json"])
            except json.JSONDecodeError as e:
                raise errors.FSMContextError(
                    f"Corrupt FSM state for '{identifier}'",
                    cause=e,
                ) from e

    async def delete_state(self, identifier: str) -> bool:
        db = self._require_db()
        async with self._lock:
            cur = await db.execute(
                "DELETE FROM fsm_state WHERE identifier = ?", (identifier,)
            )
            await db.commit()
            return cur.rowcount > 0

    async def compare_and_set(
        self,
        identifier: str,
        new_state: Dict[str, Any],
        *,
        expected_state: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        """Atomic CAS using SQLite's ``BEGIN IMMEDIATE`` transaction.

        ``BEGIN IMMEDIATE`` acquires a reserved lock that prevents other
        writers from interleaving between the read and write, giving us
        true atomicity without needing Lua scripts.
        """
        db = self._require_db()
        now = time.time()
        exp = self._exp(ttl)
        new_payload = json.dumps(new_state)

        async with self._lock:
            await db.execute("BEGIN IMMEDIATE")
            try:
                async with db.execute(
                    "SELECT state_json, expires_at FROM fsm_state WHERE identifier = ?",
                    (identifier,),
                ) as cur:
                    row = await cur.fetchone()

                # Treat expired rows as absent
                current_is_absent = (
                    row is None
                    or (row["expires_at"] is not None and row["expires_at"] <= now)
                )

                if expected_state is None:
                    if not current_is_absent:
                        await db.execute("ROLLBACK")
                        return False
                else:
                    if current_is_absent:
                        await db.execute("ROLLBACK")
                        return False
                    try:
                        current = json.loads(row["state_json"])
                    except json.JSONDecodeError:
                        await db.execute("ROLLBACK")
                        return False
                    if current != expected_state:
                        await db.execute("ROLLBACK")
                        return False

                await db.execute(
                    """
                    INSERT INTO fsm_state (identifier, state_json, expires_at)
                    VALUES (?, ?, ?)
                    ON CONFLICT(identifier) DO UPDATE SET
                        state_json = excluded.state_json,
                        expires_at = excluded.expires_at
                    """,
                    (identifier, new_payload, exp),
                )
                await db.execute("COMMIT")
                return True

            except Exception:
                await db.execute("ROLLBACK")
                raise

    async def list_keys(self, pattern: str = "*") -> List[str]:
        db = self._require_db()
        now = time.time()
        # Translate glob pattern to SQL LIKE pattern
        like = pattern.replace("%", r"\%").replace("_", r"\_").replace("*", "%").replace("?", "_")
        async with self._lock:
            async with db.execute(
                """
                SELECT identifier FROM fsm_state
                WHERE identifier LIKE ? ESCAPE '\\'
                  AND (expires_at IS NULL OR expires_at > ?)
                """,
                (like, now),
            ) as cur:
                rows = await cur.fetchall()
        return [row["identifier"] for row in rows]

    async def clear_namespace(self) -> int:
        db = self._require_db()
        async with self._lock:
            cur = await db.execute("DELETE FROM fsm_state")
            await db.commit()
            return cur.rowcount

    async def increment(
        self,
        identifier: str,
        amount: int = 1,
        *,
        ttl: Optional[int] = None,
    ) -> int:
        """Atomic counter increment using SQLite's UPSERT."""
        db = self._require_db()
        exp = self._exp(ttl)
        async with self._lock:
            await db.execute(
                """
                INSERT INTO fsm_counter (identifier, value, expires_at)
                VALUES (?, ?, ?)
                ON CONFLICT(identifier) DO UPDATE SET
                    value = value + excluded.value,
                    expires_at = COALESCE(excluded.expires_at, fsm_counter.expires_at)
                """,
                (identifier, amount, exp),
            )
            await db.commit()
            async with db.execute(
                "SELECT value FROM fsm_counter WHERE identifier = ?",
                (identifier,),
            ) as cur:
                row = await cur.fetchone()
        return row["value"] if row else amount

    # ── background cleanup ───────────────────────────────────────────────────

    async def _periodic_cleanup(self) -> None:
        """Periodically delete expired rows from both tables."""
        try:
            while True:
                await asyncio.sleep(self._cleanup_interval)
                await self._prune_expired()
        except asyncio.CancelledError:
            return

    async def _prune_expired(self) -> None:
        if self._db is None:
            return
        now = time.time()
        async with self._lock:
            cur_state = await self._db.execute(
                "DELETE FROM fsm_state WHERE expires_at IS NOT NULL AND expires_at <= ?",
                (now,),
            )
            cur_counter = await self._db.execute(
                "DELETE FROM fsm_counter WHERE expires_at IS NOT NULL AND expires_at <= ?",
                (now,),
            )
            await self._db.commit()
        total = cur_state.rowcount + cur_counter.rowcount
        if total:
            logger.debug("SQLiteStorage pruned %d expired rows", total)
