import { createSignal, JSX } from "solid-js";

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
}

export default function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = createSignal(false);

  const copy = async () => {
    await navigator.clipboard.writeText(props.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="relative group my-4">
      {props.title && (
        <div class="flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 text-xs font-medium"
          style={{ background: "var(--color-surface)", "border-color": "var(--color-code-border)", color: "var(--color-text-secondary)" }}>
          <svg class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {props.title}
        </div>
      )}
      <pre classList={{ "!rounded-t-none": !!props.title }}>
        <code innerHTML={props.code} />
      </pre>
      <button
        onClick={copy}
        class="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ background: "var(--color-surface)" }}
        title="Copy to clipboard"
      >
        {copied() ? (
          <svg class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
