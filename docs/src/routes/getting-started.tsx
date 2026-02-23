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
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> Client, filters
<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

app = Client(<span class="str">"my_bot"</span>)

<span class="dec">@app.on_message</span>(filters.command(<span class="str">"start"</span>))
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    kb = InlineKeyboard(row_width=<span class="num">2</span>)
    kb.add(
        InlineButton(text=<span class="str">"🔍 Search"</span>, callback_data=<span class="str">"search"</span>),
        InlineButton(text=<span class="str">"⚙️ Settings"</span>, callback_data=<span class="str">"settings"</span>),
        InlineButton(text=<span class="str">"📖 Help"</span>, callback_data=<span class="str">"help"</span>),
    )
    <span class="kw">await</span> message.reply(<span class="str">"Welcome! Choose an option:"</span>, reply_markup=kb)

app.run()`}
        />
      </section>

      {/* With Pyrogram Patch */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Adding Pyrogram Patch</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Enable routers, FSM, and middleware by patching the client.
        </p>
        <CodeBlock
          title="main.py"
          code={`<span class="imp">import</span> asyncio
<span class="imp">from</span> pyrogram <span class="imp">import</span> Client, filters
<span class="imp">from</span> pyrogram <span class="imp">import</span> idle
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> MemoryStorage

app = Client(<span class="str">"my_bot"</span>)
router = Router()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"start"</span>))
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Hello from pyrogram_patch!"</span>)

<span class="kw">async def</span> <span class="fn">main</span>():
    <span class="cmt"># Patch the client to enable advanced features</span>
    manager = <span class="kw">await</span> patch(app)
    manager.set_storage(MemoryStorage())
    manager.include_router(router)

    <span class="kw">await</span> app.start()
    <span class="kw">await</span> idle()

asyncio.run(main())`}
        />
      </section>

      {/* FSM Example */}
      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">First FSM Flow</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Collect user input across multiple steps using finite state machines.
        </p>
        <CodeBlock
          title="fsm_demo.py"
          code={`<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> State, StatesGroup, StateFilter
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router
<span class="imp">from</span> pyrogram_patch.patch_helper <span class="imp">import</span> PatchHelper

<span class="kw">class</span> <span class="cls">Registration</span>(StatesGroup):
    name = State()
    email = State()

router = Router()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"register"</span>))
<span class="kw">async def</span> <span class="fn">start_registration</span>(client, message, patch_helper: PatchHelper):
    <span class="kw">await</span> patch_helper.set_state(Registration.name)
    <span class="kw">await</span> message.reply(<span class="str">"What's your name?"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Registration.name))
<span class="kw">async def</span> <span class="fn">get_name</span>(client, message, patch_helper: PatchHelper):
    <span class="kw">await</span> patch_helper.update_data(name=message.text)
    <span class="kw">await</span> patch_helper.set_state(Registration.email)
    <span class="kw">await</span> message.reply(<span class="str">"Great! What's your email?"</span>)

<span class="dec">@router.on_message</span>(StateFilter(Registration.email))
<span class="kw">async def</span> <span class="fn">get_email</span>(client, message, patch_helper: PatchHelper):
    data = <span class="kw">await</span> patch_helper.get_data()
    name = data[<span class="str">"name"</span>]
    <span class="kw">await</span> patch_helper.finish()
    <span class="kw">await</span> message.reply(
        <span class="str">f"Done! Name: </span>{name}<span class="str">, Email: </span>{message.text}<span class="str">"</span>
    )`}
        />
      </section>

      {/* Next steps */}
      <section class="mb-8 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What's Next?</h2>
        <div class="grid sm:grid-cols-2 gap-3 stagger">
          <NextStep href="/pykeyboard" title="📖 PyKeyboard Guide" desc="Learn the full keyboard API — pagination, builders, and hooks" />
          <NextStep href="/pyrogram-patch" title="🔧 Pyrogram Patch Guide" desc="Deep dive into routers, FSM, middleware, and storage" />
          <NextStep href="/pyrogram-patch/fsm/states" title="🎯 State Machines" desc="State groups, transitions, and state guards" />
          <NextStep href="/pyrogram-patch/storage" title="💾 Storage Backends" desc="MemoryStorage, RedisStorage, and custom backends" />
        </div>
      </section>
    </Layout>
  );
}

function NextStep(props: { href: string; title: string; desc: string }) {
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
