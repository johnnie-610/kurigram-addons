# Pyrogram Keyboard Quickstart

Connect PyKeyboard with Pyrogram Patch to serve adaptive keyboards inside your bot.

## Install dependencies

```bash
pip install pyrogram pykeyboard kurigram-addons
```

## Configure Pyrogram Patch

```python
from pyrogram import Client
from pyrogram_patch import PatchedDispatcher, PatchHelper
from pyrogram_patch.config import PyrogramPatchConfig

config = PyrogramPatchConfig(
    addons=["pyrogram_patch.addons.keyboard.KeyboardAddon"],
    addon_config={
        "keyboard": {
            "remember_locales": True,
            "default_locale": "en_US"
        }
    }
)

client = Client("bot")
dispatcher = PatchedDispatcher(client, config=config)
```

The addon bootstraps presets, themes, and locale helpers during initialization.

## Register a handler

```python
@dispatcher.router.on_message()
async def greet_user(client, message, patch_helper: PatchHelper):
    keyboard = patch_helper.keyboards.language_menu(
        locales=["en_US", "es_ES", "tr_TR"],
        remember=True
    )
    await message.reply_text(
        "Choose your language",
        reply_markup=keyboard.as_inline()
    )
```

Handlers gain direct access to keyboard utilities when they opt into patch helper injection.

## Run the bot

```python
if __name__ == "__main__":
    dispatcher.run()
```

Your bot now serves adaptive keyboards backed by resilient session state.
