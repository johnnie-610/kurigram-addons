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
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What's New in v0.5.0</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <Feature title="Broadcast" desc="Async-generator bulk sender with FloodWait handling" href="/kurigram-addons/broadcast" />
          <Feature title="DIContainer + Depends" desc="FastAPI-style dependency injection for handlers" href="/kurigram-addons/depends" />
          <Feature title="I18nMiddleware" desc="Auto-detect user language, inject _() translator" href="/kurigram-addons/i18n" />
          <Feature title="HealthServer" desc="Lightweight HTTP health endpoint for K8s / Docker" href="/kurigram-addons/health" />
          <Feature title="SQLiteStorage" desc="Persistent FSM storage with zero infrastructure" href="/pyrogram-patch/storage/sqlite" />
          <Feature title="CallbackData Factory" desc="Strongly-typed callback data with pack/unpack/filter" href="/pykeyboard/callback-data" />
          <Feature title="MiddlewareContext" desc="Structured single-arg middleware calling convention" href="/pyrogram-patch/middleware/writing" />
          <Feature title="Per-Handler Middleware" desc="@use_middleware() — attach guards to specific handlers" href="/pyrogram-patch/middleware/per-handler" />
          <Feature title="Testing Module" desc="MockClient, factory functions, ConversationTester" href="/kurigram-addons/testing" />
          <Feature title="Router.on_callback_data()" desc="Regex capture group injection for callback queries" href="/pyrogram-patch/router" />
          <Feature title="FSM State History" desc="push_history() / get_history() audit ring-buffer" href="/pyrogram-patch/fsm/history" />
          <Feature title="State.filter()" desc="Ergonomic shorthand replacing stringly-typed StateFilter" href="/pyrogram-patch/fsm/states" />
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Carried Over from v0.4</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <Feature title="KurigramClient" desc="Drop-in Client subclass — replaces patch()" href="/kurigram-addons/client" />
          <Feature title="Conversation Handler" desc="Class-based declarative FSM flows" href="/kurigram-addons/conversation" />
          <Feature title="Menu System" desc="Declarative menus with auto back-button" href="/kurigram-addons/menu" />
          <Feature title="RateLimit" desc="Per-user / per-chat token bucket decorator" href="/kurigram-addons/rate-limit" />
          <Feature title="Command Parser" desc="Typed /command arg1 arg2 parsing" href="/kurigram-addons/command-parser" />
          <Feature title="Auto FloodWait" desc="Transparent retry with backoff" href="/kurigram-addons/flood-wait" />
          <Feature title="Lifecycle Hooks" desc="on_startup / on_shutdown async callbacks" href="/kurigram-addons/lifecycle-hooks" />
          <Feature title="Router Shortcuts" desc="on_callback() + on_command()" href="/pyrogram-patch/router" />
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
    InlineKeyboard, InlineButton, ReplyKeyboard, CallbackData,
    <span class="cmt"># FSM & Storage</span>
    MemoryStorage, SQLiteStorage, StatesGroup, State,
    <span class="cmt"># Conversations & Menus</span>
    Conversation, ConversationState, Menu,
    <span class="cmt"># Middleware</span>
    MiddlewareContext, use_middleware, I18nMiddleware,
    <span class="cmt"># Dependency Injection</span>
    DIContainer, Depends,
    <span class="cmt"># Utilities</span>
    broadcast, BroadcastResult,
    parse_command, RateLimit, FloodWaitHandler,
    <span class="cmt"># Testing</span>
    MockClient, make_message, make_callback_query, ConversationTester,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Start</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Replace <code>patch()</code> with <code>KurigramClient</code> and import from a single package:
        </p>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, Router, MemoryStorage

router = Router()

<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Hello!"</span>)

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
    auto_flood_wait=<span class="num">True</span>,
    health_port=<span class="num">8080</span>,
)
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
