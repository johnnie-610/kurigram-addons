import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Pyrogram Patch API Reference — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Pyrogram Patch API Reference</h1>
        <p class="text-slate-400 mb-8">Complete API reference for pyrogram_patch classes, methods, and types.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Core</h2>
        <table>
          <thead><tr><th>Symbol</th><th>Module</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>patch(client)</code></td><td><code>pyrogram_patch</code></td><td>Patch a Pyrogram Client, returns PatchManager</td></tr>
            <tr><td><code>PatchManager</code></td><td><code>pyrogram_patch</code></td><td>Configure storage, routers, middleware</td></tr>
            <tr><td><code>Router</code></td><td><code>pyrogram_patch.router</code></td><td>Hierarchical handler router</td></tr>
            <tr><td><code>PatchHelper</code></td><td><code>pyrogram_patch.patch_helper</code></td><td>Per-update FSM state/data helper</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">FSM</h2>
        <table>
          <thead><tr><th>Symbol</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>State</code></td><td>Single FSM state descriptor</td></tr>
            <tr><td><code>StatesGroup</code></td><td>Base class for state groups</td></tr>
            <tr><td><code>StateFilter</code></td><td>Filter for a specific state</td></tr>
            <tr><td><code>AnyStateFilter</code></td><td>Filter for any active state</td></tr>
            <tr><td><code>NoStateFilter</code></td><td>Filter for no state</td></tr>
            <tr><td><code>MemoryStorage</code></td><td>In-memory storage backend</td></tr>
            <tr><td><code>RedisStorage</code></td><td>Redis storage with circuit breaker</td></tr>
            <tr><td><code>BaseStorage</code></td><td>Abstract base for custom backends</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Errors</h2>
        <table>
          <thead><tr><th>Error</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>PatchError</code></td><td>Base error class</td></tr>
            <tr><td><code>StorageError</code></td><td>Storage operation failure</td></tr>
            <tr><td><code>CircuitBreakerOpenError</code></td><td>Circuit breaker is open</td></tr>
            <tr><td><code>InvalidStateTransition</code></td><td>Transition guard violation</td></tr>
            <tr><td><code>MiddlewareError</code></td><td>Middleware execution failure</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
