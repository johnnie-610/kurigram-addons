import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function BuilderPage() {
  return (
    <Layout>
      <Title>Builder API — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Builder API</h1>
        <p class="text-slate-400 mb-8">Fluent, chainable keyboard construction with <code>KeyboardBuilder</code>. Supports validation hooks, button transforms, and programmatic row control.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineButton, KeyboardBuilder

kb = (
    KeyboardBuilder()
    .add_button(InlineButton(text=<span class="str">"Home"</span>, callback_data=<span class="str">"home"</span>))
    .add_button(InlineButton(text=<span class="str">"Settings"</span>, callback_data=<span class="str">"settings"</span>))
    .new_row()
    .add_button(InlineButton(text=<span class="str">"Help"</span>, callback_data=<span class="str">"help"</span>))
    .build_inline()
)

<span class="kw">await</span> message.reply(<span class="str">"Menu:"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Methods</h2>
        <table>
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>add_button(button)</code></td><td><code>self</code></td><td>Add a button to the current row</td></tr>
            <tr><td><code>add_row(*buttons)</code></td><td><code>self</code></td><td>Add a complete row of buttons</td></tr>
            <tr><td><code>new_row()</code></td><td><code>self</code></td><td>Start a new row</td></tr>
            <tr><td><code>build_inline()</code></td><td><code>InlineKeyboard</code></td><td>Build as inline keyboard</td></tr>
            <tr><td><code>build_reply(**kwargs)</code></td><td><code>ReplyKeyboard</code></td><td>Build as reply keyboard</td></tr>
            <tr><td><code>add_pre_build_hook(fn)</code></td><td><code>self</code></td><td>Hook called before build</td></tr>
            <tr><td><code>add_post_build_hook(fn)</code></td><td><code>self</code></td><td>Hook called after build</td></tr>
            <tr><td><code>add_button_transform(fn)</code></td><td><code>self</code></td><td>Transform applied to each button on build</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Validation Hooks</h2>
        <CodeBlock code={`<span class="kw">def</span> <span class="fn">validate_no_empty</span>(builder):
    <span class="cmt">"""Reject keyboards with no buttons."""</span>
    <span class="kw">if</span> <span class="kw">not</span> builder.rows:
        <span class="kw">raise</span> ValueError(<span class="str">"Keyboard cannot be empty"</span>)

<span class="kw">def</span> <span class="fn">add_prefix</span>(button):
    <span class="cmt">"""Add emoji prefix to all buttons."""</span>
    button.text = <span class="str">"→ "</span> + button.text
    <span class="kw">return</span> button

kb = (
    KeyboardBuilder()
    .add_pre_build_hook(validate_no_empty)
    .add_button_transform(add_prefix)
    .add_button(InlineButton(text=<span class="str">"Click me"</span>, callback_data=<span class="str">"x"</span>))
    .build_inline()
)`} />
      </section>
    </Layout>
  );
}
