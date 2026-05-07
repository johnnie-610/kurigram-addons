import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Writing Middleware — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Writing Middleware</h1>
        <p class="text-slate-400 mb-8">Create custom middleware functions with signature-based dependency injection.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Before Middleware</h2>
        <CodeBlock code={`async def logging_middleware(update, client, patch_helper):
    """Log every incoming update before handlers run."""
    print(f"Update from {update.from_user.id}")

await manager.add_middleware(logging_middleware, kind="before")`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Around Middleware</h2>
        <CodeBlock code={`async def timing_middleware(next_handler, update):
    """Measure handler execution time."""
    import time
    start = time.monotonic()
    result = await next_handler(update)
    elapsed = time.monotonic() - start
    print(f"Handler took {elapsed:.3f}s")
    return result

await manager.add_middleware(timing_middleware, kind="around")`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">After Middleware</h2>
        <CodeBlock code={`async def analytics_middleware(update, client, patch_helper):
    """Send analytics after handler completes."""
    await send_analytics(event="update_handled", user=update.from_user.id)

await manager.add_middleware(analytics_middleware, kind="after")`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Priority</h2>
        <p class="text-sm text-slate-400">Higher priority middleware runs first. Default is 0. Use negative values to run last:</p>
        <CodeBlock code={`await manager.add_middleware(auth_check, kind="before", priority=100)   # runs first
await manager.add_middleware(logging_mw, kind="before", priority=0)     # runs second
await manager.add_middleware(cleanup_mw, kind="after", priority=-10)    # runs last`} />
      </section>
    </Layout>
  );
}
