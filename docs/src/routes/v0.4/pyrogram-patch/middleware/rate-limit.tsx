import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Rate Limiting — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Rate Limiting</h1>
        <p class="text-slate-400 mb-8">Built-in rate limiting middleware with per-user token bucket and customizable responses.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Usage</h2>
        <CodeBlock code={`from pyrogram_patch.middleware import RateLimitMiddleware

rate_limiter = RateLimitMiddleware(
    limit=5,              # max requests
    period=60,            # per 60 seconds
    on_limited=lambda u: u.reply("Too many requests. Please wait."),
)
await manager.add_middleware(rate_limiter, kind="before", priority=100)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Parameters</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>limit</code></td><td><code>int</code></td><td>—</td><td>Max number of requests per period</td></tr>
            <tr><td><code>period</code></td><td><code>float</code></td><td>—</td><td>Time window in seconds</td></tr>
            <tr><td><code>on_limited</code></td><td><code>Callable</code></td><td><code>None</code></td><td>Callback when rate limit is hit</td></tr>
            <tr><td><code>key_func</code></td><td><code>Callable</code></td><td>user ID</td><td>Function to extract rate limit key from update</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
