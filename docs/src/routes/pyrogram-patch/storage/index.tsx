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
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Backend</th><th>Persistence</th><th>Distributed</th><th>Extra dep</th><th>Best For</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>MemoryStorage</code></td><td>❌ In-process</td><td>❌</td><td>none</td><td>Development, testing</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>SQLiteStorage</code> <span class="text-xs text-amber-300">v0.5</span></td><td>✅ File on disk</td><td>❌</td><td>aiosqlite</td><td>Single-process bots that need persistence</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>RedisStorage</code></td><td>✅ Survives restart</td><td>✅</td><td>redis</td><td>Production, multi-instance</td></tr>
              <tr><td class="py-2">Custom</td><td>—</td><td>—</td><td>—</td><td>PostgreSQL, MongoDB, etc.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">BaseStorage Interface</h2>
        <p class="text-sm text-slate-400 mb-4">All storage backends implement this abstract interface:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>get_state(id)</code></td><td>Retrieve state document by identifier</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>set_state(id, state, *, ttl=None)</code></td><td>Overwrite state with optional TTL</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>delete_state(id)</code></td><td>Remove state; returns True if key existed</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>compare_and_set(id, new, *, expected, ttl)</code></td><td>Atomic CAS — writes only if current value equals expected</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>increment(id, amount=1, *, ttl=None)</code></td><td><span class="text-amber-300">v0.5.0</span> — Atomic counter increment; returns new count. Used by RateLimitMiddleware</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>list_keys(pattern)</code></td><td>List keys matching a glob pattern</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>clear_namespace()</code></td><td>Delete all keys in the storage namespace</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>health()</code></td><td>Return True if storage is reachable</td></tr>
              <tr><td class="py-2"><code>start() / stop()</code></td><td>Lifecycle — connect/disconnect and start/stop background tasks</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">increment() <span class="text-sm font-normal text-slate-500">v0.5.0</span></h2>
        <p class="text-slate-400 text-sm mb-4">
          Atomic counter used internally by <code>RateLimitMiddleware</code> but
          available for any use-case (feature flags, visit counters, etc.).
        </p>
        <CodeBlock code={`<span class="cmt"># MemoryStorage — asyncio lock, in-process</span>
count = <span class="kw">await</span> storage.increment(<span class="str">"visits:42"</span>, ttl=<span class="num">86400</span>)

<span class="cmt"># RedisStorage — INCRBY + EXPIRE, O(1)</span>
count = <span class="kw">await</span> redis_storage.increment(<span class="str">"visits:42"</span>, amount=<span class="num">1</span>, ttl=<span class="num">86400</span>)

<span class="cmt"># SQLiteStorage — UPSERT, serialised per-key</span>
count = <span class="kw">await</span> sqlite_storage.increment(<span class="str">"visits:42"</span>)

print(count)  <span class="cmt"># int — new total after increment</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Setup</h2>
        <CodeBlock title="Memory (development)" code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, MemoryStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(default_ttl=<span class="num">3600</span>),  <span class="cmt"># 1h TTL</span>
)`} />

        <CodeBlock title="SQLite (single-process persistence)" code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, SQLiteStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=SQLiteStorage(<span class="str">"fsm.db"</span>),  <span class="cmt"># WAL mode, auto-cleanup</span>
)`} />

        <CodeBlock title="Redis (production, multi-instance)" code={`<span class="imp">import</span> redis.asyncio <span class="kw">as</span> redis
<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> RedisStorage

redis_client = redis.Redis(host=<span class="str">"localhost"</span>, port=<span class="num">6379</span>)
app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=RedisStorage(redis_client, prefix=<span class="str">"mybot:"</span>),
)`} />
      </section>
    </Layout>
  );
}
