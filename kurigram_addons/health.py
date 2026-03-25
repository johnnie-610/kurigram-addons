# Copyright (c) 2025-2026 Johnnie
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT
#
# This file is part of the kurigram-addons library

"""Lightweight HTTP health-check server.

Exposes a single ``GET /health`` endpoint that returns pool statistics and
storage health as JSON.  Designed for Kubernetes liveness/readiness probes,
Docker ``HEALTHCHECK``, and similar container orchestration systems.

Usage::

    app = KurigramClient("bot", health_port=8080, ...)
    app.run()
    # GET http://localhost:8080/health

Response body (200 OK)::

    {
      "status": "ok",
      "pool": {
        "active_helpers": 2,
        "uptime": 123.4,
        "total_helpers_created": 50,
        "expired_helpers": 10
      },
      "storage": "healthy"
    }

Returns 503 Service Unavailable when storage is unhealthy.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Optional

logger = logging.getLogger("kurigram.health")


class HealthServer:
    """Minimal asyncio HTTP server for health checks.

    Uses only the standard library — no aiohttp or fastapi dependency.

    Args:
        port: TCP port to listen on (default: 8080).
        host: Bind address (default: ``"0.0.0.0"``).
        client_ref: Weak reference or direct reference to the KurigramClient.
    """

    def __init__(
        self,
        port: int = 8080,
        host: str = "0.0.0.0",
        client_ref: Optional[Any] = None,
    ) -> None:
        self._port = port
        self._host = host
        self._client = client_ref
        self._server: Optional[asyncio.AbstractServer] = None

    async def start(self) -> None:
        """Start the health server."""
        self._server = await asyncio.start_server(
            self._handle,
            host=self._host,
            port=self._port,
        )
        logger.info("Health server listening on %s:%d", self._host, self._port)

    async def stop(self) -> None:
        """Stop the health server."""
        if self._server:
            self._server.close()
            await self._server.wait_closed()
            logger.info("Health server stopped")

    async def _handle(
        self,
        reader: asyncio.StreamReader,
        writer: asyncio.StreamWriter,
    ) -> None:
        try:
            # Read just enough of the request to identify the path
            request_line = await asyncio.wait_for(reader.readline(), timeout=5.0)
            request_str = request_line.decode("utf-8", errors="ignore")

            # Drain the rest of the headers so the connection stays clean
            while True:
                line = await asyncio.wait_for(reader.readline(), timeout=2.0)
                if line in (b"\r\n", b"\n", b""):
                    break

            if "GET /health" in request_str:
                body, status = await self._health_body()
            else:
                body = json.dumps({"error": "not found"})
                status = 404

            response = (
                f"HTTP/1.1 {status} {'OK' if status == 200 else 'Service Unavailable' if status == 503 else 'Not Found'}\r\n"
                f"Content-Type: application/json\r\n"
                f"Content-Length: {len(body.encode())}\r\n"
                f"Connection: close\r\n"
                f"\r\n"
                f"{body}"
            )
            writer.write(response.encode("utf-8"))
            await writer.drain()
        except (asyncio.TimeoutError, ConnectionResetError):
            pass
        except Exception as exc:
            logger.debug("Health server request error: %s", exc)
        finally:
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass

    async def _health_body(self) -> tuple[str, int]:
        """Build the health response JSON and HTTP status code."""
        payload: dict = {"status": "ok"}

        client = self._client
        if client is not None:
            pool = getattr(client, "_pool", None)
            storage = getattr(client, "_storage", None)

            if pool is not None:
                try:
                    stats = await pool.get_statistics()
                    payload["pool"] = {
                        "active_helpers": stats.active_helpers,
                        "uptime": round(stats.uptime, 1),
                        "total_helpers_created": stats.total_helpers_created,
                        "expired_helpers": stats.expired_helpers,
                    }
                except Exception as exc:
                    payload["pool"] = {"error": str(exc)}

            if storage is not None:
                try:
                    healthy = await storage.health()
                    payload["storage"] = "healthy" if healthy else "unhealthy"
                except Exception as exc:
                    payload["storage"] = f"error: {exc}"
                    healthy = False

                if not healthy:
                    payload["status"] = "degraded"
                    return json.dumps(payload), 503
        else:
            payload["status"] = "starting"

        return json.dumps(payload), 200


__all__ = ["HealthServer"]
