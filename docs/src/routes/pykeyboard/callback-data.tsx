import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function CallbackDataPage() {
  return (
    <Layout>
      <Title>CallbackData — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">CallbackData</h1>
        <p class="text-slate-400 mb-2">
          Strongly-typed, versioned callback data — no more raw strings.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Defining a payload</h2>
        <CodeBlock
          title="callbacks.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> CallbackData

<span class="kw">class</span> <span class="fn">Page</span>(CallbackData, prefix=<span class="str">"pg"</span>):
    num:   <span class="fn">int</span>
    total: <span class="fn">int</span>

<span class="kw">class</span> <span class="fn">Action</span>(CallbackData, prefix=<span class="str">"act"</span>):
    name: <span class="fn">str</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Building buttons</h2>
        <CodeBlock
          title="keyboards.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> InlineKeyboard

kb = InlineKeyboard(row_width=<span class="num">2</span>)

<span class="cmt"># .button(text) returns an InlineButton with callback_data already packed</span>
<span class="kw">for</span> i <span class="kw">in</span> range(<span class="num">1</span>, <span class="num">6</span>):
    kb.add(Page(num=i, total=<span class="num">5</span>).button(<span class="str">f"Page </span><span class="num">{i}</span><span class="str">"</span>))

<span class="cmt"># Page(num=3, total=5).button("Page 3").callback_data == "pg:3:5"</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Decoding in handlers</h2>
        <CodeBlock
          title="handlers.py"
          code={`<span class="dec">@router.on_callback_query</span>(Page.filter())
<span class="kw">async def</span> <span class="fn">any_page</span>(client, query):
    obj = Page.unpack(query.data)
    <span class="kw">await</span> query.answer(<span class="str">f"Page </span><span class="num">{obj.num}</span><span class="str"> of </span><span class="num">{obj.total}</span><span class="str">"</span>)

<span class="cmt"># Filter for a specific field value</span>
<span class="dec">@router.on_callback_query</span>(Page.filter(num=<span class="num">1</span>))
<span class="kw">async def</span> <span class="fn">first_page</span>(client, query):
    <span class="kw">await</span> query.answer(<span class="str">"That's the first page!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Supported field types</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Fields are colon-separated in the encoded string. Supported types:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Python type</th><th>Encoding example</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>str</code></td><td><code>"hello"</code></td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>int</code></td><td><code>"42"</code></td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>float</code></td><td><code>"3.14"</code></td></tr>
              <tr><td class="py-2"><code>bool</code></td><td><code>"1"</code> / <code>"0"</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-slate-500 text-xs mt-3">
          <code>pack()</code> raises <code>ValueError</code> if the encoded string exceeds Telegram's 64-byte limit.
        </p>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">API reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>instance.button(text)</code></td><td>Returns an <code>InlineButton</code> with packed callback data</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>instance.pack()</code></td><td>Returns the raw encoded string</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>Class.unpack(data)</code></td><td>Decode a raw string back to an instance</td></tr>
              <tr><td class="py-2"><code>Class.filter(**kwargs)</code></td><td>Returns a Pyrogram filter (optionally match specific field values)</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
