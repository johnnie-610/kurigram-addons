import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function SQLiteStoragePage() {
  return (
    <Layout>
      <Title>SQLiteStorage — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">SQLiteStorage</h1>
        <p class="text-slate-400 mb-2">
          Persistent FSM storage with zero infrastructure.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Setup</h2>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, SQLiteStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=SQLiteStorage(<span class="str">"fsm.db"</span>),
)
app.run()`}
        />
        <p class="text-slate-500 text-xs mt-3">
          Requires the <code>aiosqlite</code> package:{" "}
          <code>pip install kurigram-addons[sqlite]</code>
        </p>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>path</code></td><td>str | Path</td><td>—</td>
                <td>Path to the SQLite database file</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>table</code></td><td>str</td><td>"fsm_state"</td>
                <td>Table name for state records</td>
              </tr>
              <tr>
                <td class="py-2"><code>cleanup_interval</code></td><td>int</td><td>300</td>
                <td>Seconds between TTL cleanup runs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Characteristics</h2>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>Survives bot restarts — state persists on disk.</li>
          <li><code>compare_and_set</code> is atomic via <code>BEGIN IMMEDIATE</code> transactions.</li>
          <li><code>increment()</code> is implemented as a single SQL <code>INSERT … ON CONFLICT … DO UPDATE</code>.</li>
          <li>No extra infrastructure — just a local file.</li>
          <li>Good for single-process bots. For multi-process deployments, use <a href="/pyrogram-patch/storage/redis" class="text-amber-400 hover:underline">RedisStorage</a>.</li>
        </ul>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Comparison</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr>
                <th class="py-2">Backend</th>
                <th>Persistent</th>
                <th>Multi-process</th>
                <th>Extra infra</th>
              </tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>MemoryStorage</code></td>
                <td>No</td><td>No</td><td>None</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>SQLiteStorage</code></td>
                <td>Yes</td><td>No</td><td>None</td>
              </tr>
              <tr>
                <td class="py-2"><code>RedisStorage</code></td>
                <td>Yes</td><td>Yes</td><td>Redis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
