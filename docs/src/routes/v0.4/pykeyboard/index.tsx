import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PyKeyboardOverview() {
  return (
    <Layout>
      <Title>PyKeyboard — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">⌨️</span>
          <h1 class="text-3xl font-bold">PyKeyboard</h1>
        </div>
        <p class="text-slate-400 mb-8 text-lg">
          A declarative, type-safe UI framework for building Telegram keyboards with Pydantic validation,
          automatic row layout, and production-ready features.
        </p>
      </div>

      {/* Core imports */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Import Map</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> (
    InlineKeyboard,    <span class="cmt"># Inline keyboard with pagination & languages</span>
    InlineButton,      <span class="cmt"># Button for inline keyboards</span>
    ReplyKeyboard,     <span class="cmt"># Reply keyboard markup</span>
    ReplyButton,       <span class="cmt"># Button for reply keyboards</span>
    KeyboardBuilder,   <span class="cmt"># Fluent builder API</span>
    KeyboardFactory,   <span class="cmt"># One-liner preset keyboards</span>
)`}
        />
      </section>

      {/* Quick example */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Example</h2>
        <CodeBlock
          title="3 buttons, 2 per row"
          code={`kb = InlineKeyboard(row_width=<span class="num">2</span>)
kb.add(
    InlineButton(text=<span class="str">"Option A"</span>, callback_data=<span class="str">"a"</span>),
    InlineButton(text=<span class="str">"Option B"</span>, callback_data=<span class="str">"b"</span>),
    InlineButton(text=<span class="str">"Option C"</span>, callback_data=<span class="str">"c"</span>),
)
<span class="cmt"># Produces: [A][B]</span>
<span class="cmt">#           [C]</span>

<span class="kw">await</span> message.reply(<span class="str">"Choose:"</span>, reply_markup=kb)`}
        />
      </section>

      {/* Feature grid */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Features</h2>
        <div class="grid sm:grid-cols-2 gap-3 stagger">
          <Feature title="Inline Keyboard" href="/v0.4/pykeyboard/inline-keyboard" desc="Full-featured inline keyboards with callback data, URL buttons, web apps, and more" />
          <Feature title="Reply Keyboard" href="/v0.4/pykeyboard/reply-keyboard" desc="Reply keyboard markup with contact, location, poll request, and one-time options" />
          <Feature title="Pagination" href="/v0.4/pykeyboard/pagination" desc="Built-in pagination with duplicate prevention and configurable navigation symbols" />
          <Feature title="Language Selection" href="/v0.4/pykeyboard/languages" desc="Language picker keyboards with custom locale support" />
          <Feature title="Builder API" href="/v0.4/pykeyboard/builder" desc="Fluent chainable interface with validation hooks and button transforms" />
          <Feature title="Factory Presets" href="/v0.4/pykeyboard/factory" desc="One-liner keyboards: confirmation, menu, rating, pagination, and language" />
          <Feature title="Validation & Hooks" href="/v0.4/pykeyboard/hooks" desc="Button validation rules, keyboard construction hooks, and error handling" />
          <Feature title="Utilities" href="/v0.4/pykeyboard/utilities" desc="Config-driven keyboard creation, introspection, and validation helpers" />
        </div>
      </section>

      {/* Key concepts */}
      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Key Concepts</h2>
        <div class="space-y-4 text-sm text-slate-300">
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <h3 class="font-semibold text-white mb-1">Automatic Row Wrapping</h3>
            <p class="text-slate-400">
              Every keyboard has a <code>row_width</code> parameter. When you <code>add()</code> buttons,
              they automatically wrap into rows of that width — no manual row management needed.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <h3 class="font-semibold text-white mb-1">Pydantic Validation</h3>
            <p class="text-slate-400">
              All button types use Pydantic models for strict type validation. Invalid text (empty strings)
              or conflicting button types are caught at construction time, not at Telegram API call time.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-white/10" style={{ background: "var(--color-surface)" }}>
            <h3 class="font-semibold text-white mb-1">Direct Pyrogram Integration</h3>
            <p class="text-slate-400">
              Keyboards are passed directly to Pyrogram's <code>reply_markup</code> parameter.
              No conversion step needed — the library handles Pyrogram type conversion internally.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Feature(props: { title: string; href: string; desc: string }) {
  return (
    <a target="_self"
      href={props.href}
      class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "var(--color-surface)" }}
    >
      <div class="font-semibold text-sm mb-1">{props.title}</div>
      <div class="text-xs text-slate-500">{props.desc}</div>
    </a>
  );
}
