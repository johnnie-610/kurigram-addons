import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Box, 
  Workflow, 
  Database, 
  ShieldCheck, 
  Settings, 
  ArrowRight,
  Sparkles,
  Cpu
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function PatchFsmPage() {
  return (
    <div class="space-y-16 pb-20">
      <Title>FSM Engine Deep Dive - Pyrogram Patch</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase">
          <Box size={12} /> State Management
        </div>
        <h1 class="text-6xl font-black tracking-tighter">
          Finite State Machine
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Manage complex, multi-step user interactions with context-aware state persistence. The FSM engine handles data isolation and automated dependency injection.
        </p>
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight">FSM Engine</h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          The FSM (Finite State Machine) engine manages user conversational states across multiple storage backends. 
          It allows you to build complex multi-step interactions while preserving context safely and efficiently.
        </p>

        <div class="grid md:grid-cols-3 gap-6 my-10">
          <div class="glass-card p-6 rounded-2xl border-l-4 border-primary-500">
            <h4 class="font-bold mb-2">Isolation</h4>
            <p class="text-sm text-slate-500">States are strictly isolated per chat/user by default.</p>
          </div>
          <div class="glass-card p-6 rounded-2xl border-l-4 border-amber-500">
            <h4 class="font-bold mb-2">Filters</h4>
            <p class="text-sm text-slate-500">Built-in decorators to route handlers based on current state.</p>
          </div>
          <div class="glass-card p-6 rounded-2xl border-l-4 border-teal-500">
            <h4 class="font-bold mb-2">Storage</h4>
            <p class="text-sm text-slate-500">Pluggable backends: Memory, Redis, or your own custom storage.</p>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-6 tracking-tight">State Storage</h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          Pyrogram Patch supports various storage backends for persisting state.
        </p>

        <h3 class="text-xl font-bold mb-4 text-primary-500">Redis Storage (Pro)</h3>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-4">
          For production applications, use <code>RedisStorage</code> to persist states across bot restarts and share state between multiple bot instances.
        </p>
        <CodeBlock 
          language="python"
          code={`
from pyrogram_patch.fsm.storages import RedisStorage

# Traditional connection
storage = RedisStorage(host="localhost", port=6379, db=0)

# URI-based connection
storage = RedisStorage("redis://localhost:6379/0")

await patch_manager.set_storage(storage)
          `}
        />

        <h3 class="text-xl font-bold mt-10 mb-4 text-primary-500">Memory Storage</h3>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-4">
          Ideal for development and testing. Data is lost when the process terminates.
        </p>
        <CodeBlock 
          language="python"
          code={`
from pyrogram_patch.fsm.storages import MemoryStorage

storage = MemoryStorage()
await patch_manager.set_storage(storage)
          `}
        />
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-6 tracking-tight">State Guards (Transitions)</h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          You can define valid transitions within your <code>StatesGroup</code> to prevent invalid state jumps. 
          If a transition is attempted that isn't in the <code>transitions</code> map, an <code>InvalidStateTransition</code> error is raised.
        </p>

        <CodeBlock 
          language="python"
          filename="states.py"
          code={`
class Registration(StatesGroup):
    name = State()
    age = State()
    confirm = State()

    # Define valid transitions
    transitions = {
        name: [age],
        age: [confirm, name],  # Can go back to name
        confirm: []            # End state
    }
          `}
        />
        
        <Callout type="warning" title="Enforcement">
           Transition validation is only performed when passing <code>State</code> objects to <code>set_state()</code>. String-based state changes bypass this guard.
        </Callout>
      </section>

      {/* Core Principles */}
      <section class="grid lg:grid-cols-2 gap-8">
          <div class="p-10 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 space-y-6">
              <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Workflow size={24} />
              </div>
              <h3 class="text-2xl font-black">Context Isolation</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
                Every user-chat pair gets its own isolated <code>FSMContext</code>. This allows multiple users to follow the same registration wizard simultaneously without data leaks or state collisions.
              </p>
          </div>
          <div class="p-10 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <ShieldCheck size={24} />
              </div>
              <h3 class="text-2xl font-black">State-Aware Filters</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
                Register handlers that only execute when a user is in a specific state. Our filters are deeply integrated with the dispatcher for O(1) matching performance.
              </p>
          </div>
      </section>

      {/* Technical Implementation */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight">Defining the Machine</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            States are organized into <code>StatesGroup</code> classes. This provides a clean, namespaced way to manage related states.
        </p>
        <CodeBlock
            language="python"
            code={`from pyrogram_patch.fsm import StatesGroup, State

class OrderPizza(StatesGroup):
    choosing_size = State()
    adding_toppings = State()
    confirming = State()`}
        />
      </section>

      {/* Real-world Example: Storage */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight flex items-center gap-3">
          <Database class="text-slate-400" /> Storage Backends
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="p-8 rounded-3xl bg-white dark:bg-tokio-bg border border-slate-200 dark:border-tokio-border group hover:border-primary-500 transition-colors">
                <h4 class="font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
                    <Cpu class="size-4 text-emerald-500" /> Memory Storage
                </h4>
                <p class="text-sm text-slate-500 leading-relaxed font-medium">
                    Fastest performance, stored in RAM. Data is lost upon bot restart. Perfect for development and small non-critical flows.
                </p>
            </div>
            <div class="p-8 rounded-3xl bg-white dark:bg-tokio-bg border border-slate-200 dark:border-tokio-border group hover:border-primary-500 transition-colors">
                <h4 class="font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
                    <Sparkles class="size-4 text-rose-500" /> Redis Storage
                </h4>
                <p class="text-sm text-slate-500 leading-relaxed font-medium">
                    EnterpriseReady. High-performance persistent storage. Supports multiple bot instances sharing the same state pool.
                </p>
            </div>
        </div>
      </section>

      {/* Handling Data */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight">The FSMContext Object</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium opacity-80 leading-relaxed mb-6">
            The <code>FSMContext</code> is the primary interface for state interaction. It is automatically injected into handlers filtered by states.
        </p>
        <CodeBlock
            language="python"
            code={`@router.on_message(OrderPizza.choosing_size)
async def set_size(client, message, state):
    # 1. Update persistent data
    await state.update_data(size=message.text)
    
    # 2. Change state
    await state.set_state(OrderPizza.adding_toppings)
    
    # 3. Access current data
    data = await state.get_data()
    print(f"User ordered: {data['size']}")`}
        />
      </section>

      {/* Final Wrap-up */}
      <section class="flex flex-col items-center gap-8 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[3rem]">
        <h2 class="text-4xl font-black text-center italic uppercase tracking-tighter">Ready to Scale?</h2>
        <p class="text-slate-500 font-medium max-w-xl text-center">Combine your FSM logic with modular routing to create complex, manageable bot architectures.</p>
        <A 
          href="/pyrogram-patch/routers" 
          class="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 shadow-xl shadow-purple-500/20 transition-all flex items-center gap-2"
        >
          Master Modular Routing <ArrowRight size={18} />
        </A>
      </section>
    </div>
  );
}
