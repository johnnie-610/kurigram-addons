import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import ApiItem from "../../components/ApiItem";
import {
  Layers,
  Settings,
  Workflow,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  IterationCw,
  CheckCircle2
} from "lucide-solid";
import { A } from "@solidjs/router";
import Callout from "../../components/Callout";

export default function PatchMiddlewaresPage() {
  return (
    <div class="space-y-16 pb-20">
      <Title>Middleware Deep Dive - Pyrogram Patch</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Layers size={12} /> Execution Pipeline
        </div>
        <h1 class="text-6xl font-black tracking-tighter">
          Middleware Deep Dive
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Control every update before it reaches your handlers. The Pyrogram Patch middleware stack supports asynchronous execution with sub-millisecond overhead and context injection.
        </p>
      </section>

      {/* Architectural Overview */}
      <section class="grid lg:grid-cols-3 gap-6">
          {[
              { 
                  title: "Before Hooks", 
                  icon: ArrowRight, 
                  desc: "Executed as soon as an update arrives. Ideal for database session injection or global logging.",
                  color: "emerald"
              },
              { 
                  title: "Around Wrappers", 
                  icon: IterationCw, 
                  desc: "Wrap handlers in a functional decorator. Allows you to 'halt' or 'retry' handler execution based on conditions.",
                  color: "blue"
              },
              { 
                  title: "After Hooks", 
                  icon: CheckCircle2, 
                  desc: "Runs after successfully processing the update. Use it for performance metrics or cleanup tasks.",
                  color: "purple"
              }
          ].map(p => (
            <div class="p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border space-y-4 transition-all hover:bg-slate-900/10 dark:hover:bg-slate-500/10 hover:translate-y-[-4px]">
                <div class={`w-12 h-12 rounded-2xl bg-${p.color}-500/10 flex items-center justify-center text-${p.color}-500`}>
                    <p.icon size={24} />
                </div>
                <h3 class="text-xl font-bold">{p.title}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">
                    {p.desc}
                </p>
            </div>
          ))}
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div class="glass-card p-6 rounded-2xl border-t-2 border-primary-500">
          <div class="text-primary-500 font-black mb-2 uppercase text-[10px] tracking-widest">Kind</div>
          <h3 class="text-xl font-bold mb-3">Before</h3>
          <p class="text-sm text-slate-500">Executed before the main handler. Useful for logging, rate limiting, and data enrichment.</p>
        </div>
        <div class="glass-card p-6 rounded-2xl border-t-2 border-primary-500">
          <div class="text-primary-500 font-black mb-2 uppercase text-[10px] tracking-widest">Kind</div>
          <h3 class="text-xl font-bold mb-3">Around</h3>
          <p class="text-sm text-slate-500">Wraps the handler execution. Ideal for performance profiling and error handling.</p>
        </div>
        <div class="glass-card p-6 rounded-2xl border-t-2 border-primary-500">
          <div class="text-primary-500 font-black mb-2 uppercase text-[10px] tracking-widest">Kind</div>
          <h3 class="text-xl font-bold mb-3">After</h3>
          <p class="text-sm text-slate-500">Runs after the handler completes. Perfect for cleanup or analytics reporting.</p>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight text-gradient-primary">Execution Priority</h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          Middlewares are executed based on their <code>priority</code> value. 
          Higher values are executed first (inverse for <code>after</code> middlewares to maintain a stack-like behavior).
        </p>
        
        <CodeBlock 
          language="python"
          code={`
# High priority middleware (runs first)
await patch_manager.include_middleware(auth_middleware, priority=100)

# Low priority middleware (runs later)
await patch_manager.include_middleware(log_middleware, priority=1)
          `}
        />
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight">Full Example</h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          Below is a complete implementation showing all three middleware kinds working together.
        </p>

        <CodeBlock 
          language="python"
          filename="middlewares.py"
          code={`
from pyrogram import Client
from pyrogram_patch import PatchHelper
import time

# 1. Before Middleware: Enrichment
async def auth_middleware(update, client, patch_helper: PatchHelper):
    user = await get_db_user(update.from_user.id)
    # Inject user into the shared data pool
    await patch_helper.update_data(db_user=user)

# 2. Around Middleware: Performance Tracking
async def trace_middleware(handler, update, client, patch_helper):
    start = time.time()
    result = await handler() # Execute next middleware or main handler
    print(f"Update processed in {time.time() - start:.3f}s")
    return result

# 3. After Middleware: Cleanup
async def cleanup_middleware(update):
    print("Request lifecycle finished.")

# Register them
await patch_manager.include_middleware(auth_middleware, kind="before")
await patch_manager.include_middleware(trace_middleware, kind="around")
await patch_manager.include_middleware(cleanup_middleware, kind="after")
          `}
        />

        <Callout type="tip" title="Shared Context">
          Always use <code>patch_helper.update_data()</code> to pass information between middlewares or to the final handler. This ensures safety across concurrent updates.
        </Callout>
      </section>

      {/* Implementation Guide */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings class="text-slate-400" /> Building a Middleware
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Middlewares can be simple functions or classes implementing the async protocol. The engine automatically detects your parameters and injects the required context.
        </p>

        <div class="space-y-12">
            <div class="space-y-4">
                <h3 class="text-xl font-bold italic text-primary-500">The "Before" Hook (Auth Example)</h3>
                <CodeBlock
                    language="python"
                    code={`from pyrogram_patch.errors import MiddlewareError

async def auth_middleware(client, update):
    # check user in database
    user = await db.get_user(update.from_user.id)
    if not user.is_active:
        raise MiddlewareError("User blocked")`}
                />
            </div>

            <div class="space-y-4">
                <h3 class="text-xl font-bold italic text-primary-500">The "Around" Wrapper (Time Calculation)</h3>
                <CodeBlock
                    language="python"
                    code={`import time

async def log_time_middleware(handler, update):
    start = time.time()
    result = await handler() # continues execution
    duration = time.time() - start
    print(f"Update processed in {duration:.4f}s")
    return result`}
                />
            </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight">Advanced Mechanics</h2>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Zap size={20} />
                    </div>
                    <h4 class="text-xl font-bold">Priority Execution</h4>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed font-medium italic">
                    Control which middleware runs first. Higher priority integers execute earlier in the pipeline. This is critical when you have both logging (low-priority) and authentication (high-priority).
                </p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Clock size={20} />
                    </div>
                    <h4 class="text-xl font-bold">Execution Timeouts</h4>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed font-medium italic">
                    Prevent "zombie" updates from hanging your dispatcher. The engine enforces a configurable <code>max_execution_time</code> (default: 10s) for every middleware in the stack.
                </p>
            </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Ready for Routers?</h2>
        <p class="text-slate-500 font-medium max-w-lg text-center">Now that you know how to intercept updates, learn how to organize them into modular, hierarchical structures.</p>
        <A 
          href="/pyrogram-patch/routers" 
          class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          Explore Routing Strategy <ArrowRight size={20} />
        </A>
      </section>
    </div>
  );
}
