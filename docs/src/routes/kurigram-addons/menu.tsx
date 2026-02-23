import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function MenuPage() {
  return (
    <Layout>
      <Title>Menu System — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Menu System</h1>
        <p class="text-slate-400 mb-8">
          Declarative navigation menus with auto back-button, edit-in-place updates, and callback routing.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Creating Menus</h2>
        <CodeBlock
          title="menus.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> Menu

<span class="cmt"># Root menu</span>
main_menu = Menu(<span class="str">"main"</span>, text=<span class="str">"📋 Main Menu\\nChoose a section:"</span>)
main_menu.button(<span class="str">"👤 Profile"</span>, goto=<span class="str">"profile"</span>)
main_menu.button(<span class="str">"⚙️ Settings"</span>, goto=<span class="str">"settings"</span>)
main_menu.button(<span class="str">"📊 Stats"</span>, callback=show_stats)

<span class="cmt"># Sub-menu (auto back-button to main)</span>
profile_menu = Menu(<span class="str">"profile"</span>, text=<span class="str">"👤 Profile"</span>, parent=main_menu)
profile_menu.button(<span class="str">"✏️ Edit Name"</span>, callback=edit_name)
profile_menu.button(<span class="str">"📸 Change Photo"</span>, callback=change_photo)

<span class="cmt"># Register with the client</span>
app.include_menus(main_menu, profile_menu)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Button Types</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Argument</th><th>Effect</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>goto="name"</code></td><td>Navigate to another Menu by name</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>callback=fn</code></td><td>Call <code>async fn(client, query)</code> on press</td></tr>
              <tr><td class="py-2"><code>url="..."</code></td><td>Open external URL</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Features</h2>
        <ul class="text-slate-400 text-sm list-disc list-inside space-y-2">
          <li><strong>Auto back-button</strong> — menus with a <code>parent</code> get a "⬅️ Back" button automatically.</li>
          <li><strong>Edit-in-place</strong> — navigation uses <code>edit_message_text</code> for smooth transitions.</li>
          <li><strong>Global registry</strong> — <code>Menu.get("name")</code> looks up any registered menu.</li>
          <li><strong>send() / edit()</strong> — display a menu programmatically from any handler.</li>
        </ul>
      </section>
    </Layout>
  );
}
