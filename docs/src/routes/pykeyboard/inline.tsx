import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  MousePointer2, 
  Languages, 
  Layers, 
  Info, 
  CheckCircle2, 
  Link, 
  Monitor, 
  LogIn, 
  Layout,
  MessageSquare,
  AlertTriangle,
  ArrowRight
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function InlineKeyboardPage() {
  return (
    <div class="space-y-12 pb-20">
      <Title>Inline Keyboards - PyKeyboard - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-widest uppercase">
          <MousePointer2 size={12} /> Interactive UI
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Inline Keyboards
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Create dynamic, high-performance button layouts. PyKeyboard simplifies the complex nested lists required by the Telegram API into a clean, chainable interface.
        </p>
      </section>

      {/* Basic Usage */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">Basic Usage</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            The foundation of PyKeyboard is the <code>InlineKeyboard</code> class. It acts as an orchestrator for your buttons, providing automatic wrapping and layout management.
        </p>
        
        <CodeBlock
            language="python"
            filename="basic_inline.py"
            code={`from pykeyboard import InlineKeyboard, InlineButton

# 1. Create keyboard
keyboard = InlineKeyboard()

# 2. Add buttons
keyboard.add(
    InlineButton("Option 1", "choice:1"),
    InlineButton("Option 2", "choice:2"),
    InlineButton("Cancel", "action:cancel")
)

# 3. Use with your bot
await message.reply_text("Choose an option:", reply_markup=keyboard)`}
        />
      </section>

      {/* Button Types Grid */}
      <section class="space-y-8">
        <h2 class="text-3xl font-bold tracking-tight">Button Types</h2>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600"><MessageSquare size={20} /></div>
                    <h3 class="font-bold">Text Buttons</h3>
                </div>
                <p class="text-sm text-slate-500 mb-4">Standard buttons that send <code>callback_data</code> back to your bot.</p>
                <CodeBlock language="python" code='InlineButton("Click me", "callback_data")' />
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600"><Link size={20} /></div>
                    <h3 class="font-bold">URL Buttons</h3>
                </div>
                <p class="text-sm text-slate-500 mb-4">Buttons that open a link in the user's browser.</p>
                <CodeBlock language="python" code='InlineButton("Visit Website", url="https://example.com")' />
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600"><Monitor size={20} /></div>
                    <h3 class="font-bold">Web App Buttons</h3>
                </div>
                <p class="text-sm text-slate-500 mb-4">Open a modern Web Application directly inside Telegram.</p>
                <CodeBlock language="python" code={`from pyrogram.types import WebAppInfo\nbutton = InlineButton("Open App", web_app=WebAppInfo(url="https://myapp.com"))`} />
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><LogIn size={20} /></div>
                    <h3 class="font-bold">Login Buttons</h3>
                </div>
                <p class="text-sm text-slate-500 mb-4">Authenticate users on your website via Telegram Login.</p>
                <CodeBlock language="python" code={`from pyrogram.types import LoginUrl\nbutton = InlineButton("Login", login_url=LoginUrl(url="https://site.com/login"))`} />
            </div>
        </div>
      </section>

      {/* Layout Control */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Layout class="text-indigo-500" /> Layout Control
        </h2>
        
        <div class="space-y-8">
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Automatic Flow (row_width)</h3>
                <p class="text-slate-600 dark:text-slate-400 font-medium text-sm">
                    Set a global <code>row_width</code> during initialization. All buttons added via <code>add()</code> will automatically wrap when this limit is reached.
                </p>
                <CodeBlock 
                    language="python"
                    code={`kb = InlineKeyboard(row_width=2)
kb.add("A", "B", "C", "D")  # Results in [A,B], [C,D]`}
                />
            </div>

            <div class="space-y-4">
                <h3 class="text-xl font-bold">Manual Rows</h3>
                <p class="text-slate-600 dark:text-slate-400 font-medium text-sm">
                    Use <code>row()</code> to force one or more buttons onto their own line, regardless of the global <code>row_width</code>.
                </p>
                <CodeBlock 
                    language="python"
                    code={`kb = InlineKeyboard(row_width=3)
kb.row("Top Button") # Row 1 (Forced)
kb.add("B2", "B3", "B4") # Row 2 (Auto)`}
                />
            </div>
        </div>
      </section>

      {/* Best Practices */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
          <CheckCircle2 class="text-emerald-500" /> Best Practices
        </h2>
        
        <div class="grid md:grid-cols-2 gap-4">
            <div class="p-6 rounded-2xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border">
                <h4 class="font-bold mb-2">Structured Callbacks</h4>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                    Always use a consistent prefixing system for your callback data to make filtering easier.
                </p>
                <div class="mt-4">
                    <CodeBlock language="python" code='InlineButton("Edit", "action:edit:user:123")' />
                </div>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border">
                <h4 class="font-bold mb-2">Immediate Feedback</h4>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                    Always call <code>answer()</code> on callback queries immediately to remove the loading state from the client.
                </p>
                <div class="mt-4">
                    <CodeBlock language="python" code='await callback_query.answer()' />
                </div>
            </div>
        </div>
      </section>

      {/* Advanced Features Teaser */}
      <section class="space-y-6 pt-10 border-t border-slate-200 dark:border-tokio-border">
        <h2 class="text-2xl font-black">Scaling Up</h2>
        <div class="grid sm:grid-cols-2 gap-4">
            <A href="/pykeyboard/pagination" class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border hover:border-primary-500 transition-colors group">
                <div class="flex items-center justify-between mb-2">
                    <Layers class="text-purple-500" size={20} />
                    <ArrowRight size={16} class="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div class="font-bold">Smart Pagination</div>
                <p class="text-xs text-slate-500">Handle millions of items with infinite scrolling.</p>
            </A>
            <A href="/api/inline-keyboard" class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border hover:border-emerald-500 transition-colors group">
                <div class="flex items-center justify-between mb-2">
                    <Info class="text-emerald-500" size={20} />
                    <ArrowRight size={16} class="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div class="font-bold">API Reference</div>
                <p class="text-xs text-slate-500">View all protected methods and parameters.</p>
            </A>
        </div>
      </section>
    </div>
  );
}
