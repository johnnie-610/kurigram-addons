import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3PatchPage() {
  return (
    <Layout>
      <Title>Patching Setup — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Patching Setup</h1>
        <p class="text-slate-400 mb-8">
          <code>patch()</code> wraps an existing <code>pyrogram.Client</code> with
          routing, FSM, and middleware capabilities. It returns a{" "}
          <code>PatchManager</code> through which you register routers and middleware.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">patch()</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> Client
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch
<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> MemoryStorage

app = Client(<span class="str">"my_bot"</span>, bot_token=<span class="str">"TOKEN"</span>)

manager = patch(app, storage=MemoryStorage())

<span class="cmt"># Register routers before run()</span>
manager.include_router(router)

app.run()`}
        />
        <div class="overflow-x-auto mt-4">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>client</code></td><td>Client</td><td>The pyrogram Client to patch</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>storage</code></td><td>BaseStorage</td><td>FSM storage backend (default: MemoryStorage)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">PatchManager</h2>
        <p class="text-slate-400 text-sm mb-4">
          The object returned by <code>patch()</code>. Used to wire up routers and middleware.
        </p>
        <CodeBlock
          code={`<span class="cmt"># Include routers</span>
manager.include_router(router)
manager.include_router(admin_router)

<span class="cmt"># Add middleware (must be called after app.start())</span>
<span class="kw">async def</span> <span class="fn">setup</span>():
    <span class="kw">await</span> app.start()
    <span class="kw">await</span> manager.add_middleware(my_middleware, kind=<span class="str">"before"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">unpatch()</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> unpatch

<span class="cmt"># Remove all patches from the client</span>
unpatch(app)`}
        />
        <p class="text-slate-400 text-sm mt-2">
          Note: In v0.5.0 both <code>patch()</code> and <code>unpatch()</code> emit
          <code>DeprecationWarning</code>. Use <code>KurigramClient</code> in v0.4+.
        </p>
      </section>
    </Layout>
  );
}
