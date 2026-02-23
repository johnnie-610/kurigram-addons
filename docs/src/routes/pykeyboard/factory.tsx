import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function FactoryPage() {
  return (
    <Layout>
      <Title>Factory Presets — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Factory Presets</h1>
        <p class="text-slate-400 mb-8">One-liner keyboard presets with <code>KeyboardFactory</code>. Create common keyboard patterns without manual button construction.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Available Presets</h2>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>confirmation(yes, no, pattern)</code></td><td>Two-button yes/no keyboard</td></tr>
            <tr><td><code>menu(items, pattern, row_width)</code></td><td>Grid menu from a list of labels</td></tr>
            <tr><td><code>rating(max_stars, pattern)</code></td><td>Star rating keyboard (⭐️ buttons)</td></tr>
            <tr><td><code>pagination(pages, current, pattern)</code></td><td>Pagination controls</td></tr>
            <tr><td><code>language(locales, pattern)</code></td><td>Language selection keyboard</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Examples</h2>
        <CodeBlock title="Confirmation dialog" code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> KeyboardFactory

kb = KeyboardFactory.confirmation(
    yes_text=<span class="str">"✅ Confirm"</span>,
    no_text=<span class="str">"❌ Cancel"</span>,
    callback_pattern=<span class="str">"confirm_{}"</span>,  <span class="cmt"># {} → "yes" or "no"</span>
)
<span class="kw">await</span> message.reply(<span class="str">"Are you sure?"</span>, reply_markup=kb)`} />

        <CodeBlock title="Star rating" code={`kb = KeyboardFactory.rating(
    max_stars=<span class="num">5</span>,
    callback_pattern=<span class="str">"rate_{}"</span>,  <span class="cmt"># {} → 1-5</span>
)
<span class="cmt"># Produces: [⭐] [⭐⭐] [⭐⭐⭐] [⭐⭐⭐⭐] [⭐⭐⭐⭐⭐]</span>`} />

        <CodeBlock title="Quick menu" code={`kb = KeyboardFactory.menu(
    items=[<span class="str">"Profile"</span>, <span class="str">"Settings"</span>, <span class="str">"Help"</span>, <span class="str">"About"</span>],
    callback_pattern=<span class="str">"menu_{}"</span>,
    row_width=<span class="num">2</span>,
)`} />
      </section>
    </Layout>
  );
}
