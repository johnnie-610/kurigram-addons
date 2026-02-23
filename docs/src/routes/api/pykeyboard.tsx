import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>PyKeyboard API Reference — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">PyKeyboard API Reference</h1>
        <p class="text-slate-400 mb-8">Complete API reference for all PyKeyboard classes, methods, and types.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Classes</h2>
        <table>
          <thead><tr><th>Class</th><th>Module</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>InlineKeyboard</code></td><td><code>pykeyboard</code></td><td>Inline keyboard with pagination &amp; languages</td></tr>
            <tr><td><code>ReplyKeyboard</code></td><td><code>pykeyboard</code></td><td>Reply keyboard with all Pyrogram options</td></tr>
            <tr><td><code>InlineButton</code></td><td><code>pykeyboard</code></td><td>Single inline button (callback, URL, etc.)</td></tr>
            <tr><td><code>ReplyButton</code></td><td><code>pykeyboard</code></td><td>Single reply button (contact, location, etc.)</td></tr>
            <tr><td><code>KeyboardBuilder</code></td><td><code>pykeyboard</code></td><td>Fluent keyboard builder with hooks</td></tr>
            <tr><td><code>KeyboardFactory</code></td><td><code>pykeyboard</code></td><td>Preset keyboard factories</td></tr>
            <tr><td><code>PyReplyKeyboardRemove</code></td><td><code>pykeyboard</code></td><td>Remove reply keyboard markup</td></tr>
            <tr><td><code>PyForceReply</code></td><td><code>pykeyboard</code></td><td>Force reply markup</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Errors</h2>
        <table>
          <thead><tr><th>Error</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>LocaleError</code></td><td>Unknown locale code in language selection</td></tr>
            <tr><td><code>PaginationError</code></td><td>Invalid pagination parameters</td></tr>
            <tr><td><code>PaginationUnchangedError</code></td><td>Page unchanged (duplicate click)</td></tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
