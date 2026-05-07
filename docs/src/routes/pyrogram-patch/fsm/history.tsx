import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function FSMHistoryPage() {
  return (
    <Layout>
      <Title>FSM History — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">FSM History</h1>
        <p class="text-slate-400 mb-8">
          State transition audit log stored as a ring-buffer in FSM storage.
          Useful for debugging, analytics, and undo/back navigation.
          Added in v0.5.0.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Recording Transitions</h2>
        <p class="text-slate-400 text-sm mb-4">
          Call <code>push_history()</code> whenever you transition to a new state.
          Each entry stores the state name and a Unix timestamp.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> FSMContext, StatesGroup, State

<span class="kw">class</span> <span class="fn">OrderFlow</span>(StatesGroup):
    cart     = State()
    checkout = State()
    payment  = State()
    done     = State()

<span class="dec">@router.on_command</span>(<span class="str">"start_order"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message, state: FSMContext):
    <span class="kw">await</span> state.set_state(OrderFlow.cart)
    <span class="kw">await</span> state.push_history(<span class="str">"OrderFlow:cart"</span>)
    <span class="kw">await</span> message.reply(<span class="str">"Cart ready."</span>)

<span class="dec">@router.on_callback_query</span>(OrderFlow.checkout.filter())
<span class="kw">async def</span> <span class="fn">go_checkout</span>(client, query, state: FSMContext):
    <span class="kw">await</span> state.set_state(OrderFlow.checkout)
    <span class="kw">await</span> state.push_history(str(OrderFlow.checkout))
    <span class="kw">await</span> query.answer()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Reading History</h2>
        <CodeBlock
          code={`<span class="dec">@router.on_command</span>(<span class="str">"history"</span>)
<span class="kw">async def</span> <span class="fn">show_history</span>(client, message, state: FSMContext):
    entries = <span class="kw">await</span> state.get_history(limit=<span class="num">5</span>)

    lines = []
    <span class="kw">for</span> e <span class="kw">in</span> entries:
        <span class="imp">import</span> datetime
        ts = datetime.datetime.fromtimestamp(e[<span class="str">"at"</span>]).strftime(<span class="str">"%H:%M:%S"</span>)
        lines.append(<span class="str">f"{ts} → {e['state']}"</span>)

    <span class="kw">await</span> message.reply(<span class="str">"\\n"</span>.join(lines) <span class="kw">or</span> <span class="str">"No history."</span>)`}
        />
        <p class="text-slate-400 text-sm mt-2">
          Entries are returned newest-last. The ring-buffer caps at <strong>50 entries</strong>
          — older entries are dropped automatically.
        </p>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Back Navigation</h2>
        <p class="text-slate-400 text-sm mb-4">
          Use history to implement a "go back" button by reading the previous state
          from the log and transitioning back to it.
        </p>
        <CodeBlock
          code={`<span class="dec">@router.on_callback_query</span>(filters.regex(<span class="str">r"^back$"</span>))
<span class="kw">async def</span> <span class="fn">go_back</span>(client, query, state: FSMContext):
    entries = <span class="kw">await</span> state.get_history(limit=<span class="num">2</span>)
    <span class="kw">if</span> len(entries) < <span class="num">2</span>:
        <span class="kw">await</span> query.answer(<span class="str">"Nothing to go back to."</span>)
        <span class="kw">return</span>
    prev_state = entries[-<span class="num">2</span>][<span class="str">"state"</span>]   <span class="cmt"># entry before current</span>
    <span class="kw">await</span> state.set_state(prev_state)
    <span class="kw">await</span> query.answer(f"Back to {prev_state}")`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Clearing History</h2>
        <CodeBlock
          code={`<span class="cmt"># Clear only history (state & data are unaffected)</span>
<span class="kw">await</span> state.clear_history()

<span class="cmt"># Or clear everything at end of flow</span>
<span class="kw">await</span> state.clear_state()
<span class="kw">await</span> state.clear_history()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">API Reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>await push_history(state_name, *, ttl=None)</code></td><td>Append state_name + current timestamp to the ring-buffer</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await get_history(limit=10)</code></td><td>Return up to <em>limit</em> most recent entries as <code>[{"{"}"state": str, "at": float{"}"}]</code>, newest last</td></tr>
              <tr><td class="py-2"><code>await clear_history()</code></td><td>Delete the entire history for this identifier</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-slate-400 text-sm mt-4">
          History is stored under a separate key (<code>identifier + "__history__"</code>)
          so it never interferes with state or data.
        </p>
      </section>
    </Layout>
  );
}
