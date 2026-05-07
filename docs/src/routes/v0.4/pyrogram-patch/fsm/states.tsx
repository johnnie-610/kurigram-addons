import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function FSMStatesPage() {
  return (
    <Layout>
      <Title>States & Transitions — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">States & Transitions</h1>
        <p class="text-slate-400 mb-8">Define FSM states with <code>State</code> and <code>StatesGroup</code>, and optionally enforce allowed transitions using state guards.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Defining States</h2>
        <CodeBlock title="states.py" code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> State, StatesGroup

<span class="kw">class</span> <span class="cls">Registration</span>(StatesGroup):
    waiting_for_name = State()
    waiting_for_email = State()
    waiting_for_confirm = State()

<span class="cmt"># States auto-assign group name</span>
<span class="fn">print</span>(Registration.waiting_for_name)  <span class="cmt"># "Registration:waiting_for_name"</span>`} />
        <p class="text-sm text-slate-400 mt-3">
          Each <code>State()</code> declared inside a <code>StatesGroup</code> automatically gets its
          name set to the attribute name and its group set to the class name (via metaclass).
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">
          State Guards <span class="badge badge-optional ml-2">Optional</span>
        </h2>
        <p class="text-sm text-slate-400 mb-4">
          You can enforce valid transitions by defining a <code>transitions</code> dict in your <code>StatesGroup</code>.
          If a handler tries to transition to a state not in the allowed list, an <code>InvalidStateTransition</code> error is raised.
        </p>
        <CodeBlock title="With state guards" code={`<span class="kw">class</span> <span class="cls">OrderFlow</span>(StatesGroup):
    cart = State()
    checkout = State()
    payment = State()
    complete = State()

    <span class="cmt"># State guards: define allowed transitions</span>
    transitions = {
        cart: [checkout],            <span class="cmt"># cart → checkout only</span>
        checkout: [payment, cart],   <span class="cmt"># checkout → payment or back to cart</span>
        payment: [complete],         <span class="cmt"># payment → complete only</span>
        complete: [],                <span class="cmt"># complete is a terminal state</span>
    }

<span class="cmt"># Valid: cart → checkout</span>
<span class="kw">await</span> patch_helper.set_state(OrderFlow.checkout)  <span class="cmt"># ✅ OK</span>

<span class="cmt"># Invalid: cart → payment (not allowed)</span>
<span class="kw">await</span> patch_helper.set_state(OrderFlow.payment)  <span class="cmt"># ❌ InvalidStateTransition</span>`} />
        <div class="mt-4 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
          <p class="text-sm text-amber-300">
            <strong>Note:</strong> State guards are entirely optional. If you don't define a <code>transitions</code> dict,
            any state can transition to any other state. Guards are useful for complex flows where
            you want to prevent invalid jumps (e.g., skipping payment in an order flow).
          </p>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Iterating States</h2>
        <CodeBlock code={`<span class="cmt"># Iterate over all states in a group</span>
<span class="kw">for</span> state <span class="kw">in</span> Registration:
    <span class="fn">print</span>(state)
<span class="cmt"># Registration:waiting_for_name</span>
<span class="cmt"># Registration:waiting_for_email</span>
<span class="cmt"># Registration:waiting_for_confirm</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">State Comparison</h2>
        <CodeBlock code={`<span class="cmt"># States support equality with other States and strings</span>
Registration.waiting_for_name == Registration.waiting_for_name  <span class="cmt"># True</span>
Registration.waiting_for_name == <span class="str">"Registration:waiting_for_name"</span>  <span class="cmt"># True</span>

<span class="cmt"># States are hashable (usable as dict keys)</span>
handlers = {Registration.waiting_for_name: handle_name}`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">API Reference</h2>
        <h3 class="text-lg font-semibold mb-3 text-white">State</h3>
        <table>
          <thead><tr><th>Property / Method</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>name</code></td><td><code>str</code></td><td>Full qualified name (e.g., <code>"Group:state_name"</code>)</td></tr>
            <tr><td><code>__eq__(other)</code></td><td><code>bool</code></td><td>Compare with another State or string</td></tr>
            <tr><td><code>__hash__()</code></td><td><code>int</code></td><td>Hash based on qualified name</td></tr>
          </tbody>
        </table>

        <h3 class="text-lg font-semibold mb-3 mt-6 text-white">StatesGroup</h3>
        <table>
          <thead><tr><th>Feature</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Class-level <code>State()</code> attributes</td><td>Auto-assigned names and group reference</td></tr>
            <tr><td><code>transitions</code> dict <span class="badge badge-optional">Optional</span></td><td>Map of state → list of allowed target states</td></tr>
            <tr><td>Iteration</td><td>Iterate over all states: <code>for s in MyGroup: ...</code></td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
