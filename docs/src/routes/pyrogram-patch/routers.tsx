import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import { A } from "@solidjs/router";
import Callout from "~/components/Callout";

export default function PatchRoutersPage() {
  return (
    <div class="pb-20">
      <Title>Modular Routing Deep Dive - Pyrogram Patch</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Organizational Strategy
      </div>
      
      <h1>Hierarchical Routers</h1>
      
      <p class="lead text-xl">
        Scale your bot logic horizontally. Our router system allows you to build trees of handlers with isolated logic, shared clients, and automated duplicate prevention.
      </p>

      <h2>The Need for Routers</h2>
      <p>
        In a standard Pyrogram application, developers usually define all handlers in a single large file, or pass the <code>app</code> instance around to different files to register decorators. This quickly becomes impossible to maintain when your bot grows beyond a few dozen handlers.
      </p>
      
      <p>
        Routers solve this by allowing you to register handlers on a "dummy" object that is completely decoupled from your Telegram Client.
      </p>

      <h3>Deferred Registration</h3>
      <p>
        Handlers registered on a <code>Router</code> are stored in a pending state until the router is eventually attached to the <code>PatchManager</code>. This allows you to define complex logic trees before your bot even starts, and easily unit test them.
      </p>

      <h3>Duplicate Defense</h3>
      <p>
        The router system actively prevents the same handler function from being registered twice to the same Pyrogram group. It protects your bot from terrifying duplicate update bugs when team members accidentally import the same module twice.
      </p>

      <h2>Building the Tree</h2>
      <p>
        The best practice is to separate your feature areas into dedicated files, each with its own router, and then include them into a central root router.
      </p>

      <h3>1. Define the Feature Router</h3>
      <p>Create a router for a specific domain, like authentication or payments.</p>
      <CodeBlock
          language="python"
          filename="features/auth.py"
          code={`from pyrogram import filters
from pyrogram_patch.router import Router

# Create an isolated router
auth_router = Router()

@auth_router.on_message(filters.command("login"))
async def login_handler(client, message):
    await message.reply("Logging you in...")`}
      />

      <h3>2. Assemble the Tree</h3>
      <p>In your main execution file, combine all your feature routers into a single root router, or attach them directly to the patch manager.</p>
      <CodeBlock
          language="python"
          filename="main.py"
          code={`from pyrogram import Client
from pyrogram_patch import patch
from pyrogram_patch.router import Router

# Import your features
from .features.auth import auth_router
from .features.payments import payments_router

async def run_bot():
    app = Client("modular_bot")
    manager = await patch(app)
    
    # You can nest routers as deeply as you want
    main_router = Router()
    main_router.include_router(auth_router)
    main_router.include_router(payments_router)
    
    # Finally, attach the root to the engine
    manager.include_router(main_router)
    
    await app.start()
    await app.idle()`}
      />

      <h2>Advanced Pattern: Router Context</h2>
      <p>
        Because routers define isolated boundaries, you might want to share specific dependencies (like a database connection) only with handlers inside a specific router, rather than globally via middlewares.
      </p>
      <p>This is currently achieved by applying Middlewares directly to specific Routers, ensuring that dependency injection only triggers for relevant handler groups.</p>

      <br />
      <hr />
      
      <Callout type="info" title="The Next Step">
         Combine routers with state management to build complex, persistent user flows that span across multiple files cleanly. Check out the <A class="font-bold" href="/pyrogram-patch/fsm">FSM Engine</A> docs.
      </Callout>

    </div>
  );
}
