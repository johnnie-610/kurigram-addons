import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { Zap, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function KeyboardFactoryApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>KeyboardFactory API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold tracking-widest uppercase">
          <Zap size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          KeyboardFactory
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          A collection of static utility methods for rapid keyboard generation. <code>KeyboardFactory</code> provides one-line solutions for common UI patterns like confirmation dialogs and menus.
        </p>
      </section>

      {/* Static Methods */}
      <ApiItem 
        name="create_confirmation_keyboard"
        signature="KeyboardFactory.create_confirmation_keyboard(yes_text='✅ Yes', no_text='❌ No', cancel_text=None, callback_pattern='confirm_{action}', columns=2)"
        description="Creates a standardized confirmation dialog with Yes/No/Cancel buttons."
        parameters={[
          { name: "yes_text", type: "str", description: "Label for the confirm button.", default: "'✅ Yes'" },
          { name: "no_text", type: "str", description: "Label for the decline button.", default: "'❌ No'" },
          { name: "cancel_text", type: "str | None", description: "Optional third button label.", default: "None" },
          { name: "callback_pattern", type: "str", description: "Pattern containing '{action}' ('yes', 'no', or 'cancel').", default: "'confirm_{action}'" }
        ]}
        returns={{ type: "InlineKeyboard", description: "A populated inline keyboard instance." }}
        example={`from pykeyboard import KeyboardFactory\n\nkb = KeyboardFactory.create_confirmation_keyboard(\n    yes_text="Delete", \n    no_text="Keep", \n    callback_pattern="del_item_{action}"\n)`}
      />

      <ApiItem 
        name="create_menu_keyboard"
        signature="KeyboardFactory.create_menu_keyboard(menu_items, callback_pattern='menu_{action}', columns=2)"
        description="Builds a grid menu from a dictionary of items."
        parameters={[
          { name: "menu_items", type: "dict[str, str]", description: "Mapping of Display Name -> Action ID.", required: true },
          { name: "callback_pattern", type: "str", description: "Pattern for the actions.", default: "'menu_{action}'" },
          { name: "columns", type: "int", description: "Buttons per row (row_width).", default: "2" }
        ]}
        returns={{ type: "InlineKeyboard", description: "A populated inline keyboard instance." }}
        example={`menu = {\n    "Profile": "profile",\n    "Settings": "settings",\n    "Help": "help"\n}\nkb = KeyboardFactory.create_menu_keyboard(menu, columns=2)`}
      />

      <ApiItem 
        name="create_rating_keyboard"
        signature="KeyboardFactory.create_rating_keyboard(max_rating=5, callback_pattern='rate_{stars}', include_labels=True)"
        description="Generates a row of star-rating buttons."
        parameters={[
            { name: "max_rating", type: "int", description: "Number of stars (max 10 allowed).", default: "5" },
            { name: "callback_pattern", type: "str", description: "Pattern containing '{stars}'.", default: "'rate_{stars}'" }
        ]}
        returns={{ type: "InlineKeyboard", description: "A star-rating keyboard." }}
        example={`kb = KeyboardFactory.create_rating_keyboard(\n    max_rating=5, \n    callback_pattern="feedback_{stars}"\n)`}
      />

      <ApiItem 
        name="clone_keyboard"
        signature="KeyboardFactory.clone_keyboard(source_keyboard, deep_copy=True)"
        description="Creates a copy of an existing keyboard instance."
        parameters={[
            { name: "source_keyboard", type: "InlineKeyboard | ReplyKeyboard", description: "The instance to copy.", required: true },
            { name: "deep_copy", type: "bool", description: "Whether to perform a deep recursion copy of button objects.", default: "True" }
        ]}
        returns={{ type: "InlineKeyboard | ReplyKeyboard", description: "The cloned keyboard." }}
        example={`new_kb = KeyboardFactory.clone_keyboard(existing_kb)\nnew_kb.add(InlineButton("Extra Option", "extra"))`}
      />

      {/* Navigation Footer */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Related API Docs</h2>
        <div class="flex gap-4">
            <A href="/api/inline-keyboard" class="text-primary-500 font-bold hover:underline">InlineKeyboard <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/builder" class="text-primary-500 font-bold hover:underline">KeyboardBuilder <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
