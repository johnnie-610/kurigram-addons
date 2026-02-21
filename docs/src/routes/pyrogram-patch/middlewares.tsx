import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { A } from "@solidjs/router";

export default function PatchMiddlewaresPage() {
  return (
    <div class="pb-20">
      <Title>Middleware Deep Dive - Pyrogram Patch</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        Execution Pipeline
      </div>
      
      <h1>Middleware Stack</h1>
      
      <p class="lead text-xl">
        Control every update before it reaches your handlers. The Pyrogram Patch middleware stack supports asynchronous execution with sub-millisecond overhead and context injection.
      </p>

      <h2>Architectural Overview</h2>
      <p>
        Pyrogram natively evaluates filters and immediately runs matching handlers. But what if you want to log every incoming message, or open a database session securely for <em>every</em> handler in your bot? 
      </p>
      <p>
        The Patch introduces a sophisticated "Tri-Phase" middleware engine to solve this. Add hooks at three critical lifecycle stages:
      </p>

      <ul>
        <li><strong>Before Hooks:</strong> Executed as soon as an update arrives, before any filters are checked. Ideal for global rate limiting or auth.</li>
        <li><strong>Around Wrappers:</strong> Wraps the actual handler execution in a functional decorator. Allows you to 'halt', 'retry', or measure the duration of handler execution.</li>
        <li><strong>After Hooks:</strong> Runs after successfully processing the update. Use it for cleanup tasks.</li>
      </ul>

      <h2>Execution Priority</h2>
      <p>
        Middlewares are executed based on their <code>priority</code> integer value. Higher values execute first (the order is internally reversed for <code>after</code> middlewares to maintain proper stack-like unwinding).
      </p>
      
      <CodeBlock 
          language="python"
          code={`# High priority middleware (runs very early)
await patch_manager.include_middleware(auth_middleware, priority=100)

# Low priority middleware (runs right before the handler is called)
await patch_manager.include_middleware(log_middleware, priority=1)`}
      />

      <h2>Building a Middleware</h2>
      <p>
        Middlewares can be simple async functions or full classes. The engine automatically inspects your parameters (via <code>inspect.signature</code>) and injects only the context you request.
      </p>

      <h3>1. The "Before" Hook (Dependency Injection)</h3>
      <p>
        A powerful use case is injecting data (like a database user object) into the global <code>PatchHelper</code> pool, making it available to all subsequent middlewares and the final handler.
      </p>

      <CodeBlock 
          language="python"
          filename="middlewares.py"
          code={`from pyrogram_patch import PatchHelper
from pyrogram.types import Update
from .database import get_user

async def auth_middleware(update: Update, patch_helper: PatchHelper):
    # Fetch the user from DB based on telegram ID
    # (Assuming update has a from_user attribute)
    if hasattr(update, "from_user") and update.from_user:
        db_user = await get_user(update.from_user.id)
        
        # Inject user into the shared data pool!
        # Now every handler can request 'user_profile' in its arguments
        await patch_helper.update_data(user_profile=db_user)`}
      />

      <h3>2. The "Around" Wrapper (Time Calculation)</h3>
      <p>
        An around middleware must accept a <code>handler</code> argument. It is responsible for awaiting that handler to continue the execution chain. If you don't <code>await handler()</code>, the update is dropped.
      </p>

      <CodeBlock
          language="python"
          code={`import time

async def trace_middleware(handler, update):
    start = time.time()
    
    # Yield control to the next middleware or the actual bot handler
    result = await handler() 
    
    duration = time.time() - start
    print(f"Update processed in {duration:.4f}s")
    
    return result`}
      />

      <h3>3. Registering the Stack</h3>
      <p>You apply middlewares to the central patch manager. Be sure to specify the <code>kind</code> correctly.</p>

      <CodeBlock
          language="python"
          code={`# Register them in your startup sequence
await patch_manager.include_middleware(auth_middleware, kind="before")
await patch_manager.include_middleware(trace_middleware, kind="around")`}
      />

      <h2>Advanced Mechanics</h2>
      
      <h3>Execution Timeouts</h3>
      <p>
        To prevent "zombie" updates from hanging your dispatcher indefinitely, the engine enforces a configurable <code>max_execution_time</code> limit for every middleware block.
      </p>

      <h3>Circuit Breakers</h3>
      <p>
        If a middleware starts throwing consistent exceptions (for instance, if your database goes down), Pyrogram Patch can automatically "open the circuit" and temporarily disable that middleware, falling back gracefully without bringing the entire bot offline. 
      </p>

      <Callout type="info" title="Configuration">
        Timeout thresholds and circuit breaker parameters are all tunable. See the <A class="font-bold" href="/pyrogram-patch/configuration">Configuration</A> guide for details.
      </Callout>

    </div>
  );
}
