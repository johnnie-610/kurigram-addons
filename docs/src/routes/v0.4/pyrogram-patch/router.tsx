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

manager = <span class="kw">await</span> patch(app)
manager.include_router(main_router)`} />
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
    </Layout>
  );
}
