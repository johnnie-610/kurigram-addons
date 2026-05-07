import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Circuit Breaker — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Circuit Breaker</h1>
        <p class="text-slate-400 mb-8">Automatic resilience for storage backends with configurable failure thresholds, timeouts, and half-open probing.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">How It Works</h2>
        <div class="p-4 rounded-lg border border-white/10 font-mono text-sm text-center" style="background: var(--color-surface);">
          <span class="text-green-400 font-bold">CLOSED</span> →
          <span class="text-slate-400">failure_threshold →</span>
          <span class="text-red-400 font-bold">OPEN</span> →
          <span class="text-slate-400">timeout →</span>
          <span class="text-amber-400 font-bold">HALF_OPEN</span> →
          <span class="text-slate-400">success →</span>
          <span class="text-green-400 font-bold">CLOSED</span>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Configuration</h2>
        <p class="text-sm text-slate-400 mb-4">RedisStorage has a built-in circuit breaker. Configuration is via constructor params:</p>
        <table>
          <thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>failure_threshold</code></td><td><code>5</code></td><td>Failures before opening the circuit</td></tr>
            <tr><td><code>recovery_timeout</code></td><td><code>30s</code></td><td>Time to wait in OPEN before probing</td></tr>
            <tr><td><code>half_open_max_calls</code></td><td><code>1</code></td><td>Max probe calls in HALF_OPEN</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Behavior</h2>
        <p class="text-sm text-slate-400">When the circuit is OPEN, all storage operations raise <code>CircuitBreakerOpenError</code>. The framework catches this and the bot continues running without FSM — handlers still execute, but <code>PatchHelper</code> operations return defaults. When Redis comes back, the circuit transitions through HALF_OPEN back to CLOSED automatically.</p>
      </section>
    </Layout>
  );
}
