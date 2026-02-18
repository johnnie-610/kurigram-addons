import { Component, createSignal, onMount, createEffect } from "solid-js";
import { Check, ClipboardCopy } from "lucide-solid";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript"; 

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const CodeBlock: Component<CodeBlockProps> = (props) => {
  const [copied, setCopied] = createSignal(false);
  const [visible, setVisible] = createSignal(false);
  let codeRef: HTMLElement | undefined;

  const highlight = () => {
    if (codeRef) {
      Prism.highlightElement(codeRef);
    }
  };

  onMount(() => {
    highlight();
    // Trigger entry animation
    setTimeout(() => setVisible(true), 100);
  });

  createEffect(() => {
    props.code; 
    props.language;
    highlight();
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div 
      class={`my-8 rounded-xl overflow-hidden glass-card transition-all duration-500 ease-out group ${
        visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ "transition-delay": "100ms" }}
    >
      {(props.filename || props.language) && (
        <div class="flex items-center justify-between px-6 py-2.5 bg-slate-50 dark:bg-tokio-bg border-b border-slate-200 dark:border-tokio-border">
          <div class="flex items-center gap-3">
            {props.filename && (
              <span class="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                {props.filename}
              </span>
            )}
          </div>
          <div class="flex items-center gap-4">
             {props.language && (
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 select-none">
                  {props.language}
                </span>
             )}
            <button
              onClick={copyToClipboard}
              class="text-slate-400 hover:text-primary-500 transition-all duration-200 focus:outline-none p-1 rounded-md hover:bg-slate-100 dark:hover:bg-tokio-card"
              title="Copy"
            >
              {copied() ? <Check size={14} class="text-primary-500" /> : <ClipboardCopy size={14} />}
            </button>
          </div>
        </div>
      )}
      
      <div class="relative overflow-x-auto group/pre bg-slate-50 dark:bg-tokio-card">
        {!props.filename && (
          <button
            onClick={copyToClipboard}
            class="absolute top-4 right-4 opacity-0 group-hover/pre:opacity-100 transition-opacity z-10 p-2 rounded-lg bg-white/10 text-slate-400 hover:text-primary-500 backdrop-blur-md border border-white/10"
            title="Copy"
          >
            {copied() ? <Check size={16} /> : <ClipboardCopy size={16} />}
          </button>
        )}
        <pre class="!m-0 !p-6 !bg-transparent text-[13px] font-mono leading-relaxed text-slate-800 dark:text-slate-100 selection:bg-primary-500/30">
          <code 
            ref={codeRef}
            class={`language-${props.language || 'text'} transition-opacity duration-300 ${visible() ? 'opacity-100' : 'opacity-0'}`}
          >
            {props.code.trim()}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
