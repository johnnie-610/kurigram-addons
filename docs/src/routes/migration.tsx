import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function MigrationPage() {
  return (
    <Layout>
      <Title>Migration Guide — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Migration Guide</h1>
        <p class="text-slate-400 mb-8">
          Step-by-step guides for upgrading between major versions of kurigram-addons.
        </p>
      </div>

      {/* ── v0.4 → v0.5 ──────────────────────────────────────────────────── */}

      <section class="mb-10 reveal">
        <h2 class="text-2xl font-bold mb-6 text-amber-400">v0.4.x → v0.5.0</h2>

        <div class="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mb-6 text-sm text-slate-300">
          <strong class="text-amber-400">Summary:</strong> v0.5.0 fixes many concurrency bugs, adds new features
          (broadcast, DI, i18n, health, SQLiteStorage, testing, per-handler middleware), and
          changes a few APIs. Most v0.4 code works without changes, but review the breaking
          items below.
        </div>
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Breaking Changes</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Change</th><th>Before (v0.4)</th><th>After (v0.5)</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>PatchHelper.data</code></td>
                <td>Async property (broken — returned coroutine)</td>
                <td><code>await helper.get_data()</code> method</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>ConversationContext.data</code></td>
                <td>Property (raised <code>AttributeError</code>)</td>
                <td><code>await ctx.get_data(model=None)</code></td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>get_statistics()</code></td>
                <td>Returns <code>Dict[str, Any]</code></td>
                <td>Returns <code>PoolStatistics</code> frozen dataclass (use <code>.active_helpers</code> not <code>["active_helpers"]</code>)</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2">Custom storage backends</td>
                <td>—</td>
                <td>Must implement new <code>increment(id, amount, *, ttl)</code> abstract method</td>
              </tr>
              <tr>
                <td class="py-2"><code>RateLimitMiddleware</code></td>
                <td>CAS-based counters (broken — always read 0)</td>
                <td>Rewritten to use <code>storage.increment()</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">New Deprecations in v0.5</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Deprecated</th><th>Replacement</th><th>Removal</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>patch()</code> / <code>unpatch()</code></td>
                <td>Use <code>KurigramClient</code></td>
                <td>v1.0.0</td>
              </tr>
              <tr>
                <td class="py-2"><code>get_circuit_breaker(name)</code></td>
                <td>Instantiate <code>AsyncCircuitBreaker</code> directly</td>
                <td>v1.0.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Recommended Middleware Update</h3>
        <p class="text-slate-400 text-sm mb-4">
          v0.5 introduces <code>MiddlewareContext</code> — a single structured object that replaces
          positional parameter name sniffing. Both conventions work, but the new form is preferred
          for IDE support:
        </p>
        <CodeBlock
          title="Before (v0.4)"
          code={`<span class="kw">async def</span> <span class="fn">my_middleware</span>(update, client, patch_helper):
    data = <span class="kw">await</span> patch_helper.get_data()
    ...`}
        />
        <div class="my-4 flex items-center gap-2 text-amber-400 text-sm font-medium">
          <span>⬇️</span> becomes <span>⬇️</span>
        </div>
        <CodeBlock
          title="After (v0.5 — preferred)"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> MiddlewareContext

<span class="kw">async def</span> <span class="fn">my_middleware</span>(ctx: MiddlewareContext):
    data = <span class="kw">await</span> ctx.helper.get_data()
    ...`}
        />
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">New Features to Adopt</h3>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li><strong>SQLiteStorage</strong> — persistent FSM without Redis. <code>pip install kurigram-addons[sqlite]</code></li>
          <li><strong>DIContainer</strong> — register providers, handlers get deps injected by type annotation</li>
          <li><strong>broadcast()</strong> — bulk send to user list with FloodWait handling</li>
          <li><strong>I18nMiddleware</strong> — auto-detect language, inject <code>_()</code> translator</li>
          <li><strong>HealthServer</strong> — pass <code>health_port=8080</code> to KurigramClient for <code>GET /health</code></li>
          <li><strong>@use_middleware()</strong> — attach guards to individual handlers instead of globally</li>
          <li><strong>CallbackData</strong> — strongly-typed callback data with <code>pack()</code> / <code>unpack()</code> / <code>filter()</code></li>
          <li><strong>Testing module</strong> — <code>MockClient</code>, <code>make_message()</code>, <code>ConversationTester</code> for unit tests</li>
          <li><strong>State.filter()</strong> — replaces <code>StateFilter("Registration:name")</code> with <code>Registration.name.filter()</code></li>
          <li><strong>FSM history</strong> — <code>push_history()</code> / <code>get_history()</code> state transition audit trail</li>
          <li><strong>Conversation.timeout</strong> — class-level inactivity timeout auto-expires FSM state</li>
          <li><strong>Router.on_callback_data(pattern)</strong> — regex capture groups injected as handler kwargs</li>
        </ul>
      </section>

      {/* ── v0.3 → v0.4 ──────────────────────────────────────────────────── */}

      <div class="border-t border-white/10 my-12 pt-8">
        <h2 class="text-2xl font-bold mb-6 text-amber-400">v0.3.x → v0.4.x</h2>
      </div>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Import Changes</h3>
        <p class="text-slate-400 text-sm mb-4">
          Everything is now available from a single package:
        </p>
        <CodeBlock
          title="Before (v0.3.x)"
          code={`<span class="cmt"># Keyboards — separate pykeyboard package</span>
<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton
<span class="imp">from</span> pykeyboard <span class="imp">import</span> ReplyKeyboard, ReplyButton

<span class="cmt"># Routing — separate pyrogram_patch package</span>
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch, StopPropagation

<span class="cmt"># FSM & Storage — deep imports</span>
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> StateItem, StatesGroup
<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> MemoryStorage
<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> RedisStorage`}
        />
        <div class="my-4 flex items-center gap-2 text-amber-400 text-sm font-medium">
          <span>⬇️</span> becomes <span>⬇️</span>
        </div>
        <CodeBlock
          title="After (v0.4.x+)"
          code={`<span class="cmt"># Everything from one package</span>
<span class="imp">from</span> kurigram_addons <span class="imp">import</span> (
    <span class="cmt"># Client</span>
    KurigramClient,

    <span class="cmt"># Keyboards</span>
    InlineKeyboard, InlineButton,
    ReplyKeyboard, ReplyButton,

    <span class="cmt"># Routing & FSM</span>
    Router, State, StatesGroup,
    MemoryStorage, RedisStorage,

    <span class="cmt"># Utilities</span>
    Conversation, ConversationState,
    Menu, parse_command, RateLimit, Depends,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Client Setup</h3>
        <p class="text-slate-400 text-sm mb-4">
          The <code>patch()</code> function is replaced by <code>KurigramClient</code>:
        </p>
        <CodeBlock
          title="Before (v0.3.x)"
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> Client
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch

app = Client(<span class="str">"my_bot"</span>)
patched = patch(app)`}
        />
        <div class="my-4 flex items-center gap-2 text-amber-400 text-sm font-medium">
          <span>⬇️</span> becomes <span>⬇️</span>
        </div>
        <CodeBlock
          title="After (v0.4.x+)"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, MemoryStorage

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
    auto_flood_wait=<span class="num">True</span>,
)
app.run()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Breaking Changes in v0.4.1</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Change</th><th>Before</th><th>After</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>parse_command</code></td>
                <td>Returns empty dict on missing args</td>
                <td>Raises <code>CommandParseError</code></td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>Menu._registry</code></td>
                <td>Strong references (leaks)</td>
                <td><code>WeakValueDictionary</code> (auto-cleanup)</td>
              </tr>
              <tr>
                <td class="py-2"><code>RateLimit</code> buckets</td>
                <td>Unbounded <code>defaultdict</code></td>
                <td>Bounded <code>OrderedDict</code> (max 10k, LRU)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h3 class="text-lg font-semibold mb-4 text-teal-400">Backward Compatibility</h3>
        <p class="text-slate-400 text-sm">
          The old <code>from pykeyboard import ...</code> and <code>from pyrogram_patch import ...</code> paths
          still work. However, we recommend migrating to <code>from kurigram_addons import ...</code> for:
        </p>
        <ul class="text-slate-400 text-sm list-disc list-inside mt-3 space-y-1.5">
          <li><strong>Simpler imports</strong> — one package instead of three</li>
          <li><strong>Consistent API</strong> — access to new features like <code>KurigramClient</code>, lifecycle hooks, and <code>Conversation</code></li>
          <li><strong>Future-proof</strong> — legacy import paths will be removed in v1.0.0</li>
        </ul>
      </section>
    </Layout>
  );
}
