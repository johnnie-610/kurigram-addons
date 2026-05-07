import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function BroadcastPage() {
  return (
    <Layout>
      <Title>Broadcast — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Broadcast</h1>
        <p class="text-slate-400 mb-2">
          Async-generator bulk sender with automatic <code>FloodWait</code> handling and per-user result streaming.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock
          title="announce.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> broadcast

<span class="dec">@router.on_command</span>(<span class="str">"announce"</span>)
<span class="kw">async def</span> <span class="fn">announce</span>(client, message):
    user_ids = <span class="kw">await</span> db.get_all_user_ids()
    ok = fail = skip = <span class="num">0</span>

    <span class="kw">async for</span> result <span class="kw">in</span> broadcast(
        client,
        user_ids,
        <span class="str">"📢 Important update!"</span>,
        delay=<span class="num">0.05</span>,
        max_flood_wait=<span class="num">60</span>,
        on_error=<span class="str">"skip"</span>,
    ):
        <span class="kw">if</span> result.ok:       ok   += <span class="num">1</span>
        <span class="kw">elif</span> result.skipped: skip += <span class="num">1</span>
        <span class="kw">else</span>:               fail += <span class="num">1</span>

    <span class="kw">await</span> message.reply(<span class="str">f"Sent </span><span class="num">{ok}</span><span class="str"> | Skipped </span><span class="num">{skip}</span><span class="str"> | Failed </span><span class="num">{fail}</span><span class="str">"</span>)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Parameters</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr>
                <th class="py-2">Parameter</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>client</code></td><td>Client</td><td>—</td>
                <td>A Pyrogram / KurigramClient instance</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>user_ids</code></td><td>Iterable[int]</td><td>—</td>
                <td>Target user IDs</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>text</code></td><td>str</td><td>—</td>
                <td>Message text to send</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>delay</code></td><td>float</td><td>0.05</td>
                <td>Seconds between successful sends</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>max_flood_wait</code></td><td>int</td><td>60</td>
                <td>Max FloodWait seconds to absorb automatically</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>on_error</code></td><td>str</td><td>"skip"</td>
                <td><code>"skip"</code> to continue after failures, <code>"stop"</code> to abort</td>
              </tr>
              <tr>
                <td class="py-2"><code>**send_kwargs</code></td><td>Any</td><td>—</td>
                <td>Extra kwargs forwarded to <code>send_message()</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">BroadcastResult</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Each iteration yields a <code>BroadcastResult</code> dataclass:
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Field</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>user_id</code></td><td>int</td><td>Recipient ID</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>ok</code></td><td>bool</td><td>True if message was sent</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>error</code></td><td>Exception | None</td><td>Exception on failure</td></tr>
              <tr><td class="py-2"><code>skipped</code></td><td>bool</td><td>True if user was blocked / deactivated</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">HTML formatting example</h2>
        <CodeBlock
          title="broadcast_html.py"
          code={`<span class="kw">async for</span> result <span class="kw">in</span> broadcast(
    client,
    user_ids,
    <span class="str">"&lt;b&gt;News&lt;/b&gt;: Check out v0.5!"</span>,
    parse_mode=<span class="str">"html"</span>,
    disable_web_page_preview=<span class="num">True</span>,
):
    <span class="kw">if not</span> result.ok <span class="kw">and not</span> result.skipped:
        logger.warning(<span class="str">"Failed for %d: %s"</span>, result.user_id, result.error)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Notes</h2>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>Blocked / deactivated / invalid peer users are silently skipped and set <code>skipped=True</code>.</li>
          <li>FloodWait ≤ <code>max_flood_wait</code> is absorbed automatically with up to 3 retries.</li>
          <li>The <code>delay</code> default of 50 ms keeps the send rate comfortably below Telegram's ~30 msg/s limit.</li>
          <li>Results are yielded in order, so you can track progress in real time.</li>
        </ul>
      </section>
    </Layout>
  );
}
