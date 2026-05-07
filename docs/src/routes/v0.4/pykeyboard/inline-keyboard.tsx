import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function InlineKeyboardPage() {
  return (
    <Layout>
      <Title>Inline Keyboard — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Inline Keyboard</h1>
        <p class="text-slate-400 mb-8">Build inline keyboards with automatic row layout, callback data, URL buttons, and Pyrogram integration.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock title="Creating an inline keyboard" code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

<span class="cmt"># Create with 2 buttons per row</span>
kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.add(
    InlineButton(text=<span class="str">"✅ Yes"</span>, callback_data=<span class="str">"confirm"</span>),
    InlineButton(text=<span class="str">"❌ No"</span>, callback_data=<span class="str">"cancel"</span>),
    InlineButton(text=<span class="str">"ℹ️ Info"</span>, callback_data=<span class="str">"info"</span>),
)
<span class="cmt"># Layout: [Yes][No]</span>
<span class="cmt">#         [Info]</span>

<span class="kw">await</span> message.reply(<span class="str">"Confirm?"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>row_width</code></td><td><code>int</code></td><td><code>3</code></td><td>Max buttons per row (1–8)</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Button Types</h2>
        <p class="text-sm text-slate-400 mb-4">Each <code>InlineButton</code> can be one of several types. Only one action parameter should be set per button.</p>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>text</code></td><td><code>str</code></td><td>Button label (required, non-empty)</td></tr>
            <tr><td><code>callback_data</code></td><td><code>str</code></td><td>Data sent to callback query handler</td></tr>
            <tr><td><code>url</code></td><td><code>str</code></td><td>URL to open when tapped</td></tr>
            <tr><td><code>web_app</code></td><td><code>WebAppInfo</code></td><td>Web App to open</td></tr>
            <tr><td><code>login_url</code></td><td><code>LoginUrl</code></td><td>Login URL for seamless auth</td></tr>
            <tr><td><code>switch_inline_query</code></td><td><code>str</code></td><td>Switch to inline mode in current chat</td></tr>
            <tr><td><code>switch_inline_query_current_chat</code></td><td><code>str</code></td><td>Switch to inline in same chat</td></tr>
            <tr><td><code>pay</code></td><td><code>bool</code></td><td>Payment button (first button only)</td></tr>
            <tr><td><code>copy_text</code></td><td><code>str</code></td><td>Text to copy to clipboard</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">URL Buttons</h2>
        <CodeBlock code={`kb = InlineKeyboard()
kb.add(
    InlineButton(text=<span class="str">"📖 Documentation"</span>, url=<span class="str">"https://example.com/docs"</span>),
    InlineButton(text=<span class="str">"💻 GitHub"</span>, url=<span class="str">"https://github.com/example"</span>),
)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Serialization</h2>
        <p class="text-sm text-slate-400 mb-4">Inline keyboards can be serialized to JSON and restored — useful for caching or database storage.</p>
        <CodeBlock code={`<span class="cmt"># Serialize</span>
json_str = kb.to_json()

<span class="cmt"># Deserialize</span>
restored = InlineKeyboard.from_json(json_str)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Methods</h2>
        <table>
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>add(*buttons)</code></td><td><code>self</code></td><td>Add buttons, auto-wrapping into rows</td></tr>
            <tr><td><code>row(*buttons)</code></td><td><code>self</code></td><td>Add a single row of buttons (ignoring row_width)</td></tr>
            <tr><td><code>paginate(...)</code></td><td><code>self</code></td><td>Add pagination controls (see Pagination page)</td></tr>
            <tr><td><code>languages(...)</code></td><td><code>self</code></td><td>Add language selection buttons (see Languages page)</td></tr>
            <tr><td><code>to_json()</code></td><td><code>str</code></td><td>Serialize keyboard to JSON string</td></tr>
            <tr><td><code>from_json(data)</code></td><td><code>InlineKeyboard</code></td><td>Class method: restore from JSON</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
