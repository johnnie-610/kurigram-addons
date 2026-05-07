import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>FSM Injection — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">FSM Injection</h1>
        <p class="text-slate-400 mb-8">Automatic FSM state injection into handler parameters via middleware.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">How It Works</h2>
        <p class="text-sm text-slate-400 mb-4">When you add <code>patch_helper: PatchHelper</code> as a handler parameter, the framework automatically injects a configured PatchHelper instance. This is handled by the FSM injection middleware, registered automatically when you call <code>patch()</code>.</p>
        <CodeBlock code={`from pyrogram_patch.patch_helper import PatchHelper

@router.on_message(filters.command("status"))
async def status(client, message, patch_helper: PatchHelper):
    state = await patch_helper.get_state()
    data = await patch_helper.get_data()
    await message.reply(f"State: {state}\\nData: {data}")`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Automatic Registration</h2>
        <p class="text-sm text-slate-400">You do not need to manually register this middleware. Calling <code>patch(app)</code> and <code>manager.set_storage(storage)</code> handles everything. The PatchHelper is created per-update with a pooled lifecycle.</p>
      </section>
    </Layout>
  );
}
