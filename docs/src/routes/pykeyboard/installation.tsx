import { Title } from "@solidjs/meta";
import CodeBlock from "~/components/CodeBlock";
import Callout from "~/components/Callout";
import { Download, Terminal, Settings, AlertCircle, CheckCircle2 } from "lucide-solid";

export default function InstallationPage() {
  return (
    <div class="space-y-12 pb-20">
      <Title>Installation - PyKeyboard - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Download size={12} /> Getting Started
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Installation
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          PyKeyboard is a lightweight, modern library with zero unnecessary bloat. It's built for speed and type-safety on top of the Kurigram framework.
        </p>
      </section>

      {/* Requirements */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings class="text-slate-400" /> Requirements
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border bg-white dark:bg-tokio-bg-alt">
                <div class="font-bold text-slate-900 dark:text-white mb-2">Python Environment</div>
                <p class="text-sm text-slate-500">Python 3.9 or higher is required for full type-hinting support and modern async features.</p>
            </div>
            <div class="glass-card p-6 rounded-2xl border border-slate-200 dark:border-tokio-border bg-white dark:bg-tokio-bg-alt">
                <div class="font-bold text-slate-900 dark:text-white mb-2">Kurigram Framework</div>
                <p class="text-sm text-slate-500">Built specifically for Kurigram. It will be automatically installed as a dependency.</p>
            </div>
        </div>
      </section>

      {/* Package Managers */}
      <section class="space-y-8">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Terminal class="text-blue-500" /> Package Managers
        </h2>
        
        <div class="space-y-6">
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Using pip</h3>
                <CodeBlock 
                    language="bash"
                    code="pip install kurigram-addons"
                />
            </div>

            <div class="space-y-4">
                <h3 class="text-xl font-bold">Using poetry</h3>
                <CodeBlock 
                    language="bash"
                    code="poetry add kurigram-addons"
                />
            </div>
        </div>
      </section>

      {/* Source Installation */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">From Source</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            If you need the bleeding-edge version or want to contribute, install directly from GitHub:
        </p>
        <CodeBlock 
            language="bash"
            code={`git clone https://github.com/johnnie-610/kurigram-addons.git
cd kurigram-addons
pip install -e .`}
        />
      </section>

      {/* Verification */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CheckCircle2 class="text-emerald-500" /> Verification
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Run this minimal script to ensure your environment is set up correctly:
        </p>
        <CodeBlock 
            language="python"
            filename="verify.py"
            code={`import pykeyboard
from pykeyboard import InlineKeyboard, InlineButton

print(f"PyKeyboard version: {pykeyboard.__version__}")

# Create a test keyboard
kb = InlineKeyboard()
kb.add(InlineButton("Test", "test"))

print("✅ Installation verified successfully!")`}
        />
      </section>

      {/* Troubleshooting */}
      <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          <AlertCircle class="text-rose-500" /> Troubleshooting
        </h2>
        
        <div class="space-y-4">
            <Callout type="warning" title="TgCrypto Warning">
                You might see a warning about <code>TgCrypto</code> missing. While optional, we highly recommend installing it for significantly faster cryptographic operations in Pyrogram:
                <div class="mt-4">
                    <CodeBlock language="bash" code="pip install TgCrypto" />
                </div>
            </Callout>

            <Callout type="info" title="Import Errors">
                If you encounter <code>ImportError</code>, double-check that your active virtual environment is using Python 3.9+. Older versions of Python are not supported.
            </Callout>
        </div>
      </section>
    </div>
  );
}
