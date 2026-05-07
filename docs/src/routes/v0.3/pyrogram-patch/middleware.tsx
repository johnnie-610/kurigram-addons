import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3MiddlewarePage() {
  return (
    <Layout>
      <Title>Middleware — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Middleware</h1>
        <p class="text-slate-400 mb-8">
          Middleware functions intercept every update before or after handlers run.
          Three kinds: <code>before</code>, <code>after</code>, and <code>around</code>.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Before Middleware</h2>
        <p class="text-slate-400 text-sm mb-4">
          Runs before every handler. Receives <code>update</code>, <code>client</code>,
          and <code>patch_helper</code> by parameter name (positional sniffing).
        </p>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">logging_middleware</span>(update, client, patch_helper):
    user_id = getattr(update.from_user, <span class="str">"id"</span>, <span class="str">"?"</span>)
    print(<span class="str">f"[{user_id}] update received"</span>)

<span class="cmt"># Register after app.start()</span>
<span class="kw">await</span> manager.add_middleware(logging_middleware, kind=<span class="str">"before"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">After Middleware</h2>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">analytics_middleware</span>(update, client):
    <span class="kw">await</span> track_event(<span class="str">"update_handled"</span>, user=update.from_user.id)

<span class="kw">await</span> manager.add_middleware(analytics_middleware, kind=<span class="str">"after"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Around Middleware</h2>
        <p class="text-slate-400 text-sm mb-4">
          Wraps the handler call — useful for timing, transactions, or catching errors.
          Must accept and call <code>next_handler</code>.
        </p>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">timing_middleware</span>(next_handler, update):
    <span class="imp">import</span> time
    start = time.monotonic()
    result = <span class="kw">await</span> next_handler(update)
    elapsed = time.monotonic() - start
    print(<span class="str">f"Handler took {elapsed:.3f}s"</span>)
    <span class="kw">return</span> result

<span class="kw">await</span> manager.add_middleware(timing_middleware, kind=<span class="str">"around"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Priority</h2>
        <p class="text-slate-400 text-sm mb-4">
          Higher-priority middleware runs first. Default is 0.
        </p>
        <CodeBlock
          code={`<span class="cmt"># Runs first (highest priority)</span>
<span class="kw">await</span> manager.add_middleware(auth_check, kind=<span class="str">"before"</span>, priority=<span class="num">100</span>)

<span class="cmt"># Runs second</span>
<span class="kw">await</span> manager.add_middleware(logging_mw, kind=<span class="str">"before"</span>, priority=<span class="num">0</span>)

<span class="cmt"># Runs last</span>
<span class="kw">await</span> manager.add_middleware(cleanup_mw, kind=<span class="str">"after"</span>, priority=<span class="num">-10</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">PatchHelper in Middleware</h2>
        <p class="text-slate-400 text-sm mb-4">
          The <code>patch_helper</code> parameter gives access to the FSM context and
          stored data for the current update's user.
        </p>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">session_middleware</span>(update, client, patch_helper):
    state = <span class="kw">await</span> patch_helper.state
    data  = <span class="kw">await</span> patch_helper.get_data()

    <span class="kw">if</span> state == <span class="str">"banned"</span>:
        <span class="kw">return</span>   <span class="cmt"># short-circuit — do not call next handler</span>`}
        />
      </section>
    </Layout>
  );
}
