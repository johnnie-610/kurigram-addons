import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function GettingStarted() {
  return (
    <Layout>
      <Title>Getting Started — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Getting Started</h1>
        <p class="text-slate-400 mb-8">Get up and running with kurigram-addons in under 5 minutes.</p>
      </div>

      {/* Installation */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Installation</h2>
        <CodeBlock
          title="pip"
          code={`pip install kurigram-addons`}
        />
        <CodeBlock
          title="Poetry"
          code={`poetry add kurigram-addons`}
        />
        <p class="text-sm text-slate-400 mt-3">
          <strong>Requirements:</strong> Python ≥ 3.10, Kurigram ≥ 2.1.35.
          Redis ≥ 6.0.0 is only needed if you use <code>RedisStorage</code> for FSM.
        </p>
      </section>

      {/* Minimal Bot */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Minimal Bot with Keyboards</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Create a bot that responds with an inline keyboard when the user types <code>/start</code>.
        </p>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, Router, InlineKeyboard, MemoryStorage

router = Router()

<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    kb = InlineKeyboard(row_width=<span class="num">2</span>)
    kb.button(<span class="str">"🔍 Search"</span>, callback=<span class="str">"search"</span>)
    kb.button(<span class="str">"⚙️ Settings"</span>, callback=<span class="str">"settings"</span>)
    kb.button(<span class="str">"📖 Help"</span>, callback=<span class="str">"help"</span>)
    <span class="kw">await</span> message.reply(<span class="str">"Welcome! Choose an option:"</span>, reply_markup=kb)

app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"YOUR_TOKEN"</span>,
    storage=MemoryStorage(),
    auto_flood_wait=<span class="num">True</span>,
)
app.include_router(router)
app.run()`}
        />
      </section>

      {/* Lifecycle Hooks */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Lifecycle Hooks</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Run async setup/teardown around the client lifecycle — connect databases, warm caches, etc.
        </p>
        <CodeBlock
          title="lifecycle.py"
          code={`<span class="dec">@app.on_startup</span>
<span class="kw">async def</span> <span class="fn">init</span>():
    <span class="kw">await</span> database.connect()
    print(<span class="str">"✅ Database ready"</span>)

<span class="dec">@app.on_shutdown</span>
<span class="kw">async def</span> <span class="fn">cleanup</span>():
    <span class="kw">await</span> database.disconnect()
    print(<span class="str">"🛑 Disconnected"</span>)`}
        />
      </section>

      {/* Conversation Flow */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">First Conversation Flow</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Collect user input across multiple steps with a declarative class-based conversation.
        </p>
        <CodeBlock
          title="registration.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> Conversation, ConversationState

<span class="kw">class</span> <span class="cls">Registration</span>(Conversation):
    name = ConversationState(initial=<span class="num">True</span>)
    email = ConversationState()

    <span class="dec">@name.on_enter</span>
    <span class="kw">async def</span> <span class="fn">ask_name</span>(self, ctx):
        <span class="kw">await</span> ctx.message.reply(<span class="str">"What's your name?"</span>)

    <span class="dec">@name.on_message</span>
    <span class="kw">async def</span> <span class="fn">save_name</span>(self, ctx):
        <span class="kw">await</span> ctx.helper.update_data(name=ctx.message.text)
        <span class="kw">await</span> self.goto(ctx, self.email)

    <span class="dec">@email.on_enter</span>
    <span class="kw">async def</span> <span class="fn">ask_email</span>(self, ctx):
        <span class="kw">await</span> ctx.message.reply(<span class="str">"Great! What's your email?"</span>)

    <span class="dec">@email.on_message</span>
    <span class="kw">async def</span> <span class="fn">save_email</span>(self, ctx):
        data = <span class="kw">await</span> ctx.helper.get_data()
        name = data[<span class="str">"name"</span>]
        <span class="kw">await</span> ctx.helper.finish()
        <span class="kw">await</span> ctx.message.reply(
            <span class="str">f"Done! Name: </span>{name}<span class="str">, Email: </span>{ctx.message.text}<span class="str">"</span>
        )

<span class="cmt"># Register with the client</span>
app.include_conversation(Registration)`}
        />
      </section>

      {/* Next steps */}
      <section class="mb-8 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What's Next?</h2>
        <div class="grid sm:grid-cols-2 gap-3 stagger">
          <NextStep href="/v0.4/kurigram-addons/client" title="🤖 KurigramClient" desc="Full client API — middleware, routing, storage, FloodWait" />
          <NextStep href="/v0.4/kurigram-addons/lifecycle-hooks" title="🔄 Lifecycle Hooks" desc="on_startup / on_shutdown async callbacks" />
          <NextStep href="/v0.4/kurigram-addons/conversation" title="💬 Conversations" desc="Class-based multi-step FSM flows" />
          <NextStep href="/v0.4/kurigram-addons/rate-limit" title="⏱️ Rate Limiting" desc="Per-user / per-chat token-bucket rate limiter" />
        </div>
      </section>
    </Layout>
  );
}

function NextStep(props: { href: string; title: string; desc: string }) {
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
