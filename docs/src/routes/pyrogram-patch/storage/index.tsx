import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function StorageOverview() {
  return (
    <Layout>
      <Title>Storage Backends — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Storage Backends</h1>
        <p class="text-slate-400 mb-8">Pluggable storage for FSM state persistence. Choose between in-memory for development, Redis for production, or implement your own.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Choosing a Backend</h2>
        <table>
          <thead><tr><th>Backend</th><th>Persistence</th><th>Distributed</th><th>Best For</th></tr></thead>
          <tbody>
            <tr><td><code>MemoryStorage</code></td><td>❌ In-process only</td><td>❌ Single instance</td><td>Development, testing, small bots</td></tr>
            <tr><td><code>RedisStorage</code></td><td>✅ Survives restarts</td><td>✅ Multi-instance</td><td>Production, distributed bots</td></tr>
            <tr><td>Custom</td><td>You decide</td><td>You decide</td><td>Specialized requirements</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">BaseStorage Interface</h2>
        <p class="text-sm text-slate-400 mb-4">All storage backends implement this abstract interface:</p>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>set_state(id, state, ttl=None)</code></td><td>Store state data with optional TTL</td></tr>
            <tr><td><code>get_state(id)</code></td><td>Retrieve state data by identifier</td></tr>
            <tr><td><code>delete_state(id)</code></td><td>Remove state data</td></tr>
            <tr><td><code>compare_and_set(id, new, expected, ttl)</code></td><td>Atomic compare-and-swap for concurrency safety</td></tr>
            <tr><td><code>list_keys(pattern)</code></td><td>List all keys matching a glob pattern</td></tr>
            <tr><td><code>clear_namespace()</code></td><td>Remove all keys in the storage namespace</td></tr>
            <tr><td><code>start() / stop()</code></td><td>Lifecycle hooks for connection management</td></tr>
            <tr><td><code>health()</code></td><td>Health check returning <code>True</code> if storage is operational</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Setup</h2>
        <CodeBlock title="Memory (development)" code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> MemoryStorage

manager = <span class="kw">await</span> patch(app)
manager.set_storage(MemoryStorage(default_ttl=<span class="num">3600</span>))  <span class="cmt"># 1h TTL</span>`} />

        <CodeBlock title="Redis (production)" code={`<span class="imp">import</span> redis.asyncio <span class="kw">as</span> redis
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> RedisStorage

redis_client = redis.Redis(host=<span class="str">"localhost"</span>, port=<span class="num">6379</span>)
manager = <span class="kw">await</span> patch(app)
manager.set_storage(RedisStorage(redis_client, prefix=<span class="str">"mybot:"</span>))`} />
      </section>
    </Layout>
  );
}
