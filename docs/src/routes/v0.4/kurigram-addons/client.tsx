import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function ClientPage() {
  return (
    <Layout>
      <Title>KurigramClient — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">KurigramClient</h1>
        <p class="text-slate-400 mb-8">
          Drop-in <code>pyrogram.Client</code> subclass with built-in middleware, FSM, routing, and FloodWait handling.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, Router, MemoryStorage

router = Router()

<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Hello!"</span>)

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
    auto_flood_wait=<span class="num">True</span>,
    max_flood_wait=<span class="num">60</span>,
)
app.include_router(router)
app.run()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>name</code></td><td>str</td><td>—</td><td>Session name</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>storage</code></td><td>BaseStorage</td><td>None</td><td>FSM storage backend</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>auto_flood_wait</code></td><td>bool</td><td>False</td><td>Auto-retry on FloodWait</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>max_flood_wait</code></td><td>int</td><td>60</td><td>Max wait seconds</td></tr>
              <tr><td class="py-2"><code>**kwargs</code></td><td>Any</td><td>—</td><td>Forwarded to pyrogram.Client</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Methods</h2>

        <h3 class="text-lg font-medium mb-2 text-teal-400">include_router(router)</h3>
        <p class="text-slate-400 mb-4 text-sm">Register a Router. Can be called before or after <code>start()</code>.</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">include_conversation(cls)</h3>
        <p class="text-slate-400 mb-4 text-sm">Register a <code>Conversation</code> subclass and auto-register its handlers.</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">include_menus(*menus)</h3>
        <p class="text-slate-400 mb-4 text-sm">Register Menu instances for callback routing.</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">include_middleware(mw, kind, priority)</h3>
        <p class="text-slate-400 mb-4 text-sm">Register middleware (must be called after <code>start()</code>).</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">set_storage(storage)</h3>
        <p class="text-slate-400 mb-4 text-sm">Set or replace the FSM storage backend.</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">on_startup(func) <span class="text-xs text-slate-500">v0.4.1</span></h3>
        <p class="text-slate-400 mb-4 text-sm">Decorator. Register an async callback to run after <code>start()</code>. See <a href="/v0.4/kurigram-addons/lifecycle-hooks" class="text-amber-400 hover:underline">Lifecycle Hooks</a>.</p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">on_shutdown(func) <span class="text-xs text-slate-500">v0.4.1</span></h3>
        <p class="text-slate-400 mb-4 text-sm">Decorator. Register an async callback to run before <code>stop()</code>. See <a href="/v0.4/kurigram-addons/lifecycle-hooks" class="text-amber-400 hover:underline">Lifecycle Hooks</a>.</p>
      </section>
    </Layout>
  );
}
