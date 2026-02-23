import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function MiddlewareOverview() {
  return (
    <Layout>
      <Title>Middleware — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Middleware</h1>
        <p class="text-slate-400 mb-8">Tri-phase middleware pipeline: execute logic before, around, or after handlers. Supports priority ordering, signature-based dependency injection, and timeout enforcement.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Execution Order</h2>
        <div class="p-6 rounded-xl border border-white/10 text-sm font-mono text-center space-y-3" style={{ background: "var(--color-surface)" }}>
          <div class="text-slate-400">Update arrives</div>
          <div class="text-slate-500">↓</div>
          <div class="text-green-400 font-semibold">Before Middlewares</div>
          <div class="text-xs text-slate-500">(highest priority first, signature-based DI)</div>
          <div class="text-slate-500">↓</div>
          <div class="text-blue-400 font-semibold">Around Middlewares</div>
          <div class="text-xs text-slate-500">(wrap the handler, control execution)</div>
          <div class="text-slate-500">↓</div>
          <div class="text-amber-400 font-semibold">Handler</div>
          <div class="text-slate-500">↓</div>
          <div class="text-purple-400 font-semibold">After Middlewares</div>
          <div class="text-xs text-slate-500">(highest priority first, post-processing)</div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Phase Types</h2>
        <table>
          <thead><tr><th>Phase</th><th>Signature</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>before</code></td><td><code>async fn(update, client, patch_helper)</code></td><td>Pre-processing: logging, auth checks, rate limiting</td></tr>
            <tr><td><code>around</code></td><td><code>fn(next_handler) → fn(update)</code></td><td>Wraps handler: timing, retry, error boundaries</td></tr>
            <tr><td><code>after</code></td><td><code>async fn(update, client, patch_helper)</code></td><td>Post-processing: analytics, cleanup, notifications</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Examples</h2>
        <CodeBlock title="Before middleware — logging" code={`<span class="kw">async def</span> <span class="fn">log_updates</span>(update, client, patch_helper):
    <span class="fn">print</span>(<span class="str">f"Received: </span>{<span class="fn">type</span>(update).__name__}<span class="str">"</span>)

manager = <span class="kw">await</span> patch(app)
<span class="kw">await</span> manager.add_middleware(log_updates, kind=<span class="str">"before"</span>)`} />

        <CodeBlock title="Around middleware — timing" code={`<span class="imp">import</span> time

<span class="kw">def</span> <span class="fn">timing_middleware</span>(next_handler):
    <span class="kw">async def</span> <span class="fn">wrapper</span>(update):
        start = time.time()
        result = <span class="kw">await</span> next_handler(update)
        elapsed = time.time() - start
        <span class="fn">print</span>(<span class="str">f"Handler took </span>{elapsed:.3f}<span class="str">s"</span>)
        <span class="kw">return</span> result
    <span class="kw">return</span> wrapper

<span class="kw">await</span> manager.add_middleware(timing_middleware, kind=<span class="str">"around"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Priority</h2>
        <p class="text-sm text-slate-400 mb-4">
          Higher priority values execute first. When two middlewares have the same priority,
          they execute in registration order.
        </p>
        <CodeBlock code={`<span class="cmt"># Priority 10 runs before priority 0</span>
<span class="kw">await</span> manager.add_middleware(auth_check, kind=<span class="str">"before"</span>, priority=<span class="num">10</span>)
<span class="kw">await</span> manager.add_middleware(log_updates, kind=<span class="str">"before"</span>, priority=<span class="num">0</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Signature-Based DI</h2>
        <p class="text-sm text-slate-400 mb-4">
          Middleware functions receive arguments based on their parameter names.
          The manager inspects your function signature and injects only what you need:
        </p>
        <CodeBlock code={`<span class="cmt"># Only receives 'update' — efficient</span>
<span class="kw">async def</span> <span class="fn">simple_logger</span>(update):
    <span class="fn">print</span>(<span class="fn">type</span>(update).__name__)

<span class="cmt"># Receives all three — full access</span>
<span class="kw">async def</span> <span class="fn">full_middleware</span>(update, client, patch_helper):
    data = <span class="kw">await</span> patch_helper.get_data()
    <span class="cmt"># ...</span>`} />
      </section>
    </Layout>
  );
}
