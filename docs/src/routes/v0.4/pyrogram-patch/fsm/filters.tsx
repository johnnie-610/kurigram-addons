import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>FSM Filters — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">FSM Filters</h1>
        <p class="text-slate-400 mb-8">Route updates to state handlers using StateFilter, AnyStateFilter, and NoStateFilter.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">StateFilter</h2>
        <p class="text-sm text-slate-400 mb-4">Match a specific state. Combine with Pyrogram filters using <code>&amp;</code>:</p>
        <CodeBlock code={`from pyrogram_patch.fsm import StateFilter
from pyrogram import filters

# Match only when user is in Form.name state
@router.on_message(StateFilter(Form.name) & filters.text)
async def get_name(client, message, patch_helper):
    await patch_helper.update_data(name=message.text)
    await patch_helper.set_state(Form.age)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">AnyStateFilter</h2>
        <p class="text-sm text-slate-400 mb-4">Match any active state — useful for cancel commands:</p>
        <CodeBlock code={`from pyrogram_patch.fsm import AnyStateFilter

@router.on_message(AnyStateFilter() & filters.command("cancel"))
async def cancel(client, message, patch_helper):
    await patch_helper.finish()
    await message.reply("Cancelled.")`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">NoStateFilter</h2>
        <p class="text-sm text-slate-400 mb-4">Match only when no FSM state is set:</p>
        <CodeBlock code={`from pyrogram_patch.fsm import NoStateFilter

@router.on_message(NoStateFilter() & filters.text)
async def echo(client, message):
    await message.reply(message.text)`} />
      </section>
    </Layout>
  );
}
