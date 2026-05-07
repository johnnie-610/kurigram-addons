import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Patch Helper — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Patch Helper</h1>
        <p class="text-slate-400 mb-8">Per-update helper providing FSM state/data access, pooled lifecycle, and weak-reference cleanup.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Accessing PatchHelper</h2>
        <p class="text-sm text-slate-400 mb-4">Add <code>patch_helper: PatchHelper</code> to any handler parameter list:</p>
        <CodeBlock code={`from pyrogram_patch.patch_helper import PatchHelper

@router.on_message(filters.command("data"))
async def show_data(client, message, patch_helper: PatchHelper):
    data = await patch_helper.get_data()
    await message.reply(str(data))`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Methods</h2>
        <table>
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>get_state()</code></td><td><code>str | None</code></td><td>Current FSM state</td></tr>
            <tr><td><code>set_state(state)</code></td><td><code>None</code></td><td>Transition to a new state</td></tr>
            <tr><td><code>get_data()</code></td><td><code>dict</code></td><td>Stored state data</td></tr>
            <tr><td><code>update_data(**kwargs)</code></td><td><code>None</code></td><td>Merge key-value pairs into data</td></tr>
            <tr><td><code>set_data(data)</code></td><td><code>None</code></td><td>Replace entire data dict</td></tr>
            <tr><td><code>finish()</code></td><td><code>None</code></td><td>Clear state and data</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
