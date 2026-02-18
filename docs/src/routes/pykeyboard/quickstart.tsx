import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { Rocket, Zap, MousePointer2, Languages, Layout, Info, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function QuickStartPage() {
  return (
    <div class="space-y-12 pb-20">
      <Title>Quick Start - PyKeyboard - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-widest uppercase">
          <Rocket size={12} /> Launch Pad
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Quick Start
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Build and deploy your first interactive keyboard in under 5 minutes.
        </p>
      </section>

      {/* Step 1: Your First Keyboard */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Zap class="text-amber-500" /> 1. The Basics
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Import the builder, add some buttons, and pass it directly to any Kurigram method. No manual markup conversion needed.
        </p>
        <CodeBlock 
            language="python"
            filename="basics.py"
            code={`from pykeyboard import InlineKeyboard, InlineButton

# 1. Initialize the keyboard
keyboard = InlineKeyboard()

# 2. Add buttons (uses row_width=3 by default)
keyboard.add(
    InlineButton("👍 Like", "action:like"),
    InlineButton("👎 Dislike", "action:dislike"),
    InlineButton("📊 Stats", "action:stats")
)

# 3. Send it!
await message.reply_text("What do you think?", reply_markup=keyboard)`}
        />
      </section>

      {/* Step 2: Handling Callbacks */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">2. Interacting</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Use Kurigram's native <code>filters.regex</code> to handle the button clicks. Simple, clean, and effective.
        </p>
        <CodeBlock 
            language="python"
            filename="callbacks.py"
            code={`@app.on_callback_query(filters.regex("action:like"))
async def handle_like(client, callback_query):
    await callback_query.answer("You liked it! 👍")

@app.on_callback_query(filters.regex("action:stats"))
async def handle_stats(client, callback_query):
    await callback_query.edit_message_text("📊 Loading stats...")`}
        />
      </section>

      {/* Step 3: Layout Power */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Layout class="text-indigo-500" /> 3. Layout Control
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Need more control? Use <code>row()</code> to force buttons onto a new line regardless of the global row width.
        </p>
        <CodeBlock 
            language="python"
            filename="layout.py"
            code={`kb = InlineKeyboard(row_width=2)

kb.add(InlineButton("A", "a"), InlineButton("B", "b")) # Row 1
kb.row(InlineButton("Full Width C", "c"))             # Row 2 (Forced)`}
        />
      </section>

      {/* Advanced Teaser */}
      <section class="grid md:grid-cols-2 gap-6">
        <div class="glass-card p-8 rounded-3xl premium-shadow border border-slate-200 dark:border-tokio-border border-b-4 border-b-primary-500">
            <Languages class="text-primary-500 mb-4" size={32} />
            <h3 class="text-xl font-bold mb-2">Multilingual</h3>
            <p class="text-sm text-slate-500 mb-4">Support 50+ languages with automated flag emojis and native language names.</p>
            <A href="/pykeyboard/inline#localization" class="text-primary-500 font-medium text-sm flex items-center gap-1 group">
                Learn more <ArrowRight size={14} class="group-hover:translate-x-1 transition-transform" />
            </A>
        </div>
        <div class="glass-card p-8 rounded-3xl premium-shadow border border-slate-200 dark:border-tokio-border border-b-4 border-b-purple-500">
            <MousePointer2 class="text-purple-500 mb-4" size={32} />
            <h3 class="text-xl font-bold mb-2">Smart Pagination</h3>
            <p class="text-sm text-slate-500 mb-4">Infinite scrolling made simple. Let the library handle the complex page logic.</p>
            <A href="/pykeyboard/pagination" class="text-purple-500 font-medium text-sm flex items-center gap-1 group">
                Learn more <ArrowRight size={14} class="group-hover:translate-x-1 transition-transform" />
            </A>
        </div>
      </section>

      {/* Footer Callout */}
      <Callout type="info" title="Ready for more?">
        The basics are just the beginning. Check out the <strong>Pagination Masterclass</strong> or the <strong>Keyboard Builder</strong> guides in the sidebar for more power user features.
      </Callout>
    </div>
  );
}
