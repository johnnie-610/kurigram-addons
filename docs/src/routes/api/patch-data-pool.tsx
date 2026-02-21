import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Database, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function PatchDataPoolApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>PatchDataPool API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Database size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          PatchDataPool
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The high-concurrency storage layer. <code>PatchDataPool</code> handles memory management for contexts and provides low-level access to the middleware and FSM state storage.
        </p>
      </section>

      {/* Methods */}
      <ApiItem 
        name="get_fsm_context"
        signature="get_fsm_context(user_id, chat_id)"
        description="Retrieves or creates an FSMContext instance for the specified scope."
        parameters={[
          { name: "user_id", type: "int", description: "Unique Telegram user ID.", required: true },
          { name: "chat_id", type: "int", description: "Unique Telegram chat ID.", required: true }
        ]}
        returns={{ type: "FSMContext", description: "The scoped context object." }}
        example={`context = pool.get_fsm_context(user_id=12345, chat_id=12345)\nawait context.set_state(MyStates.first_step)`}
      />

      <ApiItem 
        name="clear_all"
        signature="async clear_all()"
        description="Removes all stored data and registered middlewares from the pool. Use for full system resets."
        example={`await pool.clear_all()\n# Everything is wiped clean`}
      />

      <ApiItem 
        name="set_fsm_storage"
        signature="set_fsm_storage(storage)"
        description="Sets the global FSM storage backend."
        parameters={[
            { name: "storage", type: "BaseStorage", description: "An implementation of the BaseStorage class." }
        ]}
        example={`pool.set_fsm_storage(RedisStorage("redis://localhost:6379"))`}
      />

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Core API Reference</h2>
        <div class="flex gap-4">
            <A href="/api/patch-manager" class="text-primary-500 font-bold hover:underline">PatchManager <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/middleware-manager" class="text-primary-500 font-bold hover:underline">MiddlewareManager <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
