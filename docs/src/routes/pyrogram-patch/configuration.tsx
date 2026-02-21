import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import { A } from "@solidjs/router";
import Callout from "~/components/Callout";

export default function ConfigurationPage() {
  return (
    <div class="pb-20">
      <Title>Configuration System - Pyrogram Patch</Title>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4 not-prose">
        System Settings
      </div>
      
      <h1>Configuration</h1>
      
      <p class="lead text-xl">
        Pyrogram Patch features a centralized, strictly-typed configuration system powered by Pydantic. Manage everything from circuit breaker thresholds to FSM storage via environment variables or a programmatic API.
      </p>

      <h2>Environment Variables</h2>
      <p>
        The easiest way to configure Pyrogram Patch in a production environment (like Docker or Kubernetes) is through environment variables. Each component subsystem has a specific prefix to prevent naming collisions.
      </p>

      <ul>
        <li><strong><code>PYROGRAM_PATCH_</code></strong>: Root settings (e.g., <code>DEBUG</code>)</li>
        <li><strong><code>PYROGRAM_PATCH_FSM_</code></strong>: State machine constraints (e.g., <code>DEFAULT_TTL</code>)</li>
        <li><strong><code>PYROGRAM_PATCH_STORAGE_</code></strong>: Storage engine connection URIs</li>
        <li><strong><code>PYROGRAM_PATCH_MIDDLEWARE_</code></strong>: Circuit breakers and timeouts</li>
      </ul>

      <CodeBlock 
          language="bash"
          filename=".env"
          code={`# Enable high-verbosity internal logs
PYROGRAM_PATCH_DEBUG=True

# Kill states after 1 hour of inactivity
PYROGRAM_PATCH_FSM_DEFAULT_TTL=3600

# Where Redis is located
PYROGRAM_PATCH_STORAGE_REDIS_URL=redis://localhost:6379/1

# Maximum seconds a middleware is allowed to run before forced cancellation
PYROGRAM_PATCH_MIDDLEWARE_MAX_EXECUTION_TIME=5.0`}
      />

      <h2>Programmatic API</h2>
      <p>
        You can securely read and mutate configuration values during runtime using the python API.
      </p>

      <h3>Getting Configuration</h3>
      <p>The <code>get_config()</code> function returns a parsed Pydantic settings object representing the active configuration.</p>
      
      <CodeBlock 
          language="python"
          code={`from pyrogram_patch.config import get_config

config = get_config()
print(f"Max exec time: {config.middleware.max_execution_time}s")`}
      />

      <h3>Updating Settings Dynamically</h3>
      <p>Updates provided via the <code>update_config()</code> function are applied instantly to the global configuration instance used by the dispatch engine.</p>
      
      <CodeBlock 
          language="python"
          code={`from pyrogram_patch.config import update_config

# Pass a dictionary of nested updates
update_config({
    "debug": True,
    "middleware": {
        "max_execution_time": 10.0,
        "enable_circuit_breaker": False
    }
})`}
      />

      <h2>Reference Map</h2>

      <h3>Middlewares & Circuit Breakers</h3>
      <ul>
        <li><code>max_execution_time</code>: Hard limit limit for a single middleware block (default 10s).</li>
        <li><code>enable_circuit_breaker</code>: Auto-disable failing middlewares natively (default True).</li>
        <li><code>failure_threshold</code>: Number of consecutive exceptions before the circuit trips.</li>
        <li><code>recovery_timeout</code>: Time (in seconds) the circuit waits before checking if the middleware is healthy again.</li>
      </ul>

      <h3>FSM Constraints</h3>
      <ul>
        <li><code>default_ttl</code>: Seconds before an idle user's state context is wiped completely (0 = never expires).</li>
        <li><code>max_state_size</code>: Maximum state size in bytes per user dict to prevent overwhelming Redis limits.</li>
      </ul>

      <br />
      <hr />
      
      <Callout type="info" title="Validation">
         Because settings are validated tightly by Pydantic V2, attempting to assign an invalid type (like passing the string <code>"fast"</code> to <code>max_execution_time</code>) will immediately raise a ValidationError on startup, protecting you from subtle runtime bugs.
      </Callout>

    </div>
  );
}
