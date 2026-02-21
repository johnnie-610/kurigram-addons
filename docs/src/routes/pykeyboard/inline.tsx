import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";

export default function InlineKeyboardsPage() {
  return (
    <div class="pb-20">
      <Title>Inline Keyboards - PyKeyboard - Kurigram Addons</Title>

      <h1>Inline Keyboards in Depth</h1>
      
      <p class="lead text-xl">
        Inline keyboards are attached directly to messages. They provide a seamless way to trigger callbacks, open URLs, and build interactive menus without filling the chat history with user responses.
      </p>

      <h2>The Builder API</h2>
      <p>
        The <code>InlineKeyboard</code> class acts as a sophisticated builder that handles row constraints and serialization automatically. Instead of dealing with nested arrays, you just <code>add()</code> buttons to the builder.
      </p>

      <CodeBlock 
          language="python"
          filename="builder.py"
          code={`from pykeyboard import InlineKeyboard, InlineButton

kb = InlineKeyboard(row_width=2)
kb.add(
    InlineButton("Primary Action", "action:primary"),    # Callbacks
    InlineButton("Secondary Action", "action:secondary"),
    InlineButton("Our Website", url="https://example.com") # URLs
)`}
      />

      <h3>Button Types</h3>
      <p>
        The <code>InlineButton</code> class is a wrapper around Pyrogram's native <code>InlineKeyboardButton</code>. It supports all standard parameters, but normalizes how data is passed.
      </p>

      <ul>
        <li><strong>Callback Data</strong>: Pass a string as the second argument. This is the most common use case.</li>
        <li><strong>URLs</strong>: Pass a <code>url=</code> kwarg to open external links.</li>
        <li><strong>Web Apps</strong>: Pass an <code>AppInfo</code> object or URL for Telegram Web Apps.</li>
        <li><strong>Login URLs</strong>: Use the <code>login_url=</code> kwarg for seamless authentication.</li>
        <li><strong>Switch Inline Query</strong>: Use <code>switch_inline_query=</code> to prompt the user to select a chat and start an inline query.</li>
      </ul>

      <Callout type="warning" title="Callback Data Limits">
        Telegram imposes a strict 64-byte limit on callback data. Be mindful of long strings, especially when passing serialized data or IDs. We recommend using short action prefixes like <code>user:12345</code> instead of <code>action_view_user_profile_12345</code>.
      </Callout>

      <h2>Row Constraints</h2>
      <p>
        By default, the builder attempts to place as many buttons on a single row as permitted by the <code>row_width</code> constructor argument (default is 3).
      </p>
      
      <h3>The `row()` Method</h3>
      <p>
        When you need explicit layout control, use <code>row()</code> to force the provided buttons onto their own distinct row, ignoring the standard wrapping logic.
      </p>

      <CodeBlock 
          language="python"
          filename="layout.py"
          code={`kb = InlineKeyboard(row_width=3)

# These buttons will sit side-by-side
kb.add(
    InlineButton("A", "data:a"),
    InlineButton("B", "data:b")
)

# This button forces a new row, spanning the full width
kb.row(InlineButton("Proceed to Checkout", "action:checkout"))

# This starts on a new row under checkout
kb.add(InlineButton("Go Back", "nav:back"))`}
      />

      <h2 id="localization">Localization (I18n)</h2>
      <p>
        A powerful feature of PyKeyboard is its native support for localization. Instead of hardcoding text, you can pass translation keys to your buttons. Before sending the keyboard, you call the <code>localize()</code> method, providing the current user's language code and a translation dictionary or callable.
      </p>

      <CodeBlock 
          language="python"
          filename="i18n.py"
          code={`from pykeyboard import InlineKeyboard, InlineButton

TRANSLATIONS = {
    "en": {"btn.settings": "Settings ⚙️", "btn.help": "Help ❓"},
    "es": {"btn.settings": "Ajustes ⚙️", "btn.help": "Ayuda ❓"},
    "ru": {"btn.settings": "Настройки ⚙️", "btn.help": "Помощь ❓"}
}

def get_text(key: str, lang: str) -> str:
    # A simple translation resolver
    return TRANSLATIONS.get(lang, TRANSLATIONS["en"]).get(key, key)

@app.on_message(filters.command("start"))
async def start(client, message):
    # Detect the user's language
    user_lang = message.from_user.language_code
    
    kb = InlineKeyboard()
    # Use translation keys instead of hardcoded strings
    kb.add(
        InlineButton("btn.settings", "nav:settings"),
        InlineButton("btn.help", "nav:help")
    )
    
    # Process the localization
    kb.localize(user_lang, get_text)
    
    await message.reply_text("Choose an option:", reply_markup=kb)`}
      />

      <p>
        Every button's text is passed through the translation callable, allowing you to maintain massive multi-language bots from a single localized keyboard definition.
      </p>

      <h2>Under the Hood: Pyrogram Interoperability</h2>
      <p>
        You might wonder how you can pass a custom <code>InlineKeyboard</code> mapping directly to methods like <code>reply_text</code> without invoking a `.to_dict()` or `.get_markup()` method. 
      </p>
      <p>
        In Python, Pyrogram checks if the supplied <code>reply_markup</code> is an instance of its own types, or if it can serialize it. Because PyKeyboard's objects are meticulously structured, Kurigram-addons transparently hooks into the bot's execution lifecycle to serialize the builder just in time for the API dispatch.
      </p>
    </div>
  );
}
