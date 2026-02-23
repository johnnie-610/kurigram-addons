import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function RateLimitPage() {
  return (
    <Layout>
      <Title>Rate Limiting — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Rate Limiting</h1>
        <p class="text-slate-400 mb-8">
          Per-user / per-chat token-bucket rate limiter with configurable window and reply message.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Usage</h2>
        <CodeBlock
          title="rate_limit.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> RateLimit, Router

router = Router()

<span class="dec">@router.on_command</span>(<span class="str">"generate"</span>)
<span class="dec">@RateLimit</span>(per_user=<span class="num">3</span>, window=<span class="num">60</span>, message=<span class="str">"⏳ Slow down! {remaining}s left."</span>)
<span class="kw">async def</span> <span class="fn">generate</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Generating..."</span>)

<span class="cmt"># Per-chat rate limit</span>
<span class="dec">@router.on_command</span>(<span class="str">"announce"</span>)
<span class="dec">@RateLimit</span>(per_chat=<span class="num">1</span>, window=<span class="num">300</span>)
<span class="kw">async def</span> <span class="fn">announce</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Announcement!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>per_user</code></td><td>int</td><td>Max calls per user</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>per_chat</code></td><td>int</td><td>Max calls per chat</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>window</code></td><td>float</td><td>Time window in seconds (default: 60)</td></tr>
              <tr><td class="py-2"><code>message</code></td><td>str</td><td>Reply when limited. <code>{"{remaining}"}</code> = seconds left</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
