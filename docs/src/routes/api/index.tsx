import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Box, Cpu, Layers, MousePointer2 } from "lucide-solid";

export default function ApiIndex() {
  return (
    <div class="space-y-16 pb-20">
      <Title>API Reference - Kurigram Addons</Title>

      <section class="space-y-6">
        <h1 class="text-6xl font-black tracking-tighter italic">API Reference</h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
          Low-level documentation for Kurigram Addons components. 
          Everything you need to know about method signatures, parameters, and return types.
        </p>
      </section>

      <div class="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "Pyrogram Patch",
            items: [
              { name: "PatchManager", href: "/api/patch-manager", icon: Cpu, desc: "The core manager for patched clients and middleware." },
              { name: "Router", href: "/api/router", icon: Box, desc: "Modular update routing and handler management." }
            ]
          },
          {
            title: "PyKeyboard",
            items: [
              { name: "InlineKeyboard", href: "/api/inline-keyboard", icon: MousePointer2, desc: "High-level builder for Telegram Inline keyboards." },
              { name: "ReplyKeyboard", href: "/api/reply-keyboard", icon: Layers, desc: "High-level builder for Telegram Reply keyboards." }
            ]
          }
        ].map(section => (
          <div class="space-y-6">
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-2">{section.title}</h2>
            <div class="space-y-4">
              {section.items.map(item => (
                <A href={item.href} class="flex items-center gap-6 p-6 rounded-xl bg-white dark:bg-tokio-card border border-slate-200 dark:border-tokio-border hover:border-primary-500 transition-all group">
                  <div class="w-12 h-12 bg-slate-50 dark:bg-tokio-bg rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors border border-slate-200 dark:border-tokio-border">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold group-hover:text-primary-500 transition-colors">{item.name}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </A>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
