"""
pyrogram-patch Framework Example: State-based Telegram Bot

This example demonstrates how to build a Telegram bot using the pyrogram-patch framework,
which extends the standard Pyrogram library with advanced features like:
- Finite State Machines (FSM) for managing conversation flows
- Middleware system for request/response processing
- Router system for organizing handlers
- Data persistence and state management

The bot implements a simple user registration flow that collects weight and height
information using a state-based approach.

Key Concepts Demonstrated:
1. State Groups and State Items for managing conversation states
2. Middleware for preprocessing and filtering messages
3. Custom filters for advanced message handling
4. Router-based handler organization
5. State transitions and data persistence

Prerequisites:
- pyrogram library installed
- pyrogram-patch library installed
- Valid Telegram API credentials (API_ID, API_HASH, BOT_TOKEN)
"""

from pyrogram import Client, filters
from pyrogram.handlers import EditedMessageHandler, MessageHandler
from pyrogram.types import Message

from pyrogram_patch import patch
from pyrogram_patch.fsm import State, StateItem, StatesGroup
from pyrogram_patch.fsm.filter import StateFilter
from pyrogram_patch.fsm.storages import MemoryStorage
from pyrogram_patch.middlewares import PatchHelper
from pyrogram_patch.middlewares.middleware_types import (MixedMiddleware,
                                                        OnMessageMiddleware)
from pyrogram_patch.router import Router

# ===== CONFIGURATION =====
# Replace these with your actual Telegram API credentials
# Get them from https://my.telegram.org/apps
SESSION_NAME = "bot"  # Session file name for the bot
API_ID = 8  # Your API ID from my.telegram.org
API_HASH = "7245de8e747a0d6fbe11f7cc14fcc0bb"  # Your API Hash from my.telegram.org
BOT_TOKEN = ""  # Your bot token from @BotFather

# ===== FINITE STATE MACHINE (FSM) SETUP =====
"""
States are used to track where users are in a conversation flow.
Think of it like a flowchart where each state represents a step in the process.
"""


class Parameters(StatesGroup):
    """
    Defines the states for our user registration process.
    
    StatesGroup is a container that holds related states together. In this case,
    we're collecting user parameters (weight and height) so we group them logically.
    
    Each StateItem represents a specific point in the conversation where we're
    waiting for particular user input.
    
    Usage in your own bot:
    - Create a StatesGroup class for each logical flow (registration, settings, etc.)
    - Add StateItem() for each step where you need user input
    - Use descriptive names that make the flow clear
    
    Example flow:
    User types "register" → Bot asks for weight → User enters weight (weight state)
    → Bot asks for height → User enters height (height state) → Registration complete
    """
    weight = StateItem()  # State: waiting for user's weight input
    height = StateItem()  # State: waiting for user's height input


# ===== MIDDLEWARE SYSTEM =====
"""
Middlewares are functions that process messages before they reach your handlers.
They run in order and can:
- Modify message data
- Skip handlers based on conditions
- Add preprocessing logic
- Implement authentication, logging, etc.

There are two types:
1. OnMessageMiddleware - runs only for message events
2. MixedMiddleware - runs for multiple event types
"""


class SkipDigitMiddleware(OnMessageMiddleware):
    """
    Middleware that skips message processing if the message is not a digit
    when the user is in the 'height' state.
    
    Purpose: Validates that users enter numeric values for height.
    If they enter non-numeric text while in height state, the handler is skipped.
    
    How to use in your bot:
    - Create similar middlewares for input validation
    - Use skip_handler() to prevent processing invalid inputs
    - Access state information via patch_helper.state.state
    - Access shared data via patch_helper.data
    """
    
    def __init__(self) -> None:
        """Initialize the middleware. No special setup needed for this example."""
        pass

    async def __call__(self, message: Message, client: Client, patch_helper: PatchHelper):
        """
        Main middleware logic executed for each message.
        
        Args:
            message: The incoming Telegram message
            client: The Pyrogram client instance
            patch_helper: Helper object containing state and shared data
            
        Process:
        1. Check if the message text contains only digits (set by CheckDigitMiddleware)
        2. If not digits AND user is in height state, skip the handler
        3. This ensures only numeric height values are processed
        """
        # Get the digit check result from shared data (set by CheckDigitMiddleware)
        is_digit = patch_helper.data["is_digit"]
        
        # If message is not a digit and user is waiting to enter height
        if not is_digit:
            if patch_helper.state.state == Parameters.height:
                # Skip the handler - this message won't be processed
                return await patch_helper.skip_handler()


