import { A } from "@solidjs/router";
import { 
  ArrowRight, 
  Box, 
  Keyboard, 
  Layers, 
  Zap, 
  Shield, 
  Cpu, 
  Globe,
  Terminal
} from "lucide-solid";
import CodeBlock from "~/components/CodeBlock";

export default function Home() {
  return (
    <div class="not-prose space-y-32 py-16">
      {/* Hero Section */}
      <section class="relative text-center space-y-8 py-20 px-4">
        <div class="absolute inset-0 -z-10 bg-radial from-primary-500/10 via-transparent to-transparent opacity-50 blur-3xl animate-pulse" />
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase mb-4">
          <Zap size={14} /> Production Ready
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
          <span class="text-gradient-primary">
            Kurigram
          </span>
          <br />
          <span class="text-slate-800 dark:text-slate-100 opacity-90">Addons</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
          The definitive toolkit for <span class="text-slate-900 dark:text-white font-bold underline decoration-primary-500 decoration-4 underline-offset-4">advanced</span> Pyrogram bots. 
          Middleware, modular routing, and smart keyboards—engineered for scale.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-6 pt-10">
          <A
            href="/pyrogram-patch"
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-600 rounded-2xl shadow-2xl hover:bg-primary-500 hover:scale-105 transition-all duration-300 gap-3 overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <Layers size={22} />
            Get Started
            <ArrowRight size={22} class="group-hover:translate-x-1 transition-transform" />
          </A>
          <A
            href="/pykeyboard"
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 dark:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:scale-105 transition-all duration-300 gap-3"
          >
            <Keyboard size={22} />
            Documentation
          </A>
        </div>
      </section>

      {/* Code Preview Section */}
      <section class="max-w-5xl mx-auto px-4">
        <div class="glass-card rounded-[2.5rem] p-1 overflow-hidden premium-shadow">
          <div class="bg-slate-950 rounded-[calc(2.5rem-4px)] p-2">
             <CodeBlock 
                language="python"
                filename="main.py"
                code={`from pyrogram import Client
from pyrogram_patch import patch, router

# Seamless integration
patch(Client)

# Modular routing & Middleware
r = router.Router()

@r.on_message()
async def welcome(client, message, patch_helper):
    await message.reply(f"Hello {message.from_user.first_name}!")`}
             />
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section class="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        <div class="glass-card p-10 rounded-3xl premium-shadow hover:scale-[1.02] transition-all duration-300 border-t-primary-500 border-t-4">
          <div class="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 mb-8">
            <Cpu size={32} />
          </div>
          <h3 class="text-2xl font-bold mb-4">Core Engine</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            A high-concurrency dispatcher with built-in circuit breakers and automatic latency tracking.
          </p>
        </div>

        <div class="glass-card p-10 rounded-3xl premium-shadow hover:scale-[1.02] transition-all duration-300 border-t-accent-500 border-t-4">
          <div class="w-14 h-14 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-600 mb-8">
            <Layers size={32} />
          </div>
          <h3 class="text-2xl font-bold mb-4">Middleware Stack</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Sophisticated execution hooks (before/after/around) with dependency injection for every handler.
          </p>
        </div>

        <div class="glass-card p-10 rounded-3xl premium-shadow hover:scale-[1.02] transition-all duration-300 border-t-indigo-500 border-t-4">
          <div class="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
            <Globe size={32} />
          </div>
          <h3 class="text-2xl font-bold mb-4">Enterprise UX</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            I18n-ready keyboards, automatic pagination, and professional FSM state management built-in.
          </p>
        </div>
      </section>

      {/* Detailed Features List */}
      <section class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <h2 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Designed for developers who <span class="text-gradient-primary">demand more</span>.
            </h2>
            <div class="space-y-6">
              {[
                { icon: Shield, title: "Circuit Breakers", desc: "Prevent bot crashes under heavy load with automatic fallback handling." },
                { icon: Terminal, title: "Modular Architecture", desc: "Keep your code clean with a decoupled router and middleware system." },
                { icon: Box, title: "Stateful FSM", desc: "Intuitive state management that just works across multiple workers." }
              ].map(f => (
                <div class="flex gap-6 group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <f.icon size={24} class="group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 class="text-xl font-bold mb-1">{f.title}</h4>
                    <p class="text-slate-600 dark:text-slate-400 font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="relative hidden md:block">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
            <div class="relative glass-card rounded-[3rem] p-8 premium-shadow border-primary-500/20">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">KB</div>
                <div>
                  <div class="text-sm font-bold">Kurigram Bot</div>
                  <div class="text-[10px] uppercase tracking-wider text-slate-500">System Ready</div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div class="text-xs font-bold text-primary-500 mb-1 tracking-widest uppercase">Middleware Hit</div>
                  <div class="text-sm">Processed update in 14ms via <code>check_auth</code></div>
                </div>
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div class="text-xs font-bold text-indigo-500 mb-1 tracking-widest uppercase">Router Match</div>
                  <div class="text-sm">Executing <code>CommandHandler('start')</code></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section class="text-center py-20 bg-primary-600 dark:bg-primary-900/40 rounded-[3rem] px-6 mx-4 mb-20 relative overflow-hidden group">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 transition-transform group-hover:scale-110 duration-700" />
        <h2 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
          Ready to build better bots?
        </h2>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <A
            href="/pyrogram-patch"
            class="px-10 py-5 bg-white text-primary-600 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl"
          >
            Start Integration
          </A>
          <A
            href="https://github.com/johnnie-610/kurigram-addons"
            class="px-10 py-5 bg-slate-900/20 text-white border-2 border-white/20 hover:border-white/40 rounded-2xl font-black text-xl hover:scale-105 transition-all"
          >
            View on GitHub
          </A>
        </div>
      </section>
    </div>
  );
}
