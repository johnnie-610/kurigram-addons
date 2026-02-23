import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Custom Backends — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Custom Backends</h1>
        <p class="text-slate-400 mb-8">Implement your own FSM storage backend by subclassing BaseStorage.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">BaseStorage Interface</h2>
        <CodeBlock code={`from pyrogram_patch.fsm.storages.base_storage import BaseStorage

class PostgresStorage(BaseStorage):
    async def get_state(self, key):
        """Return the current state string or None."""
        ...

    async def set_state(self, key, state):
        """Set the state for a key."""
        ...

    async def get_data(self, key):
        """Return the stored data dict."""
        ...

    async def set_data(self, key, data):
        """Set the data dict for a key."""
        ...

    async def finish(self, key):
        """Clear state and data for a key."""
        ...

    async def close(self):
        """Cleanup connections on shutdown."""
        ...`} />
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Key Format</h2>
        <p class="text-sm text-slate-400 mb-4">The <code>key</code> parameter is a tuple of <code>(chat_id: int, user_id: int)</code>. Your storage must handle this key format consistently.</p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Registering</h2>
        <CodeBlock code={`storage = PostgresStorage(dsn="postgresql://...")
manager.set_storage(storage)`} />
      </section>
    </Layout>
  );
}
