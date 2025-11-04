# Instrument Your Bot

Track performance and health signals across PyKeyboard and Pyrogram Patch.

## 1. Enable metrics addons

```python
from pyrogram_patch.addons.metrics import MetricsAddon

config = PyrogramPatchConfig(
    addons=[
        "pyrogram_patch.addons.keyboard.KeyboardAddon",
        "pyrogram_patch.addons.metrics.MetricsAddon"
    ]
)
```

The metrics addon exposes Prometheus-style collectors and integrates with the health router.

## 2. Capture keyboard profiling data

```python
from pykeyboard.visualization import KeyboardProfiler

with KeyboardProfiler.capture("confirm_dialog") as profile:
    keyboard = build_keyboard_somehow()

print(profile.to_markdown())
```

Profiles record duration, memory deltas, and serialization cost for each keyboard build.

## 3. Expose a status command

```python
from pyrogram_patch.health import create_health_router

router = create_health_router()

@dispatcher.include_router(router)
async def _(_: PatchHelper):
    ...
```

The health router reports addon status, pool utilisation, and breaker state directly in chat.

## 4. Export metrics

Pair the Prometheus exporter with your observability stack to monitor trends over time.

```bash
poetry run python -m pyrogram_patch.metrics --export prometheus --port 9100
```

Now you can chart keyboard build latency alongside dispatcher throughput.
