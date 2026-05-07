import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PaginationPage() {
  return (
    <Layout>
      <Title>Pagination — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Pagination</h1>
        <p class="text-slate-400 mb-8">Built-in pagination for inline keyboards with configurable navigation symbols, duplicate hash prevention, and page change detection.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock title="Paginated keyboard" code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard

kb = InlineKeyboard()
kb.paginate(
    count_pages=<span class="num">10</span>,
    current_page=<span class="num">3</span>,
    callback_pattern=<span class="str">"page_{}"</span>,  <span class="cmt"># {} is replaced with page number</span>
)

<span class="cmt"># Produces: [« 1] [‹ 2] [· 3 ·] [4 ›] [10 »]</span>
<span class="kw">await</span> message.reply(<span class="str">"Page 3 of 10"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Parameters</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>count_pages</code></td><td><code>int</code></td><td>Total number of pages</td></tr>
            <tr><td><code>current_page</code></td><td><code>int</code></td><td>Currently active page (1-indexed)</td></tr>
            <tr><td><code>callback_pattern</code></td><td><code>str</code></td><td>Pattern with <code>{"{}"}</code> placeholder for page number</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Custom Symbols</h2>
        <p class="text-sm text-slate-400 mb-4">Override the default navigation symbols:</p>
        <CodeBlock code={`kb = InlineKeyboard()
kb.PAGINATION_SYMBOLS = {
    <span class="str">"first"</span>: <span class="str">"⏮ {}"</span>,
    <span class="str">"prev"</span>: <span class="str">"◀ {}"</span>,
    <span class="str">"current"</span>: <span class="str">"[{}]"</span>,
    <span class="str">"next"</span>: <span class="str">"{} ▶"</span>,
    <span class="str">"last"</span>: <span class="str">"{} ⏭"</span>,
}
kb.paginate(count_pages=<span class="num">5</span>, current_page=<span class="num">2</span>, callback_pattern=<span class="str">"p:{}"</span>)

<span class="cmt"># Produces: [⏮ 1] [◀ 1] [[2]] [3 ▶] [5 ⏭]</span>`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Duplicate Prevention</h2>
        <p class="text-sm text-slate-400 mb-4">
          Pagination uses SHA-256 hashing to detect when the user taps the current page button (no-op).
          A <code>PaginationUnchangedError</code> is raised when the page hasn't changed,
          which you can catch to avoid unnecessary edits.
        </p>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard.errors <span class="imp">import</span> PaginationUnchangedError

<span class="kw">try</span>:
    kb.paginate(count_pages=<span class="num">5</span>, current_page=<span class="num">3</span>, callback_pattern=<span class="str">"p:{}"</span>)
<span class="kw">except</span> PaginationUnchangedError:
    <span class="cmt"># User tapped the current page — nothing to update</span>
    <span class="kw">pass</span>`} />
      </section>
    </Layout>
  );
}
