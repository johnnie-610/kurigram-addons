import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  MessageSquare, 
  Database,
  Terminal,
  ChevronRight
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function PatchTutorialPage() {
  return (
    <div class="space-y-16 pb-20">
      <Title>Tutorial: Building a Stateful Wizard - Pyrogram Patch</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
          <Workflow size={12} /> Step-by-Step Tutorial
        </div>
        <h1 class="text-6xl font-black tracking-tighter">
          The Stateful Wizard
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Learn how to build a complex registration flow using Finite State Machines (FSM). We'll cover status injection, data persistence, and router integration.
        </p>
      </section>

      {/* Roadmap */}
      <section class="p-8 rounded-[2rem] bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border">
          <h2 class="text-lg font-bold mb-6">Learning Path</h2>
          <div class="grid md:grid-cols-4 gap-4">
              {[
                  { id: "01", title: "Define States", icon: Terminal },
                  { id: "02", title: "Step Handlers", icon: MessageSquare },
                  { id: "03", title: "Data Storage", icon: Database },
                  { id: "04", title: "Final Build", icon: CheckCircle2 }
              ].map(step => (
                <div class="flex items-center gap-4">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-black text-emerald-500 tracking-widest">{step.id}</span>
                        <span class="font-bold text-sm">{step.title}</span>
                    </div>
                </div>
              ))}
          </div>
      </section>

      {/* Step 1 */}
      <section class="space-y-8">
        <div class="flex items-start gap-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xl">1</div>
            <div class="space-y-4">
                <h2 class="text-3xl font-black tracking-tight pt-1">Defining the State Machine</h2>
                <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    First, we define a <code>StatesGroup</code>. This acts as a container for your bot's conversational states.
                </p>
            </div>
        </div>

        <CodeBlock
            language="python"
            filename="states.py"
            code={`from pyrogram_patch.fsm import StatesGroup, State

class Registration(StatesGroup):
    name = State()
    age = State()
    confirm = State()`}
        />
      </section>

      {/* Step 2 */}
      <section class="space-y-8">
        <div class="flex items-start gap-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xl">2</div>
            <div class="space-y-4">
                <h2 class="text-3xl font-black tracking-tight pt-1">Handling State Transitions</h2>
                <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Now, let's create handlers that only trigger when a user is in a specific state. We use the <code>FSMContext</code> to transition users between steps.
                </p>
            </div>
        </div>

        <CodeBlock
            language="python"
            filename="handlers.py"
            code={`from pyrogram_patch.router import Router
from .states import Registration

router = Router()

@router.on_message(Registration.name)
async def process_name(client, message, state):
    await state.set_data({"name": message.text})
    await state.set_state(Registration.age)
    await message.reply("Great! Now, what is your age?")

@router.on_message(Registration.age)
async def process_age(client, message, state):
    data = await state.get_data()
    name = data['name']
    await state.finish()
    await message.reply(f"All set, {name}! Registration complete.")`}
        />
      </section>

      {/* Key Concept: Injection */}
      <section class="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-6">
        <h3 class="text-2xl font-black flex items-center gap-3">
            <UserPlus class="text-emerald-500" /> Automatic Injection
        </h3>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Notice the <code>state</code> parameter in the handler? Pyrogram Patch automatically detects your FSM filters and injects the <code>FSMContext</code> object directly into your function. You don't need to manually fetch the user's state from the database.
        </p>
        <div class="flex gap-4">
            <div class="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold ring-1 ring-emerald-500/20">Memory Isolation</div>
            <div class="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold ring-1 ring-emerald-500/20">Auto-Injection</div>
        </div>
      </section>

      {/* Step 3 */}
      <section class="space-y-8">
        <div class="flex items-start gap-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xl">3</div>
            <div class="space-y-4">
                <h2 class="text-3xl font-black tracking-tight pt-1">Wiring it Up</h2>
                <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Finally, initialize the storage and register your router with the patched client.
                </p>
            </div>
        </div>

        <CodeBlock
            language="python"
            filename="bot.py"
            code={`from pyrogram_patch.fsm.storages.memory_storage import MemoryStorage

async def run():
    manager = await patch(app)
    
    # 1. Configure Persistent Storage
    await manager.set_storage(MemoryStorage())
    
    # 2. Include the Registration Router
    manager.include_router(registration_router)`}
        />
      </section>

      {/* Next Steps */}
      <section class="flex flex-col items-center gap-8 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[3rem]">
        <h2 class="text-4xl font-black text-center">Mastered the Wizard?</h2>
        <p class="text-slate-500 font-medium max-w-xl text-center">Take your knowledge further by exploring how to build custom middleware for authentication and logging.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <A 
            href="/pyrogram-patch/middlewares" 
            class="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
          >
            Middleware Deep-Dive <ArrowRight size={18} />
          </A>
          <A 
            href="/pyrogram-patch/fsm" 
            class="px-8 py-3 bg-white dark:bg-tokio-bg text-slate-900 dark:text-white border border-slate-200 dark:border-tokio-border rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-tokio-card transition-all"
          >
            Advanced FSM Features
          </A>
        </div>
      </section>
    </div>
  );
}
