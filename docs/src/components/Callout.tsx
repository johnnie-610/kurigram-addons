import { Component, JSX, splitProps } from "solid-js";
import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-solid";

type CalloutType = "info" | "warning" | "danger" | "tip" | "note";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: JSX.Element;
}

const styles: Record<CalloutType, { container: string; icon: string; iconComp: any }> = {
  info: {
    container: "bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
    iconComp: Info,
  },
  note: {
      container: "bg-slate-500/10 border-slate-500/20 text-slate-900 dark:text-slate-200",
      icon: "text-slate-500 dark:text-slate-400",
      iconComp: Info,
    },
  tip: {
    container: "bg-teal-500/10 border-teal-500/20 text-teal-900 dark:text-teal-200",
    icon: "text-teal-600 dark:text-teal-400",
    iconComp: Lightbulb,
  },
  warning: {
    container: "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-400",
    iconComp: AlertTriangle,
  },
  danger: {
    container: "bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200",
    icon: "text-rose-600 dark:text-rose-400",
    iconComp: AlertCircle,
  },
};

const Callout: Component<CalloutProps> = (props) => {
  const type = props.type || "info";
  const style = styles[type];
  const Icon = style.iconComp;

  return (
    <div class={`my-8 p-6 rounded-2xl border backdrop-blur-md flex gap-5 ${style.container} premium-shadow transition-all duration-300 hover:scale-[1.01]`}>
      <div class={`flex-shrink-0 mt-1 ${style.icon}`}>
        <Icon size={24} />
      </div>
      <div class="flex-1 min-w-0">
        {props.title && (
          <h5 class="font-bold mb-2 text-inherit tracking-tight uppercase text-xs opacity-80">
            {props.title}
          </h5>
        )}
        <div class="prose prose-sm dark:prose-invert prose-p:my-0 prose-a:text-inherit font-medium leading-relaxed max-w-none">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Callout;
