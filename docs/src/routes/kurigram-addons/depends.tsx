import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function DependsPage() {
  return (
    <Layout>
      <Title>Dependency Injection — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Dependency Injection</h1>
        <p class="text-slate-400 mb-8">
          FastAPI-style <code>Depends()</code> for handler parameters with per-request caching.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          title="depends_example.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> Depends, Router

router = Router()

<span class="kw">async def</span> <span class="fn">get_user</span>(client, update):
    <span class="cmt"># Called once per request, result is cached</span>
    <span class="kw">return await</span> db.fetch_user(update.from_user.id)

<span class="kw">async def</span> <span class="fn">get_settings</span>(client, update):
    <span class="kw">return await</span> db.fetch_settings(update.from_user.id)

<span class="dec">@router.on_command</span>(<span class="str">"profile"</span>)
<span class="kw">async def</span> <span class="fn">profile</span>(client, message, user=Depends(get_user)):
    <span class="kw">await</span> message.reply(<span class="str">f"Hello, </span>{user.name}<span class="str">!"</span>)

<span class="dec">@router.on_command</span>(<span class="str">"settings"</span>)
<span class="kw">async def</span> <span class="fn">settings</span>(client, message,
    user=Depends(get_user),
    prefs=Depends(get_settings)
):
    <span class="kw">await</span> message.reply(<span class="str">f"</span>{user.name}<span class="str">'s settings: </span>{prefs}<span class="str">"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">How It Works</h2>
        <ul class="text-slate-400 text-sm list-disc list-inside space-y-2">
          <li>Declare dependencies as default parameter values using <code>Depends(fn)</code>.</li>
          <li>The framework inspects the handler signature and resolves dependencies before calling it.</li>
          <li>Dependencies receive <code>(client, update)</code> as arguments.</li>
          <li>Results are cached per-request by default — the same dependency called twice in one request only executes once.</li>
          <li>Set <code>Depends(fn, cache=False)</code> to disable caching.</li>
        </ul>
      </section>
    </Layout>
  );
}
