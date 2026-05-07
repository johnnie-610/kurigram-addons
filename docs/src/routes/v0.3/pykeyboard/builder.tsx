import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3BuilderPage() {
  return (
    <Layout>
      <Title>Builder API — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pykeyboard
        </div>
        <h1 class="text-3xl font-bold mb-2">Builder API</h1>
        <p class="text-slate-400 mb-8">
          The fluent builder interface lets you chain keyboard construction calls
          instead of calling <code>add()</code> separately.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Chaining</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

kb = (
    InlineKeyboard(row_width=<span class="num">2</span>)
    .add(InlineButton(<span class="str">"One"</span>,   callback_data=<span class="str">"1"</span>))
    .add(InlineButton(<span class="str">"Two"</span>,   callback_data=<span class="str">"2"</span>))
    .add(InlineButton(<span class="str">"Three"</span>, callback_data=<span class="str">"3"</span>))
    .row(InlineButton(<span class="str">"Cancel"</span>, callback_data=<span class="str">"cancel"</span>))
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Factory Pattern</h2>
        <CodeBlock
          code={`<span class="kw">def</span> <span class="fn">confirm_keyboard</span>(action: str) -> InlineKeyboard:
    <span class="kw">return</span> (
        InlineKeyboard()
        .row(
            InlineButton(<span class="str">"✓ Yes"</span>, callback_data=<span class="str">f"confirm:{action}"</span>),
            InlineButton(<span class="str">"✗ No"</span>,  callback_data=<span class="str">"cancel"</span>),
        )
    )

<span class="kw">await</span> message.reply(
    <span class="str">"Are you sure you want to delete this?"</span>,
    reply_markup=confirm_keyboard(<span class="str">"delete:42"</span>),
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Building from Data</h2>
        <CodeBlock
          code={`products = [
    {<span class="str">"id"</span>: <span class="num">1</span>, <span class="str">"name"</span>: <span class="str">"Apple"</span>},
    {<span class="str">"id"</span>: <span class="num">2</span>, <span class="str">"name"</span>: <span class="str">"Banana"</span>},
    {<span class="str">"id"</span>: <span class="num">3</span>, <span class="str">"name"</span>: <span class="str">"Cherry"</span>},
]

kb = InlineKeyboard(row_width=<span class="num">2</span>)
<span class="kw">for</span> p <span class="kw">in</span> products:
    kb.add(InlineButton(p[<span class="str">"name"</span>], callback_data=<span class="str">f"buy:{p['id']}"</span>))
kb.row(InlineButton(<span class="str">"← Back"</span>, callback_data=<span class="str">"back"</span>))`}
        />
      </section>
    </Layout>
  );
}
