import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3RouterPage() {
  return (
    <Layout>
      <Title>Router — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pyrogram_patch
        </div>
        <h1 class="text-3xl font-bold mb-2">Router</h1>
        <p class="text-slate-400 mb-8">
          <code>Router</code> groups related handlers into a module. Multiple routers
          can be included in a <code>PatchManager</code>, each with its own filter prefix.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Defining Handlers</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> filters
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router

router = Router()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"start"</span>))
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    await message.reply("Hello!")

<span class="dec">@router.on_callback_query</span>(filters.regex(<span class="str">r"^action:"</span>))
<span class="kw">async def</span> <span class="fn">handle_action</span>(client, query):
    await query.answer("OK")

<span class="dec">@router.on_command</span>(<span class="str">"help"</span>)
<span class="kw">async def</span> <span class="fn">cmd_help</span>(client, message):
    await message.reply("Available commands: /start /help")`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Handler Decorators</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Decorator</th><th>Update type</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>@router.on_message(filter)</code></td><td>Message</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>@router.on_callback_query(filter)</code></td><td>CallbackQuery</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>@router.on_inline_query(filter)</code></td><td>InlineQuery</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>@router.on_edited_message(filter)</code></td><td>Edited message</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>@router.on_command(cmd)</code></td><td>Message matching /cmd</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Router Prefix Filter</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> filters

ADMIN_IDS = [123456789]

<span class="cmt"># Every handler in this router requires the user to be an admin</span>
admin_router = Router(filter=filters.user(ADMIN_IDS))

<span class="dec">@admin_router.on_command</span>(<span class="str">"ban"</span>)
<span class="kw">async def</span> <span class="fn">ban_user</span>(client, message):
    pass  <span class="cmt"># only admins reach here</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Including Routers</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram_patch <span class="imp">import</span> patch

app = Client("bot", bot_token="TOKEN")
manager = patch(app)

manager.include_router(router)
manager.include_router(admin_router)`}
        />
      </section>
    </Layout>
  );
}
