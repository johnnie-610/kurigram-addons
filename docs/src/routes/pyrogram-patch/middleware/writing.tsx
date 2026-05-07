import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function WritingMiddlewarePage() {
  return (
    <Layout>
      <Title>Writing Middleware — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Writing Middleware</h1>
        <p class="text-slate-400 mb-8">
          Middleware intercepts every update before (<code>before</code>), after
          (<code>after</code>), or around (<code>around</code>) the handler. Two
          calling conventions are supported: the classic positional form and the
          v0.5.0 <code>MiddlewareContext</code> typed form.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">
          MiddlewareContext <span class="text-sm font-normal text-slate-500">v0.5.0 — preferred</span>
        </h2>
        <p class="text-slate-400 text-sm mb-4">
          Annotate the first parameter as <code>MiddlewareContext</code> to receive
          a single structured object instead of relying on positional name sniffing.
          Fields: <code>ctx.update</code>, <code>ctx.client</code>, <code>ctx.helper</code>.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> MiddlewareContext

<span class="kw">async def</span> <span class="fn">logging_middleware</span>(ctx: MiddlewareContext):
    user_id = getattr(ctx.update.from_user, <span class="str">"id"</span>, <span class="str">"?"</span>)
    state   = <span class="kw">await</span> ctx.helper.state
    print(<span class="str">f"[{user_id}] state={state}"</span>)

<span class="kw">async def</span> <span class="fn">auth_middleware</span>(ctx: MiddlewareContext):
    user = <span class="kw">await</span> db.get_user(ctx.update.from_user.id)
    <span class="kw">if not</span> user:
        <span class="kw">await</span> ctx.update.reply(<span class="str">"Please register first."</span>)
        <span class="kw">return</span>   <span class="cmt"># short-circuit — skip handler</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Classic Positional Form</h2>
        <p class="text-slate-400 text-sm mb-4">
          Still supported — the dispatcher sniffs parameter names and injects
          <code>update</code>, <code>client</code>, and <code>patch_helper</code> by name.
        </p>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">logging_middleware</span>(update, client, patch_helper):
    user_id = getattr(update.from_user, <span class="str">"id"</span>, <span class="str">"?"</span>)
    print(<span class="str">f"[{user_id}] update received"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Before Middleware</h2>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">logging_middleware</span>(ctx: MiddlewareContext):
    print(<span class="str">f"Before handler: </span>{type(ctx.update).__name__}<span class="str">"</span>)

<span class="kw">await</span> app.include_middleware(logging_middleware, kind=<span class="str">"before"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Around Middleware</h2>
        <p class="text-slate-400 text-sm mb-4">
          Wrap the handler call — useful for timing, transactions, or error catching.
          Must accept and call <code>next_handler</code>.
        </p>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">timing_middleware</span>(next_handler, update):
    <span class="imp">import</span> time
    start = time.monotonic()
    result = <span class="kw">await</span> next_handler(update)
    print(<span class="str">f"Handler took {time.monotonic() - start:.3f}s"</span>)
    <span class="kw">return</span> result

<span class="kw">await</span> app.include_middleware(timing_middleware, kind=<span class="str">"around"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">After Middleware</h2>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">analytics_middleware</span>(ctx: MiddlewareContext):
    <span class="kw">await</span> track_event(<span class="str">"update_handled"</span>, user=ctx.update.from_user.id)

<span class="kw">await</span> app.include_middleware(analytics_middleware, kind=<span class="str">"after"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Priority</h2>
        <p class="text-slate-400 text-sm mb-4">Higher priority runs first. Default is 0.</p>
        <CodeBlock
          code={`<span class="kw">await</span> app.include_middleware(auth_check,  kind=<span class="str">"before"</span>, priority=<span class="num">100</span>)  <span class="cmt"># first</span>
<span class="kw">await</span> app.include_middleware(logging_mw, kind=<span class="str">"before"</span>, priority=<span class="num">0</span>)    <span class="cmt"># second</span>
<span class="kw">await</span> app.include_middleware(cleanup_mw, kind=<span class="str">"after"</span>,  priority=<span class="num">-10</span>)   <span class="cmt"># last</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Class-based Middleware</h2>
        <CodeBlock
          code={`<span class="kw">class</span> <span class="fn">BanCheckMiddleware</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, banned_users: set):
        self.banned = banned_users

    <span class="kw">async def</span> <span class="fn">__call__</span>(self, ctx: MiddlewareContext):
        uid = getattr(ctx.update.from_user, <span class="str">"id"</span>, None)
        <span class="kw">if</span> uid <span class="kw">in</span> self.banned:
            <span class="kw">return</span>

ban_check = BanCheckMiddleware(banned_users={<span class="num">99999</span>})
<span class="kw">await</span> app.include_middleware(ban_check, kind=<span class="str">"before"</span>, priority=<span class="num">200</span>)`}
        />
      </section>
    </Layout>
  );
}
