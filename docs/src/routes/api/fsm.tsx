import { Title } from "@solidjs/meta";
import ApiItem from "../../components/ApiItem";
import { Box, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";
import Callout from "../../components/Callout";

export default function FsmApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>FSM API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4 mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase">
          <Box size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight">
          FSM Context & States
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
          Complete API reference for state management and transition guards in Pyrogram Patch.
        </p>
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight text-gradient-primary">StatesGroup</h2>
        <p class="mb-6 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          The base class for grouping related states. It uses a metaclass to automatically register its <code>State</code> attributes.
        </p>
        
        <ApiItem 
          name="transitions"
          signature="transitions: Dict[State, List[State]]"
          description="A mapping of valid state transitions. If defined, the FSM will enforce these rules."
        />

        <Callout type="note">
          States within a group are represented as <code>GroupName:StateName</code> strings when stored in the database.
        </Callout>
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight text-gradient-primary">FSMContext API</h2>
        <p class="mb-6 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
           The primary interface for interacting with the FSM. 
           It is typically accessed via <code>patch_helper.fsm</code> or injected into handlers.
        </p>

        <ApiItem 
          name="set_state"
          signature="async set_state(state: Union[str, State], ttl: Optional[int] = None) -> None"
          description="Sets the current state for the context identifier."
          parameters={[
            { name: "state", type: "Union[str, State]", description: "The state to set. Using State objects enables transition validation.", required: true },
            { name: "ttl", type: "int", description: "Optional time-to-live in seconds for this state." }
          ]}
          raises={[{ name: "InvalidStateTransition", description: "Raised if transition validation fails." }]}
        />

        <ApiItem 
          name="get_state"
          signature="async get_state()"
          description="Retrieves the current state ID string."
          returns={{ type: "str | None", description: "Current state name or None." }}
        />

        <ApiItem 
          name="update_data"
          signature="async update_data(**kwargs)"
          description="Merges new data into the existing context storage."
          parameters={[
              { name: "**kwargs", type: "Any", description: "Key-value pairs to store." }
          ]}
        />

        <ApiItem 
          name="finish"
          signature="async finish()"
          description="Clears both state and data for the current context."
        />
      </section>

      <div class="pt-10 border-t border-slate-200 dark:border-tokio-border">
          <h2 class="text-3xl font-black mb-8 tracking-tight">Metadata Classes</h2>
          
          <ApiItem 
            name="StatesGroup"
            signature="class MyFlow(StatesGroup): ..."
            description="Metaclass-driven container for State objects. Namespaces your states automatically."
          />

          <ApiItem 
            name="State"
            signature="state_name = State()"
            description="Represents a unique point in your finite state machine."
          />
      </div>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Core API Reference</h2>
        <div class="flex gap-4 text-primary-500 font-bold">
            <A href="/api/patch-manager" class="hover:underline">PatchManager <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/router" class="hover:underline">Router <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
