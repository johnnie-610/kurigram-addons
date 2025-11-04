# Pyrogram Patch Overview

Pyrogram Patch extends the native Pyrogram dispatcher with middleware orchestration, finite-state-machine storage, circuit breakers, and resiliency helpers that keep your bot responsive under load.

## Highlights

- **Addon framework** – Discover and load modular addons that contribute middleware, storage backends, and metrics collectors via `AddonManager`.
- **Patch helper lifecycle** – Leverage `PatchHelper` instances that are pooled per user/chat, support TTL-based cleanup, and can persist snapshots across restarts.
- **Circuit breakers** – Protect downstream resources using the built-in breaker utilities and deliver graceful fallback responses to end users when outages occur.
- **Health dashboards** – Ship a status router that visualizes pool utilisation, breaker state, and metrics in chat, so operators can triage issues quickly.

## Why it matters

Bots evolve quickly. Pyrogram Patch lowers the cost of experimentation by:

1. Separating cross-cutting concerns into discoverable addons.
2. Providing structured helper injection so handlers stay lean.
3. Making failure scenarios observable without custom wiring.

Continue with the [integration playbook](integration-playbook.md) to see PyKeyboard and Pyrogram Patch working together.
