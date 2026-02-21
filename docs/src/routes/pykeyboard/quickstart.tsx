import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { A } from "@solidjs/router";

export default function QuickStartPage() {
  return (
    <div class="pb-20">
      <Title>Quick Start - PyKeyboard - Kurigram Addons</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Launch Pad
      </div>
      
      <h1>Quick Start</h1>
      <p class="lead text-xl">
        Build and deploy your first interactive keyboard in under 5 minutes. PyKeyboard is designed to be seamless; there's no need to convert objects manually before passing them to Kurigram.
      </p>

      <h2>1. The Basics</h2>
      <p>
        Building an inline keyboard starts with the <code>InlineKeyboard</code> builder class. This builder manages rows, constraints, and data callbacks automatically.
      </p>
      
      <p>
        Import the builder, add some buttons, and pass the builder <strong>directly</strong> to any Kurigram method that accepts a <code>reply_markup</code>.
      </p>

      <CodeBlock 
          language="python"
          filename="basics.py"
          code={`from pykeyboard import InlineKeyboard, InlineButton

# 1. Initialize the keyboard constraints
keyboard = InlineKeyboard(row_width=3) # Maximum 3 buttons per row

# 2. Add buttons (will wrap automatically based on row_width)
keyboard.add(
    InlineButton("👍 Like", "action:like"),
    InlineButton("👎 Dislike", "action:dislike"),
    InlineButton("📊 Stats", "action:stats")
)

# 3. Send it directly using the client!
await client.send_message(
    chat_id=chat_id, 
    text="What do you think about PyKeyboard?", 
    reply_markup=keyboard
)`}
      />

      <Callout type="info" title="No more .to_markup()">
        You don't need to call a method to generate the markup. <code>InlineKeyboard</code> and <code>ReplyKeyboard</code> act as drop-in replacements for Pyrogram's native markup objects.
      </Callout>

      <h2>2. Controlling the Layout</h2>
      <p>
        Sometimes, automatic wrapping via <code>row_width</code> isn't enough. You might want to force certain buttons to span the entire width of the chat window, or group specific actions together. This is where the <code>row()</code> method becomes exceptionally useful.
      </p>

      <CodeBlock 
          language="python"
          filename="layout.py"
          code={`kb = InlineKeyboard(row_width=2)

# Normal addition: These two fit in row 1
kb.add(InlineButton("A", "a"), InlineButton("B", "b"))

# Forced row: 'C' gets its own row regardless of the global row_width
kb.row(InlineButton("Full Width C", "c"))

# Back to normal: This will go on row 3
kb.add(InlineButton("D", "d"))`}
      />

      <h2>3. Handling Interactions</h2>
      <p>
        Kurigram's native <code>filters.regex</code> is the recommended way to handle the button clicks. Because PyKeyboard uses simple string data for callbacks, intercepting them is just standard Pyrogram boilerplate.
      </p>
      
      <p>
        Below is a complete, runnable bot example that demonstrates everything from sending the keyboard to answering the callback queries.
      </p>

      <CodeBlock 
          language="python"
          filename="bot.py"
          code={`import os
from pyrogram import Client, filters
from pykeyboard import InlineKeyboard, InlineButton

app = Client("my_bot", bot_token=os.environ.get("BOT_TOKEN"))

@app.on_message(filters.command("start"))
async def start_command(client, message):
    # Prepare our keyboard
    kb = InlineKeyboard(row_width=2)
    kb.add(
        InlineButton("Settings ⚙️", "menu:settings"),
        InlineButton("Profile 👤", "menu:profile")
    )
    kb.row(InlineButton("Help ❓", "menu:help"))
    
    await message.reply_text(
        "Welcome to the PyKeyboard Quick Start Bot! Choose an option:",
        reply_markup=kb
    )

@app.on_callback_query(filters.regex(r"^menu:(.+)"))
async def handle_menu_clicks(client, callback_query):
    # Extract the matched group from the regex filter
    action = callback_query.matches[0].group(1)
    
    if action == "settings":
        await callback_query.answer("Opening Settings...", show_alert=True)
    elif action == "profile":
        await callback_query.edit_message_text("This is your empty profile!")
    elif action == "help":
        await callback_query.answer("No help available yet.")

if __name__ == "__main__":
    app.run()`}
      />

      <h2>What's Next?</h2>
      <p>Ready to level up your UI? Check out these powerful features:</p>
      
      <ul>
        <li>
            <A href="/pykeyboard/pagination" class="font-bold">Automated Pagination</A>: Stop manually slicing lists. Let the library generate infinite scrolling keyboards.
        </li>
        <li>
            <A href="/pykeyboard/reply" class="font-bold">Reply Keyboards</A>: Build dynamic custom keyboard layouts that appear in place of the user's mobile keyboard.
        </li>
        <li>
            <A href="/pykeyboard/inline#localization" class="font-bold">Localization</A>: Automatically translate button text based on the user's language code from Telegram.
        </li>
      </ul>

      <br />
      <hr />
      
      <Callout type="info" title="Explore the Architecture">
        For larger bots, managing UI logic right inside <code>on_callback_query</code> can get messy. Take a look at the <A href="/pyrogram-patch">Pyrogram Patch module</A> which provides state machines (FSM) and modular routers to elegantly handle complex flows.
      </Callout>

    </div>
  );
}
