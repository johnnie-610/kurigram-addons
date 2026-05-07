import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function V3PaginationPage() {
  return (
    <Layout>
      <Title>Pagination — kurigram-addons v0.3.x</Title>

      <div class="animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-700/60 text-slate-400 mb-4">
          v0.3.x · pykeyboard
        </div>
        <h1 class="text-3xl font-bold mb-2">Pagination Keyboard</h1>
        <p class="text-slate-400 mb-8">
          Generate ‹ prev / page indicator / next › navigation bars automatically
          from a current page and total page count.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Quick Example</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> InlineKeyboard, InlineButton

<span class="kw">def</span> <span class="fn">pagination_keyboard</span>(current_page: int, total_pages: int) -> InlineKeyboard:
    kb = InlineKeyboard(row_width=<span class="num">3</span>)
    buttons = []

    <span class="kw">if</span> current_page > <span class="num">1</span>:
        buttons.append(InlineButton(<span class="str">"‹"</span>, callback_data=<span class="str">f"page:{current_page - 1}"</span>))
    <span class="kw">else</span>:
        buttons.append(InlineButton(<span class="str">"·"</span>, callback_data=<span class="str">"noop"</span>))

    buttons.append(InlineButton(
        <span class="str">f"{current_page}/{total_pages}"</span>, callback_data=<span class="str">"noop"</span>
    ))

    <span class="kw">if</span> current_page < total_pages:
        buttons.append(InlineButton(<span class="str">"›"</span>, callback_data=<span class="str">f"page:{current_page + 1}"</span>))
    <span class="kw">else</span>:
        buttons.append(InlineButton(<span class="str">"·"</span>, callback_data=<span class="str">"noop"</span>))

    kb.add(*buttons)
    <span class="kw">return</span> kb

<span class="cmt"># Show page 2 of 10</span>
kb = pagination_keyboard(<span class="num">2</span>, <span class="num">10</span>)
<span class="kw">await</span> message.reply(<span class="str">"Results:"</span>, reply_markup=kb)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Handling Page Callbacks</h2>
        <CodeBlock
          code={`<span class="imp">from</span> pyrogram <span class="imp">import</span> filters
<span class="imp">from</span> pyrogram_patch.router <span class="imp">import</span> Router

router = Router()

<span class="dec">@router.on_callback_query</span>(filters.regex(<span class="str">r"^page:(\d+)$"</span>))
<span class="kw">async def</span> <span class="fn">handle_page</span>(client, query):
    page = int(query.data.split(<span class="str">":"</span>)[<span class="num">1</span>])
    items = get_page_items(page)      <span class="cmt"># your data fetching</span>
    kb    = pagination_keyboard(page, total_pages)
    <span class="kw">await</span> query.message.edit_text(
        format_items(items),
        reply_markup=kb
    )
    <span class="kw">await</span> query.answer()`}
        />
      </section>
    </Layout>
  );
}
