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
        <h2 class="text-xl font-semibold mb-4 text-amber-400">
          MiddlewareContext <span class="text-sm font-normal text-slate-500">v0.5.0 — preferred</span>
        </h2>
        <p class="text-sm text-slate-400 mb-4">
          In v0.5.0, the preferred calling convention uses a single <code>MiddlewareContext</code> object
          instead of positional parameter name sniffing. This gives full IDE autocomplete:
        </p>
        <CodeBlock code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> MiddlewareContext

<span class="kw">async def</span> <span class="fn">auth_middleware</span>(ctx: MiddlewareContext):
    user = <span class="kw">await</span> db.get_user(ctx.update.from_user.id)
    <span class="kw">if not</span> user:
        <span class="kw">await</span> ctx.update.reply(<span class="str">"Please register first."</span>)
        <span class="kw">return</span>   <span class="cmt"># short-circuit — skip handler</span>

<span class="kw">await</span> app.include_middleware(auth_middleware, kind=<span class="str">"before"</span>, priority=<span class="num">100</span>)`} />
        <p class="text-xs text-slate-500 mt-3">
          Fields: <code>ctx.update</code>, <code>ctx.client</code>, <code>ctx.helper</code> (PatchHelper).
          The classic positional form (<code>update, client, patch_helper</code>) still works.
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Phase Types</h2>
        <table>
          <thead><tr><th>Phase</th><th>Signature</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>before</code></td><td><code>async fn(ctx: MiddlewareContext)</code></td><td>Pre-processing: logging, auth checks, rate limiting</td></tr>
            <tr><td><code>around</code></td><td><code>async fn(next_handler, update)</code></td><td>Wraps handler: timing, retry, error boundaries</td></tr>
            <tr><td><code>after</code></td><td><code>async fn(ctx: MiddlewareContext)</code></td><td>Post-processing: analytics, cleanup, notifications</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Examples</h2>
        <CodeBlock title="Before middleware — logging" code={`<span class="kw">async def</span> <span class="fn">log_updates</span>(ctx: MiddlewareContext):
    print(<span class="str">f"Received: </span>{type(ctx.update).__name__}<span class="str">"</span>)

<span class="kw">await</span> app.include_middleware(log_updates, kind=<span class="str">"before"</span>)`} />

        <CodeBlock title="Around middleware — timing" code={`<span class="imp">import</span> time

<span class="kw">async def</span> <span class="fn">timing_middleware</span>(next_handler, update):
    start = time.monotonic()
    result = <span class="kw">await</span> next_handler(update)
    elapsed = time.monotonic() - start
    print(<span class="str">f"Handler took </span>{elapsed:.3f}<span class="str">s"</span>)
    <span class="kw">return</span> result

<span class="kw">await</span> app.include_middleware(timing_middleware, kind=<span class="str">"around"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Priority</h2>
        <p class="text-sm text-slate-400 mb-4">
          Higher priority values execute first. When two middlewares have the same priority,
          they execute in registration order.
        </p>
        <CodeBlock code={`<span class="cmt"># Priority 10 runs before priority 0</span>
<span class="kw">await</span> app.include_middleware(auth_check, kind=<span class="str">"before"</span>, priority=<span class="num">10</span>)
<span class="kw">await</span> app.include_middleware(log_updates, kind=<span class="str">"before"</span>, priority=<span class="num">0</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Signature-Based DI</h2>
        <p class="text-sm text-slate-400 mb-4">
          Middleware functions receive arguments based on their parameter names.
          The dispatcher inspects your function signature and injects only what you need:
        </p>
        <CodeBlock code={`<span class="cmt"># MiddlewareContext — preferred (v0.5+)</span>
<span class="kw">async def</span> <span class="fn">modern_mw</span>(ctx: MiddlewareContext):
    print(type(ctx.update).__name__)

<span class="cmt"># Classic positional — still supported</span>
<span class="kw">async def</span> <span class="fn">simple_logger</span>(update):
    print(type(update).__name__)

<span class="cmt"># Classic with all three — still supported</span>
<span class="kw">async def</span> <span class="fn">full_middleware</span>(update, client, patch_helper):
    data = <span class="kw">await</span> patch_helper.get_data()
    <span class="cmt"># ...</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">See Also</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <a href="/pyrogram-patch/middleware/writing" class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all" style={{ background: "var(--color-surface)" }}>
            <div class="font-semibold text-sm mb-1">✍️ Writing Middleware</div>
            <div class="text-xs text-slate-500">Before / around / after with examples and class-based</div>
          </a>
          <a href="/pyrogram-patch/middleware/per-handler" class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all" style={{ background: "var(--color-surface)" }}>
            <div class="font-semibold text-sm mb-1">🎯 Per-Handler Middleware</div>
            <div class="text-xs text-slate-500">@use_middleware() — attach guards to specific handlers</div>
          </a>
          <a href="/pyrogram-patch/middleware/rate-limit" class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all" style={{ background: "var(--color-surface)" }}>
            <div class="font-semibold text-sm mb-1">⏱️ Rate Limiting</div>
            <div class="text-xs text-slate-500">Storage-backed token bucket via RateLimitMiddleware</div>
          </a>
        </div>
      </section>
    </Layout>
  );
}
