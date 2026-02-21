import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Terminal, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function RouterApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>Router API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Terminal size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Router
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The foundation for modular event handling. <code>Router</code> provides a complete suite of decorators for all Pyrogram events, supporting hierarchical composition.
        </p>
      </section>

      {/* Methods */}
      <ApiItem 
        name="include_router"
        signature="include_router(router)"
        description="Nests another router into the current one, forming a tree structure."
        parameters={[
          { name: "router", type: "Router", description: "The sub-router to include.", required: true }
        ]}
        example={`root_router = Router()\nauth_router = Router()\n\nroot_router.include_router(auth_router)`}
      />

      <ApiItem 
        name="set_client"
        signature="set_client(client)"
        description="Assigns a Pyrogram client to the router and registers all pending handlers. Usually called internally by PatchManager."
        parameters={[
            { name: "client", type: "pyrogram.Client", description: "The target client for handler registration." }
        ]}
        example={`router.set_client(app)`}
      />

      {/* Decorators */}
      <section class="space-y-8 pt-10 border-t border-slate-200 dark:border-tokio-border">
          <h2 class="text-4xl font-black">Event Decorators</h2>
          <p class="text-slate-500 font-medium italic">Every decorator supports standard Pyrogram filters and optional handler groups.</p>
          
          <div class="grid md:grid-cols-2 gap-4">
              {[
                  "on_message", "on_callback_query", "on_inline_query", 
                  "on_chosen_inline_result", "on_edited_message", 
                  "on_poll", "on_user_status", "on_chat_member_updated"
              ].map(d => (
                <div class="p-5 rounded-xl bg-slate-900/5 dark:bg-slate-500/5 border border-slate-200 dark:border-tokio-border font-mono text-sm group hover:border-primary-500 transition-colors">
                    <span class="text-primary-500 font-black">@router.{d}</span>(filters, group=0)
                </div>
              ))}
          </div>

          <div class="mt-8">
            <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Example Usage
            </h4>
            <div class="-my-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <CodeBlock 
                    language="python"
                    code={`from pyrogram import filters\nfrom pyrogram_patch.router import Router\n\nrouter = Router()\n\n@router.on_message(filters.command("start"))\nasync def start_cmd(client, message):\n    await message.reply("Hello!")\n\n@router.on_callback_query(filters.regex("prefix:"))\nasync def cq_handler(client, callback):\n    await callback.answer()`}
                />
            </div>
          </div>
      </section>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Related API Docs</h2>
        <div class="flex gap-4">
            <A href="/api/patch-manager" class="text-primary-500 font-bold hover:underline">PatchManager <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/middleware-manager" class="text-primary-500 font-bold hover:underline">MiddlewareManager <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
