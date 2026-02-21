import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";

export default function PatchTutorialPage() {
  return (
    <div class="pb-20">
      <Title>Tutorial: Building a Stateful Wizard - Pyrogram Patch</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Step-by-Step Tutorial
      </div>
      
      <h1>The Stateful Wizard</h1>
      
      <p class="lead text-xl">
        Learn how to build a complex registration flow using Finite State Machines (FSM). We'll cover status injection, data persistence, and router integration all in one complete example.
      </p>

      <h2>1. Defining the State Machine</h2>
      <p>
        Before we write any handlers, we must declare the steps in our conversational wizard. We do this by creating a <code>StatesGroup</code>. This object serves as an organized container for your bot's conversational states.
      </p>

      <CodeBlock
          language="python"
          filename="states.py"
          code={`from pyrogram_patch.fsm import StatesGroup, State

class Registration(StatesGroup):
    # Step 1: Asking for Name
    name = State()
    
    # Step 2: Asking for Age
    age = State()
    
    # Step 3: Final confirmation
    confirm = State()`}
      />

      <Callout type="info" title="Why not just use strings?">
        While you could filter by the string <code>"Registration:name"</code>, using typed <code>State</code> objects enables auto-completion in your IDE and prevents devastating typographical errors in production.
      </Callout>

      <h2>2. Handling State Transitions</h2>
      <p>
        Now, let's create a <code>Router</code>. Routers allow us to decouple our handlers from the main <code>Client</code> app. We will use the states we just defined directly in our router decorators.
      </p>
      
      <p>
        When Pyrogram Patch detects an FSM filter (like <code>Registration.name</code>), it automatically injects a special <code>state</code> variable containing the <code>FSMContext</code> into your function arguments.
      </p>

      <CodeBlock
          language="python"
          filename="handlers.py"
          code={`from pyrogram import filters
from pyrogram_patch.router import Router
from .states import Registration

router = Router()

# This acts as the entry point to our wizard
@router.on_message(filters.command("register"))
async def start_registration(client, message, state):
    # Move the user into the very first state
    await state.set_state(Registration.name)
    await message.reply("Welcome! To begin, please send me your First Name.")

# This handler ONLY fires if the user is in the 'name' state
@router.on_message(Registration.name)
async def process_name(client, message, state):
    # 1. Save their response to their isolated session
    await state.set_data({"name": message.text})
    
    # 2. Transition them to the next step
    await state.set_state(Registration.age)
    
    await message.reply("Great! Now, what is your age?")

# This handler ONLY fires if the user is in the 'age' state
@router.on_message(Registration.age)
async def process_age(client, message, state):
    # Reject invalid input without changing state
    if not message.text.isdigit():
        await message.reply("Please send a valid number.")
        return

    # 1. Retrieve the data we saved in the previous step
    data = await state.get_data()
    name = data['name']
    
    # 2. Clean up the wizard
    await state.finish()
    
    await message.reply(f"All set, {name}! You are {message.text} years old. Registration complete.")`}
      />

      <h2>3. Wiring it Up</h2>
      <p>
        We've defined our states and written our logic. All that's left is to connect our router to the core Pyrogram client and declare our storage backend.
      </p>

      <CodeBlock
          language="python"
          filename="bot.py"
          code={`import os
from pyrogram import Client
from pyrogram_patch import patch
from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage

# Import the router we made in step 2
from .handlers import router as registration_router

app = Client("my_wizard_bot", bot_token=os.environ.get("BOT_TOKEN"))

async def run_bot():
    # 1. Apply the patch to intercept standard Pyrogram dispatching
    manager = await patch(app)
    
    # 2. Configure Persistent Storage for our states
    await manager.set_storage(MemoryStorage())
    
    # 3. Mount our modular registration logic
    manager.include_router(registration_router)
    
    # 4. Start normally
    print("Bot is up and listening...")
    await app.start()
    await app.idle()

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_bot())`}
      />

      <br />
      <hr />
      
      <h2>What we learned</h2>
      <ul>
        <li><strong>Memory Isolation:</strong> Every user who messages the bot gets their own internal memory dictionary. The <code>state.get_data()</code> method retrieves exactly what that specific user typed.</li>
        <li><strong>Auto-Injection:</strong> By defining arguments like <code>state</code>, the patch automatically routes the proper class instances into your function at runtime.</li>
        <li><strong>Flow Control:</strong> We can easily reject bad input (like texting "twenty" instead of "20") by simply returning early, keeping the user stuck in the <code>Registration.age</code> state until they comply.</li>
      </ul>

    </div>
  );
}
