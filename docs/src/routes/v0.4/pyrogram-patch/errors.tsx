import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function PageComponent() {
  return (
    <Layout>
      <Title>Errors — kurigram-addons</Title>
      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Errors</h1>
        <p class="text-slate-400 mb-8">Structured error hierarchy with TraceInfo, error IDs, JSON serialization, and wrap() for cause chaining.</p>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Error Hierarchy</h2>
        <div class="p-4 rounded-lg border border-white/10 font-mono text-sm" style="background: var(--color-surface);">
          <div>PatchError</div>
          <div class="ml-4">├── StorageError</div>
          <div class="ml-8">├── CircuitBreakerOpenError</div>
          <div class="ml-8">└── StorageConnectionError</div>
          <div class="ml-4">├── FSMError</div>
          <div class="ml-8">├── InvalidStateTransition</div>
          <div class="ml-8">└── StateNotFoundError</div>
          <div class="ml-4">├── MiddlewareError</div>
          <div class="ml-4">└── RouterError</div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">TraceInfo</h2>
        <p class="text-sm text-slate-400 mb-4">Every <code>PatchError</code> includes a <code>trace_info</code> with error ID, timestamp, and context for log correlation.</p>
        <CodeBlock code={`try:
    await patch_helper.set_state(SomeState.step)
except InvalidStateTransition as e:
    print(e.trace_info.error_id)    # "err_abc123"
    print(e.trace_info.timestamp)   # datetime
    print(e.to_json())              # full JSON repr`} />
      </section>
    </Layout>
  );
}
