import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { A } from "@solidjs/router";

export default function PaginationPage() {
  return (
    <div class="pb-20">
      <Title>Smart Pagination - PyKeyboard - Kurigram Addons</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Advanced UI
      </div>
      
      <h1>Smart Pagination</h1>
      <p class="lead text-xl">
        Handle massive lists with elegance. PyKeyboard's pagination engine features built-in LRU caching and duplicate prevention to ensure a fluid user experience even with thousands of items.
      </p>

      <h2>Quick Implementation</h2>
      <p>
        The <code>paginate()</code> method automatically calculates missing links and generates a responsive navigation row based on the total page count and the user's current position.
      </p>
      
      <CodeBlock
          language="python"
          filename="pagination_basic.py"
          code={`from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()

# Creates a row that looks like: « 1 ‹ 11 · 12 · 13 › 25 »
keyboard.paginate(
    count_pages=25,
    current_page=12,
    callback_pattern="page:{number}"
)`}
      />
      
      <Callout type="info" title="Dynamic Patterns">
        The <code>{`{number}`}</code> placeholder in <code>callback_pattern</code> is required. It is automatically replaced by the library with the target page number when generating the buttons.
      </Callout>

      <h2>Core Mechanics</h2>
      
      <h3>LRU Caching</h3>
      <p>
        Pagination math can become expensive if you have a massive bot with hundreds of users querying data simultaneously. To mitigate this, PyKeyboard caches the last 1,000 generated pagination layouts using a Least Recently Used (LRU) algorithm. 
      </p>
      <p>
        This ensures that identical pagination requests (e.g., page 5 of 10) are instantly retrieved from memory, providing a significant performance boost.
      </p>

      <h3>Duplicate Prevention</h3>
      <p>
        A common UX issue in Telegram bots is when a user aggressively taps the button for the page they are <strong>already on</strong>. When the bot attempts to edit the message with the exact same content, Telegram throws a <code>MessageNotModified</code> exception.
      </p>
      <p>
        PyKeyboard detects if the requested page is identical to the current page natively and provides specific hooks to prevent unnecessary API calls.
      </p>

      <CodeBlock 
          language="python"
          filename="duplicates.py"
          code={`from pykeyboard import PaginationUnchangedError

@app.on_callback_query(filters.regex(r"^page:(\\d+)$"))
async def handle_pagination(client, callback):
    # Retrieve the requested page from the callback data
    target_page = int(callback.matches[0].group(1))
    
    # Let's pretend we extracted the "current page" from the message text
    current_page = 5 
    
    try:
        kb = InlineKeyboard()
        kb.paginate(count_pages=10, current_page=current_page, callback_pattern="page:{number}")
        
    except PaginationUnchangedError:
        # The user clicked the page they are already on!
        await callback.answer("You are already on this page! ℹ️")
        return
        
    # Proceed to load data and edit the message...`}
      />

      <h2>Advanced Layouts</h2>
      <p>
        Pagination isn't limited to a single row. It's designed to compose seamlessly with the rest of the <code>InlineKeyboard</code> builder logic.
      </p>

      <CodeBlock 
          language="python"
          filename="advanced_layout.py"
          code={`kb = InlineKeyboard(row_width=2)

# Add your dynamic list of items first
kb.add(
    InlineButton("Item 1", "item:1"),
    InlineButton("Item 2", "item:2")
)

# Append the pagination controls at the bottom
kb.paginate(150, 75, 'page:{number}')

# You can even append standard action buttons below the pagination row
kb.row(
    InlineButton('🔙 Back to Menu', 'menu:main'),
    InlineButton('❌ Close', 'action:close')
)`}
      />

      <br />
      <hr />
      
      <Callout type="info" title="Explore the Inner Workings">
        Interested in how the math actually bounds the page links and caches instances? Check the <A class="font-bold" href="/api">API Reference</A> for the PaginationHelper class.
      </Callout>

    </div>
  );
}
