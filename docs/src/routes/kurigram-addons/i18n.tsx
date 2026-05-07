import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function I18nPage() {
  return (
    <Layout>
      <Title>i18n Middleware — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">i18n Middleware</h1>
        <p class="text-slate-400 mb-2">
          Auto-detects user language from their Telegram profile and injects a <code>_()</code> translation callable
          into every handler via the patch helper.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">JSON locale files</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Create one JSON file per language under your <code>locales/</code> directory:
        </p>
        <CodeBlock
          language="json"
          title="locales/en.json"
          code={`{
  <span class="str">"welcome"</span>: <span class="str">"Welcome!"</span>,
  <span class="str">"farewell"</span>: <span class="str">"Goodbye!"</span>
}`}
        />
        <CodeBlock
          language="json"
          title="locales/ru.json"
          code={`{
  <span class="str">"welcome"</span>: <span class="str">"Добро пожаловать!"</span>,
  <span class="str">"farewell"</span>: <span class="str">"До свидания!"</span>
}`}
        />
        <CodeBlock
          title="setup.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> I18nMiddleware

i18n = I18nMiddleware(
    default_lang=<span class="str">"en"</span>,
    locales_path=<span class="str">"locales"</span>,
    use_json=<span class="num">True</span>,
)

<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">setup</span>():
    <span class="kw">await</span> app.include_middleware(i18n, kind=<span class="str">"before"</span>)

<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message, patch_helper):
    _ = <span class="kw">await</span> patch_helper.get(<span class="str">"_"</span>) <span class="kw">or</span> (<span class="kw">lambda</span> k: k)
    <span class="kw">await</span> message.reply(_(<span class="str">"welcome"</span>))`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">GNU gettext (.po/.mo files)</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Omit <code>use_json=True</code>. The directory layout must follow the gettext convention:
        </p>
        <CodeBlock
          language="text"
          title="locales layout"
          code={`locales/
  en/LC_MESSAGES/bot.mo
  ru/LC_MESSAGES/bot.mo`}
        />
        <CodeBlock
          title="gettext_setup.py"
          code={`i18n = I18nMiddleware(
    default_lang=<span class="str">"en"</span>,
    locales_path=<span class="str">"locales"</span>,
    domain=<span class="str">"bot"</span>,      <span class="cmt"># matches the .mo filename</span>
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>default_lang</code></td><td>str</td><td>"en"</td><td>Fallback language code</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>locales_path</code></td><td>str</td><td>"locales"</td><td>Path to locale files directory</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>domain</code></td><td>str</td><td>"bot"</td><td>gettext domain (matches .mo filename)</td></tr>
              <tr><td class="py-2"><code>use_json</code></td><td>bool</td><td>False</td><td>Load JSON files instead of .mo</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Notes</h2>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>Language codes are normalised: <code>"en-US"</code> → <code>"en"</code>.</li>
          <li>If a key is missing in the user's language, the default language is tried, then the key itself is returned.</li>
          <li>Translators are cached per language code — only loaded once at first request.</li>
          <li>The detected language is also stored under <code>"__lang__"</code> in the helper data.</li>
        </ul>
      </section>
    </Layout>
  );
}
