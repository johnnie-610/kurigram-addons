import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function LanguagesPage() {
  return (
    <Layout>
      <Title>Language Selection — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Language Selection</h1>
        <p class="text-slate-400 mb-8">Built-in language picker keyboards with 65+ locale codes, flag emojis, and custom locale support.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard

kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.languages(
    locales=[<span class="str">"en"</span>, <span class="str">"es"</span>, <span class="str">"fr"</span>, <span class="str">"de"</span>, <span class="str">"ja"</span>, <span class="str">"ko"</span>],
    callback_pattern=<span class="str">"lang_{}"</span>,  <span class="cmt"># {} → locale code</span>
)

<span class="cmt"># Produces:</span>
<span class="cmt"># [🇬🇧 English] [🇪🇸 Español]</span>
<span class="cmt"># [🇫🇷 Français] [🇩🇪 Deutsch]</span>
<span class="cmt"># [🇯🇵 日本語]   [🇰🇷 한국어]</span>

<span class="kw">await</span> message.reply(<span class="str">"Choose language:"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Custom Locales</h2>
        <p class="text-sm text-slate-400 mb-4">Add languages not in the built-in list using <code>custom_locales</code>:</p>
        <CodeBlock code={`kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.custom_locales = {
    <span class="str">"pirate"</span>: <span class="str">"🏴‍☠️ Pirate"</span>,
    <span class="str">"klingon"</span>: <span class="str">"🖖 Klingon"</span>,
}
kb.languages(
    locales=[<span class="str">"en"</span>, <span class="str">"pirate"</span>, <span class="str">"klingon"</span>],
    callback_pattern=<span class="str">"lang_{}"</span>,
)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Error Handling</h2>
        <p class="text-sm text-slate-400 mb-4">
          A <code>LocaleError</code> is raised if you pass an unrecognized locale code that isn't
          in the built-in list or your <code>custom_locales</code>.
        </p>
      </section>
    </Layout>
  );
}
