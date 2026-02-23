import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function UtilitiesPage() {
  return (
    <Layout>
      <Title>Utilities — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Utilities</h1>
        <p class="text-slate-400 mb-8">Config-driven keyboard creation, introspection, and validation helpers.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Config-Driven Keyboards</h2>
        <p class="text-sm text-slate-400 mb-4">Create keyboards from dictionaries or JSON — useful for dynamic UIs stored in databases or config files.</p>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard.utils <span class="imp">import</span> create_keyboard_from_config

config = {
    <span class="str">"type"</span>: <span class="str">"inline"</span>,
    <span class="str">"row_width"</span>: <span class="num">2</span>,
    <span class="str">"buttons"</span>: [
        {<span class="str">"text"</span>: <span class="str">"Option A"</span>, <span class="str">"callback_data"</span>: <span class="str">"a"</span>},
        {<span class="str">"text"</span>: <span class="str">"Option B"</span>, <span class="str">"callback_data"</span>: <span class="str">"b"</span>},
        {<span class="str">"text"</span>: <span class="str">"🔗 Link"</span>, <span class="str">"url"</span>: <span class="str">"https://example.com"</span>},
    ]
}

kb = create_keyboard_from_config(config)
<span class="kw">await</span> message.reply(<span class="str">"Dynamic:"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Introspection</h2>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard.utils <span class="imp">import</span> get_keyboard_info

info = get_keyboard_info(kb)
<span class="fn">print</span>(info)
<span class="cmt"># {'type': 'inline', 'rows': 2, 'buttons': 3, 'row_width': 2}</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Validation</h2>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard.utils <span class="imp">import</span> validate_keyboard_config

errors = validate_keyboard_config(config)
<span class="kw">if</span> errors:
    <span class="fn">print</span>(<span class="str">"Config errors:"</span>, errors)
<span class="kw">else</span>:
    <span class="fn">print</span>(<span class="str">"Config is valid!"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Functions</h2>
        <table>
          <thead><tr><th>Function</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>create_keyboard_from_config(config)</code></td><td>Keyboard</td><td>Build keyboard from dict/JSON config</td></tr>
            <tr><td><code>get_keyboard_info(keyboard)</code></td><td><code>dict</code></td><td>Get metadata about a keyboard instance</td></tr>
            <tr><td><code>validate_keyboard_config(config)</code></td><td><code>list</code></td><td>Validate config dict, returns error list</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
