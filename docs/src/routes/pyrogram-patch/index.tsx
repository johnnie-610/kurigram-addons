import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Layers, 
  Zap, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Box, 
  Terminal,
  Unplug,
  Workflow,
  Sparkles
} from "lucide-solid";

export default function PyrogramPatchIndex() {
  return (
    <div class="space-y-20 pb-20">
      <Title>Pyrogram Patch Overview - Kurigram Addons</Title>

      {/* Hero */}
      <section class="space-y-8 py-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
          <Sparkles size={12} /> The New Standard
        </div>
        <h1 class="text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
          Pyrogram <span class="bg-gradient-to-r from-emerald-500 to-primary-500 bg-clip-text text-transparent">Reimagined.</span>
        </h1>
        <p class="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
          A non-invasive, high-performance extension for Pyrogram that adds a modern middleware pipeline, hierarchical routing, and a state-of-the-art FSM engine.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <A 
            href="/pyrogram-patch/tutorial" 
            class="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3 scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Tutorial <Workflow size={20} />
          </A>
          <A 
            href="/api/patch-manager" 
            class="px-8 py-4 bg-white dark:bg-tokio-bg text-slate-900 dark:text-white rounded-2xl font-bold border border-slate-200 dark:border-tokio-border hover:bg-slate-50 dark:hover:bg-tokio-card transition-all flex items-center gap-3"
          >
            Technical API <ArrowRight size={20} />
          </A>
        </div>
      </section>

      {/* Architectural Deep Dive */}
      <section class="space-y-12">
        <div class="space-y-4">
            <h2 class="text-3xl font-black tracking-tight">The Patched Architecture</h2>
            <p class="text-slate-500 font-medium">How we extend Pyrogram without breaking it.</p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8">
            <div class="p-8 rounded-[2rem] bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Unplug size={120} />
                </div>
                <h3 class="text-xl font-black mb-4">Non-Invasive Bridge</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">
                    Instead of forking the library, we replace the internal <code>Dispatcher</code> at runtime. This "hot-swap" allows your code to use 100% of Pyrogram's native features while gaining a powerful new update processing pipeline.
                </p>
                <div class="mt-8 flex items-center gap-3 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <Shield size={14} /> 100% Update Compatibility
                </div>
            </div>

            <div class="p-8 rounded-[2rem] bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={120} />
                </div>
                <h3 class="text-xl font-black mb-4">The Data Pool</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">
                    Our <code>PatchDataPool</code> provides a thread-safe, high-concurrency storage layer for middleware state and FSM contexts. It ensures that your bot can handle thousands of concurrent users with minimal memory footprint.
                </p>
                <div class="mt-8 flex items-center gap-3 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    <Box size={14} /> LRU Context Caching
                </div>
            </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section class="space-y-10">
        <h2 class="text-3xl font-black tracking-tight text-center">Engine Capabilities</h2>
        <div class="grid md:grid-cols-3 gap-6">
          {[
            { 
              icon: Layers, 
              title: "Tri-Phase Middlewares", 
              desc: "Register hooks for 'before', 'after', and 'around' execution. Perfect for auth, logging, and metrics.",
              link: "/pyrogram-patch/middlewares",
              color: "emerald"
            },
            { 
              icon: Terminal, 
              title: "Hierarchical Routers", 
              desc: "Build trees of handlers. Scale your bot from 10 to 1000 handlers without messy files.",
              link: "/pyrogram-patch/routers",
              color: "blue"
            },
            { 
              icon: Box, 
              title: "Advanced FSM", 
              desc: "Full context isolation with support for Redis and Memory storage. Automated data cleanup.",
              link: "/pyrogram-patch/fsm",
              color: "purple"
            }
          ].map(f => (
            <div class="glass-card p-10 rounded-[2.5rem] group border border-slate-200 dark:border-tokio-border hover:shadow-2xl transition-all duration-500">
              <div class={`w-14 h-14 bg-${f.color}-500/10 rounded-2xl flex items-center justify-center text-${f.color}-500 mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon size={28} />
              </div>
              <h3 class="text-2xl font-black mb-4">{f.title}</h3>
              <p class="text-slate-500 leading-relaxed font-medium text-sm mb-8">
                {f.desc}
              </p>
              <A href={f.link} class="group/link text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <span class="group-hover/link:underline decoration-2 underline-offset-4 decoration-primary-500">Explore Detail</span>
                <ArrowRight size={14} class="group-hover/link:translate-x-1 transition-transform text-primary-500" />
              </A>
            </div>
          ))}
        </div>
      </section>

      {/* Code Preview */}
      <section class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="space-y-4">
                <h2 class="text-4xl font-black tracking-tight">One Patch, Infinite Possibilities</h2>
                <p class="text-slate-500 font-medium">Register everything through a single, elegant manager.</p>
            </div>
        </div>
        
        <div class="grid lg:grid-cols-5 gap-8">
            <div class="lg:col-span-3">
                <CodeBlock
                    language="python"
                    filename="main.py"
                    code={`from pyrogram import Client
from pyrogram_patch import patch
from .handlers import router
from .middlewares import AuthMiddleware

async def main():
    app = Client("bot")
    manager = await patch(app)
    
    # Register global auth
    await manager.include_middleware(AuthMiddleware())
    
    # Add modular handlers
    manager.include_router(router)
    
    await app.start()
    await app.idle()`}
                />
            </div>
            <div class="lg:col-span-2 space-y-6">
                <div class="p-6 rounded-2xl bg-white dark:bg-tokio-bg border border-slate-200 dark:border-tokio-border">
                    <h4 class="font-bold mb-2 flex items-center gap-2">
                        <Zap size={16} class="text-amber-500" /> Startup listeners
                    </h4>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Register async hooks that trigger exactly when the patch is applied, allowing for dynamic dependency injection.
                    </p>
                </div>
                <div class="p-6 rounded-2xl bg-white dark:bg-tokio-bg border border-slate-200 dark:border-tokio-border">
                    <h4 class="font-bold mb-2 flex items-center gap-2">
                        <Shield size={16} class="text-emerald-500" /> Priority Pipeline
                    </h4>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Control the exact execution order of your middlewares across multiple routers with integer-based priorities.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Path Navigation */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-20 border-t border-slate-200 dark:border-tokio-border">
        <A 
            href="/pyrogram-patch/routers"
            class="p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col justify-between group hover:bg-slate-800 transition-colors h-[280px]"
        >
            <Terminal size={40} class="text-primary-500 group-hover:scale-110 transition-transform" />
            <div class="space-y-2">
                <h3 class="text-3xl font-black italic uppercase">Routers</h3>
                <p class="text-slate-400 text-sm font-medium">Modularize your event handlers.</p>
            </div>
        </A>
        <A 
            href="/pyrogram-patch/middlewares"
            class="p-10 rounded-[2.5rem] bg-primary-600 text-white flex flex-col justify-between group hover:bg-primary-500 transition-colors h-[280px]"
        >
            <Layers size={40} class="text-white group-hover:scale-110 transition-transform" />
            <div class="space-y-2">
                <h3 class="text-3xl font-black italic uppercase text-white">Middlewares</h3>
                <p class="text-slate-100/70 text-sm font-medium">Control the execution pipeline.</p>
            </div>
        </A>
      </div>
    </div>
  );
}
