<img align=center src=./logo.png length=80 width = 400>


> This library is a collection of popular Addons and patches for pyrogram/Kurigram.
> Currently, Pykeyboard and Pyrogram-patch have been added. You're welcome to add more.

# Installation
> PLEASE DON'T USE THE PYPI VERSION OF THIS LIBRARY. IT'S OUTDATED.
## using pip  

```bash
#bash
pip install git+https://github.com/johnnie-610/kurigram-addons.git

```

## using poetry

```bash
# bash
poetry add git+https://github.com/johnnie-610/kurigram-addons.git

```

# Usage

<details>
<summary><b>PyKeyboard</b> (click to expand)</summary>

<div align="center">
<p align="center">
<img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/logo.png" alt="pykeyboard">
</p>

![PyPI](https://img.shields.io/pypi/v/pykeyboard-kurigram)
[![Downloads](https://pepy.tech/badge/pykeyboard-kurigram)](https://pepy.tech/project/pykeyboard-kurigram)
![GitHub](https://img.shields.io/github/license/johnnie-610/pykeyboard)

 <p><h2>🎉This is pykeyboard for <a href="https://github.com/KurimuzonAkuma/pyrogram">Kurigram</a> 🎉</h2></p>
 <br>
 <p><strong><em>No need to change your code, just install the library and you're good to go.</em></strong></p>

</div>

# Pykeyboard

- [Pykeyboard](#pykeyboard)
- [What's new?](#whats-new)
- [Documentation](#documentation)
  - [Inline Keyboard](#inline-keyboard)
        - [Parameters:](#parameters)
    - [Inline Keyboard add buttons](#inline-keyboard-add-buttons)
      - [Code](#code)
      - [Result](#result)
    - [Inline Keyboard row buttons](#inline-keyboard-row-buttons)
      - [Code](#code-1)
      - [Result](#result-1)
    - [Pagination inline keyboard](#pagination-inline-keyboard)
      - [Parameters:](#parameters-1)
      - [Pagination 3 pages](#pagination-3-pages)
      - [Code](#code-2)
      - [Result](#result-2)
      - [Pagination 5 pages](#pagination-5-pages)
      - [Code](#code-3)
      - [Result](#result-3)
      - [Pagination 9 pages](#pagination-9-pages)
      - [Code](#code-4)
      - [Result](#result-4)
      - [Pagination 100 pages](#pagination-100-pages)
      - [Code](#code-5)
      - [Result](#result-5)
      - [Pagination 150 pages and buttons](#pagination-150-pages-and-buttons)
      - [Code](#code-6)
      - [Result](#result-6)
    - [Languages inline keyboard](#languages-inline-keyboard)
      - [Parameters:](#parameters-2)
      - [Code](#code-7)
      - [Result](#result-7)
  - [Reply Keyboard](#reply-keyboard)
      - [Parameters:](#parameters-3)
    - [Reply Keyboard add buttons](#reply-keyboard-add-buttons)
      - [Code](#code-8)
      - [Result](#result-8)
    - [Reply Keyboard row buttons](#reply-keyboard-row-buttons)
      - [Code](#code-9)
      - [Result](#result-9)

# What's new?

- Minor changes due to update in Kurigram.

# Documentation

## Inline Keyboard

```python
from pykeyboard import InlineKeyboard
```

##### Parameters:

- row_width (integer, default 3)

### Inline Keyboard add buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton


keyboard = InlineKeyboard(row_width=3)
keyboard.add(
    InlineButton('1', 'inline_keyboard:1'),
    InlineButton('2', 'inline_keyboard:2'),
    InlineButton('3', 'inline_keyboard:3'),
    InlineButton('4', 'inline_keyboard:4'),
    InlineButton('5', 'inline_keyboard:5'),
    InlineButton('6', 'inline_keyboard:6'),
    InlineButton('7', 'inline_keyboard:7')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/add_inline_button.png" alt="add_inline_button"></p>

### Inline Keyboard row buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton


keyboard = InlineKeyboard()
keyboard.row(InlineButton('1', 'inline_keyboard:1'))
keyboard.row(
    InlineButton('2', 'inline_keyboard:2'),
    InlineButton('3', 'inline_keyboard:3')
)
keyboard.row(InlineButton('4', 'inline_keyboard:4'))
keyboard.row(
    InlineButton('5', 'inline_keyboard:5'),
    InlineButton('6', 'inline_keyboard:6')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/row_inline_button.png" alt="row_inline_button"></p>

### Pagination inline keyboard

```python
from pykeyboard import InlineKeyboard
```

#### Parameters:

- count_pages (integer)
- current_page (integer)
- callback_pattern (string) - use of the `{number}` pattern is <ins>required</ins>

#### Pagination 3 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(3, 3, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_3.png" alt="pagination_keyboard_3"></p>

#### Pagination 5 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(5, 3, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_5.png" alt="pagination_keyboard_5"></p>

#### Pagination 9 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(9, 5, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_9.png" alt="pagination_keyboard_9"></p>

#### Pagination 100 pages

#### Code

```python
from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()
keyboard.paginate(100, 100, 'pagination_keyboard:{number}')
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_100.png" alt="pagination_keyboard_100"></p>

#### Pagination 150 pages and buttons

#### Code

```python
from pykeyboard import InlineKeyboard, InlineButton

keyboard = InlineKeyboard()
keyboard.paginate(150, 123, 'pagination_keyboard:{number}')
keyboard.row(
    InlineButton('Back', 'pagination_keyboard:back'),
    InlineButton('Close', 'pagination_keyboard:close')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/pagination_keyboard_150.png" alt="pagination_keyboard_150"></p>

### Languages inline keyboard

```python
from pykeyboard import InlineKeyboard
```

#### Parameters:

- callback_pattern (string) - use of the `{locale}` pattern is <ins>required</ins>
- locales (string | list) - list of language codes
  - be_BY - Belarusian
  - de_DE - German
  - zh_CN - Chinese
  - en_US - English
  - fr_FR - French
  - id_ID - Indonesian
  - it_IT - Italian
  - ko_KR - Korean
  - tr_TR - Turkish
  - ru_RU - Russian
  - es_ES - Spanish
  - uk_UA - Ukrainian
  - uz_UZ - Uzbek
- row_width (integer, default 2)


#### Code

```python
from pykeyboard import InlineKeyboard


keyboard = InlineKeyboard(row_width=3)
keyboard.languages(
    'languages:{locale}', ['en_US', 'ru_RU', 'id_ID'], 2
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/languages_keyboard.png" alt="languages_keyboard"></p>

## Reply Keyboard

```python
from pykeyboard import ReplyKeyboard
```

#### Parameters:

- resize_keyboard (bool, optional)
- one_time_keyboard (bool, optional)
- selective (bool, optional)
- row_width (integer, default 3)

### Reply Keyboard add buttons

#### Code

```python
from pykeyboard import ReplyKeyboard, ReplyButton


keyboard = ReplyKeyboard(row_width=3)
keyboard.add(
    ReplyButton('Reply button 1'),
    ReplyButton('Reply button 2'),
    ReplyButton('Reply button 3'),
    ReplyButton('Reply button 4'),
    ReplyButton('Reply button 5')
)
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/add_reply_button.png" alt="add_reply_button"></p>

### Reply Keyboard row buttons

#### Code

```python
from pykeyboard import ReplyKeyboard, ReplyButton


keyboard = ReplyKeyboard()
keyboard.row(ReplyButton('Reply button 1'))
keyboard.row(
    ReplyButton('Reply button 2'),
    ReplyButton('Reply button 3')
)
keyboard.row(ReplyButton('Reply button 4'))
keyboard.row(ReplyButton('Reply button 5'))
```

#### Result

<p><img src="https://raw.githubusercontent.com/johnnie-610/pykeyboard/main/docs/source/images/row_reply_button.png" alt="row_reply_button"></p>

</details>


<details>
<summary><b>Pyrogram Patch</b> (click to expand)</summary>

# 🔧 pyrogram_patch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Kurigram](https://img.shields.io/badge/Built%20for-Kurigram-blue)](https://github.com/JohnnieJohnnie/kurigram)

**pyrogram_patch** is a powerful Python library that extends Pyrogram with advanced middleware support and Finite State Machine (FSM) capabilities, making it easier to build complex Telegram bots with better code organization and state management.

## ✨ Features

- 🔀 **Middleware System**: Intercept and process updates before they reach your handlers
- 🤖 **Finite State Machine (FSM)**: Manage conversation flows and user states
- 🧩 **Router Support**: Organize your handlers into modular components
- 💾 **Flexible Storage**: Built-in memory storage with support for custom storage backends
- 🎯 **Type Safety**: Full type hints support for better development experience
- 📦 **Easy Integration**: Simple API that works seamlessly with existing Pyrogram code


## 🚀 Quick Start

Here's a simple example to get you started:

```python
from pyrogram import Client, filters
from pyrogram_patch import patch
from pyrogram_patch.fsm import StatesGroup, State, StateItem
from pyrogram_patch.fsm.storages import MemoryStorage
from pyrogram_patch.fsm.filter import StateFilter

# Create a Pyrogram client
app = Client("my_bot", api_id=123456, api_hash="your_api_hash", bot_token="your_bot_token")

# Patch the client to enable middleware and FSM features
patch_manager = patch(app)

# Set up storage for FSM
storage = MemoryStorage()
patch_manager.set_storage(storage)

# Define your states for a conversation
class UserRegistration(StatesGroup):
    waiting_name = StateItem()
    waiting_age = StateItem()

# Start the registration process
@app.on_message(filters.command("register") & filters.private)
async def start_registration(client, message, state: State):
    await client.send_message(message.chat.id, "Please enter your name:")
    await state.set_state(UserRegistration.waiting_name)

# Handle name input
@app.on_message(filters.private & StateFilter(UserRegistration.waiting_name))
async def process_name(client, message, state: State):
    await state.set_data("name", message.text)
    await client.send_message(message.chat.id, "Please enter your age:")
    await state.set_state(UserRegistration.waiting_age)

# Handle age input
@app.on_message(filters.private & StateFilter(UserRegistration.waiting_age))
async def process_age(client, message, state: State):
    await state.set_data("age", message.text)
    await client.send_message(message.chat.id, "Registration completed!\nName: {}\nAge: {}".format(
        state.get_data("name"),
        state.get_data("age")))
    await state.finish()

# Run the bot
if __name__ == "__main__":
    app.run()
```

## 📚 Documentation

### 🔧 Basic Setup

First, you need to patch your Pyrogram client:

```python
from pyrogram import Client
from pyrogram_patch import patch

# Create a Pyrogram client
app = Client("my_bot", api_id=123456, api_hash="your_api_hash", bot_token="your_bot_token")

# Patch the client to enable middleware and FSM features
patch_manager = patch(app)
```

The `patch_manager` object provides methods to configure middlewares, FSM storage, and routers.

---

## 🔀 Middleware System

Middlewares allow you to intercept and process updates before they reach your handlers. This is useful for logging, authentication, rate limiting, and data preprocessing.

### 📝 Creating Middlewares

#### Basic Middleware
```python
from pyrogram_patch.middlewares.middleware_types import OnUpdateMiddleware
from pyrogram_patch.patch_helper import PatchHelper

class LoggingMiddleware(OnUpdateMiddleware):
    def __init__(self, log_file: str = "bot.log"):
        self.log_file = log_file

    async def __call__(self, update, client, patch_helper: PatchHelper):
        # Log every update
        with open(self.log_file, "a") as f:
            f.write(f"Update received: {type(update).__name__}\n")
        
        # Add timestamp to handler data
        import datetime
        patch_helper.data["timestamp"] = datetime.datetime.now()
```

#### Authentication Middleware

```python
from pyrogram_patch.middlewares.middleware_types import OnUpdateMiddleware
from pyrogram_patch.patch_helper import PatchHelper

class AuthenticationMiddleware(OnUpdateMiddleware):
    def __init__(self, allowed_users: list[int]):
        self.allowed_users = allowed_users

    async def __call__(self, update, client, patch_helper: PatchHelper):
        user_id = None
        
        # Extract user ID from different update types
        if hasattr(update, 'from_user') and update.from_user:
            user_id = update.from_user.id
        elif hasattr(update, 'message') and update.message.from_user:
            user_id = update.message.from_user.id
        
        # Check authorization
        if user_id not in self.allowed_users:
            await patch_helper.skip_handler()  # Skip processing
        
        # Add user info to handler data
        patch_helper.data["is_admin"] = user_id in self.allowed_users

```


### 🎯 Middleware Types

Different middleware types are triggered by specific update types:

| Middleware Type | Triggered By | Use Case |
|---|---|---|
| `OnUpdateMiddleware` | All updates | General purpose, logging |
| `OnMessageMiddleware` | Text messages | Message processing, filtering |
| `OnCallbackQueryMiddleware` | Inline button clicks | Button interactions |
| `OnInlineQueryMiddleware` | Inline queries | Inline bot responses |
| `OnEditedMessageMiddleware` | Message edits | Edit tracking |
| `OnDeletedMessagesMiddleware` | Message deletions | Deletion logging |
| `OnUserStatusMiddleware` | User status changes | Online/offline tracking |
| `OnChatMemberUpdatedMiddleware` | Member changes | Member management |
| `OnChatJoinRequestMiddleware` | Join requests | Request handling |
| `OnChosenInlineResultMiddleware` | Chosen inline results | Result tracking |
| `OnRawUpdateMiddleware` | Raw updates | Low-level processing |
| `OnDisconnectMiddleware` | Disconnections | Cleanup tasks |
| `OnPollMiddleware` | Poll updates | Poll management |

#### Mixed Middleware

For handling multiple update types with one middleware:

```python
from pyrogram_patch.middlewares.middleware_types import MixedMiddleware
from pyrogram.handlers import MessageHandler, EditedMessageHandler
from pyrogram_patch.patch_helper import PatchHelper

class ContentModerationMiddleware(MixedMiddleware):
    def __init__(self, banned_words: list[str]):
        self.banned_words = banned_words
    
        # Specify which handler types this middleware should process
        super().__init__(MessageHandler, EditedMessageHandler)

    async def __call__(self, update, client, patch_helper: PatchHelper):
        text = None
        
        # Extract text from different update types
        if hasattr(update, 'text'):
            text = update.text
        elif hasattr(update, 'caption'):
            text = update.caption
        
        # Check for banned words
        if text and any(
                word in text.lower() for word in self.banned_words
                ):
            patch_helper.data["flagged"] = True
            # Optionally skip the handler
            #await patch_helper.skip_handler()

```

#### Registering Middlewares

```python
from pyrogram_patch.patch import PatchManager
from pyrogram_patch.middlewares import LoggingMiddleware, \
    AuthMiddleware, \
    ContentModerationMiddleware
patch_manager = PatchManager(#your client)
# Regular middleware (processes updates that reach handlers)
patch_manager.include_middleware(
	LoggingMiddleware(
		"app.log",
		),
	)
patch_manager.include_middleware(
	AuthMiddleware(
		[123456789, 987654321],
		),
	)

# Outer middleware (processes ALL updates, even those not handled)
patch_manager.include_outer_middleware(
	ContentModerationMiddleware(
		["spam", "abuse"],
		),
	)

```

#### Using Middleware data in handlers
Data set by middlewares is automatically available in handlers. For example:


```python
# app - your pyrogram client

@app.on_message(
	filters.private,
	)
async def echo_handler(
		client, message, timestamp, is_admin=False, flagged=False,
		):
	response = f"Message received at {timestamp}"

	if is_admin:
		response += " (Admin user)"

	if flagged:
		response += " ⚠️ (Flagged content)"

	await message.reply(
		response,
		)

```

### 📚 FSM (Finite State Machine)

The Finite State Machine (FSM) system allows you to create conversation-like workflows for your bot where the bot remembers the context of each users interaction.

#### Defining States

```python
from pyrogram_patch.fsm import StatesGroup, \
	StateItem


class OrderProcess(
	StatesGroup,
	):
	selecting_product = StateItem()
	entering_quantity = StateItem()
	confirming_order = StateItem()
	entering_address = StateItem()


class SupportTicket(
	StatesGroup,
	):
	waiting_subject = StateItem()
	waiting_description = StateItem()
	waiting_priority = StateItem()

```

#### Storage Configuration

##### Memory Storage (default)

```python
from pyrogram_patch.fsm.storages import MemoryStorage
from pyrogram_patch.patch import patch

patch_manager = patch(
    #app, your client
    )

patch_manager.set_storage(
	MemoryStorage(),
	)
```

##### Custom Storage Implementation (e.g., Redis)
For persistent storage across bot restarts:

```python
from pyrogram_patch.fsm import BaseStorage, \
	State
from pyrogram_patch.patch import patch
import json
import aiofiles

patch_manager = patch(
    #app, your client
    )

class FileStorage(
	BaseStorage,
	):
	def __init__(self, file_path: str = "states.json"):
		self.file_path = file_path
		self.data = {}

	async def load_data(self):
		try:
			async with aiofiles.open(
					self.file_path,
					'r',
					) as f:
				content = await f.read()
				self.data = json.loads(
					content,
					)
		except (FileNotFoundError, json.JSONDecodeError):
			self.data = {}

	async def save_data(self):
		async with aiofiles.open(
				self.file_path,
				'w',
				) as f:
			await f.write(
				json.dumps(
					self.data,
					indent=2,
					),
				)

	async def checkup(self, key: str) -> State:
		await self.load_data()
		state_data = self.data.get(
			key,
			{},
			)
		state = State(
			storage=self,
			key=key,
			)
		if 'state' in state_data:
			state._state = state_data['state']
		return state

	async def set_state(self, state: str, key: str) -> None:
		await self.load_data()
		if key not in self.data:
			self.data[key] = {}
		self.data[key]['state'] = state
		await self.save_data()

	async def set_data(self, data: dict, key: str) -> None:
		await self.load_data()
		if key not in self.data:
			self.data[key] = {}
		self.data[key]['data'] = data
		await self.save_data()

	async def get_data(self, key: str) -> dict:
		await self.load_data()
		return self.data.get(
			key,
			{},
			).get(
			'data',
			{},
			)

	async def finish_state(self, key: str) -> None:
		await self.load_data()
		self.data.pop(
			key,
			None,
			)
		await self.save_data()


# Use the custom storage
patch_manager.set_storage(
	FileStorage(
		"user_states.json",
		),
	)

```

#### Storage Filtering and Handling

##### Basic State Filter

```python
from pyrogram_patch.fsm.filter import StateFilter
from pyrogram_patch.fsm.states import State
from pyrogram import filters

#app - your pyrogram client


# Handle any state
@app.on_message(
	filters.private & StateFilter(),
	)
async def handle_any_state(client, message, state: State):
	await message.reply(
		"You're in a conversation state!",
		)


# Handle specific state
@app.on_message(
	filters.private & StateFilter(
		OrderProcess.selecting_product,
		),
	)
async def handle_product_selection(client, message, state: State):
	# Process product selection
	pass


# Handle multiple states
@app.on_message(
	filters.private & StateFilter(
		[OrderProcess.entering_quantity, OrderProcess.confirming_order],
		),
	)
async def handle_order_details(client, message, state: State):
	current_state = await state.get_state()
	if current_state == OrderProcess.entering_quantity:
		# Handle quantity input
		pass
	elif current_state == OrderProcess.confirming_order:
		# Handle order confirmation
		pass

```

#### State Management

```python
@app.on_message(
	filters.command(
		"order",
		) & filters.private,
	)
async def start_order(client, message, state: State):
	# Set initial state
	await state.set_state(
		OrderProcess.selecting_product,
		)
	await message.reply(
		"What would you like to order?",
		)


@app.on_message(
	filters.private & StateFilter(
		OrderProcess.selecting_product,
		),
	)
async def process_product_selection(client, message, state: State):
	product = message.text

	# Store data
	await state.set_data(
		{"product": product},
		)

	# Move to next state
	await state.set_state(
		OrderProcess.entering_quantity,
		)
	await message.reply(
		f"How many {product} would you like?",
		)


@app.on_message(
	filters.private & StateFilter(
		OrderProcess.entering_quantity,
		),
	)
async def process_quantity(client, message, state: State):
	try:
		quantity = int(
			message.text,
			)

		# Get existing data
		data = await state.get_data()
		data["quantity"] = quantity

		# Update data
		await state.set_data(
			data,
			)

		# Move to confirmation
		await state.set_state(
			OrderProcess.confirming_order,
			)
		await message.reply(
			f"Order Summary:\n"
			f"Product: {data['product']}\n"
			f"Quantity: {quantity}\n\n"
			f"Confirm order? (yes/no)",
		)
	except ValueError:
		await message.reply(
			"Please enter a valid number!",
			)


@app.on_message(
	filters.private & StateFilter(
		OrderProcess.confirming_order,
		),
	)
async def confirm_order(client, message, state: State):
	if message.text.lower() == "yes":
		data = await state.get_data()
		await message.reply(
			f"Order confirmed! {data['quantity']} {data['product']} will be delivered.",
			)
		await state.finish()  # Clear state
	elif message.text.lower() == "no":
		await message.reply(
			"Order cancelled.",
			)
		await state.finish()
	else:
		await message.reply(
			"Please answer 'yes' or 'no'",
			)

```

#### State Utilities

```python
# Check current state
current_state = await state.get_state()
if current_state == OrderProcess.selecting_product:
	# Handle specific state logic
	pass

# Clear all data but keep state
await state.clear_data()

# Reset to specific state
await state.set_state(
	OrderProcess.selecting_product,
	)

# Check if user is in any state
if await state.get_state() != "*":
	await message.reply(
		"You're currently in a conversation.",
		)

```

## 📚 Router System
Routers help organize your handlers into modular components, making it easier to manage your codebase.

### 📝 Creating Routers

```python
from pyrogram_patch.router import Router
from pyrogram import filters

# Admin router
admin_router = Router()

@admin_router.on_message(filters.command("ban") & filters.private)
async def ban_user(client, message):
    # Admin-only functionality
    await message.reply("User banned!")

@admin_router.on_message(filters.command("stats") & filters.private)
async def show_stats(client, message):
    await message.reply("Bot statistics...")

# User router
user_router = Router()

@user_router.on_message(filters.command("help") & filters.private)
async def show_help(client, message):
    await message.reply("Available commands: /help, /profile")

@user_router.on_message(filters.command("profile") & filters.private)
async def show_profile(client, message):
    await message.reply("Your profile information...")

```

###  Registering Routers

```python
# Register routers with the patch manager
patch_manager.include_router(
	admin_router,
	)
patch_manager.include_router(
	user_router,
	)

```

### Routers with Middlewares
Routers work seamlessly with middlewares. You can apply middlewares to specific handlers within a router.

```python
# Middleware data is available in router handlers
@user_router.on_message(
	filters.private,
	)
async def router_handler(client, message, timestamp, is_admin=False):
	response = f"Router handler called at {timestamp}"
	if is_admin:
		response += " (Admin privileges)"
	await message.reply(
		response,
		)

```

# Advanced Features
## Custom Filters with Middlewares
You can define custom filters with middlewares to apply them to specific handlers.

```python
from pyrogram import filters


async def admin_filter(_, __, update) -> bool:
	"""Custom filter that uses middleware data"""
	if hasattr(
			update,
			"text",
			):
		patch_helper = PatchHelper.get_from_pool(
			update,
			)
		if patch_helper:
			return patch_helper.data.get(
				"is_admin",
				False,
				)
	return False


admin_filter = filters.create(
	admin_filter,
	)


@app.on_message(
	admin_filter,
	)
async def admin_only_handler(client, message):
	await message.reply(
		"This is an admin-only command!",
		)
```

## Managing Allowed Update Types
Control which update types are processed by FSM.

```python
import pyrogram.types

# Allow only specific update types for FSM processing
app.dispatcher.manage_allowed_update_types(
	pyrogram.types.Message,
	)
app.dispatcher.manage_allowed_update_types(
	pyrogram.types.CallbackQuery,
	)
```

## Custom Key Generation
Customize how FSM keys are generated by different users/chats:

```python
from pyrogram_patch.patch_helper import PatchHelper


# Generate keys for group chats differently
def custom_key_generator(client_id: int, user_id: int, chat_id: int) -> str:
	if chat_id != user_id:  # Group chat
		return f"group_{client_id}_{chat_id}_{user_id}"
	else:  # Private chat
		return f"private_{client_id}_{user_id}"


# Use in your FSM logic
key = PatchHelper.generate_state_key(
	client.me.id,
	user.id,
	chat.id,
	)
```

# Complete Example
Here's a comprehensive example that demonstrates all features

```python
from pyrogram import Client, \
	filters
from pyrogram_patch import patch
from pyrogram_patch.fsm import StatesGroup, \
	StateItem, \
	State
from pyrogram_patch.fsm.storages import MemoryStorage
from pyrogram_patch.fsm.filter import StateFilter
from pyrogram_patch.middlewares.middleware_types import OnMessageMiddleware
from pyrogram_patch.middlewares import PatchHelper
from pyrogram_patch.router import Router

# Initialize bot
app = Client(
	"pizza_bot",
	api_id=12345,
	api_hash="your_hash",
	bot_token="your_token",
	)
patch_manager = patch(
	app,
	)
patch_manager.set_storage(
	MemoryStorage(),
	)


# Define states
class PizzaOrder(
	StatesGroup,
	):
	selecting_size = StateItem()
	selecting_toppings = StateItem()
	entering_address = StateItem()
	confirming_order = StateItem()


# Logging middleware
class LoggingMiddleware(
	OnMessageMiddleware,
	):
	async def __call__(self, update, client, patch_helper: PatchHelper):
		patch_helper.data["user_name"] = update.from_user.first_name
		print(
			f"Message from {update.from_user.first_name}: {update.text}",
			)


# Order router
order_router = Router()


@order_router.on_message(
	filters.command(
		"order",
		) & filters.private,
	)
async def start_order(client, message, state: State, user_name: str):
	await state.set_state(
		PizzaOrder.selecting_size,
		)
	await message.reply(
		f"Hi {user_name}! \n"
		f"Choose your pizza size:\n"
		f"1. Small ($10)\n"
		f"2. Medium ($15)\n"
		f"3. Large ($20)",
	)


@order_router.on_message(
	filters.private & StateFilter(
		PizzaOrder.selecting_size,
		),
	)
async def process_size(client, message, state: State):
	size_map = {"1": ("Small", 10), "2": ("Medium", 15), "3": ("Large", 20)}

	if message.text in size_map:
		size, price = size_map[message.text]
		await state.set_data(
			{"size": size, "price": price, "toppings": []},
			)
		await state.set_state(
			PizzaOrder.selecting_toppings,
			)
		await message.reply(
			f"Great! You selected {size} pizza (${price})\n\n"
			f"Now choose toppings (type numbers separated by commas):\n"
			f"1. Pepperoni (+$2)\n"
			f"2. Mushrooms (+$1)\n"
			f"3. Extra Cheese (+$1.5)\n"
			f"4. Olives (+$1)\n"
			f"Or type 'none' for no toppings",
		)
	else:
		await message.reply(
			"Please choose 1, 2, or 3!",
			)


@order_router.on_message(
	filters.private & StateFilter(
		PizzaOrder.selecting_toppings,
		),
	)
async def process_toppings(client, message, state: State):
	data = await state.get_data()

	if message.text.lower() == "none":
		toppings = []
		extra_cost = 0
	else:
		topping_map = {
			"1": ("Pepperoni", 2),
			"2": ("Mushrooms", 1),
			"3": ("Extra Cheese", 1.5),
			"4": ("Olives", 1),
		}

		try:
			choices = [choice.strip() for choice in message.text.split(
				",",
				)]
			toppings = []
			extra_cost = 0

			for choice in choices:
				if choice in topping_map:
					name, cost = topping_map[choice]
					toppings.append(
						name,
						)
					extra_cost += cost
				else:
					raise ValueError(
						"Invalid choice",
						)
		except:
			await message.reply(
				"Invalid input! Please enter numbers separated by commas (e.g., '1,3,4')",
				)
			return

	data["toppings"] = toppings
	data["extra_cost"] = extra_cost
	data["total"] = data["price"] + extra_cost
	await state.set_data(
		data,
		)

	await state.set_state(
		PizzaOrder.entering_address,
		)
	await message.reply(
		"Please enter your delivery address:",
		)


@order_router.on_message(
	filters.private & StateFilter(
		PizzaOrder.entering_address,
		),
	)
async def process_address(client, message, state: State):
	data = await state.get_data()
	data["address"] = message.text
	await state.set_data(
		data,
		)

	# Show order summary
	toppings_text = ", ".join(
		data["toppings"],
		) if data["toppings"] else "None"
	summary = (
		f" Order Summary:\n"
		f"Size: {data['size']} (${data['price']})\n"
		f"Toppings: {toppings_text} (+${data['extra_cost']})\n"
		f"Total: ${data['total']}\n"
		f"Address: {data['address']}\n\n"
		f"Confirm order? (yes/no)"
	)

	await state.set_state(
		PizzaOrder.confirming_order,
		)
	await message.reply(
		summary,
		)


@order_router.on_message(
	filters.private & StateFilter(
		PizzaOrder.confirming_order,
		),
	)
async def confirm_order(client, message, state: State, user_name: str):
	if message.text.lower() == "yes":
		data = await state.get_data()
		await message.reply(
			f" Order confirmed, {user_name}!\n"
			f"Your {data['size']} pizza will be delivered to {data['address']} in 30-45 minutes.\n"
			f"Total: ${data['total']}",
		)
		await state.finish()
	elif message.text.lower() == "no":
		await message.reply(
			"Order cancelled. Type /order to start over!",
			)
		await state.finish()
	else:
		await message.reply(
			"Please answer 'yes' or 'no'",
			)


# Register middleware and router
patch_manager.include_middleware(
	LoggingMiddleware(),
	)
patch_manager.include_router(
	order_router,
	)


# Basic commands
@app.on_message(
	filters.command(
		"start",
		) & filters.private,
	)
async def start_command(client, message):
	await message.reply(
		"Welcome to Pizza Bot! \n"
		"Commands:\n"
		"/order - Start ordering pizza\n"
		"/cancel - Cancel current order",
	)


@app.on_message(
	filters.command(
		"cancel",
		) & filters.private,
	)
async def cancel_order(client, message, state: State):
	await state.finish()
	await message.reply(
		"Order cancelled!",
		)


# Run the bot
if __name__ == "__main__":
	app.run()
```

# Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/some-feature`.
3. Make your changes.
4. Commit your changes: `git commit -m "Add some feature"`.
5. Push your branch to GitHub: `git push origin feature/some-feature`.
6. Open a pull request

# Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pyrogram_patch.git
cd pyrogram_patch

# Install dependencies
poetry install

# Run tests
poetry run pytest

# Format code
poetry run black .
poetry run isort .
```

# License

This project is released under the [MIT License](LICENSE).

# Support
 - Create an [issue](https://github.com/johnnie-610/kurigram-addons/issues) for bug reports and feature requests.

Made with ❤️ by Kurigram-Addons Team 🚀

</details>

