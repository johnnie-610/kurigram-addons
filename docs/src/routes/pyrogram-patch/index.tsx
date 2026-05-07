import { Title } from "@solidjs/meta";

import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PyrogramPatchOverview() {
  return (
    <Layout>
      <Title>Pyrogram Patch — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">🔧</span>
          <h1 class="text-3xl font-bold">Pyrogram Patch</h1>
        </div>
        <p class="text-slate-400 mb-8 text-lg">
          Engine-level patching for Kurigram/Pyrogram that replaces the default dispatcher with a
          production-grade architecture: hierarchical routers, finite state machines, tri-phase middleware,
          circuit breaker resilience, and dependency-injected handlers.
        </p>
      </div>

      {/* Architecture diagram */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Architecture</h2>
        <div class="p-6 rounded-xl border border-white/10 text-sm font-mono text-center space-y-3" style={{ background: "var(--color-surface)" }}>
          <div class="text-cyan-400">Telegram Update</div>
          <div class="text-slate-500">↓</div>
          <div class="text-amber-400 font-semibold">PatchedDispatcher</div>
          <div class="text-slate-500">↓</div>
          <div class="flex justify-center gap-8 flex-wrap">
            <span class="text-green-400">Before Middleware</span>
            <span class="text-slate-500">→</span>
            <span class="text-blue-400">Around Middleware</span>
            <span class="text-slate-500">→</span>
            <span class="text-purple-400">Handler + DI</span>
            <span class="text-slate-500">→</span>
            <span class="text-green-400">After Middleware</span>
          </div>
          <div class="text-slate-500">↕</div>
          <div class="flex justify-center gap-6 flex-wrap">
            <span class="px-2 py-1 rounded bg-amber-500/10 text-amber-400">FSM Storage</span>
            <span class="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">Circuit Breaker</span>
            <span class="px-2 py-1 rounded bg-purple-500/10 text-purple-400">PatchHelper DI</span>
          </div>
        </div>
      </section>

      {/* Core imports */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Import Map</h2>
        <CodeBlock
          code={`<span class="cmt"># Core patching</span>
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch, PatchManager

<span class="cmt"># Router</span>
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router

<span class="cmt"># FSM</span>
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> (
    State, StatesGroup,              <span class="cmt"># State definitions</span>
    FSMContext,                       <span class="cmt"># Runtime context</span>
    MemoryStorage, RedisStorage,     <span class="cmt"># Storage backends</span>
    StateFilter, AnyStateFilter,     <span class="cmt"># Filters</span>
    NoStateFilter,
)

<span class="cmt"># Middleware</span>
<span class="imp">from</span> pyrogram_patch.middlewares.rate_limit <span class="imp">import</span> RateLimitMiddleware

<span class="cmt"># Helpers</span>
<span class="imp">from</span> pyrogram_patch.patch_helper <span class="imp">import</span> PatchHelper`}
        />
      </section>

      {/* Feature grid */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Features</h2>
        <div class="grid sm:grid-cols-2 gap-3 stagger">
          <Feature title="Patching" href="/pyrogram-patch/patching" desc="patch() / unpatch() lifecycle and PatchManager configuration" />
          <Feature title="Router" href="/pyrogram-patch/router" desc="Hierarchical routers with 25+ event decorators and sub-router nesting" />
          <Feature title="FSM" href="/pyrogram-patch/fsm" desc="State machines with state guards, transition validation, and filters" />
          <Feature title="Storage" href="/pyrogram-patch/storage" desc="Pluggable backends: Memory, Redis (with circuit breaker), or custom" />
          <Feature title="Middleware" href="/pyrogram-patch/middleware" desc="Tri-phase pipeline: before → around → handler → after" />
          <Feature title="Patch Helper" href="/pyrogram-patch/patch-helper" desc="Dependency-injected helper with FSM, data access, and snapshots" />
          <Feature title="Circuit Breaker" href="/pyrogram-patch/circuit-breaker" desc="Fault tolerance with automatic recovery for storage operations" />
          <Feature title="Configuration" href="/pyrogram-patch/configuration" desc="Pydantic settings with environment variable support" />
          <Feature title="Dispatcher" href="/pyrogram-patch/dispatcher" desc="PatchedDispatcher internals, middleware chain, and handler DI" />
          <Feature title="Errors" href="/pyrogram-patch/errors" desc="15+ structured error types with TraceInfo and JSON serialization" />
        </div>
      </section>

      {/* Minimal setup */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Minimal Setup</h2>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">import</span> asyncio
<span class="imp">from</span> pyrogram <span class="imp">import</span> Client, idle
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> MemoryStorage

app = Client(<span class="str">"my_bot"</span>)
router = Router()

<span class="cmt"># Register handlers on the router...</span>

<span class="kw">async def</span> <span class="fn">main</span>():
    manager = <span class="kw">await</span> patch(app)
    manager.set_storage(MemoryStorage())  <span class="cmt"># or RedisStorage(redis_client)</span>
    manager.include_router(router)

    <span class="cmt"># Optionally add middleware</span>
    <span class="kw">await</span> manager.add_middleware(my_logging_middleware, kind=<span class="str">"before"</span>)

    <span class="kw">await</span> app.start()
    <span class="kw">await</span> idle()

asyncio.run(main())`}
        />
      </section>
    </Layout>
  );
}

function Feature(props: { title: string; href: string; desc: string }) {
  return (
    <a
      href={props.href}
      target="_self"
      class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "var(--color-surface)" }}
    >
      <div class="font-semibold text-sm mb-1">{props.title}</div>
      <div class="text-xs text-slate-500">{props.desc}</div>
    </a>
  );
}
