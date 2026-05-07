import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function FSMOverview() {
  return (
    <Layout>
      <Title>FSM Overview — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Finite State Machines</h1>
        <p class="text-slate-400 mb-8">Manage multi-step conversations with declarative states, transition guards, and pluggable storage backends.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Example</h2>
        <CodeBlock code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> State, StatesGroup, StateFilter
<span class="imp">from</span> pyrogram_patch.patch_helper <span class="imp">import</span> PatchHelper

<span class="kw">class</span> <span class="cls">Form</span>(StatesGroup):
    name = State()
    age = State()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"form"</span>))
<span class="kw">async def</span> <span class="fn">start_form</span>(client, message, patch_helper: PatchHelper):
    <span class="kw">await</span> patch_helper.set_state(Form.name)
    <span class="kw">await</span> message.reply(<span class="str">"What's your name?"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Form.name))
<span class="kw">async def</span> <span class="fn">get_name</span>(client, message, patch_helper: PatchHelper):
    <span class="kw">await</span> patch_helper.update_data(name=message.text)
    <span class="kw">await</span> patch_helper.set_state(Form.age)
    <span class="kw">await</span> message.reply(<span class="str">"How old are you?"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Form.age))
<span class="kw">async def</span> <span class="fn">get_age</span>(client, message, patch_helper: PatchHelper):
    data = <span class="kw">await</span> patch_helper.get_data()
    <span class="kw">await</span> patch_helper.finish()
    <span class="kw">await</span> message.reply(<span class="str">f"Name: </span>{data[<span class="str">'name'</span>]}<span class="str">, Age: </span>{message.text}<span class="str">"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Components</h2>
        <table>
          <thead><tr><th>Component</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>State</code> / <code>StatesGroup</code></td><td>Declarative state definitions with optional transition guards</td></tr>
            <tr><td><code>PatchHelper</code></td><td>Runtime API for get/set state and data</td></tr>
            <tr><td><code>StateFilter</code></td><td>Route updates to the correct state handler</td></tr>
            <tr><td><code>AnyStateFilter</code></td><td>Match any active state</td></tr>
            <tr><td><code>NoStateFilter</code></td><td>Match only when no state is set</td></tr>
            <tr><td><code>MemoryStorage</code></td><td>In-memory backend for development</td></tr>
            <tr><td><code>RedisStorage</code></td><td>Redis backend for production</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">PatchHelper FSM Methods</h2>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>set_state(state)</code></td><td>Transition to a new state</td></tr>
            <tr><td><code>get_state()</code></td><td>Get the current state</td></tr>
            <tr><td><code>update_data(**kwargs)</code></td><td>Merge data into the current state data</td></tr>
            <tr><td><code>get_data()</code></td><td>Retrieve all stored state data</td></tr>
            <tr><td><code>finish()</code></td><td>Clear state and data (end the FSM flow)</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
