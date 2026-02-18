import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import { 
  Terminal, 
  Workflow, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Box
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function PatchRoutersPage() {
  return (
    <div class="space-y-16 pb-20">
      <Title>Modular Routing Deep Dive - Pyrogram Patch</Title>

      {/* Header */}
      <section class="space-y-4 text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Terminal size={12} /> Organizational Strategy
        </div>
        <h1 class="text-6xl font-black tracking-tighter">
          Hierarchical Routers
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Scale your bot logic horizontally. Our router system allows you to build trees of handlers with isolated logic, shared clients, and automated duplicate prevention.
        </p>
      </section>

      {/* Core Logic Grid */}
      <section class="grid lg:grid-cols-2 gap-8">
          <div class="p-10 rounded-[2.5rem] bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border space-y-6">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <LayoutGrid size={24} />
              </div>
              <h3 class="text-2xl font-black">Deferred Registration</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                Handlers registered on a <code>Router</code> are stored in a pending state until the router is attached to a <code>Client</code>. This allows you to define complex logic trees before your bot even starts.
              </p>
          </div>
          <div class="p-10 rounded-[2.5rem] bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border space-y-6">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={24} />
              </div>
              <h3 class="text-2xl font-black">Duplicate Defense</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                The router system prevents the same handler from being registered twice to the same group, protecting your bot from duplicate update processing.
              </p>
          </div>
      </section>

      {/* Implementation Pattern */}
      <section class="space-y-8">
        <h2 class="text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings class="text-slate-400" /> Building the Tree
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The best practice is to separate your feature areas into dedicated files, each with its own router, and then include them into a single root router.
        </p>

        <div class="space-y-12">
            <div class="space-y-4">
                <h3 class="text-xl font-bold italic text-blue-500">1. Define Feature Router</h3>
                <CodeBlock
                    language="python"
                    filename="features/auth.py"
                    code={`from pyrogram_patch.router import Router

auth_router = Router()

@auth_router.on_message(filters.command("login"))
async def login_handler(client, message):
    await message.reply("Logging you in...")`}
                />
            </div>

            <div class="space-y-4">
                <h3 class="text-xl font-bold italic text-blue-500">2. Assemble the Tree</h3>
                <CodeBlock
                    language="python"
                    filename="main.py"
                    code={`from .features.auth import auth_router
from pyrogram_patch.router import Router

main_router = Router()

# Nested routing
main_router.include_router(auth_router)

# Attached to manager later
patch_manager.include_router(main_router)`}
                />
            </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section class="space-y-8 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-tokio-border">
          <h3 class="text-xl font-black flex items-center gap-3 italic">
              <Box size={20} class="text-primary-500" /> Why use Routers?
          </h3>
          <div class="grid md:grid-cols-2 gap-8 text-sm">
              <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                      <span class="text-slate-500 font-medium">Clean project structure without "God files".</span>
                  </li>
                  <li class="flex items-start gap-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                      <span class="text-slate-500 font-medium">Independent testing of feature modules.</span>
                  </li>
              </ul>
              <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span class="text-slate-500 font-medium">Easy sharing of common filters and logic.</span>
                  </li>
                  <li class="flex items-start gap-3">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span class="text-slate-500 font-medium">Performance optimization via pre-grouped handlers.</span>
                  </li>
              </ul>
          </div>
      </section>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">The Final Piece: FSM</h2>
        <p class="text-slate-500 font-medium max-w-lg text-center">Combine routers with state management to build complex, persistent user flows.</p>
        <A 
          href="/pyrogram-patch/fsm" 
          class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          Master FSM Integration <ArrowRight size={20} />
        </A>
      </section>
    </div>
  );
}
