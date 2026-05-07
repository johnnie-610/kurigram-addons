import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3HooksPage() {
  return (
    <Layout>
      <Title>Hooks & Validation — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pykeyboard
        </div>
        <h1 class="text-3xl font-bold mb-2">Hooks &amp; Validation</h1>
        <p class="text-slate-400 mb-8">
          pykeyboard validates callback data before sending to Telegram
          and exposes hooks to transform buttons at serialisation time.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Callback Data Limits</h2>
        <p class="text-slate-400 text-sm mb-4">
          Telegram enforces a 64-byte limit on <code>callback_data</code>. pykeyboard
          checks the UTF-8 byte length at construction time and raises
          <code>ValueError</code> for oversized data. In v0.3.x, truncation slices by
          character count (fixed in v0.5.0 to slice by bytes).
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineButton

<span class="cmt"># This raises ValueError — too long</span>
InlineButton(<span class="str">"X"</span>, callback_data=<span class="str">"a"</span> * <span class="num">65</span>)

<span class="cmt"># Safe — 12 bytes</span>
InlineButton(<span class="str">"X"</span>, callback_data=<span class="str">"action:12345"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Pre-send Hook</h2>
        <p class="text-slate-400 text-sm mb-4">
          Register a callable on the keyboard to transform every button before
          serialisation — useful for adding per-button tracking prefixes.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

kb = InlineKeyboard()
kb.add(InlineButton(<span class="str">"Pay"</span>, callback_data=<span class="str">"pay"</span>))

<span class="kw">def</span> <span class="fn">add_user_prefix</span>(button, user_id: int):
    <span class="kw">if</span> button.callback_data:
        button.callback_data = <span class="str">f"{user_id}:{button.callback_data}"</span>
    <span class="kw">return</span> button

<span class="cmt"># Apply before sending</span>
personalised = kb.apply(add_user_prefix, user_id=<span class="num">42</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Button Utilities</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> Button

<span class="cmt"># Generic Button — wraps InlineButton or ReplyButton</span>
btn = Button(<span class="str">"Click"</span>, callback_data=<span class="str">"click"</span>)   <span class="cmt"># → InlineButton</span>
btn = Button(<span class="str">"Reply"</span>, request_contact=<span class="num">True</span>)      <span class="cmt"># → ReplyButton</span>`}
        />
      </section>
    </Layout>
  );
}
