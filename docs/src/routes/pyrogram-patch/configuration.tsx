import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { 
  Settings, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Layers,
  Zap,
  RefreshCw,
  FileCode,
  ArrowRight
} from "lucide-solid";
import { A } from "@solidjs/router";

export default function ConfigurationPage() {
  return (
    <div class="space-y-16 pb-20">
      <Title>Configuration System - Pyrogram Patch</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Settings size={12} /> System Settings
        </div>
        <h1 class="text-6xl font-black tracking-tighter">
          Configuration
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          Pyrogram Patch features a centralized configuration system powered by Pydantic. 
          Manage everything from circuit breaker thresholds to FSM storage via environment variables or programmatic API.
        </p>
      </section>

      {/* Environment Variables */}
      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
          <Terminal class="text-slate-400" /> Environment Variables
        </h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          The easiest way to configure Pyrogram Patch is through environment variables. 
          Each component has its own prefix to prevent naming collisions.
        </p>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="glass-card p-6 rounded-2xl border-l-4 border-primary-500">
                <code class="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2 block">General Prefix</code>
                <h4 class="text-lg font-bold mb-1">PYROGRAM_PATCH_</h4>
                <p class="text-sm text-slate-500">Global settings like <code>DEBUG</code> or <code>MAX_WORKERS</code>.</p>
            </div>
            <div class="glass-card p-6 rounded-2xl border-l-4 border-amber-500">
                <code class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 block">FSM Prefix</code>
                <h4 class="text-lg font-bold mb-1">PYROGRAM_PATCH_FSM_</h4>
                <p class="text-sm text-slate-500">Settings for <code>DEFAULT_TTL</code>, <code>MAX_STATE_SIZE</code>, etc.</p>
            </div>
            <div class="glass-card p-6 rounded-2xl border-l-4 border-teal-500">
                <code class="text-xs font-bold text-teal-500 uppercase tracking-wider mb-2 block">Storage Prefix</code>
                <h4 class="text-lg font-bold mb-1">PYROGRAM_PATCH_STORAGE_</h4>
                <p class="text-sm text-slate-500">Configure <code>REDIS_URL</code>, <code>MONGO_URI</code>, or prefixes.</p>
            </div>
            <div class="glass-card p-6 rounded-2xl border-l-4 border-rose-500">
                <code class="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 block">Middleware Prefix</code>
                <h4 class="text-lg font-bold mb-1">PYROGRAM_PATCH_MIDDLEWARE_</h4>
                <p class="text-sm text-slate-500">Tune <code>MAX_EXECUTION_TIME</code> or circuit breaker state.</p>
            </div>
        </div>

        <CodeBlock 
          language="bash"
          filename=".env"
          code={`
PYROGRAM_PATCH_DEBUG=True
PYROGRAM_PATCH_FSM_DEFAULT_TTL=3600
PYROGRAM_PATCH_STORAGE_REDIS_URL=redis://localhost:6379/1
PYROGRAM_PATCH_MIDDLEWARE_MAX_EXECUTION_TIME=5.0
          `}
        />
      </section>

      {/* Programmatic Access */}
      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
          <FileCode class="text-slate-400" /> Programmatic API
        </h2>
        <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
          You can also manage configuration directly in your code using the provided helper functions.
        </p>

        <div class="space-y-8">
            <div class="space-y-4">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    <Zap size={18} class="text-yellow-500" /> Getting Configuration
                </h3>
                <CodeBlock 
                    language="python"
                    code={`from pyrogram_patch.config import get_config

config = get_config()
print(config.middleware.max_execution_time)
print(config.fsm.default_ttl)`}
                />
            </div>

            <div class="space-y-4">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    <RefreshCw size={18} class="text-blue-500" /> Updating Settings
                </h3>
                <p class="text-sm text-slate-500">Updates are applied immediately to the global configuration instance.</p>
                <CodeBlock 
                    language="python"
                    code={`from pyrogram_patch.config import update_config

# Pass a dictionary of updates
update_config({
    "debug": True,
    "middleware": {"max_execution_time": 10.0}
})`}
                />
            </div>
        </div>
      </section>

      {/* Configuration Map */}
      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight">Configuration Reference</h2>
        
        <div class="space-y-10">
            {/* FSM Section */}
            <div class="glass-card p-8 rounded-3xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Database size={20} />
                    </div>
                    <h3 class="text-2xl font-black italic">FSM Settings</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">default_ttl</span>
                        <span class="text-sm text-slate-500">Seconds before state expires (0 = never)</span>
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">max_state_size</span>
                        <span class="text-sm text-slate-500">Maximum state size in bytes</span>
                    </div>
                    <div class="flex justify-between items-center py-3">
                        <span class="font-mono text-sm">cleanup_interval</span>
                        <span class="text-sm text-slate-500">Frequency of stale state cleanup</span>
                    </div>
                </div>
            </div>

            {/* Middleware Section */}
            <div class="glass-card p-8 rounded-3xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Layers size={20} />
                    </div>
                    <h3 class="text-2xl font-black italic">Middleware Settings</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">max_execution_time</span>
                        <span class="text-sm text-slate-500">Hard limit for middleware logic</span>
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">enable_circuit_breaker</span>
                        <span class="text-sm text-slate-500">Auto-disable failing middlewares</span>
                    </div>
                    <div class="flex justify-between items-center py-3">
                        <span class="font-mono text-sm">signature_cache_size</span>
                        <span class="text-sm text-slate-500">LRU cache for middleware signatures</span>
                    </div>
                </div>
            </div>

            {/* Circuit Breaker Section */}
            <div class="glass-card p-8 rounded-3xl border border-slate-200 dark:border-tokio-border">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 class="text-2xl font-black italic">Circuit Breaker</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">failure_threshold</span>
                        <span class="text-sm text-slate-500">Consecutive failures to open circuit</span>
                    </div>
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                        <span class="font-mono text-sm">recovery_timeout</span>
                        <span class="text-sm text-slate-500">Wait time before half-open state</span>
                    </div>
                    <div class="flex justify-between items-center py-3">
                        <span class="font-mono text-sm">fallback_message</span>
                        <span class="text-sm text-slate-500">Message sent when circuit is open</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-8 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[3rem]">
        <h2 class="text-4xl font-black text-center italic uppercase tracking-tighter">Tune for Performance</h2>
        <p class="text-slate-500 font-medium max-w-xl text-center">Now that you've mastered configuration, learn how to build performant middlewares that leverage these settings.</p>
        <A 
          href="/pyrogram-patch/middlewares" 
          class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          Master Middlewares <ArrowRight size={18} />
        </A>
      </section>
    </div>
  );
}
