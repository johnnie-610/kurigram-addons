import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3CircuitBreakerPage() {
  return (
    <Layout>
      <Title>Circuit Breaker — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Circuit Breaker</h1>
        <p class="text-slate-400 mb-8">
          <code>AsyncCircuitBreaker</code> protects external calls (database,
          Redis, API) from cascading failures. When failures exceed a threshold
          the breaker opens and fast-fails subsequent calls for a cooldown period.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.circuit_breaker <span class="imp">import</span> AsyncCircuitBreaker

breaker = AsyncCircuitBreaker(
    failure_threshold=<span class="num">5</span>,   <span class="cmt"># open after 5 consecutive failures</span>
    recovery_timeout=<span class="num">30</span>,  <span class="cmt"># try again after 30 seconds</span>
)

<span class="kw">async def</span> <span class="fn">fetch_user</span>(user_id: int):
    <span class="kw">async with</span> breaker:
        <span class="kw">return await</span> db.get_user(user_id)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">protect() Decorator</h2>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">send_notification</span>(user_id, text):
    <span class="kw">await</span> redis_client.publish(<span class="str">f"notify:{user_id}"</span>, text)

protected_notify = breaker.protect(send_notification)

<span class="cmt"># If the breaker is open, raises CircuitBreakerOpenError</span>
<span class="kw">await</span> protected_notify(<span class="num">42</span>, <span class="str">"Hello!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">States</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">State</th><th>Behaviour</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><strong>Closed</strong></td><td>Normal — all calls pass through</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><strong>Open</strong></td><td>Fast-fail — raises CircuitBreakerOpenError immediately</td></tr>
              <tr><td class="py-2"><strong>Half-open</strong></td><td>One probe call allowed; closes on success, reopens on failure</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Configuration Reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>failure_threshold</code></td><td>5</td><td>Consecutive failures before opening</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>recovery_timeout</code></td><td>60</td><td>Seconds before half-open probe</td></tr>
              <tr><td class="py-2"><code>expected_exception</code></td><td>Exception</td><td>Which exception type counts as a failure</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
