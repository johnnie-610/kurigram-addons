# pyrogram_patch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![PyPI](https://img.shields.io/pypi/v/kurigram-addons)](https://pypi.org/project/kurigram-addons/)
[![Downloads](https://static.pepy.tech/badge/kurigram-addons)](https://pepy.tech/project/kurigram-addons)

**pyrogram_patch** is a powerful extension for Pyrogram that enhances it with advanced features for building robust Telegram bots. It provides middleware support, Finite State Machine (FSM) capabilities, and thread-safe data management, making it easier to develop complex bot interactions.

**NOTE: This is a dev version; working seamlessly is not guaranteed. Use at your own risk.**


## 🚀 Quick Start

### Basic Usage

```python
from pyrogram import Client, filters
from pyrogram_patch import patch, Router
from pyrogram_patch.fsm import StatesGroup, State, StateFilter

# Initialize the client and router
app = Client("my_bot")
router = Router()

# Apply the patch
patch_manager = patch(app)

# Define states
class Registration(StatesGroup):
    waiting_for_name = State()
    waiting_for_age = State()

# Command handler with router
@router.on_message(filters.command("start") & filters.private)
async def start(client, message, state):
    await state.set_state(Registration.waiting_for_name)
    await message.reply("Welcome! Please enter your name:")

# State handler with router
@router.on_message(StateFilter(Registration.waiting_for_name) & filters.private)
async def process_name(client, message, state):
    await state.update_data(name=message.text)
    await state.set_state(Registration.waiting_for_age)
    await message.reply(f"Nice to meet you, {message.text}! How old are you?")

# Include router in the application
app.include_router(router)

# Run the bot
if __name__ == "__main__":
    app.run()
```

## 💬 Community

Join our community for support and discussions:

- [GitHub Issues](https://github.com/johnnie-610/kurigram-addons/issues)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

🥳 Have fun with pyrogram_patch! 🎉