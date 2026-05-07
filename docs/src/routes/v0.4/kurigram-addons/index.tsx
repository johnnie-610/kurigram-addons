import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function KurigramAddonsOverview() {
  return (
    <Layout>
      <Title>kurigram-addons — Overview</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">kurigram-addons</h1>
        <p class="text-slate-400 mb-8">
          The unified namespace for all kurigram-addons features. Import everything from one place.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What's New in v0.4.0</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <Feature title="KurigramClient" desc="Drop-in Client subclass — replaces patch()" href="/v0.4/kurigram-addons/client" />
          <Feature title="Conversation Handler" desc="Class-based declarative FSM flows" href="/v0.4/kurigram-addons/conversation" />
          <Feature title="Menu System" desc="Declarative menus with auto back-button" href="/v0.4/kurigram-addons/menu" />
          <Feature title="Depends()" desc="FastAPI-style dependency injection" href="/v0.4/kurigram-addons/depends" />
          <Feature title="RateLimit" desc="Per-user / per-chat token bucket" href="/v0.4/kurigram-addons/rate-limit" />
          <Feature title="Command Parser" desc="Typed /command arg1 arg2 parsing" href="/v0.4/kurigram-addons/command-parser" />
          <Feature title="Auto FloodWait" desc="Transparent retry with backoff" href="/v0.4/kurigram-addons/flood-wait" />
          <Feature title="Router Shortcuts" desc="on_callback() + on_command()" href="/v0.4/pyrogram-patch/router" />
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Unified Imports</h2>
        <p class="text-slate-400 mb-4 text-sm">
          All features are available from a single namespace. Old imports from <code>pykeyboard</code> and <code>pyrogram_patch</code> still work but emit deprecation warnings.
        </p>
        <CodeBlock
          title="imports.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> (
    <span class="cmt"># Client</span>
    KurigramClient,
    <span class="cmt"># Routing</span>
    Router,
    <span class="cmt"># Keyboards</span>
    InlineKeyboard, InlineButton, ReplyKeyboard,
    <span class="cmt"># FSM</span>
    MemoryStorage, StatesGroup,
    <span class="cmt"># v0.4.0 features</span>
    Conversation, ConversationState,
    Menu,
    Depends,
    RateLimit,
    parse_command,
    FloodWaitHandler,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Migration from v0.3.x</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Replace <code>patch()</code> with <code>KurigramClient</code> and update your imports:
        </p>
        <CodeBlock
          title="Before (v0.3.x)"
          code={`<span class="cmt"># Old way</span>
<span class="imp">from</span> pyrogram <span class="imp">import</span> Client
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch
<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard

app = Client(<span class="str">"my_bot"</span>)
manager = <span class="kw">await</span> patch(app)`}
        />
        <CodeBlock
          title="After (v0.4.0)"
          code={`<span class="cmt"># New way</span>
<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, InlineKeyboard, MemoryStorage

app = KurigramClient(<span class="str">"my_bot"</span>, storage=MemoryStorage())
app.include_router(router)
app.run()`}
        />
      </section>
    </Layout>
  );
}

function Feature(props: { title: string; desc: string; href: string }) {
  return (
    <a
      href={props.href}
      class="block p-4 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "var(--color-surface)" }}
    >
      <div class="font-semibold text-sm mb-1">{props.title}</div>
      <div class="text-xs text-slate-500">{props.desc}</div>
    </a>
  );
}
