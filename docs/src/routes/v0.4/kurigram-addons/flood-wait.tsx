import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function FloodWaitPage() {
  return (
    <Layout>
      <Title>Auto FloodWait — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Auto FloodWait</h1>
        <p class="text-slate-400 mb-8">
          Transparent retry with exponential backoff for Telegram <code>FloodWait</code> errors.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">With KurigramClient</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Enable at construction — all API calls automatically retry on FloodWait:
        </p>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, MemoryStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
    auto_flood_wait=<span class="num">True</span>,    <span class="cmt"># Enable auto-retry</span>
    max_flood_wait=<span class="num">60</span>,      <span class="cmt"># Max seconds to wait</span>
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Standalone Handler</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Use <code>FloodWaitHandler</code> directly for custom retry logic:
        </p>
        <CodeBlock
          title="custom_retry.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> FloodWaitHandler

handler = FloodWaitHandler(max_wait=<span class="num">30</span>, max_retries=<span class="num">2</span>)

<span class="cmt"># As a decorator</span>
<span class="dec">@handler.wrap</span>
<span class="kw">async def</span> <span class="fn">send_message</span>(client, chat_id, text):
    <span class="kw">await</span> client.send_message(chat_id, text)

<span class="cmt"># Or call directly</span>
<span class="kw">await</span> handler(client.send_message, chat_id, <span class="str">"Hello!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Behavior</h2>
        <ul class="text-slate-400 text-sm list-disc list-inside space-y-2">
          <li>If <code>FloodWait.value ≤ max_wait</code>, sleeps and retries.</li>
          <li>If <code>FloodWait.value {'>'} max_wait</code>, re-raises immediately.</li>
          <li>After <code>max_retries</code> attempts, re-raises the last error.</li>
          <li>All retries are logged at INFO level.</li>
        </ul>
      </section>
    </Layout>
  );
}