class CheckDigitMiddleware(MixedMiddleware):
    """
    Middleware that checks if a message contains only numeric characters.
    
    This middleware runs early in the processing pipeline and adds the result
    to shared data that other middlewares and handlers can use.
    
    MixedMiddleware means it can handle multiple types of updates (messages, 
    callback queries, etc.), though this example only processes messages.
    
    Real-world applications:
    - Input validation (numbers, emails, URLs)
    - User authentication checks
    - Rate limiting
    - Logging and analytics
    """
    
    def __init__(self, handlers: tuple, some_var: bool) -> None:
        """
        Initialize the middleware with configuration.
        
        Args:
            handlers: Tuple of handler types this middleware applies to
            some_var: Example configuration variable (can be any data you need)
        """
        self.some_var = some_var  # Store configuration for use in middleware logic
        super().__init__(handlers)  # Initialize parent MixedMiddleware

    async def __call__(self, message: Message, client: Client, patch_helper: PatchHelper):
        """
        Check if the message text contains only digits.
        
        Args:
            message: The incoming Telegram message
            client: The Pyrogram client instance
            patch_helper: Helper object for accessing state and shared data
            
        Process:
        1. Check if message has text attribute
        2. Use Python's isdigit() method to check if text is numeric
        3. Store result in shared data for other components to use
        """
        if hasattr(message, "text"):
            # Store the digit check result in shared data
            # Other middlewares and handlers can access this via patch_helper.data["is_digit"]
            patch_helper.data["is_digit"] = message.text.isdigit()


# ===== APPLICATION SETUP =====
"""
Main application configuration and initialization.
This section sets up the bot client, routers, and middleware pipeline.
"""

# Create the main Pyrogram client (replace ... with actual client parameters)
app = Client(...)

# Create routers for organizing handlers
# Routers help separate different bot features into logical groups
router = Router()   # Primary router for main registration flow
router2 = Router()  # Secondary router for weight handling

# Apply the pyrogram-patch framework to the client
# This replaces the default dispatcher with an enhanced one that supports
# middleware, FSM, and other advanced features
patch_manager = patch(app)

# Configure storage for persistent state data
# MemoryStorage keeps states in RAM (lost on restart)
# For production, consider Redis or database storage
patch_manager.set_storage(MemoryStorage())

# Add outer middleware (runs first in the pipeline)
# CheckDigitMiddleware processes MessageHandler events with configuration
patch_manager.include_outer_middleware(
    CheckDigitMiddleware((MessageHandler, ), False)
)

# Add regular middleware (runs after outer middleware)
# SkipDigitMiddleware validates numeric input for height state
patch_manager.include_middleware(SkipDigitMiddleware())

# Register routers with the patch manager
# This enables the routers to use FSM and middleware features
patch_manager.include_router(router)
patch_manager.include_router(router2)


# ===== CUSTOM FILTERS =====
"""
Custom filters allow you to create complex message filtering logic
beyond what's available in pyrogram's built-in filters.
"""


async def my_filter_function(_, __, update) -> bool:
    """
    Custom filter that processes messages and adds additional data.
    
    Args:
        _: Unused parameter (pyrogram filter convention)
        __: Unused parameter (pyrogram filter convention) 
        update: The message or update object to filter
        
    Returns:
        bool: True if message should be processed, False to ignore
        
    Purpose:
    - Demonstrates accessing shared data from middlewares
    - Shows how to add additional data for handlers
    - Provides a template for creating custom filtering logic
    
    Usage in your bot:
    - Create filters for user permissions, content types, etc.
    - Access middleware data via PatchHelper.get_from_pool()
    - Add computed data that handlers can use
    """
    if hasattr(update, "text"):
        # Get the patch helper for this update from the object pool
        patch_helper = PatchHelper.get_from_pool(update)
        
        # Access data set by CheckDigitMiddleware
        some_data = patch_helper.data["is_digit"]
        
        # Add additional computed data for handlers to use
        patch_helper.data["some_data_is_digit"] = some_data
        
        return True  # Allow this message to be processed
    return False  # Ignore messages without text


# Create the custom filter using pyrogram's filter creation system
my_filter = filters.create(my_filter_function)


# ===== MESSAGE HANDLERS =====
"""
Handlers process specific types of messages based on filters and states.
Each handler represents a step in the user interaction flow.
"""


