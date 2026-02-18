import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import CodeBlock from "~/components/CodeBlock";
import { 
  Keyboard, 
  Globe, 
  Layers, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  BookOpen,
  Terminal,
  Cpu
} from "lucide-solid";

export default function PyKeyboardIndex() {
  return (
    <div class="space-y-16 pb-20">
      <Title>PyKeyboard - Modern UI for Kurigram</Title>

      {/* Hero Section */}
      <section class="space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-widest uppercase">
          <Keyboard size={12} /> UI Components
        </div>
        <h1 class="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
          The most intuitive way to build <span class="text-rose-500">Telegram UI.</span>
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          PyKeyboard provides a declarative, type-safe API for Inline and Reply keyboards. 
          Stop wrestling with nested lists and start building high-performance, multilingual button layouts.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
            <A href="/pykeyboard/installation" class="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                <Terminal size={18} /> Get Started
            </A>
            <A href="/pykeyboard/quickstart" class="px-8 py-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-bold hover:bg-rose-500/20 transition-all flex items-center gap-2">
                <Zap size={18} /> Quick Start
            </A>
        </div>
      </section>

      {/* Core Features Grid */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight">Framework Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Globe class="text-blue-500" />}
            title="50+ Native Locales"
            description="Comprehensive locale support including flags and native language names for effortless internationalization."
          />
          <FeatureCard 
            icon={<Layers class="text-purple-500" />}
            title="Smart Pagination"
            description="Built-in LRU caching and duplicate prevention for fluid, high-performance scrolling lists."
          />
          <FeatureCard 
            icon={<Wrench class="text-orange-500" />}
            title="Builder Pattern"
            description="A fluent, chainable API that makes complex keyboard structures readable and maintainable."
          />
          <FeatureCard 
            icon={<ShieldCheck class="text-emerald-500" />}
            title="Strict Validation"
            description="Automatic button validation ensures your markup always fits Telegram's strict layout constraints."
          />
          <FeatureCard 
            icon={<Cpu class="text-indigo-500" />}
            title="Type Safety"
            description="Built with Pydantic and exhaustive type hints for an elite development experience in modern IDEs."
          />
          <FeatureCard 
            icon={<BookOpen class="text-slate-500" />}
            title="Zero Adapters"
            description="Directly compatible with Kurigram methods. Pass our keyboard objects to any reply_markup parameter."
          />
        </div>
      </section>

      {/* Code Preview */}
      <section class="space-y-8">
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-black tracking-tight">Clean by Design</h2>
            <A href="/pykeyboard/quickstart" class="text-sm font-bold text-primary-500 flex items-center gap-1 hover:underline">
                View all examples <ArrowRight size={16} />
            </A>
        </div>
        <div class="grid lg:grid-cols-5 gap-8 items-start">
            <div class="lg:col-span-3">
                <CodeBlock 
                    language="python"
                    filename="keyboard_demo.py"
                    code={`from pykeyboard import InlineKeyboard, InlineButton

# No more nested lists!
kb = InlineKeyboard(row_width=2)

kb.add(
    InlineButton("👍 Applaud", "cmd:like"),
    InlineButton("👎 Criticize", "cmd:unlike")
)
kb.row(InlineButton("🔄 Refresh Data", "cmd:refresh"))

# Send directly to Kurigram
await message.reply("Choose path:", reply_markup=kb)`}
                />
            </div>
            <div class="lg:col-span-2 space-y-6">
                <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                    <h4 class="font-bold mb-2">Why PyKeyboard?</h4>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        Telegram keyboards are traditionally managed as complex multidimensional arrays. 
                        PyKeyboard abstracts this into <strong>Fluent Rows</strong> and <strong>Smart Wrapping</strong>, allowing you to focus on UX rather than array indices.
                    </p>
                </div>
                <div class="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <h4 class="font-bold text-amber-600 dark:text-amber-500 mb-2 flex items-center gap-2">
                        <Zap size={16} /> Performance Tip
                    </h4>
                    <p class="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                        Use the <code>KeyboardFactory</code> for common patterns like confirmation or selection menus to reduce boilerplate even further.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section class="space-y-8 bg-slate-900/5 dark:bg-slate-500/5 p-12 rounded-[2.5rem] border border-slate-200 dark:border-tokio-border">
        <h2 class="text-3xl font-black tracking-tight text-center">Architecture Overview</h2>
        <div class="max-w-4xl mx-auto space-y-12">
            <p class="text-center text-slate-500 font-medium">
                PyKeyboard sits between your bot logic and the Telegram API, providing a structured layer for UI construction.
            </p>
            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div class="space-y-4">
                    <div class="w-16 h-16 bg-white dark:bg-tokio-bg-alt rounded-2xl shadow-xl flex items-center justify-center mx-auto border border-slate-200 dark:border-tokio-border">
                        <Terminal class="text-primary-500" />
                    </div>
                    <div>
                        <div class="font-bold">Input Layer</div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Builder / Factory</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="w-16 h-16 bg-white dark:bg-tokio-bg-alt rounded-2xl shadow-xl flex items-center justify-center mx-auto border border-slate-200 dark:border-tokio-border">
                        <Cpu class="text-purple-500" />
                    </div>
                    <div>
                        <div class="font-bold">Logic Engine</div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Pagination / Hooks</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="w-16 h-16 bg-white dark:bg-tokio-bg-alt rounded-2xl shadow-xl flex items-center justify-center mx-auto border border-slate-200 dark:border-tokio-border">
                        <ShieldCheck class="text-emerald-500" />
                    </div>
                    <div>
                        <div class="font-bold">Markup Generation</div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Validation / Serialization</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard(props: { icon: any, title: string, description: string }) {
  return (
    <div class="glass-card p-8 rounded-3xl premium-shadow border border-slate-200 dark:border-tokio-border group hover:-translate-y-1 transition-all duration-300">
      <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-tokio-bg-alt flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {props.icon}
      </div>
      <h3 class="text-lg font-bold mb-3">{props.title}</h3>
      <p class="text-sm text-slate-500 leading-relaxed font-medium">
        {props.description}
      </p>
    </div>
  );
}
