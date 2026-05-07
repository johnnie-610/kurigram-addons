import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PerHandlerPage() {
  return (
    <Layout>
      <Title>Per-Handler Middleware — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Per-Handler Guards</h1>
        <p class="text-slate-400 mb-2">
          Scope middleware to a single handler with <code>@use_middleware</code> instead of running it on every update.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          title="guards.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> use_middleware
<span class="imp">from</span> pyrogram <span class="imp">import</span> StopPropagation

<span class="kw">async def</span> <span class="fn">require_admin</span>(update, client, patch_helper):
    <span class="kw">if</span> update.from_user.id <span class="kw">not in</span> ADMIN_IDS:
        <span class="kw">await</span> update.reply(<span class="str">"⛔ Admins only."</span>)
        <span class="kw">raise</span> StopPropagation

<span class="dec">@router.on_command</span>(<span class="str">"ban"</span>)
<span class="dec">@use_middleware</span>(require_admin)   <span class="cmt"># only runs for /ban</span>
<span class="kw">async def</span> <span class="fn">ban_cmd</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Banned!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Stacking guards</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Multiple <code>@use_middleware</code> decorators execute outermost-first.
        </p>
        <CodeBlock
          title="stacked.py"
          code={`<span class="dec">@router.on_command</span>(<span class="str">"broadcast"</span>)
<span class="dec">@use_middleware</span>(require_admin)
<span class="dec">@use_middleware</span>(RateLimit(per_user=<span class="num">1</span>, window=<span class="num">60</span>))
<span class="kw">async def</span> <span class="fn">broadcast_cmd</span>(client, message):
    ...`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Around middleware</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Wrap a handler with before/after logic using the <code>@middleware</code> decorator.
          The wrapped function receives a <code>handler</code> callable as its first argument.
        </p>
        <CodeBlock
          title="timing.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> middleware
<span class="imp">import</span> time

<span class="dec">@router.on_command</span>(<span class="str">"slow"</span>)
<span class="dec">@middleware</span>
<span class="kw">async def</span> <span class="fn">slow_cmd</span>(handler, client, message):
    t = time.perf_counter()
    <span class="kw">await</span> handler()          <span class="cmt"># call the actual handler body</span>
    elapsed = (time.perf_counter() - t) * <span class="num">1000</span>
    <span class="kw">await</span> message.reply(<span class="str">f"Took </span><span class="num">{elapsed:.1f}</span><span class="str">ms"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Notes</h2>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>Per-handler guards only run for the decorated handler — not globally.</li>
          <li>Raising <code>StopPropagation</code> from a guard blocks the handler and stops further propagation.</li>
          <li>Guards execute in the order decorators are applied (outermost first).</li>
          <li>The global middleware pipeline still runs before per-handler guards.</li>
        </ul>
      </section>
    </Layout>
  );
}
