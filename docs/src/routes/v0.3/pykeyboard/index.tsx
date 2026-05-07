import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3InlineKeyboardPage() {
  return (
    <Layout>
      <Title>Inline Keyboard — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pykeyboard
        </div>
        <h1 class="text-3xl font-bold mb-2">Inline Keyboard</h1>
        <p class="text-slate-400 mb-8">
          Build Telegram inline keyboards with automatic row management.
          <code>InlineKeyboard</code> wraps a list of <code>InlineButton</code> rows
          and serialises to a <code>pyrogram.types.InlineKeyboardMarkup</code>.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.add(
    InlineButton(<span class="str">"Button 1"</span>, callback_data=<span class="str">"btn1"</span>),
    InlineButton(<span class="str">"Button 2"</span>, callback_data=<span class="str">"btn2"</span>),
    InlineButton(<span class="str">"Button 3"</span>, callback_data=<span class="str">"btn3"</span>),
)

<span class="kw">await</span> message.reply(<span class="str">"Pick one:"</span>, reply_markup=kb)`}
        />
        <p class="text-sm text-slate-500 mt-2">
          <code>row_width=2</code> means each row holds at most 2 buttons. The third
          button automatically wraps to the next row.
        </p>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">InlineButton Types</h2>
        <CodeBlock
          code={`<span class="cmt"># Callback data button</span>
InlineButton(<span class="str">"Click me"</span>, callback_data=<span class="str">"action:123"</span>)

<span class="cmt"># URL button</span>
InlineButton(<span class="str">"Open link"</span>, url=<span class="str">"https://example.com"</span>)

<span class="cmt"># Switch inline query</span>
InlineButton(<span class="str">"Search"</span>, switch_inline_query=<span class="str">"query"</span>)

<span class="cmt"># Switch inline in current chat</span>
InlineButton(<span class="str">"Search here"</span>, switch_inline_query_current_chat=<span class="str">""</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Row Control</h2>
        <CodeBlock
          code={`kb = InlineKeyboard()

<span class="cmt"># add() groups buttons in rows of row_width</span>
kb.add(btn1, btn2, btn3)

<span class="cmt"># row() forces each group to its own row</span>
kb.row(
    InlineButton(<span class="str">"Full-width"</span>, callback_data=<span class="str">"wide"</span>)
)

<span class="cmt"># Insert at specific row index</span>
kb.insert(InlineButton(<span class="str">"Inserted"</span>, callback_data=<span class="str">"ins"</span>), row=<span class="num">0</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Dynamic Keyboards</h2>
        <CodeBlock
          code={`items = [(<span class="str">"Apple"</span>, <span class="str">"fruit:apple"</span>), (<span class="str">"Banana"</span>, <span class="str">"fruit:banana"</span>), (<span class="str">"Cherry"</span>, <span class="str">"fruit:cherry"</span>)]

kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.add(*[InlineButton(label, callback_data=data) <span class="kw">for</span> label, data <span class="kw">in</span> items])
kb.row(InlineButton(<span class="str">"✗ Cancel"</span>, callback_data=<span class="str">"cancel"</span>))`}
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
              <tr class="border-b border-white/5"><td class="py-2"><code>add(*buttons)</code></td><td>Add buttons, wrapping at row_width</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>row(*buttons)</code></td><td>Add buttons on a dedicated row</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>insert(button, row)</code></td><td>Insert into a specific row index</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>keyboard</code></td><td>Property — returns raw 2D list</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
