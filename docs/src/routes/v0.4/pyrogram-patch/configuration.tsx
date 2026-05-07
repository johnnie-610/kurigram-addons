import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Configuration — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Configuration</h1>
        <p class="text-slate-400 mb-8">Global configuration for pyrogram_patch including logging, pool sizes, and default behaviors.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Environment Variables</h2>
        <table>
          <thead><tr><th>Variable</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>PYROGRAM_PATCH_LOG_LEVEL</code></td><td><code>INFO</code></td><td>Logging level for framework internals</td></tr>
            <tr><td><code>PYROGRAM_PATCH_POOL_TTL</code></td><td><code>300</code></td><td>PatchHelper pool TTL in seconds</td></tr>
            <tr><td><code>PYROGRAM_PATCH_REDIS_PREFIX</code></td><td><code>pyrogram_patch:</code></td><td>Default Redis key prefix</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
