import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Keyboard, 
  UserCheck, 
  MapPin, 
  BarChart3, 
  Smartphone, 
  Layout, 
  CheckCircle2, 
  Info,
  ArrowRight
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function ReplyKeyboardPage() {
  return (
    <div class="space-y-12 pb-20">
      <Title>Reply Keyboards - PyKeyboard - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Keyboard size={12} /> Bottom Menu UI
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Reply Keyboards
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Create persistent menus at the bottom of the chat interface. Reply keyboards allow users to send predefined text messages or perform special actions like sharing their location.
        </p>
      </section>

      {/* Basic Usage */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">Basic Usage</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Unlike inline keyboards, reply keyboard buttons always send plain text back to your bot, which you can handle using normal text filters.
        </p>
        
        <CodeBlock
            language="python"
            filename="basic_reply.py"
            code={`from pykeyboard import ReplyKeyboard, ReplyButton

# 1. Create keyboard
keyboard = ReplyKeyboard(resize_keyboard=True)

# 2. Add buttons
keyboard.add(
    ReplyButton("📋 My Profile"),
    ReplyButton("⚙️ Settings"),
    ReplyButton("❓ Help")
)

# 3. Send to user
await message.reply_text("Main Menu:", reply_markup=keyboard)`}
        />
      </section>

      {/* Configuration Parameters */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">Configuration</h2>
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-6 rounded-2xl border border-slate-200 dark:border-tokio-border space-y-2">
                <div class="font-bold flex items-center gap-2 text-primary-500">
                    <Smartphone size={16} /> resize_keyboard
                </div>
                <p class="text-xs text-slate-500 font-medium">Automatically shrinks the keyboard height to fit the number of rows. Highly recommended.</p>
            </div>
            <div class="p-6 rounded-2xl border border-slate-200 dark:border-tokio-border space-y-2">
                <div class="font-bold flex items-center gap-2 text-amber-500">
                    <UserCheck size={16} /> one_time_keyboard
                </div>
                <p class="text-xs text-slate-500 font-medium">Hides the keyboard as soon as a button is pressed. Perfect for temporary selection menus.</p>
            </div>
            <div class="p-6 rounded-2xl border border-slate-200 dark:border-tokio-border space-y-2">
                <div class="font-bold flex items-center gap-2 text-indigo-500">
                    <Info size={16} /> placeholder
                </div>
                <p class="text-xs text-slate-500 font-medium">Custom text shown in the input field when the keyboard is active.</p>
            </div>
            <div class="p-6 rounded-2xl border border-slate-200 dark:border-tokio-border space-y-2">
                <div class="font-bold flex items-center gap-2 text-rose-500">
                    <Layout size={16} /> selective
                </div>
                <p class="text-xs text-slate-500 font-medium">Only shows the keyboard to specific users mentioned in the message text.</p>
            </div>
        </div>
      </section>

      {/* Request Buttons */}
      <section class="space-y-8">
        <h2 class="text-3xl font-bold tracking-tight">Interactive Requests</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Reply keyboards feature special button types that interact directly with the user's device capabilities.
        </p>

        <div class="grid md:grid-cols-2 gap-6">
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Smartphone size={20} /></div>
                    <h3 class="font-bold">Contact Sharing</h3>
                </div>
                <CodeBlock language="python" code='ReplyButton("📱 Share Phone", request_contact=True)' />
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600"><MapPin size={20} /></div>
                    <h3 class="font-bold">Location Access</h3>
                </div>
                <CodeBlock language="python" code='ReplyButton("📍 Send Location", request_location=True)' />
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border md:col-span-2">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600"><BarChart3 size={20} /></div>
                    <h3 class="font-bold">Polls & Quizzes</h3>
                </div>
                <CodeBlock language="python" code={`from pyrogram.types import KeyboardButtonPollType\n\nReplyButton("📊 Create Poll", request_poll=KeyboardButtonPollType(type="regular"))`} />
            </div>
        </div>
      </section>

      {/* Best Practices */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CheckCircle2 class="text-emerald-500" /> Best Practices
        </h2>
        
        <ul class="space-y-4">
            <li class="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-tokio-bg-alt border border-slate-200 dark:border-tokio-border">
                <div class="text-emerald-500 font-black">01.</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Use <strong>Emojis</strong> on every button. They help users visually parse large menus much faster than text alone.
                </div>
            </li>
            <li class="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-tokio-bg-alt border border-slate-200 dark:border-tokio-border">
                <div class="text-emerald-500 font-black">02.</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Keep your <strong>Main Menu</strong> persistent, but use <code>one_time_keyboard</code> for confirmation steps or single-choice questions.
                </div>
            </li>
            <li class="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-tokio-bg-alt border border-slate-200 dark:border-tokio-border">
                <div class="text-emerald-500 font-black">03.</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Always provide a <strong>"Back"</strong> button in sub-menus to prevent users from getting stuck in a dead-end UI flow.
                </div>
            </li>
        </ul>
      </section>

      {/* Footer Callout */}
      <section class="flex flex-col items-center gap-6 py-20 border-t border-slate-200 dark:border-tokio-border">
        <h2 class="text-3xl font-black">Master the API</h2>
        <p class="text-slate-500 font-medium">Need the lower-level details? Explore the technical reference.</p>
        <A 
          href="/api/reply-keyboard" 
          class="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 shadow-xl shadow-primary-500/20 transition-all flex items-center gap-2"
        >
          View API Reference <ArrowRight size={20} />
        </A>
      </section>
    </div>
  );
}
