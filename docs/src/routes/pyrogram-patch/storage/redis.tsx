import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function RedisStoragePage() {
  return (
    <Layout>
      <Title>Redis Storage — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Redis Storage</h1>
        <p class="text-slate-400 mb-8">Production-grade FSM storage using Redis with Pydantic validation, circuit breaker protection, and atomic compare-and-set via <code>WATCH/MULTI/EXEC</code> transactions.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Setup</h2>
        <CodeBlock code={`<span class="imp">import</span> redis.asyncio <span class="kw">as</span> redis
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> RedisStorage

redis_client = redis.Redis(
    host=<span class="str">"localhost"</span>,
    port=<span class="num">6379</span>,
    db=<span class="num">0</span>,
    decode_responses=<span class="num">True</span>,
)

storage = RedisStorage(redis_client, prefix=<span class="str">"mybot:fsm:"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>redis</code></td><td><code>redis.asyncio.Redis</code></td><td>—</td><td>Async Redis client instance</td></tr>
            <tr><td><code>prefix</code></td><td><code>str</code></td><td><code>"pyrogram_patch:"</code></td><td>Key prefix for all FSM entries</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Circuit Breaker Integration</h2>
        <p class="text-sm text-slate-400 mb-4">
          Every Redis operation is wrapped in a circuit breaker. If Redis becomes unavailable,
          the breaker opens and prevents flooding a dead connection. Once Redis recovers,
          the breaker transitions through <code>HALF_OPEN</code> back to <code>CLOSED</code> automatically.
        </p>
        <div class="p-4 rounded-lg border border-white/10 text-sm font-mono text-center space-y-2" style={{ background: "var(--color-surface)" }}>
          <div class="flex justify-center gap-4 flex-wrap items-center">
            <span class="px-3 py-1 rounded bg-green-500/15 text-green-400">CLOSED</span>
            <span class="text-slate-500">failure_threshold →</span>
            <span class="px-3 py-1 rounded bg-red-500/15 text-red-400">OPEN</span>
            <span class="text-slate-500">timeout →</span>
            <span class="px-3 py-1 rounded bg-amber-500/15 text-amber-400">HALF_OPEN</span>
            <span class="text-slate-500">success →</span>
            <span class="px-3 py-1 rounded bg-green-500/15 text-green-400">CLOSED</span>
          </div>
        </div>
        <p class="text-sm text-slate-400 mt-4">
          Configure via <code>PyrogramPatchConfig.circuit_breaker</code> (environment variables or code):
        </p>
        <CodeBlock code={`<span class="cmt"># Environment variables:</span>
<span class="cmt"># PYROGRAM_PATCH_CIRCUIT_BREAKER__FAILURE_THRESHOLD=5</span>
<span class="cmt"># PYROGRAM_PATCH_CIRCUIT_BREAKER__SUCCESS_THRESHOLD=2</span>
<span class="cmt"># PYROGRAM_PATCH_CIRCUIT_BREAKER__TIMEOUT=30</span>
<span class="cmt"># PYROGRAM_PATCH_CIRCUIT_BREAKER__FALLBACK_MESSAGE="Service temporarily unavailable"</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Pydantic Validation</h2>
        <p class="text-sm text-slate-400 mb-4">
          State data is validated at write time using <code>FSMStateModel</code> (a Pydantic model).
          Invalid payloads are rejected before touching Redis, preventing corrupt state.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Atomic Compare-and-Set</h2>
        <p class="text-sm text-slate-400 mb-4">
          Uses Redis <code>WATCH/MULTI/EXEC</code> transactions for safe concurrent updates.
          The <code>compare_and_set()</code> method reads the current state, verifies it matches the expected value,
          then atomically writes the new value — all inside a transaction. If another client modifies the key
          between WATCH and EXEC, the transaction fails and returns <code>False</code>.
        </p>
        <CodeBlock code={`<span class="cmt"># Used internally by RateLimitMiddleware for safe counter increments</span>
success = <span class="kw">await</span> storage.compare_and_set(
    id=<span class="str">"ratelimit:user:12345:1700000"</span>,
    new_state={<span class="str">"count"</span>: <span class="num">4</span>},
    expected_state={<span class="str">"count"</span>: <span class="num">3</span>},
    ttl=<span class="num">60</span>,
)`} />
      </section>
    </Layout>
  );
}
