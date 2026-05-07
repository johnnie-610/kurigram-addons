import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3ReplyKeyboardPage() {
  return (
    <Layout>
      <Title>Reply Keyboard — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pykeyboard
        </div>
        <h1 class="text-3xl font-bold mb-2">Reply Keyboard</h1>
        <p class="text-slate-400 mb-8">
          Build the keyboard that replaces the phone's native keyboard.
          <code>ReplyKeyboard</code> wraps rows of <code>ReplyButton</code> objects
          and serialises to <code>pyrogram.types.ReplyKeyboardMarkup</code>.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> ReplyKeyboard, ReplyButton

kb = ReplyKeyboard(row_width=<span class="num">2</span>, resize_keyboard=<span class="num">True</span>)
kb.add(
    ReplyButton(<span class="str">"📊 Stats"</span>),
    ReplyButton(<span class="str">"⚙️ Settings"</span>),
    ReplyButton(<span class="str">"❓ Help"</span>),
)

<span class="kw">await</span> message.reply(<span class="str">"Choose:"</span>, reply_markup=kb)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Special Buttons</h2>
        <CodeBlock
          code={`<span class="cmt"># Request phone number</span>
ReplyButton(<span class="str">"Share phone"</span>, request_contact=<span class="num">True</span>)

<span class="cmt"># Request location</span>
ReplyButton(<span class="str">"Share location"</span>, request_location=<span class="num">True</span>)

<span class="cmt"># Request a poll</span>
ReplyButton(<span class="str">"Create poll"</span>, request_poll=True)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">ReplyKeyboard Options</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>row_width</code></td><td>int</td><td>3</td><td>Max buttons per row</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>resize_keyboard</code></td><td>bool</td><td>False</td><td>Resize to fit buttons</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>one_time_keyboard</code></td><td>bool</td><td>False</td><td>Hide after first tap</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>selective</code></td><td>bool</td><td>False</td><td>Show to mentioned users only</td></tr>
              <tr><td class="py-2"><code>input_field_placeholder</code></td><td>str</td><td>None</td><td>Placeholder in the input field</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Removing the Keyboard</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram.types <span class="imp">import</span> ReplyKeyboardRemove

<span class="kw">await</span> message.reply(<span class="str">"Keyboard removed."</span>, reply_markup=ReplyKeyboardRemove())`}
        />
      </section>
    </Layout>
  );
}
