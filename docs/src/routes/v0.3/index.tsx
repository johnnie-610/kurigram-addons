import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3IndexPage() {
  return (
    <Layout>
      <Title>Getting Started — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x docs
        </div>
        <h1 class="text-3xl font-bold mb-2">Getting Started</h1>
        <p class="text-slate-400 mb-8">
          v0.3.x is the foundation release — it ships two independent packages:{" "}
          <code>pykeyboard</code> for building Telegram keyboards and{" "}
          <code>pyrogram_patch</code> for routing, FSM, middleware, and storage.
          There is no unified namespace yet; you import from each package directly.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Installation</h2>
        <CodeBlock title="pip" code={`pip install kurigram-addons==0.3.*`} />
        <CodeBlock title="poetry" code={`poetry add "kurigram-addons==0.3.*"`} />
        <CodeBlock title="uv" code={`uv add "kurigram-addons==0.3.*"`} />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">What's in v0.3</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="p-4 rounded-lg border border-white/10 bg-white/5">
            <div class="font-semibold text-amber-300 mb-2">pykeyboard</div>
            <ul class="text-slate-400 space-y-1 list-disc list-inside">
              <li>InlineKeyboard builder</li>
              <li>ReplyKeyboard builder</li>
              <li>Pagination keyboard</li>
              <li>Language selection keyboard</li>
              <li>Builder API (fluent interface)</li>
              <li>Hooks &amp; validation</li>
              <li>Utilities (button helpers)</li>
            </ul>
          </div>
          <div class="p-4 rounded-lg border border-white/10 bg-white/5">
            <div class="font-semibold text-amber-300 mb-2">pyrogram_patch</div>
            <ul class="text-slate-400 space-y-1 list-disc list-inside">
              <li>patch() / PatchManager</li>
              <li>Router with filter-based handlers</li>
              <li>Finite State Machine (FSM)</li>
              <li>MemoryStorage &amp; RedisStorage</li>
              <li>Before / around / after middleware</li>
              <li>PatchHelper (data, state in handlers)</li>
              <li>AsyncCircuitBreaker</li>
              <li>Configuration via env vars</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Start</h2>
        <CodeBlock
          title="bot.py"
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> Client, filters
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> StatesGroup, State, FSMContext
<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> MemoryStorage
<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

router = Router()

<span class="kw">class</span> <span class="fn">Form</span>(StatesGroup):
    name = State()
    age  = State()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"start"</span>))
<span class="kw">async def</span> <span class="fn">cmd_start</span>(client, message, state: FSMContext):
    <span class="kw">await</span> state.set_state(Form.name)
    <span class="kw">await</span> message.reply(<span class="str">"What's your name?"</span>)

<span class="dec">@router.on_message</span>(Form.name.filter())
<span class="kw">async def</span> <span class="fn">got_name</span>(client, message, state: FSMContext):
    <span class="kw">await</span> state.update_data(name=message.text)
    <span class="kw">await</span> state.set_state(Form.age)
    <span class="kw">await</span> message.reply(<span class="str">"How old are you?"</span>)

<span class="dec">@router.on_message</span>(Form.age.filter())
<span class="kw">async def</span> <span class="fn">got_age</span>(client, message, state: FSMContext):
    data = <span class="kw">await</span> state.get_data()
    <span class="kw">await</span> state.clear_state()
    <span class="kw">await</span> message.reply(
        <span class="str">f"Name: </span>{data[<span class="str">'name'</span>]}<span class="str">, Age: </span>{message.text}<span class="str">"</span>
    )

app = Client(<span class="str">"my_bot"</span>, bot_token=<span class="str">"..."</span>)
manager = patch(app, storage=MemoryStorage())
manager.include_router(router)
app.run()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Imports Reference</h2>
        <CodeBlock
          code={`<span class="cmt"># Keyboards</span>
<span class="imp">from</span> pykeyboard <span class="imp">import</span> (
    InlineKeyboard, InlineButton,
    ReplyKeyboard, ReplyButton,
    Button,
)

<span class="cmt"># Core patching</span>
<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch, PatchManager

<span class="cmt"># Router</span>
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router

<span class="cmt"># FSM</span>
<span class="imp">from</span> pyrogram_patch.fsm <span class="imp">import</span> StatesGroup, State, FSMContext
<span class="imp">from</span> pyrogram_patch.fsm.filters <span class="imp">import</span> StateFilter
<span class="imp">from</span> pyrogram_patch.fsm.storages <span class="imp">import</span> MemoryStorage, RedisStorage

<span class="cmt"># Middleware helper</span>
<span class="imp">from</span> pyrogram_patch.patch_helper <span class="imp">import</span> PatchHelper`}
        />
      </section>
    </Layout>
  );
}
