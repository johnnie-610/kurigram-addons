import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import CodeBlock from "~/components/CodeBlock";
import { Keyboard, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function ReplyKeyboardApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>ReplyKeyboard API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
          <Keyboard size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          ReplyKeyboard
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The primary interface for building persistent bottom menus. Supports automated layout, user requests (contact, location), and poll creation hooks.
        </p>
      </section>

      {/* Constructor */}
      <ApiItem 
        name="Constructor"
        signature="ReplyKeyboard(row_width=3, is_persistent=None, resize_keyboard=None, one_time_keyboard=None, selective=None, placeholder=None)"
        description="Initializes a new ReplyKeyboard with granular control over its behavior in the Telegram client."
        parameters={[
          { name: "row_width", type: "int", description: "Default buttons per row.", default: "3" },
          { name: "is_persistent", type: "bool | None", description: "Whether the keyboard is always visible.", default: "None" },
          { name: "resize_keyboard", type: "bool | None", description: "Whether to shrink keyboard height to fit buttons.", default: "None" },
          { name: "one_time_keyboard", type: "bool | None", description: "Whether to hide after first press.", default: "None" },
          { name: "selective", type: "bool | None", description: "Whether to show only to specific users.", default: "None" },
          { name: "placeholder", type: "str | None", description: "Text shown in the input field.", default: "None" }
        ]}
        raises={[
            { name: "ConfigurationError", description: "Raised if row_width is less than 1." }
        ]}
      />

      {/* Methods */}
      <ApiItem 
        name="add"
        signature="add(*buttons)"
        description="Adds buttons to the keyboard, automatically wrapping them based on row_width."
        parameters={[
            { name: "*buttons", type: "ReplyButton | str", description: "Button objects or raw string labels." }
        ]}
      />

      <ApiItem 
        name="row"
        signature="row(*buttons)"
        description="Adds an explicit row of buttons, bypassing row_width."
        parameters={[
            { name: "*buttons", type: "ReplyButton", description: "Buttons for this row." }
        ]}
      />

      {/* Related Utilities */}
      <div class="pt-10 border-t border-slate-200 dark:border-tokio-border">
          <h2 class="text-3xl font-black mb-8">Related Utilities</h2>
          
          <div class="space-y-12">
              <section class="space-y-4">
                  <h3 class="text-xl font-bold flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-rose-500"></span> PyReplyKeyboardRemove
                  </h3>
                  <p class="text-sm text-slate-500">A helper to remove the active reply keyboard of the user.</p>
                  <CodeBlock language="python" code={`from pykeyboard import PyReplyKeyboardRemove\n\nawait message.reply("Menu closed", reply_markup=PyReplyKeyboardRemove())`} />
              </section>

              <section class="space-y-4">
                  <h3 class="text-xl font-bold flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-primary-500"></span> PyForceReply
                  </h3>
                  <p class="text-sm text-slate-500">Forces the user to send a reply via the UI's reply interface.</p>
                  <CodeBlock language="python" code={`from pykeyboard import PyForceReply\n\nawait message.reply("Enter your email:", reply_markup=PyForceReply(placeholder="user@example.com"))`} />
              </section>
          </div>
      </div>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Next API Reference</h2>
        <div class="flex gap-4">
            <A href="/api/inline-keyboard" class="text-primary-500 font-bold hover:underline">InlineKeyboard <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/builder" class="text-primary-500 font-bold hover:underline">KeyboardBuilder <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
