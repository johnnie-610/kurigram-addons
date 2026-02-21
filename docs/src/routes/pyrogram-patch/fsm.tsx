import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";

export default function PatchFsmPage() {
  return (
    <div class="pb-20">
      <Title>FSM Engine Deep Dive - Pyrogram Patch</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        State Management
      </div>
      
      <h1>Finite State Machine</h1>
      
      <p class="lead text-xl">
        Manage complex, multi-step user interactions with context-aware state persistence. The FSM engine handles data isolation and automated dependency injection natively.
      </p>

      <h2>The FSM Architecture</h2>
      <p>
        A Finite State Machine restricts users so they can only trigger specific handlers if they are in a specific "state"—like answering a series of questions.
      </p>
      
      <ul>
        <li><strong>Isolation:</strong> States are strictly isolated per chat/user by default.</li>
        <li><strong>Filters:</strong> Built-in decorators route handlers based in O(1) time complexity.</li>
        <li><strong>Storage:</strong> Pluggable backends meaning you can use Memory in testing, and Redis in production without changing your logic.</li>
      </ul>

      <h2>Defining the Machine</h2>
      <p>
        States are organized into <code>StatesGroup</code> classes to prevent typos and provide a clean, namespaced way to manage related states. Using raw strings for states is highly discouraged.
      </p>

      <CodeBlock
          language="python"
          code={`from pyrogram_patch.fsm import StatesGroup, State

class OrderPizza(StatesGroup):
    choosing_size = State()
    adding_toppings = State()
    confirming = State()`}
      />

      <h3>State Guards (Transitions)</h3>
      <p>
        For strict flows, you can define valid transitions within your <code>StatesGroup</code> to prevent invalid state jumps (e.g., jumping straight from <code>choosing_size</code> to <code>confirming</code>). 
      </p>
      <p>
        If a transition is attempted that isn't in the <code>transitions</code> map, an <code>InvalidStateTransition</code> error is raised.
      </p>

      <CodeBlock 
          language="python"
          filename="states.py"
          code={`class Registration(StatesGroup):
    name = State()
    age = State()
    confirm = State()

    # Define strict valid transitions
    transitions = {
        name: [age],
        age: [confirm, name],  # User can proceed or go back
        confirm: []            # End state, nowhere to go
    }`}
      />
      
      <Callout type="warning" title="Enforcement Rule">
          Transition validation is only performed when passing typed <code>State</code> objects to <code>set_state()</code>. Using raw string names will bypass this guard.
      </Callout>

      <h2>Handling Data with FSMContext</h2>
      <p>
        The <code>FSMContext</code> is the primary interface for state interaction. Because the dispatcher tracks the user's state internally, it automatically injects this context object into any handler filtered by an FSM state.
      </p>

      <CodeBlock
          language="python"
          code={`@router.on_message(OrderPizza.choosing_size)
async def set_size(client, message, state):
    # 1. Save data persistently to the user's isolated session
    await state.update_data(size=message.text)
    
    # 2. Advance the state securely
    await state.set_state(OrderPizza.adding_toppings)
    
    # 3. Retrieve the current data payload
    data = await state.get_data()
    print(f"User is currently ordering: {data['size']}")`}
      />

      <h2>Storage Backends</h2>
      <p>
        By default, the FSM engine uses <code>MemoryStorage</code>, but the <code>PatchManager</code> makes it trivial to swap this out for a centralized database.
      </p>

      <h3>Memory Storage (Development)</h3>
      <p>Provides the fastest performance as everything acts directly on RAM. Data is lost upon bot restart. Perfect for development and small, non-critical flows.</p>
      
      <CodeBlock 
          language="python"
          code={`from pyrogram_patch.fsm.storages import MemoryStorage

storage = MemoryStorage()
await patch_manager.set_storage(storage)`}
      />

      <h3>Redis Storage (Production)</h3>
      <p>
        Enterprise-ready, high-performance persistent storage. Redis ensures that if your bot restarts or crashes, user conversations aren't interrupted. Furthermore, it supports multiple bot worker processes sharing the same exact state pool.
      </p>

      <CodeBlock 
          language="python"
          code={`from pyrogram_patch.fsm.storages import RedisStorage

# Traditional dictionary connection
storage = RedisStorage(host="localhost", port=6379, db=0)

# URI-based connection
storage = RedisStorage("redis://localhost:6379/0")

await patch_manager.set_storage(storage)`}
      />

      <br />
      <hr />

      <Callout type="info" title="Integration Note">
        Data serialization into Redis is handled seamlessly. However, ensure that any Python object you pass to <code>state.update_data()</code> can be easily dumped and loaded by <code>pickle</code> or <code>json</code>, as complex class instances might fail to serialize.
      </Callout>

    </div>
  );
}
