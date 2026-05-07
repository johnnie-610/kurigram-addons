import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";

export default function Home() {
  return (
    <Layout>
      <Title>kurigram-addons — Modern Telegram Bot Toolkit</Title>

      {/* Hero */}
      <section class="hero-gradient rounded-2xl p-8 sm:p-12 mb-12 animate-fade-in-up">
        <div class="flex flex-col items-center text-center">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="kurigram-addons"
            class="w-20 h-20 rounded-2xl mb-6 animate-float shadow-lg shadow-amber-500/20"
          />
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            <span class="hero-text-gradient">kurigram-addons</span>
          </h1>
          <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed">
            A production-grade toolkit for building Telegram bots with
            <strong class="text-amber-400"> Kurigram/Pyrogram</strong>.
            All-in-one client, declarative keyboards, conversations, dependency injection,
            FSM with SQLite/Redis persistence, middleware pipelines, i18n, broadcasting,
            testing utilities, and health monitoring.
          </p>
          <div class="flex flex-wrap gap-3 justify-center">
            <a
              href="/getting-started"
              target="_self"
              class="px-6 py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
            >
              Get Started
            </a>
            <a
              href="https://github.com/johnnie-610/kurigram-addons"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-2.5 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
            >
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section class="grid sm:grid-cols-2 gap-4 mb-12 stagger">
        <FeatureCard
          icon="🤖"
          title="KurigramClient"
          description="Drop-in Client subclass with built-in middleware, FSM, routing, FloodWait handling, lifecycle hooks, and HTTP health server — replaces the legacy patch() API."
          href="/kurigram-addons/client"
        />
        <FeatureCard
          icon="⌨️"
          title="Keyboards & CallbackData"
          description="Type-safe, declarative keyboard framework with inline/reply keyboards, pagination, language selection, builder API, and strongly-typed CallbackData factory for safe callback routing."
          href="/pykeyboard/inline-keyboard"
        />
        <FeatureCard
          icon="💬"
          title="Conversations"
          description="Class-based multi-step conversations with declarative state definitions, auto-registered handlers, type-safe context passing, and inactivity timeouts."
          href="/kurigram-addons/conversation"
        />
        <FeatureCard
          icon="🔧"
          title="Routing & FSM"
          description="Hierarchical routers with regex capture group injection, finite state machines with CAS-protected transitions, state history ring-buffer, and State.filter() shorthand."
          href="/pyrogram-patch/router"
        />
        <FeatureCard
          icon="📦"
          title="Storage Backends"
          description="Pluggable FSM storage — MemoryStorage for development, SQLiteStorage for zero-infra persistence, and RedisStorage with circuit breaker for production."
          href="/pyrogram-patch/storage"
        />
        <FeatureCard
          icon="💉"
          title="Dependency Injection"
          description="DIContainer with FastAPI-style Depends() marker. Register providers by type — async generators, functions, values, or classes — and inject into handlers automatically."
          href="/kurigram-addons/depends"
        />
        <FeatureCard
          icon="📢"
          title="Broadcast"
          description="Async-generator bulk sender with automatic FloodWait absorption, per-user result streaming, and silent skip of blocked/deactivated users."
          href="/kurigram-addons/broadcast"
        />
        <FeatureCard
          icon="🌍"
          title="i18n & Testing"
          description="I18nMiddleware auto-detects user language and injects _() translator. Testing module provides MockClient, factory functions, and ConversationTester for unit testing without Telegram."
          href="/kurigram-addons/i18n"
        />
      </section>

      {/* Quick install */}
      <section class="mb-12 animate-fade-in-up" style="animation-delay: 0.3s">
        <h2 class="text-2xl font-bold mb-4">Quick Install</h2>
        <pre class="!mb-0">
          <code>
            <span class="cmt"># Using pip</span>{"\n"}
            pip install kurigram-addons{"\n\n"}
            <span class="cmt"># With all optional backends</span>{"\n"}
            pip install kurigram-addons[all]{"\n\n"}
            <span class="cmt"># Using Poetry</span>{"\n"}
            poetry add kurigram-addons
          </code>
        </pre>
      </section>

      {/* Requirements */}
      <section class="mb-12 animate-fade-in-up" style="animation-delay: 0.4s">
        <h2 class="text-2xl font-bold mb-4">Requirements</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Requirement label="Python" value="≥ 3.10" />
          <Requirement label="Kurigram" value="≥ 2.1.35" />
          <Requirement label="Pydantic" value="≥ 2.11.7" />
          <Requirement label="Version" value="0.5.0" />
        </div>
        <p class="text-xs text-slate-500 mt-3">
          Redis ≥ 6.0.0 and aiosqlite ≥ 0.22.1 are optional — install with <code>[redis]</code>, <code>[sqlite]</code>, or <code>[all]</code>.
        </p>
      </section>
    </Layout>
  );
}

function FeatureCard(props: { icon: string; title: string; description: string; href: string }) {
  return (
    <a
      href={props.href}
      target="_self"
      class="group block p-5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
      style={{ background: "var(--color-surface)" }}
    >
      <div class="text-2xl mb-3">{props.icon}</div>
      <h3 class="text-lg font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">{props.title}</h3>
      <p class="text-sm text-slate-400 leading-relaxed">{props.description}</p>
    </a>
  );
}

function Requirement(props: { label: string; value: string }) {
  return (
    <div class="p-3 rounded-lg border border-white/10 text-center" style={{ background: "var(--color-surface)" }}>
      <div class="text-xs text-slate-500 mb-1">{props.label}</div>
      <div class="text-sm font-mono font-semibold text-amber-400">{props.value}</div>
    </div>
  );
}
