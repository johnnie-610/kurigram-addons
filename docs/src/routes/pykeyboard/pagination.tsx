import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Layers, 
  Repeat, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Settings,
  ArrowRight,
  Database
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function PaginationPage() {
  return (
    <div class="space-y-12 pb-20">
      <Title>Smart Pagination - PyKeyboard - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase">
          <Layers size={12} /> Advanced UI
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Smart Pagination
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Handle massive lists with elegance. PyKeyboard's pagination engine features built-in LRU caching and duplicate prevention to ensure a fluid user experience even with thousands of items.
        </p>
      </section>

      {/* Basic Usage */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">Quick Implementation</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            The <code>paginate()</code> method automatically generates a responsive navigation row based on the total page count and the user's current position.
        </p>
        
        <CodeBlock
            language="python"
            filename="pagination_basic.py"
            code={`from pykeyboard import InlineKeyboard

keyboard = InlineKeyboard()

# Creates: « 1 ‹ 11 · 12 · 13 › 25 »
keyboard.paginate(
    count_pages=25,
    current_page=12,
    callback_pattern="page:{number}"
)`}
        />
        
        <Callout type="info" title="Dynamic Patterns">
            The <code>{`{number}`}</code> placeholder in <code>callback_pattern</code> is automatically replaced by the library with the target page number.
        </Callout>
      </section>

      {/* Core Mechanics Grid */}
      <section class="space-y-8">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings class="text-slate-400" /> Core Mechanics
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Database size={24} />
                </div>
                <h3 class="text-xl font-bold">LRU Caching</h3>
                <p class="text-sm text-slate-500 leading-relaxed">
                    The library caches the last 1,000 generated pagination rows. This prevents CPU spikes when many users are scrolling through the same pages simultaneously.
                </p>
            </div>

            <div class="p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Repeat size={24} />
                </div>
                <h3 class="text-xl font-bold">Duplicate Prevention</h3>
                <p class="text-sm text-slate-500 leading-relaxed">
                    If a user clicks a button for the page they are already on, PyKeyboard detects this and provides specific hooks to prevent unnecessary API calls.
                </p>
            </div>
        </div>
      </section>

      {/* Error Handling */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3 text-rose-500">
          <ShieldAlert /> Handling Duplicates
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            When <code>paginate()</code> is called with the same page number as the current one, it raises <code>PaginationUnchangedError</code>. You should catch this to avoid <code>MessageNotModified</code> errors from Telegram.
        </p>
        <CodeBlock 
            language="python"
            code={`from pykeyboard import PaginationUnchangedError

try:
    keyboard.paginate(count, page, pattern)
except PaginationUnchangedError:
    await callback.answer("You are already on this page! ℹ️")
    return`}
        />
      </section>

      {/* Advanced Layouts */}
      <section class="space-y-8">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Zap class="text-amber-500" /> Advanced Layouts
        </h2>
        <div class="space-y-6">
            <div class="space-y-4">
                <h3 class="font-bold text-xl">Adding Action Buttons</h3>
                <p class="text-sm text-slate-500">You can easily combine pagination with standard buttons for complex interfaces.</p>
                <CodeBlock 
                    language="python"
                    code={`kb = InlineKeyboard()
kb.paginate(150, 75, 'page:{number}')

# Add static buttons below the pagination row
kb.row(
    InlineButton('🔙 Back to Menu', 'menu'),
    InlineButton('❌ Close', 'close')
)`}
                />
            </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 border-t border-slate-200 dark:border-tokio-border">
        <h2 class="text-3xl font-black">Deep Dive into Classes</h2>
        <p class="text-slate-500 font-medium">Interested in how the math works? Check the technical reference.</p>
        <A 
          href="/api/pagination-helper" 
          class="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 shadow-xl shadow-purple-500/20 transition-all flex items-center gap-2"
        >
          View API Reference <ArrowRight size={20} />
        </A>
      </section>
    </div>
  );
}
