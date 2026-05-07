import { Title } from "@solidjs/meta";
import Layout from "~/components/Layout";
import CodeBlock from "~/components/CodeBlock";

export default function HealthPage() {
  return (
    <Layout>
      <Title>Health Check — kurigram-addons</Title>

      <div class="animate-fade-in-up">
        <h1 class="text-3xl font-bold mb-2">Health Check Endpoint</h1>
        <p class="text-slate-400 mb-2">
          Lightweight HTTP <code>GET /health</code> server for Kubernetes liveness probes, Docker <code>HEALTHCHECK</code>,
          and container orchestration.{" "}
          <span class="text-amber-400 text-xs font-mono">v0.5.0</span>
        </p>
      </div>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Setup</h2>
        <p class="text-slate-400 mb-4 text-sm">
          Pass <code>health_port=N</code> to <code>KurigramClient</code>. The server starts automatically
          alongside the bot and shuts down cleanly with it.
        </p>
        <CodeBlock
          title="main.py"
          code={`app = KurigramClient(
    <span class="str">"my_bot"</span>,
    bot_token=<span class="str">"..."</span>,
    storage=MemoryStorage(),
    health_port=<span class="num">8080</span>,   <span class="cmt"># &lt;— enable health endpoint</span>
)
app.run()`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Response format</h2>
        <p class="text-slate-400 mb-4 text-sm">
          <code>GET http://localhost:8080/health</code>
        </p>
        <CodeBlock
          language="json"
          title="200 OK — healthy"
          code={`{
  <span class="str">"status"</span>: <span class="str">"ok"</span>,
  <span class="str">"pool"</span>: {
    <span class="str">"active_helpers"</span>:       <span class="num">4</span>,
    <span class="str">"uptime"</span>:               <span class="num">3600.0</span>,
    <span class="str">"total_helpers_created"</span>: <span class="num">50</span>,
    <span class="str">"expired_helpers"</span>:       <span class="num">12</span>
  },
  <span class="str">"storage"</span>: <span class="str">"healthy"</span>
}`}
        />
        <CodeBlock
          language="json"
          title="503 Service Unavailable — storage degraded"
          code={`{
  <span class="str">"status"</span>:  <span class="str">"degraded"</span>,
  <span class="str">"pool"</span>:    { <span class="str">"active_helpers"</span>: <span class="num">2</span>, <span class="str">"uptime"</span>: <span class="num">120.0</span>, ... },
  <span class="str">"storage"</span>: <span class="str">"unhealthy"</span>
}`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Kubernetes example</h2>
        <CodeBlock
          language="yaml"
          title="deployment.yaml"
          code={`livenessProbe:
  httpGet:
    path: /health
    port: <span class="num">8080</span>
  initialDelaySeconds: <span class="num">10</span>
  periodSeconds: <span class="num">30</span>
readinessProbe:
  httpGet:
    path: /health
    port: <span class="num">8080</span>
  initialDelaySeconds: <span class="num">5</span>
  periodSeconds: <span class="num">10</span>`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Docker example</h2>
        <CodeBlock
          language="dockerfile"
          title="Dockerfile"
          code={`HEALTHCHECK --interval=30s --timeout=5s \\
  CMD wget -qO- http://localhost:8080/health || exit 1`}
        />
      </section>

      <section class="mb-10 reveal">
        <h2 class="text-xl font-semibold mb-4 text-amber-400">Notes</h2>
        <ul class="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>Uses only the Python standard library — no extra HTTP dependency.</li>
          <li>Returns <code>503</code> when storage reports unhealthy, <code>200</code> otherwise.</li>
          <li>All other paths return <code>404</code>.</li>
          <li>Bind to <code>127.0.0.1</code> instead of <code>0.0.0.0</code> if you do not need external access.</li>
        </ul>
      </section>
    </Layout>
  );
}
