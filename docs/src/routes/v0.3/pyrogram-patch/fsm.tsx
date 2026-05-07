import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3FsmPage() {
  return (
    <Layout>
      <Title>FSM & States — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">FSM &amp; States</h1>
        <p class="text-slate-400 mb-8">
          The Finite State Machine lets you guide users through multi-step flows.
          Define state groups, set/get state in handlers, and store arbitrary data
          alongside each state.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Defining States</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> StatesGroup, State

<span class="kw">class</span> <span class="fn">Registration</span>(StatesGroup):
    name  = State()
    email = State()
    phone = State()

<span class="cmt"># State names are &lt;Group&gt;:&lt;field&gt;</span>
<span class="cmt"># Registration.name  → "Registration:name"</span>
<span class="cmt"># Registration.email → "Registration:email"</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Using FSMContext in Handlers</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> FSMContext

<span class="dec">@router.on_command</span>(<span class="str">"register"</span>)
<span class="kw">async def</span> <span class="fn">start_registration</span>(client, message, state: FSMContext):
    <span class="kw">await</span> state.set_state(Registration.name)
    <span class="kw">await</span> message.reply(<span class="str">"Enter your name:"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Registration.name))
<span class="kw">async def</span> <span class="fn">got_name</span>(client, message, state: FSMContext):
    <span class="kw">await</span> state.update_data(name=message.text)
    <span class="kw">await</span> state.set_state(Registration.email)
    <span class="kw">await</span> message.reply(<span class="str">"Enter your email:"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Registration.email))
<span class="kw">async def</span> <span class="fn">got_email</span>(client, message, state: FSMContext):
    data = <span class="kw">await</span> state.get_data()
    <span class="kw">await</span> state.clear_state()
    <span class="kw">await</span> message.reply(
        <span class="str">f"Registered: </span>{data['name']}<span class="str"> &lt;</span>{message.text}<span class="str">&gt;"</span>
    )`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">StateFilter</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm.filters <span class="imp">import</span> StateFilter

<span class="cmt"># Match a specific state</span>
<span class="dec">@router.on_message</span>(StateFilter(Registration.name))
<span class="kw">async def</span> <span class="fn">handler</span>(client, message, state: FSMContext): ...

<span class="cmt"># Match any state in the group</span>
<span class="dec">@router.on_message</span>(StateFilter(Registration))
<span class="kw">async def</span> <span class="fn">any_reg_state</span>(client, message, state: FSMContext): ...

<span class="cmt"># Match no state (user is outside any flow)</span>
<span class="dec">@router.on_message</span>(StateFilter(state=None))
<span class="kw">async def</span> <span class="fn">no_state</span>(client, message, state: FSMContext): ...`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">FSMContext API</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>await set_state(state)</code></td><td>Set the current state</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await get_state()</code></td><td>Return current state string or None</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await clear_state()</code></td><td>Clear state and data</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await update_data(**kw)</code></td><td>Merge kwargs into stored data</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await get_data()</code></td><td>Return stored data dict</td></tr>
              <tr><td class="py-2"><code>await clear_data()</code></td><td>Clear stored data, keep state name</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
