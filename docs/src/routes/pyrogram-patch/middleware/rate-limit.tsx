import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function RateLimitMiddlewarePage() {
  return (
    <Layout>
      <Title>Rate Limiting Middleware — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">RateLimitMiddleware</h1>
        <p class="text-slate-400 mb-8">
          Global before-middleware that enforces per-user request rate limits using
          the FSM storage's atomic <code>increment()</code> counter. In v0.5.0 the
          implementation was completely rewritten — a single storage call replaces
          the previous broken CAS loop.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Setup</h2>
        <CodeBlock
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> RateLimitMiddleware, KurigramClient, MemoryStorage

app = KurigramClient(<span class="str">"bot"</span>, bot_token=<span class="str">"TOKEN"</span>, storage=MemoryStorage())

<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">setup_middleware</span>(client):
    rate_limiter = RateLimitMiddleware(
        limit=<span class="num">5</span>,       <span class="cmt"># max 5 requests</span>
        period=<span class="num">60</span>,     <span class="cmt"># per 60-second window</span>
    )
    <span class="kw">await</span> client.include_middleware(rate_limiter, kind=<span class="str">"before"</span>, priority=<span class="num">100</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Custom Response When Limited</h2>
        <CodeBlock
          code={`<span class="kw">async def</span> <span class="fn">on_limited</span>(update, client):
    <span class="kw">if</span> hasattr(update, <span class="str">"reply"</span>):
        <span class="kw">await</span> update.reply(<span class="str">"⏳ Too many requests — please wait a moment."</span>)

rate_limiter = RateLimitMiddleware(
    limit=<span class="num">5</span>,
    period=<span class="num">60</span>,
    on_limited=on_limited,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Custom Key Function</h2>
        <p class="text-slate-400 text-sm mb-4">
          By default requests are bucketed per user ID. Supply <code>key_func</code>
          to bucket by chat, IP, or any other dimension.
        </p>
        <CodeBlock
          code={`<span class="kw">def</span> <span class="fn">key_by_chat</span>(update) -> str:
    chat = getattr(update, <span class="str">"chat"</span>, None)
    <span class="kw">return</span> <span class="str">f"chat:{chat.id}"</span> <span class="kw">if</span> chat <span class="kw">else</span> <span class="str">"unknown"</span>

rate_limiter = RateLimitMiddleware(
    limit=<span class="num">20</span>, period=<span class="num">60</span>,
    key_func=key_by_chat,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>limit</code></td><td>int</td><td>—</td><td>Max requests per window (required)</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>period</code></td><td>float</td><td>—</td><td>Window duration in seconds (required)</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>on_limited</code></td><td>Callable | None</td><td>None</td><td>Async callback when limit exceeded; receives (update, client)</td></tr>
              <tr><td class="py-2"><code>key_func</code></td><td>Callable | None</td><td>user ID</td><td>Extract rate-limit bucket key from update</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">How It Works</h2>
        <p class="text-slate-400 text-sm">
          Each request calls <code>storage.increment(key, amount=1, ttl=period)</code>,
          which atomically increments a counter and sets a TTL if the key is new.
          If the returned count exceeds <code>limit</code>, <code>on_limited</code>
          is called and the handler is skipped. Counters are stored under a dedicated
          <code>__rl__:</code> key namespace to prevent collisions with real FSM state.
        </p>
      </section>
    </Layout>
  );
}
