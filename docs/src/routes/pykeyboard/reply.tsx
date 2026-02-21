import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";

export default function ReplyKeyboardPage() {
  return (
    <div class="pb-20">
      <Title>Reply Keyboards - PyKeyboard - Kurigram Addons</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Bottom Menu UI
      </div>
      
      <h1>Reply Keyboards</h1>
      <p class="lead text-xl">
        Create persistent menus at the bottom of the chat interface. Reply keyboards allow users to send predefined text messages or perform special actions like sharing their location.
      </p>

      <h2>Basic Usage</h2>
      <p>
        Unlike inline keyboards, reply keyboard buttons always send plain text back to your bot. This means you don't handle <code>on_callback_query</code>—you simply use standard text filters like <code>filters.regex</code> or <code>filters.text</code> on incoming messages.
      </p>
      
      <CodeBlock
          language="python"
          filename="basic_reply.py"
          code={`from pykeyboard import ReplyKeyboard, ReplyButton

# 1. Initialize the keyboard builder
keyboard = ReplyKeyboard(resize_keyboard=True)

# 2. Add buttons (text represents exactly what the bot will receive)
keyboard.add(
    ReplyButton("📋 My Profile"),
    ReplyButton("⚙️ Settings"),
    ReplyButton("❓ Help")
)

# 3. Send it to the user
await message.reply_text("Main Menu:", reply_markup=keyboard)`}
      />

      <h2>Configuration Parameters</h2>
      <p>
        Telegram supports several flags that change how the reply keyboard is displayed on the client device. 
      </p>
      
      <ul>
        <li>
            <strong><code>resize_keyboard</code></strong>: Automatically shrinks the keyboard height to fit the number of rows instead of taking up the full height of the standard device keyboard. <em>Highly recommended.</em>
        </li>
        <li>
            <strong><code>one_time_keyboard</code></strong>: Hides the keyboard immediately after a button is pressed. It sits behind an icon until the user requests it again. Perfect for temporary selection menus or confirmations.
        </li>
        <li>
            <strong><code>placeholder</code></strong>: Custom faded text shown in the input box when the keyboard is active.
        </li>
        <li>
            <strong><code>selective</code></strong>: Only shows the keyboard to specific users mentioned in the message text. Useful for group chats.
        </li>
      </ul>

      <h2>Interactive Requests</h2>
      <p>
        Reply keyboards feature special button types that interact directly with the user's device capabilities to request sensitive information.
      </p>

      <h3>Contact Sharing</h3>
      <p>Prompts the user to securely share the phone number associated with their Telegram account.</p>
      <CodeBlock language="python" code='ReplyButton("📱 Share Phone", request_contact=True)' />

      <h3>Location Access</h3>
      <p>Prompts the user to share their current GPS location with the bot.</p>
      <CodeBlock language="python" code='ReplyButton("📍 Send Location", request_location=True)' />

      <h3>Polls & Quizzes</h3>
      <p>Opens the native Telegram UI for the user to create and send a poll into the chat.</p>
      <CodeBlock language="python" code={`from pyrogram.types import KeyboardButtonPollType\n\nReplyButton("📊 Create Poll", request_poll=KeyboardButtonPollType(type="regular"))`} />

      <h2>Best Practices</h2>
      
      <ol>
        <li>
            <strong>Use Emojis:</strong> Always prefix reply buttons with emojis. It helps users visually parse large menus much faster than text alone.
        </li>
        <li>
            <strong>Persistent vs One-Time:</strong> Keep your Main Menu persistent (<code>one_time_keyboard=False</code>), but use <code>one_time_keyboard=True</code> for confirmation steps or single-choice questions so it vanishes after they tap it.
        </li>
        <li>
            <strong>Navigation:</strong> Always provide a "Back to Main Menu" button in sub-menus to prevent users from getting stuck in a dead-end UI flow.
        </li>
      </ol>

    </div>
  );
}
