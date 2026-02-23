import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Memory Storage — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Memory Storage</h1>
        <p class="text-slate-400 mb-8">In-memory FSM backend for development and testing. Data is lost on restart.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Usage</h2>
        <CodeBlock code={`from pyrogram_patch.fsm import MemoryStorage

storage = MemoryStorage()
manager.set_storage(storage)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">When to Use</h2>
        <table>
          <thead><tr><th>Scenario</th><th>Recommended</th></tr></thead>
          <tbody>
            <tr><td>Local development</td><td>✅ MemoryStorage</td></tr>
            <tr><td>Testing</td><td>✅ MemoryStorage</td></tr>
            <tr><td>Single-process production</td><td>⚠️ Acceptable if data loss is OK</td></tr>
            <tr><td>Multi-process / HA production</td><td>❌ Use RedisStorage</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Behavior</h2>
        <p class="text-sm text-slate-400">MemoryStorage uses a simple <code>dict</code> keyed by <code>(chat_id, user_id)</code>. It implements the <code>BaseStorage</code> interface with no external dependencies. All operations are O(1).</p>
      </section>
    </Layout>
  );
}
