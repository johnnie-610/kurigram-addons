import { Component } from "solid-js";
import ApiItem from "../../components/ApiItem";
import Callout from "../../components/Callout";

const HooksApi: Component = () => {
  return (
    <div class="max-w-4xl mx-auto pb-20 pt-12">
      <div class="mb-16">
        <h1 class="text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Hooks & Validation</h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Secure and transform your keyboards with advanced validation rules and lifecycle hooks.
        </p>
      </div>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight text-slate-900 dark:text-white">ButtonValidator</h2>
        <p class="mb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
           The <code class="bg-slate-100 dark:bg-tokio-card px-1.5 py-0.5 rounded text-primary-500">ButtonValidator</code> class provides a comprehensive system for enforcing constraints on individual buttons or entire keyboards.
        </p>
        
        <ApiItem 
          name="add_rule"
          signature="add_rule(name: str, validator: Callable, error_message: str, suggestion: str) -> 'ButtonValidator'"
          description="Adds a custom validation rule to the validator."
          parameters={[
            { name: "name", type: "str", description: "Unique identifier for the rule.", required: true },
            { name: "validator", type: "Callable", description: "Function taking (button, context) and returning bool.", required: true },
            { name: "error_message", type: "str", description: "Message shown when validation fails." },
            { name: "suggestion", type: "str", description: "Recommended fix for the developer." }
          ]}
          returns={{ type: "ButtonValidator", description: "Returns self for method chaining." }}
          example={`from pykeyboard import ButtonValidator\n\nvalidator = ButtonValidator()\nvalidator.add_rule(\n    "no_admin_url",\n    lambda btn, ctx: "/admin" not in getattr(btn, "url", ""),\n    "Buttons cannot point to admin dashboard",\n    "Change the URL to a public endpoint"\n)`}
        />

        <ApiItem 
          name="validate_button"
          signature="validate_button(button: Any, context: Optional[dict]) -> dict"
          description="Validates a single button against all registered rules."
          parameters={[
            { name: "button", type: "Any", description: "The button object to validate.", required: true },
            { name: "context", type: "dict", description: "Optional metadata context (row, col, etc.)." }
          ]}
          returns={{ 
            type: "dict", 
            description: "A results dictionary containing 'is_valid', 'errors', 'warnings', and 'suggestions'." 
          }}
          example={`result = validator.validate_button(my_button)\nif not result["is_valid"]:\n    print(result["errors"])`}
        />
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight text-slate-900 dark:text-white">KeyboardHookManager</h2>
        <p class="mb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The <code class="bg-slate-100 dark:bg-tokio-card px-1.5 py-0.5 rounded text-primary-500">KeyboardHookManager</code> allows you to intercept the keyboard building process at various stages.
        </p>

        <ApiItem 
          name="add_pre_hook"
          signature="add_pre_hook(hook: Callable[[KeyboardBase], None])"
          description="Runs a hook before the keyboard construction begins."
          parameters={[{ name: "hook", type: "Callable", description: "Preprocessing function.", required: true }]}
          example={`from pykeyboard import KeyboardHookManager\n\nmanager = KeyboardHookManager()\nmanager.add_pre_hook(lambda kb: print(f"Building {type(kb).__name__}"))`}
        />

        <ApiItem 
          name="add_button_hook"
          signature="add_button_hook(hook: Callable[[Any], Any])"
          description="Intercepts and transforms every button as it is added to the keyboard."
          parameters={[{ name: "hook", type: "Callable", description: "Transformation function.", required: true }]}
          example={`@manager.add_button_hook\ndef uppercase_hook(button):\n    if hasattr(button, "text"):\n        button.text = button.text.upper()\n    return button`}
        />

        <Callout type="tip" title="Centralized Styling">
          Use <code>add_button_hook</code> to automatically apply consistent styling (like emojis or casing) to all buttons in your bot without manual repetition.
        </Callout>
      </section>
    </div>
  );
};

export default HooksApi;
