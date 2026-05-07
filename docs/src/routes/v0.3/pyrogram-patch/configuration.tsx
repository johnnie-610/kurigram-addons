import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3ConfigurationPage() {
  return (
    <Layout>
      <Title>Configuration — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Configuration</h1>
        <p class="text-slate-400 mb-8">
          pyrogram_patch reads settings from environment variables via Pydantic Settings.
          All variables are optional with sensible defaults.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Environment Variables</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Variable</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>PYROGRAM_PATCH_CB_FALLBACK_MESSAGE</code></td><td>""</td><td>Default text sent when a callback handler has no explicit answer</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>PYROGRAM_PATCH_LOG_LEVEL</code></td><td>WARNING</td><td>Log level for the pyrogram_patch logger</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Accessing Config in Code</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch.config <span class="imp">import</span> settings

print(settings.cb_fallback_message)
print(settings.log_level)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">.env File</h2>
        <CodeBlock
          title=".env"
          code={`PYROGRAM_PATCH_CB_FALLBACK_MESSAGE=Processing...
PYROGRAM_PATCH_LOG_LEVEL=DEBUG`}
        />
      </section>
    </Layout>
  );
}
