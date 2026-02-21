import { Component, For, Show } from "solid-js";
import CodeBlock from "~/components/CodeBlock";

interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}

interface Exception {
  name: string;
  description: string;
}

interface ApiItemProps {
  name: string;
  signature: string;
  description: string;
  parameters?: Parameter[];
  returns?: {
    type: string;
    description: string;
  };
  raises?: Exception[];
  note?: string;
  example?: string;
  exampleLanguage?: string;
}

const ApiItem: Component<ApiItemProps> = (props) => {
  return (
    <div class="glass-card rounded-xl overflow-hidden border border-slate-200 dark:border-tokio-border mb-10 group bg-white dark:bg-tokio-card">
      {/* Signature Header */}
      <div class="bg-slate-50 dark:bg-tokio-bg px-8 py-5 border-b border-slate-200 dark:border-tokio-border">
        <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-black tracking-tight text-primary-500">
                {props.name}
            </h3>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Method</span>
        </div>
        <div class="font-mono text-[13px] inline-block px-3 py-1.5 rounded-md bg-slate-900 text-primary-400 border border-slate-800">
            {props.signature}
        </div>
      </div>

      <div class="p-8 space-y-8">
        {/* General Description */}
        <div class="text-[15px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {props.description}
        </div>

        {/* Parameters */}
        <Show when={props.parameters && props.parameters.length > 0}>
            <div class="space-y-4">
                <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Parameters
                </h4>
                <div class="grid gap-2">
                    <For each={props.parameters}>
                        {(param) => (
                            <div class="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 p-4 rounded-xl bg-slate-50 dark:bg-tokio-bg border border-slate-200 dark:border-tokio-border">
                                <div class="md:w-1/4 flex flex-col">
                                    <span class="font-bold text-slate-900 dark:text-white font-mono text-sm underline decoration-primary-500/30 underline-offset-4">
                                        {param.name}
                                    </span>
                                    <span class="text-[10px] font-mono text-primary-500/80 mt-1">
                                        {param.type}
                                    </span>
                                </div>
                                <div class="md:w-3/4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {param.description}
                                    <Show when={param.default}>
                                        <div class="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold italic opacity-70">
                                            DEFAULT: <code class="bg-slate-200 dark:bg-tokio-card px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">{param.default}</code>
                                        </div>
                                    </Show>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </Show>

        {/* Return Value */}
        <Show when={props.returns}>
            <div class="space-y-4">
                 <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Returns
                </h4>
                <div class="p-5 rounded-xl bg-primary-500/5 border border-primary-500/10 transition-colors hover:bg-primary-500/10">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="font-mono text-xs font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">
                          {props.returns?.type}
                      </div>
                    </div>
                    <div class="text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line leading-relaxed">
                        {props.returns?.description}
                    </div>
                </div>
            </div>
        </Show>

         {/* Exceptions */}
         <Show when={props.raises && props.raises.length > 0}>
            <div class="space-y-4">
                 <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Exceptions
                </h4>
                <div class="grid gap-2">
                    <For each={props.raises}>
                        {(err) => (
                            <div class="flex items-center justify-between px-4 py-3 rounded-lg bg-rose-500/5 border border-rose-500/10 transition-all hover:translate-x-1">
                                <div class="flex items-center gap-4">
                                  <span class="text-xs font-bold text-rose-500 font-mono">
                                      {err.name}
                                  </span>
                                  <span class="text-xs text-slate-500 font-medium italic">
                                      {err.description}
                                  </span>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </Show>

        {/* Example */}
        <Show when={props.example}>
            <div class="space-y-4">
                 <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Example
                </h4>
                <div class="-my-4">
                    <CodeBlock 
                        language={props.exampleLanguage || "python"}
                        code={props.example!}
                    />
                </div>
            </div>
        </Show>

        <Show when={props.note}>
            <div class="text-xs italic text-slate-500 dark:text-slate-500 pt-6 border-t border-slate-200 dark:border-tokio-border flex items-center gap-2">
                <span class="font-black uppercase tracking-widest not-italic">Note:</span> {props.note}
            </div>
        </Show>
      </div>
    </div>
  );
};

export default ApiItem;
