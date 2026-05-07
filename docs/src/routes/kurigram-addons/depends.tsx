import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function DependsPage() {
  return (
    <Layout>
      <Title>Dependency Injection — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Dependency Injection</h1>
        <p class="text-slate-400 mb-8">
          <code>DIContainer</code> + <code>Depends</code> — FastAPI-style dependency
          injection for Pyrogram handlers. Register providers by type; the dispatcher
          resolves and injects them automatically at call time.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Start</h2>
        <CodeBlock
          title="di_example.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> KurigramClient, DIContainer, Router
<span class="imp">from</span> sqlalchemy.ext.asyncio <span class="imp">import</span> AsyncSession, async_sessionmaker

router = Router()
container = DIContainer()

<span class="cmt"># 1. Register providers</span>
<span class="kw">async def</span> <span class="fn">get_db</span>() -> AsyncSession:
    <span class="kw">async with</span> SessionLocal() <span class="kw">as</span> session:
        <span class="kw">yield</span> session    <span class="cmt"># generator — one session per request</span>

container.register(AsyncSession, get_db)

<span class="cmt"># 2. Attach to client</span>
app = KurigramClient(<span class="str">"bot"</span>, bot_token=<span class="str">"TOKEN"</span>)
container.attach(app)

<span class="cmt"># 3. Declare dependencies by type annotation</span>
<span class="dec">@router.on_command</span>(<span class="str">"users"</span>)
<span class="kw">async def</span> <span class="fn">list_users</span>(client, message, db: AsyncSession):
    count = <span class="kw">await</span> db.scalar(select(func.count(User.id)))
    <span class="kw">await</span> message.reply(<span class="str">f"Total users: </span>{count}<span class="str">"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Depends() Marker</h2>
        <p class="text-slate-400 text-sm mb-4">
          When a type annotation is ambiguous or you want to use a provider directly
          without registering it by type, use <code>Depends(provider)</code> as the
          default value instead.
        </p>
        <CodeBlock
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> Depends

<span class="kw">async def</span> <span class="fn">get_current_user</span>():
    <span class="kw">return await</span> db.get_user(42)

<span class="dec">@router.on_command</span>(<span class="str">"profile"</span>)
<span class="kw">async def</span> <span class="fn">profile</span>(client, message, user=Depends(get_current_user)):
    <span class="kw">await</span> message.reply(<span class="str">f"Hello, </span>{user.name}<span class="str">!"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Provider Types</h2>
        <CodeBlock
          code={`<span class="cmt"># Async generator — fresh instance per resolve, teardown on cleanup</span>
<span class="kw">async def</span> <span class="fn">get_session</span>():
    <span class="kw">async with</span> SessionLocal() <span class="kw">as</span> s:
        <span class="kw">yield</span> s
container.register(AsyncSession, get_session)

<span class="cmt"># Async function — called fresh each time (no caching)</span>
<span class="kw">async def</span> <span class="fn">get_config</span>() -> AppConfig:
    <span class="kw">return</span> AppConfig()
container.register(AppConfig, get_config)

<span class="cmt"># Concrete value — returned directly, never called</span>
container.register_value(Settings, Settings(debug=<span class="num">True</span>))

<span class="cmt"># Class — instantiated with no args on first resolve</span>
container.register(CacheService, CacheService)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">DIContainer API</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>register(type_, provider)</code></td><td>Register a provider factory for a type. Returns self for chaining.</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>register_value(type_, value)</code></td><td>Register a concrete instance (skips factory call).</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await resolve(type_)</code></td><td>Resolve a single type and return its value. Raises KeyError if unregistered.</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await resolve_provider(provider)</code></td><td>Call a provider directly (used by Depends internally).</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>await inject(handler, update, client, helper)</code></td><td>Build and return a kwargs dict for handler injection.</td></tr>
              <tr><td class="py-2"><code>attach(client)</code></td><td>Store container on client as <code>_di_container</code> for dispatcher pick-up.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Multiple Dependencies</h2>
        <CodeBlock
          code={`container.register(UserRepo, UserRepository)
container.register(LogService, LoggingService)
container.register_value(AppConfig, config)

<span class="dec">@router.on_command</span>(<span class="str">"action"</span>)
<span class="kw">async def</span> <span class="fn">do_action</span>(
    client, message,
    users: UserRepo,
    logger: LogService,
    cfg: AppConfig,
):
    <span class="kw">await</span> logger.log(<span class="str">"action invoked"</span>)
    result = <span class="kw">await</span> users.perform(cfg.action_key)
    <span class="kw">await</span> message.reply(str(result))`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Chained Registration</h2>
        <CodeBlock
          code={`container = (
    DIContainer()
    .register(AsyncSession, get_db)
    .register(UserRepo, UserRepository)
    .register_value(Config, app_config)
)
container.attach(app)`}
        />
      </section>
    </Layout>
  );
}
