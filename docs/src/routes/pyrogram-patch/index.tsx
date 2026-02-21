import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";

export default function PyrogramPatchIndex() {
  return (
    <div class="pb-20">
      <Title>Pyrogram Patch Overview - Kurigram Addons</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        The New Standard
      </div>
      
      <h1>Pyrogram Reimagined.</h1>
      
      <p class="lead text-xl">
        A non-invasive, high-performance extension for Pyrogram that adds a modern middleware pipeline, hierarchical routing, and a state-of-the-art FSM engine.
      </p>

      <h2>The Patched Architecture</h2>
      <p>
        Building complex bots natively in Pyrogram often leads to massive <code>if/else</code> chains, repetitive database queries, and tangled callback management. Pyrogram Patch solves this by fundamentally upgrading how updates are dispatched.
      </p>

      <h3>Non-Invasive Bridge</h3>
      <p>
        Instead of forking the library and forcing you to use a custom client, we replace the internal Pyrogram <code>Dispatcher</code> at runtime when you call <code>patch(app)</code>. This "hot-swap" allows your code to use 100% of Pyrogram's native features and updates, but routes them through a much more powerful execution pipeline.
      </p>

      <h3>The PatchDataPool</h3>
      <p>
        To support thousands of concurrent users, the patch introduces the <code>PatchDataPool</code>. This is a thread-safe, high-concurrency storage layer that sits alongside the dispatcher. It manages middleware dependency injection and isolates FSM contexts for every single user, ensuring zero state bleeding between chats.
      </p>

      <h2>Core Capabilities</h2>
      
      <ul>
        <li>
            <A href="/pyrogram-patch/middlewares" class="font-bold">Tri-Phase Middlewares</A>: Register hooks that fire "before", "around", or "after" your handlers. Perfect for handling database sessions, rate limiting, and authentication.
        </li>
        <li>
            <A href="/pyrogram-patch/routers" class="font-bold">Hierarchical Routers</A>: Stop writing all your handlers in <code>main.py</code>. Our Router system lets you split your bot into dozens of modular files that can easily be plugged in and out.
        </li>
        <li>
            <A href="/pyrogram-patch/fsm" class="font-bold">Advanced FSM</A>: A professional state machine engine. Define conversational flows visually using <code>StatesGroup</code> classes and let the engine handle data persistence and cleanup.
        </li>
      </ul>

      <h2>One Patch, Infinite Possibilities</h2>
      <p>
        Integrating the patch into your existing bot requires exactly two lines of code. Once patched, the <code>PatchManager</code> becomes the central hub for registering your business logic.
      </p>

      <CodeBlock
          language="python"
          filename="main.py"
          code={`from pyrogram import Client
from pyrogram_patch import patch
from .handlers import registration_router
from .middlewares import DatabaseSessionMiddleware

async def main():
    app = Client("my_bot")
    
    # 1. Apply the patch
    manager = await patch(app)
    
    # 2. Register global Middlewares
    await manager.include_middleware(DatabaseSessionMiddleware())
    
    # 3. Mount isolated Routers
    manager.include_router(registration_router)
    
    await app.start()
    await app.idle()`}
      />

      <Callout type="info" title="Zero Overhead">
        The patch is designed with extreme performance in mind. Middleware and router matching is heavily optimized to introduce near-zero nanosecond overhead compared to native Pyrogram dispatching.
      </Callout>

      <h2>Where to Start?</h2>
      <p>
        If you are building a bot that requires users to step through a multi-stage process (like ordering a product or registering an account), we highly recommend starting with the <A href="/pyrogram-patch/tutorial" class="font-bold">Stateful Wizard Tutorial</A>.
      </p>

    </div>
  );
}
