import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PatchingPage() {
  return (
    <Layout>
      <Title>Patching — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Patching</h1>
        <p class="text-slate-400 mb-8">The <code>patch()</code> function replaces the default Pyrogram dispatcher with a production-grade engine supporting routers, FSM, and middleware.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Usage</h2>
        <CodeBlock code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> Client, idle
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch

app = Client(<span class="str">"my_bot"</span>)

<span class="kw">async def</span> <span class="fn">main</span>():
    manager = <span class="kw">await</span> patch(app)

    <span class="cmt"># Configure storage, routers, middleware...</span>
    manager.set_storage(MemoryStorage())
    manager.include_router(my_router)

    <span class="kw">await</span> app.start()
    <span class="kw">await</span> idle()`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What patch() Does</h2>
        <div class="space-y-3 text-sm text-slate-300">
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <strong class="text-white">1. Replaces the dispatcher</strong>
            <p class="text-slate-400 mt-1">Swaps <code>Dispatcher</code> with <code>PatchedDispatcher</code>, which supports handler dependency injection, middleware chains, and circuit breaker fallbacks.</p>
          </div>
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <strong class="text-white">2. Creates PatchManager</strong>
            <p class="text-slate-400 mt-1">Returns a <code>PatchManager</code> instance used to configure everything: storage, routers, middleware, and settings.</p>
          </div>
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <strong class="text-white">3. Initializes helper pool</strong>
            <p class="text-slate-400 mt-1">Sets up <code>PatchDataPool</code> for efficient <code>PatchHelper</code> instance management with weak references and TTL cleanup.</p>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">PatchManager Methods</h2>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>set_storage(storage)</code></td><td>Set the FSM storage backend</td></tr>
            <tr><td><code>include_router(router)</code></td><td>Register a router and its handlers</td></tr>
            <tr><td><code>add_middleware(fn, kind, priority)</code></td><td>Add a middleware to the pipeline</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
