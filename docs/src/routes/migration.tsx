import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function MigrationPage() {
  return (
    <Layout>
      <Title>Migration from v0.3.x — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Migration from v0.3.x</h1>
        <p class="text-slate-400 mb-8">
          In v0.4.x, <code>pykeyboard</code> and <code>pyrogram_patch</code> were merged into the
          unified <code>kurigram_addons</code> namespace. Old import paths still work for backward
          compatibility, but we recommend updating to the new imports.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Import Changes</h2>
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
          title="After (v0.4.x)"
          code={`<span class="cmt"># Everything from one package</span>
<span class="imp">from</span> kurigram_addons <span class="imp">import</span> (
    <span class="cmt"># Client</span>
    KurigramClient,

    <span class="cmt"># Keyboards</span>
    InlineKeyboard, InlineButton,
    ReplyKeyboard, ReplyButton,

    <span class="cmt"># Routing & FSM</span>
    Router, StateItem, StatesGroup,
    MemoryStorage, RedisStorage,

    <span class="cmt"># Utilities</span>
    Conversation, ConversationState,
    Menu, parse_command, RateLimit, Depends,
)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Client Setup</h2>
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
          title="After (v0.4.x)"
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
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Breaking Changes in v0.4.1</h2>
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
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Backward Compatibility</h2>
        <p class="text-slate-400 text-sm">
          The old <code>from pykeyboard import ...</code> and <code>from pyrogram_patch import ...</code> paths
          still work. However, we recommend migrating to <code>from kurigram_addons import ...</code> for:
        </p>
        <ul class="text-slate-400 text-sm list-disc list-inside mt-3 space-y-1.5">
          <li><strong>Simpler imports</strong> — one package instead of three</li>
          <li><strong>Consistent API</strong> — access to new features like <code>KurigramClient</code>, lifecycle hooks, and <code>Conversation</code></li>
          <li><strong>Future-proof</strong> — legacy import paths may be deprecated in a future release</li>
        </ul>
      </section>
    </Layout>
  );
}
