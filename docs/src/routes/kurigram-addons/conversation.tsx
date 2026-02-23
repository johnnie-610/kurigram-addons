import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function ConversationPage() {
  return (
    <Layout>
      <Title>Conversation Handler — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Conversation Handler</h1>
        <p class="text-slate-400 mb-8">
          Declarative, class-based FSM flows with state descriptors and hook decorators.
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Basic Conversation</h2>
        <CodeBlock
          title="registration.py"
          code={`<span class="imp">from</span> kurigram_addons <span class="imp">import</span> Conversation, ConversationState

<span class="kw">class</span> <span class="cls">Registration</span>(Conversation):
    name = ConversationState(initial=<span class="num">True</span>)
    age = ConversationState()

    <span class="dec">@name.on_enter</span>
    <span class="kw">async def</span> <span class="fn">ask_name</span>(self, ctx):
        <span class="kw">await</span> ctx.message.reply(<span class="str">"What's your name?"</span>)

    <span class="dec">@name.on_message</span>
    <span class="kw">async def</span> <span class="fn">save_name</span>(self, ctx):
        <span class="kw">await</span> ctx.helper.update_data(name=ctx.message.text)
        <span class="kw">await</span> self.goto(ctx, self.age)

    <span class="dec">@age.on_enter</span>
    <span class="kw">async def</span> <span class="fn">ask_age</span>(self, ctx):
        <span class="kw">await</span> ctx.message.reply(<span class="str">"How old are you?"</span>)

    <span class="dec">@age.on_message</span>
    <span class="kw">async def</span> <span class="fn">save_age</span>(self, ctx):
        <span class="kw">await</span> ctx.helper.update_data(age=<span class="fn">int</span>(ctx.message.text))
        <span class="kw">await</span> self.finish(ctx)`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Concepts</h2>

        <h3 class="text-lg font-medium mb-2 text-teal-400">ConversationState</h3>
        <p class="text-slate-400 mb-3 text-sm">
          A descriptor that defines a state in the conversation. Set <code>initial=True</code> on the first state.
          Each state can have three hooks:
        </p>
        <ul class="text-slate-400 text-sm list-disc list-inside mb-4 space-y-1">
          <li><code>@state.on_enter</code> — called when transitioning <em>into</em> this state</li>
          <li><code>@state.on_message</code> — called when a message arrives while in this state</li>
          <li><code>@state.on_callback</code> — called when a callback query arrives while in this state</li>
        </ul>

        <h3 class="text-lg font-medium mb-2 text-teal-400">ConversationContext</h3>
        <p class="text-slate-400 mb-3 text-sm">
          Passed to all hooks. Contains <code>ctx.client</code>, <code>ctx.message</code>, <code>ctx.callback_query</code>, and <code>ctx.helper</code> (the FSM PatchHelper).
        </p>

        <h3 class="text-lg font-medium mb-2 text-teal-400">Navigation</h3>
        <ul class="text-slate-400 text-sm list-disc list-inside mb-4 space-y-1">
          <li><code>await self.goto(ctx, self.next_state)</code> — transition to another state</li>
          <li><code>await self.finish(ctx)</code> — end the conversation and clear state</li>
          <li><code>await self.start(ctx)</code> — begin from the initial state</li>
        </ul>
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Registration</h2>
        <CodeBlock
          title="main.py"
          code={`<span class="cmt"># Auto-register handlers on KurigramClient</span>
app.include_conversation(Registration)

<span class="cmt"># Or manually register on a router</span>
reg = Registration()
reg.register_handlers(router)`}
        />
      </section>
    </Layout>
  );
}
