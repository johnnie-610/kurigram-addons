import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3StoragePage() {
  return (
    <Layout>
      <Title>Storage — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Storage Backends</h1>
        <p class="text-slate-400 mb-8">
          FSM state and data are persisted through a <code>BaseStorage</code> backend.
          v0.3 ships two built-in backends: <code>MemoryStorage</code> (in-process,
          volatile) and <code>RedisStorage</code> (persistent, shareable across processes).
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">MemoryStorage</h2>
        <p class="text-slate-400 text-sm mb-4">
          Stores state in a Python dict. Lost on restart. Best for development and
          single-process bots with no persistence requirement.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> MemoryStorage

storage = MemoryStorage()
manager = patch(app, storage=storage)`}
        />
        <div class="overflow-x-auto mt-4">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>ttl</code></td><td>int | None</td><td>None</td><td>Default TTL in seconds for all keys</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">RedisStorage</h2>
        <p class="text-slate-400 text-sm mb-4">
          Stores state in Redis. Survives restarts and works across multiple bot
          processes. Requires <code>pip install kurigram-addons[redis]</code>.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm.storages.redis_storage <span class="imp">import</span> RedisStorage

storage = RedisStorage(
    host=<span class="str">"localhost"</span>,
    port=<span class="num">6379</span>,
    db=<span class="num">0</span>,
    prefix=<span class="str">"mybot"</span>,   <span class="cmt"># optional key namespace</span>
    ttl=<span class="num">3600</span>,         <span class="cmt"># optional default TTL</span>
)
manager = patch(app, storage=storage)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Custom Storage</h2>
        <p class="text-slate-400 text-sm mb-4">
          Implement <code>BaseStorage</code> to use any backend (PostgreSQL, MongoDB, etc.).
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.fsm.base_storage <span class="imp">import</span> BaseStorage

<span class="kw">class</span> <span class="fn">MyStorage</span>(BaseStorage):
    <span class="kw">async def</span> <span class="fn">get_state</span>(self, identifier: str):
        ...

    <span class="kw">async def</span> <span class="fn">set_state</span>(self, identifier: str, state, *, ttl=None):
        ...

    <span class="kw">async def</span> <span class="fn">delete_state</span>(self, identifier: str) -> bool:
        ...

    <span class="kw">async def</span> <span class="fn">compare_and_set</span>(self, identifier, new_state, *, expected_state, ttl=None) -> bool:
        ...`}
        />
      </section>
    </Layout>
  );
}
