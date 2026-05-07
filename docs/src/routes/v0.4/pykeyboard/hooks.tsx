import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function HooksPage() {
  return (
    <Layout>
      <Title>Validation & Hooks — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Validation & Hooks</h1>
        <p class="text-slate-400 mb-8">Custom button validation rules with <code>ButtonValidator</code> and keyboard construction hooks with <code>KeyboardHookManager</code>.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Button Validation</h2>
        <p class="text-sm text-slate-400 mb-4">Register custom validation rules that run when buttons are added to a keyboard.</p>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard.hooks <span class="imp">import</span> ButtonValidator

validator = ButtonValidator()

<span class="cmt"># Rule: button text must be under 64 chars</span>
<span class="dec">@validator.rule</span>(<span class="str">"max_length"</span>)
<span class="kw">def</span> <span class="fn">check_length</span>(button):
    <span class="kw">if</span> <span class="fn">len</span>(button.text) \u003e <span class="num">64</span>:
        <span class="kw">return</span> <span class="num">False</span>, <span class="str">"Button text too long (max 64 chars)"</span>
    <span class="kw">return</span> <span class="num">True</span>, <span class="num">None</span>

<span class="cmt"># Rule: callback_data must not contain spaces</span>
<span class="dec">@validator.rule</span>(<span class="str">"no_spaces"</span>)
<span class="kw">def</span> <span class="fn">check_no_spaces</span>(button):
    <span class="kw">if</span> <span class="fn">hasattr</span>(button, <span class="str">"callback_data"</span>) <span class="kw">and</span> <span class="str">" "</span> <span class="kw">in</span> (button.callback_data <span class="kw">or</span> <span class="str">""</span>):
        <span class="kw">return</span> <span class="num">False</span>, <span class="str">"callback_data cannot contain spaces"</span>
    <span class="kw">return</span> <span class="num">True</span>, <span class="num">None</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Keyboard Hooks</h2>
        <p class="text-sm text-slate-400 mb-4">Hook into the keyboard construction lifecycle:</p>
        <table>
          <thead><tr><th>Hook Type</th><th>When</th><th>Use Case</th></tr></thead>
          <tbody>
            <tr><td><code>pre_build</code></td><td>Before keyboard is finalized</td><td>Validate row counts, add default buttons</td></tr>
            <tr><td><code>post_build</code></td><td>After keyboard is built</td><td>Logging, analytics, caching</td></tr>
            <tr><td><code>button_transform</code></td><td>On each button during build</td><td>Add prefixes, modify callback patterns</td></tr>
            <tr><td><code>error_hook</code></td><td>When validation fails</td><td>Error reporting, fallback keyboards</td></tr>
          </tbody>
        </table>
        <CodeBlock title="Hook manager example" code={`<span class="imp">from</span> pykeyboard.hooks <span class="imp">import</span> KeyboardHookManager

hooks = KeyboardHookManager()

<span class="dec">@hooks.pre_build</span>
<span class="kw">def</span> <span class="fn">add_back_button</span>(keyboard):
    <span class="cmt">"""Always add a back button as the last row."""</span>
    keyboard.row(InlineButton(text=<span class="str">"← Back"</span>, callback_data=<span class="str">"back"</span>))

<span class="dec">@hooks.error_hook</span>
<span class="kw">def</span> <span class="fn">on_error</span>(error, keyboard):
    <span class="fn">print</span>(<span class="str">f"Keyboard build failed: </span>{error}<span class="str">"</span>)`} />
      </section>
    </Layout>
  );
}
