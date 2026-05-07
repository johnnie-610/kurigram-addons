import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function LifecycleHooksPage() {
  return (
    <Layout>
      <Title>Lifecycle Hooks — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Lifecycle Hooks</h1>
        <p class="text-slate-400 mb-2">
          Register async callbacks that run after <code>start()</code> completes
          and before <code>stop()</code> begins cleanup.
        </p>
        <p class="text-xs text-slate-500 mb-8">Added in v0.4.1</p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">on_startup</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Runs <strong>after</strong> the client finishes connecting.
          Use it for database connections, cache warmup, webhook registration, etc.
        </p>
        <CodeBlock
          title="startup_example.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, MemoryStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
)

<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">init_database</span>():
    <span class="kw">await</span> db.connect()
    print(<span class="str">"✅ Database connected"</span>)

<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">warm_cache</span>():
    <span class="kw">await</span> cache.load()
    print(<span class="str">"✅ Cache warmed"</span>)

app.run()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">on_shutdown</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Runs <strong>before</strong> the client disconnects.
          Use it for cleanup: closing database pools, flushing caches, etc.
        </p>
        <CodeBlock
          title="shutdown_example.py"
          code={`<span class="dec">@app.on_shutdown</span>
<span class="kw">async def</span> <span class="fn">close_database</span>():
    <span class="kw">await</span> db.disconnect()
    print(<span class="str">"🛑 Database disconnected"</span>)

<span class="dec">@app.on_shutdown</span>
<span class="kw">async def</span> <span class="fn">flush_cache</span>():
    <span class="kw">await</span> cache.flush()
    print(<span class="str">"🛑 Cache flushed"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Behavior</h2>
        <ul class="list-disc list-inside text-slate-400 text-sm space-y-2">
          <li>Multiple hooks can be registered — they execute <strong>in registration order</strong>.</li>
          <li>If a hook raises an exception, it is <strong>logged but does not block</strong> the remaining hooks or the client start/stop.</li>
          <li>Hooks receive <strong>no arguments</strong> — use closures or globals for shared state.</li>
          <li>All registered hooks are <code>async</code> callables.</li>
        </ul>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Full Example</h2>
        <CodeBlock
          title="bot_with_lifecycle.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, Router, MemoryStorage

app = KurigramClient(<span class="str">"my_bot"</span>, bot_token=<span class="str">"..."</span>, storage=MemoryStorage())
router = Router()

<span class="cmt"># Startup: connect services</span>
<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">setup</span>():
    app.db = <span class="kw">await</span> create_db_pool()
    app.redis = <span class="kw">await</span> connect_redis()

<span class="cmt"># Shutdown: disconnect services</span>
<span class="dec">@app.on_shutdown</span>
<span class="kw">async def</span> <span class="fn">teardown</span>():
    <span class="kw">await</span> app.db.close()
    <span class="kw">await</span> app.redis.close()

<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Bot is running with DB and Redis!"</span>)

app.include_router(router)
app.run()`}
        />
      </section>
    </Layout>
  );
}
