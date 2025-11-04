# Learnings

This section captures the hard-earned lessons we gathered while building and maintaining Kurigram Addons.

## Keyboard ergonomics

- **Validate early and often.** Use builder validators to assert keyboard widths, callback formats, and translation coverage during CI instead of discovering mistakes in production.
- **Prefer presets for shared UX.** Codify multi-step flows (e.g., rating dialogs, pagination) as presets so updates roll out consistently across bots.

## Dispatcher resilience

- **Graceful degradation beats downtime.** The circuit breaker fallback messaging keeps users informed while storage backends recover.
- **Pools deserve hygiene.** Track helper TTLs and snapshot states to avoid leaking stale sessions after redeploys.

## Analytics & observability

- **Health dashboards are conversation starters.** Operators can query breaker states directly from chat before escalating to logs.
- **Measure what matters.** Profiling keyboard construction highlights regressions introduced by new presets or localization efforts.

Want to put these insights into practice? Jump to the [tutorials](../tutorials/index.md).
