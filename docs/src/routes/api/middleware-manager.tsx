import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Layers, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function MiddlewareManagerApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>MiddlewareManager API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Layers size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          MiddlewareManager
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The internal engine for execution control. <code>MiddlewareManager</code> manages the registration, sorting, and execution of the tri-phase execution pipeline.
        </p>
      </section>

      {/* Methods */}
      <ApiItem 
        name="add_before"
        signature="async add_before(fn, priority=0, mid=None, timeout=None)"
        description="Registers a hook to run before the event handler."
        parameters={[
          { name: "fn", type: "AsyncCallable", description: "Function(update, client, helper).", required: true },
          { name: "priority", type: "int", description: "Execution order.", default: "0" }
        ]}
        example={`await mw_manager.add_before(my_auth_check, priority=50)`}
      />

      <ApiItem 
        name="add_around"
        signature="async add_around(fn, priority=0, mid=None, timeout=None)"
        description="Registers a wrapper around the event handler."
        parameters={[
          { name: "fn", type: "AsyncCallable", description: "Function(handler, update, client, helper).", required: true }
        ]}
        example={`async def my_wrapper(handler, update):\n    print("Before")\n    res = await handler()\n    print("After")\n    return res\n\nawait mw_manager.add_around(my_wrapper)`}
      />

      <ApiItem 
        name="fire_event"
        signature="async fire_event(event, *args, **kwargs)"
        description="Triggers lifecycle events ('startup', 'shutdown') for all registered listeners."
        parameters={[
            { name: "event", type: "str", description: "Event name.", required: true }
        ]}
        example={`await mw_manager.fire_event("startup", db_pool=pool)`}
      />

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Related API Docs</h2>
        <div class="flex gap-4">
            <A href="/api/patch-manager" class="text-primary-500 font-bold hover:underline">PatchManager <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/router" class="text-primary-500 font-bold hover:underline">Router <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