@router.on_message(filters.private & StateFilter() & my_filter)
async def process_1(client: Client, message, state: State, some_data_is_digit: bool):
    """
    Initial handler for starting the registration process.
    
    Filters:
    - filters.private: Only private messages (not group chats)
    - StateFilter(): Only when user has no specific state (default state)
    - my_filter: Our custom filter that adds digit checking data
    
    Args:
        client: The Pyrogram client for sending messages
        message: The incoming message object
        state: FSM state manager for this user
        some_data_is_digit: Data injected by our custom filter
        
    Process:
    1. Check if user typed "register" to start the flow
    2. Ask for their weight
    3. Transition user to the 'weight' state
    
    How to adapt for your bot:
    - Change the trigger word ("register") to match your use case
    - Modify the prompt message
    - Set appropriate state for the next step
    """
    # Debug print to show the custom filter data is working
    print(some_data_is_digit)
    
    # Check if user wants to start registration
    if message.text == "register":
        # Send prompt for weight input
        await client.send_message(message.chat.id, "enter your weight")
        
        # Transition user to weight state - they'll now be handled by the weight handler
        await state.set_state(Parameters.weight)


@router2.on_message(filters.private & StateFilter(Parameters.weight))
async def process_2(client: Client, message, state: State):
    """
    Handler for processing weight input during registration.
    
    Filters:
    - filters.private: Only private messages
    - StateFilter(Parameters.weight): Only when user is in 'weight' state
    
    Args:
        client: The Pyrogram client for sending messages
        message: The incoming message containing the weight
        state: FSM state manager for this user
        
    Process:
    1. Save the weight data to state storage
    2. Ask for height input
    3. Transition user to the 'height' state
    
    Note: This handler only triggers when the user is in the 'weight' state,
    ensuring we collect data in the correct order.
    """
    # Store the weight in state data (persistent across the conversation)
    await state.set_data({"weight": message.text})
    
    # Prompt for the next piece of information
    await client.send_message(message.chat.id, "enter your height")
    
    # Move to height state - user will now be handled by the height handler
    await state.set_state(Parameters.height)


@app.on_message(filters.private & StateFilter(Parameters.height))
async def process_3(client: Client, message, state: State):
    """
    Final handler for processing height and completing registration.
    
    Note: This handler is registered directly on the app (not a router) to show
    that both approaches work. In practice, use routers for better organization.
    
    Filters:
    - filters.private: Only private messages
    - StateFilter(Parameters.height): Only when user is in 'height' state
    
    Args:
        client: The Pyrogram client for sending messages
        message: The incoming message containing the height
        state: FSM state manager for this user
        
    Process:
    1. Retrieve previously stored weight data
    2. Send summary message with both weight and height
    3. Complete the registration by finishing the state
    
    Important: SkipDigitMiddleware ensures only numeric height values reach this handler
    """
    # Retrieve all data stored during this conversation
    state_data = await state.get_data()
    weight = state_data["weight"]
    
    # Send summary of collected information
    await client.send_message(
        message.chat.id, 
        f"your height - {message.text} your weight - {weight}"
    )
    
    # Complete the registration flow and reset user to default state
    # User can now start new conversations or trigger "register" again
    await state.finish()


# ===== APPLICATION STARTUP =====
"""
Start the bot and begin processing messages.

The bot will:
1. Connect to Telegram using your credentials
2. Process incoming messages through the middleware pipeline
3. Route messages to appropriate handlers based on filters and states
4. Maintain conversation state for each user

To test this bot:
1. Set your API credentials and bot token
2. Run the script
3. Send "register" to your bot in a private chat
4. Follow the prompts to enter weight and height
5. Observe how the bot maintains conversation state
"""

# Start the bot (this blocks and runs forever)
app.run()

# ===== EXTENDING THIS EXAMPLE =====
"""
To adapt this code for your own use case:

1. States and Flow:
   - Define your own StatesGroup with relevant states
   - Create handlers for each state in your conversation flow
   - Use state.set_data() and state.get_data() to persist information

2. Middleware:
   - Create validation middleware for your specific input types
   - Add authentication middleware to restrict access
   - Implement logging middleware for debugging and analytics

3. Filters:
   - Create custom filters for user roles, content types, etc.
   - Combine built-in filters (private, group, photo, etc.) with custom logic
   - Use filters to route messages to appropriate handlers

4. Storage:
   - Replace MemoryStorage with RedisStorage for production
   - Implement database storage for complex data requirements
   - Consider data persistence and backup strategies

5. Error Handling:
   - Add try/catch blocks around operations that might fail
   - Implement graceful degradation for network issues
   - Provide user-friendly error messages

6. Advanced Features:
   - Add inline keyboards for user interaction
   - Implement file upload handling
   - Create admin commands and user management
   - Add multi-language support

Example additions:
- Settings menu with keyboard navigation
- File upload with validation and processing  
- User authentication and role management
- Integration with external APIs and databases
"""