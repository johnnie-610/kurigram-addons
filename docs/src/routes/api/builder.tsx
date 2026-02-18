import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Wrench, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function KeyboardBuilderApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>KeyboardBuilder API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold tracking-widest uppercase">
          <Wrench size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          KeyboardBuilder
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          A fluent interface for constructing complex keyboards. <code>KeyboardBuilder</code> allows for method chaining and conditional button adding, making your UI logic clean and declarative.
        </p>
      </section>

      {/* Constructor */}
      <ApiItem 
        name="Constructor"
        signature="KeyboardBuilder(keyboard)"
        description="Wraps an existing InlineKeyboard or ReplyKeyboard instance to enable the builder API."
        parameters={[
          { name: "keyboard", type: "InlineKeyboard | ReplyKeyboard", description: "The base keyboard instance to wrap.", required: true }
        ]}
      />

      {/* Chainable Methods */}
      <ApiItem 
        name="add_button"
        signature="add_button(text, callback_data=None, **kwargs)"
        description="Adds a single button to the builder. Supports all Pyrogram button parameters."
        parameters={[
          { name: "text", type: "str", description: "The button label.", required: true },
          { name: "callback_data", type: "str | None", description: "Data for inline callback queries.", default: "None" },
          { name: "**kwargs", type: "Any", description: "Additional parameters (url, web_app, etc.)." }
        ]}
        returns={{ type: "KeyboardBuilder", description: "Returns self for chaining." }}
      />

      <ApiItem 
        name="add_buttons"
        signature="add_buttons(*buttons)"
        description="Adds multiple buttons in a batch. Each item can be a string, a Button object, or a dictionary."
        parameters={[
          { name: "*buttons", type: "Any", description: "List of buttons to add.", required: true }
        ]}
        returns={{ type: "KeyboardBuilder", description: "Returns self for chaining." }}
      />

      <ApiItem 
        name="add_row"
        signature="add_row(*buttons)"
        description="Adds a complete row of buttons to the layout."
        parameters={[
            { name: "*buttons", type: "Any", description: "Buttons for the new row." }
        ]}
        returns={{ type: "KeyboardBuilder", description: "Returns self for chaining." }}
      />

      <ApiItem 
        name="add_conditional_button"
        signature="add_conditional_button(condition, text, callback_data=None, **kwargs)"
        description="Only adds the button to the layout if the provided condition evaluates to True."
        parameters={[
          { name: "condition", type: "bool", description: "The condition to check.", required: true },
          { name: "text", type: "str", description: "Button text.", required: true },
          { name: "callback_data", type: "str | None", description: "Callback data.", default: "None" }
        ]}
        returns={{ type: "KeyboardBuilder", description: "Returns self for chaining." }}
      />

      {/* Build */}
      <ApiItem 
        name="build"
        signature="build()"
        description="Finalizes the construction and returns the underlying keyboard instance."
        returns={{ type: "InlineKeyboard | ReplyKeyboard", description: "The constructed keyboard ready for use." }}
      />

      {/* Navigation Footer */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Related API Docs</h2>
        <div class="flex gap-4">
            <A href="/api/inline-keyboard" class="text-primary-500 font-bold hover:underline">InlineKeyboard <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/factory" class="text-primary-500 font-bold hover:underline">KeyboardFactory <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
