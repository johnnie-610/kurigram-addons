import { Title } from "@solidjs/meta";
import ApiItem from "~/components/ApiItem";
import { MousePointer2, Info, ArrowRight } from "lucide-solid";
import { A } from "@solidjs/router";

export default function InlineKeyboardApi() {
  return (
    <div class="space-y-12 pb-20 text-slate-900 dark:text-slate-100">
      <Title>InlineKeyboard API Reference - Kurigram Addons</Title>

      {/* Header */}
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-widest uppercase">
          <MousePointer2 size={12} /> Class Reference
        </div>
        <h1 class="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          InlineKeyboard
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          The primary interface for building interactive inline UI. <code>InlineKeyboard</code> managing button storage, layout logic, and the high-performance pagination engine.
        </p>
      </section>

      {/* Constructor */}
      <ApiItem 
        name="Constructor"
        signature="InlineKeyboard(row_width=3, callback_pattern='', count_pages=0, current_page=0, custom_locales=None)"
        description="Initializes a new InlineKeyboard instance with optional row and pagination settings."
        parameters={[
          { name: "row_width", type: "int", description: "Default number of buttons per row.", default: "3" },
          { name: "callback_pattern", type: "str", description: "Global pattern for auto-generated callback data.", default: "''" },
          { name: "count_pages", type: "int", description: "Total pages for pagination.", default: "0" },
          { name: "current_page", type: "int", description: "Initial active page.", default: "0" },
          { name: "custom_locales", type: "dict", description: "Custom locale overrides.", default: "None" }
        ]}
      />

      {/* Paginate */}
      <ApiItem 
        name="paginate"
        signature="paginate(count_pages, current_page, callback_pattern, source=None)"
        description="Generates a complex pagination row with built-in duplicate prevention and LRU caching."
        parameters={[
          { name: "count_pages", type: "int", description: "Total number of pages (must be ≥ 1).", required: true },
          { name: "current_page", type: "int", description: "The current page to display (must be ≥ 1).", required: true },
          { name: "callback_pattern", type: "str", description: "Pattern containing '{number}' for the target page.", required: true },
          { name: "source", type: "str | None", description: "Unique identifier for cross-client cache isolation.", default: "None" }
        ]}
        returns={{
            type: "None",
            description: "Modifies the keyboard instance in-place."
        }}
        raises={[
          { name: "PaginationError", description: "Raised if count_pages or current_page are invalid (e.g. <= 0)." },
          { name: "PaginationUnchangedError", description: "Raised if the generated keyboard is identical to the current one for that source." }
        ]}
        note="This method is highly optimized and uses an internal hash cache to prevent redundant UI generation."
      />

      {/* Languages */}
      <ApiItem 
        name="languages"
        signature="languages(callback_pattern, locales, row_width=2)"
        description="Builds a locale selection menu from built-in or custom locales."
        parameters={[
          { name: "callback_pattern", type: "str", description: "Pattern containing '{locale}'.", required: true },
          { name: "locales", type: "str | list[str]", description: "List of locale codes (e.g. ['en_US', 'es_ES']).", required: true },
          { name: "row_width", type: "int", description: "Buttons per row for the locale menu.", default: "2" }
        ]}
        raises={[
            { name: "LocaleError", description: "Raised if an invalid or unsupported locale code is provided." }
        ]}
      />

      {/* Add */}
      <ApiItem 
        name="add"
        signature="add(*buttons)"
        description="Adds multiple buttons to the keyboard, automatically wrapping them according to the instance's row_width."
        parameters={[
            { name: "*buttons", type: "InlineButton | str", description: "Any number of button objects or raw text titles." }
        ]}
      />

      {/* Row */}
      <ApiItem 
        name="row"
        signature="row(*buttons)"
        description="Forces the provided buttons onto their own single row, ignoring the global row_width."
        parameters={[
            { name: "*buttons", type: "InlineButton", description: "Buttons for this specific row." }
        ]}
      />

      {/* Custom Locales */}
      <ApiItem 
        name="add_custom_locale"
        signature="add_custom_locale(locale_code, display_name)"
        description="Registers a new custom locale for use in languages() method."
        parameters={[
            { name: "locale_code", type: "str", description: "Unique identifier (e.g. 'en_PIRATE')." },
            { name: "display_name", type: "str", description: "UTF-8 string with flag and name (e.g. '🏴‍☠️ Pirate')." }
        ]}
      />

      {/* Static Methods */}
      <div class="pt-10 border-t border-slate-200 dark:border-tokio-border">
          <h2 class="text-3xl font-black mb-8 flex items-center gap-3">
              <Info class="text-primary-500" /> Utility Methods
          </h2>
          <ApiItem 
            name="clear_pagination_hashes"
            signature="clear_pagination_hashes(source=None)"
            description="Static method to clear the global LRU cache for pagination duplicate detection."
            parameters={[
                { name: "source", type: "str | None", description: "If provided, only clears hashes for this specific source." }
            ]}
            returns={{ type: "int", description: "Total number of hashes cleared." }}
          />
      </div>

      {/* Footer Navigation */}
      <section class="flex flex-col items-center gap-6 py-20 bg-slate-900/5 dark:bg-slate-500/5 rounded-[2.5rem]">
        <h2 class="text-3xl font-black">Related API Docs</h2>
        <div class="flex gap-4">
            <A href="/api/reply-keyboard" class="text-primary-500 font-bold hover:underline">ReplyKeyboard <ArrowRight size={14} class="inline ml-1" /></A>
            <A href="/api/builder" class="text-primary-500 font-bold hover:underline">KeyboardBuilder <ArrowRight size={14} class="inline ml-1" /></A>
        </div>
      </section>
    </div>
  );
}
