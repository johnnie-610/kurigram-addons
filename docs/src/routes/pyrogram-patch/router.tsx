import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function RouterPage() {
  return (
    <Layout>
      <Title>Router — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Router</h1>
        <p class="text-slate-400 mb-8">Hierarchical routers with 25+ Pyrogram event decorators, sub-router nesting, and deferred handler registration.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> filters
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router

router = Router()

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"start"</span>))
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Hello!"</span>)

<span class="dec">@router.on_callback_query</span>(filters.regex(<span class="str">"^menu_"</span>))
<span class="kw">async def</span> <span class="fn">handle_menu</span>(client, callback_query):
    <span class="kw">await</span> callback_query.answer(<span class="str">"Selected!"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Convenience Decorators</h2>
        <p class="text-sm text-slate-400 mb-4">Shorthands for common patterns — no need to import <code>filters</code>:</p>
        <CodeBlock title="on_command()" code={`<span class="cmt"># Matches /start — equivalent to on_message(filters.command("start"))</span>
<span class="dec">@router.on_command</span>(<span class="str">"start"</span>)
<span class="kw">async def</span> <span class="fn">start</span>(client, message):
    <span class="kw">await</span> message.reply(<span class="str">"Hello!"</span>)

<span class="cmt"># Custom prefix</span>
<span class="dec">@router.on_command</span>(<span class="str">"help"</span>, prefixes=<span class="str">"!"</span>)
<span class="kw">async def</span> <span class="fn">help_cmd</span>(client, message):
    ...`} />

        <CodeBlock title="on_callback()" code={`<span class="cmt"># Matches exact callback_data == "profile"</span>
<span class="dec">@router.on_callback</span>(<span class="str">"profile"</span>)
<span class="kw">async def</span> <span class="fn">show_profile</span>(client, query):
    <span class="kw">await</span> query.answer(<span class="str">"Opening profile..."</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">
          on_callback_data() <span class="text-sm font-normal text-slate-500">v0.5.0</span>
        </h2>
        <p class="text-sm text-slate-400 mb-4">
          Register a callback query handler with <strong>regex capture group injection</strong>.
          Named groups (<code>{"(?P<name>…)"}</code>) are extracted from <code>query.data</code> and
          injected as keyword arguments — similar to FastAPI path parameters.
        </p>
        <CodeBlock title="Named groups" code={`<span class="dec">@router.on_callback_data</span>(r<span class="str">"page:(?P&lt;num&gt;\\d+)"</span>)
<span class="kw">async def</span> <span class="fn">paginate</span>(client, query, num):
    <span class="cmt"># num is always a string — cast as needed</span>
    page = int(num)
    <span class="kw">await</span> query.answer(<span class="str">f"Page {page}"</span>)`} />

        <CodeBlock title="Positional groups" code={`<span class="dec">@router.on_callback_data</span>(r<span class="str">"item:(\\d+):(buy|sell)"</span>)
<span class="kw">async def</span> <span class="fn">trade</span>(client, query, group_1, group_2):
    item_id = int(group_1)  <span class="cmt"># "123"</span>
    action  = group_2       <span class="cmt"># "buy" or "sell"</span>
    <span class="kw">await</span> query.answer(<span class="str">f"{action} item {item_id}"</span>)`} />

        <div class="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-4 text-sm text-slate-300">
          <strong class="text-amber-400">Tip:</strong> For complex structured data, consider{" "}
          <a href="/pykeyboard/callback-data" class="text-amber-400 underline">CallbackData</a>{" "}
          which handles type coercion and validation automatically.
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Sub-Routers</h2>
        <p class="text-sm text-slate-400 mb-4">Split handlers across multiple routers for modular bot architecture:</p>
        <CodeBlock code={`<span class="cmt"># admin_router.py</span>
admin_router = Router()

<span class="dec">@admin_router.on_message</span>(filters.command(<span class="str">"ban"</span>))
<span class="kw">async def</span> <span class="fn">ban_user</span>(client, message):
    ...

<span class="cmt"># main.py</span>
main_router = Router()
main_router.include_router(admin_router)

app = KurigramClient(<span class="str">"my_bot"</span>, ...)
app.include_router(main_router)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">
          Context Manager <span class="text-sm font-normal text-slate-500">v0.5.0</span>
        </h2>
        <p class="text-sm text-slate-400 mb-4">
          Use <code>async with</code> for automatic cleanup — handlers are unregistered when the block exits:
        </p>
        <CodeBlock code={`<span class="kw">async with</span> Router() <span class="kw">as</span> router:
    <span class="dec">@router.on_message</span>()
    <span class="kw">async def</span> <span class="fn">handler</span>(client, message):
        ...

    router.set_client(app)
    <span class="cmt"># ... do work ...</span>
<span class="cmt"># handlers automatically unregistered here</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Available Decorators</h2>
        <div class="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {[
            "on_message", "on_callback_query", "on_inline_query", "on_chosen_inline_result",
            "on_edited_message", "on_deleted_messages", "on_chat_member_updated",
            "on_chat_join_request", "on_raw_update", "on_disconnect", "on_user_status",
            "on_poll", "on_story", "on_bot_business_connect", "on_bot_business_message",
            "on_edited_bot_business_message", "on_deleted_bot_business_messages",
            "on_message_reaction_updated", "on_message_reaction_count_updated",
            "on_chat_boost_updated", "on_removed_chat_boost", "on_pre_checkout_query",
            "on_shipping_query", "on_paid_media_purchased",
          ].map(name => (
            <div class="py-1 font-mono text-slate-300"><code>{name}</code></div>
          ))}
        </div>
        <p class="text-xs text-slate-500 mt-3">
          Plus convenience shorthands: <code>on_command()</code>, <code>on_callback()</code>, <code>on_callback_data()</code>
        </p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Handler DI</h2>
        <p class="text-sm text-slate-400 mb-4">
          Handlers receive dependencies via their parameter names. Add a <code>patch_helper: PatchHelper</code>
          parameter to get FSM and data access:
        </p>
        <CodeBlock code={`<span class="imp">from</span> pyrogram_patch.patch_helper <span class="imp">import</span> PatchHelper

<span class="dec">@router.on_message</span>(filters.command(<span class="str">"profile"</span>))
<span class="kw">async def</span> <span class="fn">profile</span>(client, message, patch_helper: PatchHelper):
    state = <span class="kw">await</span> patch_helper.get_state()
    data = <span class="kw">await</span> patch_helper.get_data()
    <span class="kw">await</span> message.reply(<span class="str">f"State: </span>{state}<span class="str">, Data: </span>{data}<span class="str">"</span>)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Router API</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Property / Method</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>.client</code></td><td>Current attached Pyrogram client (or None)</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>.is_registered</code></td><td>True if handlers are registered with a client</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>.handler_count</code></td><td>Number of registered handlers</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>.pending_count</code></td><td>Handlers awaiting registration</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>set_client(app)</code></td><td>Attach to a Pyrogram client and register all handlers</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>include_router(r)</code></td><td>Add a sub-router</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>unregister_handlers()</code></td><td>Remove all handlers from the client</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>clear_handlers()</code></td><td>Remove all handlers and sub-routers entirely</td></tr>
              <tr><td class="py-2"><code>get_stats()</code></td><td>Returns registration statistics dict</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
