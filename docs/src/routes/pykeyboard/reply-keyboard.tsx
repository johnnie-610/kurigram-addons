import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function ReplyKeyboardPage() {
  return (
    <Layout>
      <Title>Reply Keyboard — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Reply Keyboard</h1>
        <p class="text-slate-400 mb-8">Custom reply keyboard markup with contact, location, poll request buttons, and input placeholder support.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Usage</h2>
        <CodeBlock title="Simple reply keyboard" code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> ReplyKeyboard

kb = ReplyKeyboard(
    row_width=<span class="num">2</span>,
    resize_keyboard=<span class="num">True</span>,
    one_time_keyboard=<span class="num">True</span>,
    placeholder=<span class="str">"Choose an option..."</span>,
)
kb.add(<span class="str">"✅ Yes"</span>, <span class="str">"❌ No"</span>, <span class="str">"🤷 Maybe"</span>)

<span class="kw">await</span> message.reply(<span class="str">"What do you think?"</span>, reply_markup=kb)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Constructor</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>row_width</code></td><td><code>int</code></td><td><code>3</code></td><td>Max buttons per row (1–8)</td></tr>
            <tr><td><code>resize_keyboard</code></td><td><code>bool</code></td><td><code>None</code></td><td>Resize to fit content vertically</td></tr>
            <tr><td><code>one_time_keyboard</code></td><td><code>bool</code></td><td><code>None</code></td><td>Disappear after first use</td></tr>
            <tr><td><code>is_persistent</code></td><td><code>bool</code></td><td><code>None</code></td><td>Keep visible between messages</td></tr>
            <tr><td><code>selective</code></td><td><code>bool</code></td><td><code>None</code></td><td>Show only to specific users</td></tr>
            <tr><td><code>placeholder</code></td><td><code>str</code></td><td><code>None</code></td><td>Placeholder text in input field</td></tr>
          </tbody>
        </table>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Button Types</h2>
        <p class="text-sm text-slate-400 mb-4">Use <code>ReplyButton</code> for advanced button types beyond plain text.</p>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>text</code></td><td><code>str</code></td><td>Button label (required)</td></tr>
            <tr><td><code>request_contact</code></td><td><code>bool</code></td><td>Request phone contact</td></tr>
            <tr><td><code>request_location</code></td><td><code>bool</code></td><td>Request GPS location</td></tr>
            <tr><td><code>request_poll</code></td><td><code>KeyboardButtonPollType</code></td><td>Request a poll</td></tr>
            <tr><td><code>web_app</code></td><td><code>WebAppInfo</code></td><td>Open a Web App</td></tr>
            <tr><td><code>request_users</code></td><td><code>KeyboardButtonRequestUsers</code></td><td>Request user selection</td></tr>
            <tr><td><code>request_chat</code></td><td><code>KeyboardButtonRequestChat</code></td><td>Request chat selection</td></tr>
          </tbody>
        </table>
        <CodeBlock title="Special button types" code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> ReplyKeyboard, ReplyButton

kb = ReplyKeyboard(resize_keyboard=<span class="num">True</span>)
kb.add(
    ReplyButton(text=<span class="str">"📱 Share Contact"</span>, request_contact=<span class="num">True</span>),
    ReplyButton(text=<span class="str">"📍 Share Location"</span>, request_location=<span class="num">True</span>),
)`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Removing the Keyboard</h2>
        <CodeBlock code={`<span class="imp">from</span> pykeyboard <span class="imp">import</span> PyReplyKeyboardRemove, PyForceReply

<span class="cmt"># Remove the keyboard</span>
<span class="kw">await</span> message.reply(<span class="str">"Keyboard removed"</span>, reply_markup=PyReplyKeyboardRemove())

<span class="cmt"># Force reply with placeholder</span>
<span class="kw">await</span> message.reply(
    <span class="str">"Please type your answer:"</span>,
    reply_markup=PyForceReply(placeholder=<span class="str">"Type here..."</span>)
)`} />
      </section>
    </Layout>
  );
}
