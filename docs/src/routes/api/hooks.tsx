import { Component } from "solid-js";
import ApiItem from "../../components/ApiItem";
import CodeBlock from "../../components/CodeBlock";
import Callout from "../../components/Callout";

const HooksApi: Component = () => {
  return (
    <div class="max-w-4xl mx-auto pb-20">
      <div class="mb-16">
        <h1 class="text-5xl font-black mb-6 tracking-tight">Hooks & Validation</h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Secure and transform your keyboards with advanced validation rules and lifecycle hooks.
        </p>
      </div>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight">ButtonValidator</h2>
        <p class="mb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
           The <code>ButtonValidator</code> class provides a comprehensive system for enforcing constraints on individual buttons or entire keyboards.
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
        />

        <CodeBlock 
          language="python"
          filename="validation_example.py"
          code={`
from pykeyboard import ButtonValidator

validator = ButtonValidator()

# Add a custom rule
validator.add_rule(
    "no_admin_url",
    lambda btn, ctx: "/admin" not in getattr(btn, "url", ""),
    "Buttons cannot point to admin dashboard",
    "Change the URL to a public endpoint"
)

# Validate a button
result = validator.validate_button(my_button)
if not result["is_valid"]:
    print(result["errors"])
          `}
        />
      </section>

      <section class="mb-20">
        <h2 class="text-3xl font-black mb-8 tracking-tight">KeyboardHookManager</h2>
        <p class="mb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The <code>KeyboardHookManager</code> allows you to intercept the keyboard building process at various stages.
        </p>

        <ApiItem 
          name="add_pre_hook"
          signature="add_pre_hook(hook: Callable[[KeyboardBase], None])"
          description="Runs a hook before the keyboard construction begins."
          parameters={[{ name: "hook", type: "Callable", description: "Preprocessing function.", required: true }]}
        />

        <ApiItem 
          name="add_button_hook"
          signature="add_button_hook(hook: Callable[[Any], Any])"
          description="Intercepts and transforms every button as it is added to the keyboard."
          parameters={[{ name: "hook", type: "Callable", description: "Transformation function.", required: true }]}
        />

        <Callout type="tip" title="Centralized Styling">
          Use <code>add_button_hook</code> to automatically apply consistent styling (like emojis or casing) to all buttons in your bot without manual repetition.
        </Callout>

        <CodeBlock 
          language="python"
          filename="hook_example.py"
          code={`
from pykeyboard import KeyboardHookManager

manager = KeyboardHookManager()

# Automatically uppercase all button text
@manager.add_button_hook
def uppercase_hook(button):
    if hasattr(button, "text"):
        button.text = button.text.upper()
    return button

# Logging hook
manager.add_pre_hook(lambda kb: print(f"Building {type(kb).__name__}"))
          `}
        />
      </section>
    </div>
  );
};

export default HooksApi;
