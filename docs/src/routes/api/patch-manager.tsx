import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Cpu, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function PatchManagerApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>PatchManager API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
          <Cpu size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          PatchManager
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The central hub for managing a patched client. <code>PatchManager</code> facilitates the registration of middlewares, routers, and FSM storage engines.
        </p>
      </section>

      {/* Primary Function */}
      <ApiItem 
        name="patch"
        signature="async patch(client)"
        description="The entry point for the library. Replaces the Pyrogram dispatcher and initializes the global PatchDataPool."
        parameters={[
          { name: "client", type: "pyrogram.Client", description: "The Pyrogram client instance to extend.", required: true }
        ]}
        returns={{ type: "PatchManager", description: "An initialized manager for further configuration." }}
        raises={[
            { name: "PatchError", description: "Raised if the client is already patched or initialization fails." }
        ]}
      />

      {/* Methods */}
      <ApiItem 
        name="include_middleware"
        signature="async include_middleware(middleware, kind='before', priority=0)"
        description="Registers a middleware into the execution pipeline."
        parameters={[
          { name: "middleware", type: "Callable", description: "The middleware function or class instance.", required: true },
          { name: "kind", type: "str", description: "Execution phase: 'before', 'after', or 'around'.", default: "'before'" },
          { name: "priority", type: "int", description: "Execution order (higher runs first).", default: "0" }
        ]}
        returns={{ type: "str", description: "A unique identifier for the registered middleware." }}
      />

      <ApiItem 
        name="include_router"
        signature="include_router(router)"
        description="Registers a modular router with the client. Handlers within the router become active immediately."
        parameters={[
            { name: "router", type: "Router", description: "The router instance to include.", required: true }
        ]}
      />

      <ApiItem 
        name="set_storage"
        signature="async set_storage(storage)"
        description="Configures the FSM storage backend for state persistence."
        parameters={[
            { name: "storage", type: "BaseStorage", description: "A storage implementation (e.g. MemoryStorage, RedisStorage).", required: true }
        ]}
      />

      <ApiItem 
        name="unpatch"
        signature="async unpatch()"
        description="Reverts the client to its original state, restoring the default dispatcher and clearing the pool."
      />

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Next API Reference</h2>
        <div class="flex gap-4">
            <A href="/api/router" class="text-primary-500 font-bold hover:underline">Router <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/middleware-manager" class="text-primary-500 font-bold hover:underline">MiddlewareManager <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
