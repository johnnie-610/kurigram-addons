import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function TestingPage() {
  return (
    <Layout>
      <Title>Testing — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Testing</h1>
        <p class="text-slate-400 mb-2">
          Mock factories and a <code>ConversationTester</code> for unit-testing handlers and
          conversations without hitting Telegram's API.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Mock factories</h2>
        <CodeBlock
          title="test_handlers.py"
          code={`<span class="imp">from</span> kurigram_addons.testing <span class="imp">import</span> (
    make_message,
    make_callback_query,
    make_user,
    MockClient,
)

<span class="cmt"># Build fake Pyrogram objects</span>
msg    = make_message(text=<span class="str">"/start"</span>, user_id=<span class="num">42</span>, chat_id=<span class="num">100</span>)
query  = make_callback_query(data=<span class="str">"pg:2:10"</span>, user_id=<span class="num">42</span>)
user   = make_user(user_id=<span class="num">42</span>, first_name=<span class="str">"Alice"</span>)

<span class="cmt"># MockClient records every send_message / send_photo / etc.</span>
client = MockClient(me_id=<span class="num">999</span>)
<span class="kw">await</span> client.send_message(<span class="num">100</span>, <span class="str">"Hello!"</span>)
<span class="kw">assert</span> client.sent[<span class="num">0</span>][<span class="str">"text"</span>] == <span class="str">"Hello!"</span>
client.reset()   <span class="cmt"># clear recorded sends</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">ConversationTester</h2>
        <p class="text-slate-400 mb-3 text-sm">
          Drive a full <code>Conversation</code> subclass through its states without starting a real bot.
        </p>
        <CodeBlock
          title="test_registration.py"
          code={`<span class="imp">import</span> pytest
<span class="imp">from</span> kurigram_addons.testing <span class="imp">import</span> ConversationTester

<span class="dec">@pytest.mark.asyncio</span>
<span class="kw">async def</span> <span class="fn">test_registration_flow</span>():
    tester = ConversationTester(Registration)

    <span class="kw">await</span> tester.start(user_id=<span class="num">1</span>, chat_id=<span class="num">1</span>)
    <span class="kw">assert</span> tester.current_state == <span class="str">"Registration:name"</span>

    <span class="kw">await</span> tester.send_message(<span class="str">"Alice"</span>)
    <span class="kw">assert</span> tester.current_state == <span class="str">"Registration:age"</span>

    <span class="kw">await</span> tester.send_message(<span class="str">"30"</span>)
    <span class="kw">assert</span> tester.current_state == <span class="str">"Registration:confirm"</span>

    <span class="kmt"># Check what the bot replied</span>
    tester.assert_replied(<span class="str">"Confirm your details"</span>)

    <span class="kw">await</span> tester.send_message(<span class="str">"yes"</span>)
    <span class="kw">assert</span> tester.is_finished()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">MockClient API</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Member</th><th>Description</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5"><td class="py-2"><code>sent</code></td><td>List of dicts recording every call to <code>send_message()</code> etc.</td></tr>
              <tr class="border-b border-white/5"><td class="py-2"><code>reset()</code></td><td>Clear the <code>sent</code> list</td></tr>
              <tr><td class="py-2"><code>me_id</code></td><td>Fake bot user ID returned by <code>get_me()</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Factory reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-amber-400 border-b border-white/10">
              <tr><th class="py-2">Factory</th><th>Key parameters</th><th>Returns</th></tr>
            </thead>
            <tbody class="text-slate-400">
              <tr class="border-b border-white/5">
                <td class="py-2"><code>make_message()</code></td>
                <td><code>text</code>, <code>user_id</code>, <code>chat_id</code></td>
                <td>Fake <code>Message</code></td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2"><code>make_callback_query()</code></td>
                <td><code>data</code>, <code>user_id</code></td>
                <td>Fake <code>CallbackQuery</code></td>
              </tr>
              <tr>
                <td class="py-2"><code>make_user()</code></td>
                <td><code>user_id</code>, <code>first_name</code></td>
                <td>Fake <code>User</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
