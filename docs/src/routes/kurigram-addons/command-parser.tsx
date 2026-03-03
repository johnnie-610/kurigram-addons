import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function CommandParserPage() {
  return (
    <Layout>
      <Title>Command Parser — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Command Parser</h1>
        <p class="text-slate-400 mb-8">
          Typed argument parsing for <code>/command arg1 arg2</code> using shlex + type annotations.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Usage</h2>
        <CodeBlock
          title="commands.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> parse_command, CommandParseError, Router

router = Router()

<span class="dec">@router.on_command</span>(<span class="str">"ban"</span>)
<span class="kw">async def</span> <span class="fn">ban</span>(client, message):
    <span class="kw">try</span>:
        args = parse_command(message.text, user_id=<span class="fn">int</span>, reason=<span class="fn">str</span>)
        <span class="cmt"># /ban 12345 spamming</span>
        <span class="cmt"># → {"user_id": 12345, "reason": "spamming"}</span>
        <span class="kw">await</span> message.reply(<span class="str">f"Banned </span>{args[<span class="str">'user_id'</span>]}<span class="str">: </span>{args[<span class="str">'reason'</span>]}<span class="str">"</span>)
    <span class="kw">except</span> CommandParseError <span class="kw">as</span> e:
        <span class="kw">await</span> message.reply(<span class="str">f"Usage: /ban &lt;user_id&gt; &lt;reason&gt;\\n{e}"</span>)

<span class="dec">@router.on_command</span>(<span class="str">"greet"</span>)
<span class="kw">async def</span> <span class="fn">greet</span>(client, message):
    args = parse_command(message.text, name=<span class="fn">str</span>, age=<span class="fn">int</span>)
    <span class="cmt"># /greet John 25 → {"name": "John", "age": 25}</span>
    name = args.get(<span class="str">"name"</span>, <span class="str">"stranger"</span>)
    <span class="kw">await</span> message.reply(<span class="str">f"Hello, </span>{name}<span class="str">!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Supported Types</h2>
        <p class="text-slate-400 text-sm mb-3">Arguments are parsed from strings into the specified Python types:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Type</th><th>Parsing</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>int</code></td><td><code>int("123")</code> → 123</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>float</code></td><td><code>float("3.14")</code> → 3.14</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>str</code></td><td>Passed through as-is</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>bool</code></td><td><code>"true"</code>, <code>"1"</code>, <code>"yes"</code> → True</td></tr>
              <tr><td class="py-2"><code>Optional[T]</code> <span class="text-xs text-slate-500">v0.4.1</span></td><td>Same as inner type <code>T</code>, but returns <code>None</code> if missing</td></tr>
            </tbody>
          </table>
        </div>
        <p class="text-slate-400 text-xs mt-4">
          <strong>Note (v0.4.1):</strong> All type-hinted arguments are now <strong>required by default</strong>.
          If a required argument is missing, <code>CommandParseError</code> is raised (previously it returned an empty dict).
          Use <code>Optional[T]</code> to make a parameter truly optional.
        </p>
      </section>
    </Layout>
  );
}
