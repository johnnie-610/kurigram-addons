import { createEffect, createSignal } from "solid-js";
import { Moon, Sun } from "lucide-solid";

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  createEffect(() => {
    // Check local storage or system preference on mount
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    }
  });

  createEffect(() => {
    // Update HTML class and local storage when theme changes
    const root = document.documentElement;
    if (theme() === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme());
  });

  const toggleTheme = () => {
    setTheme(theme() === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Toggle Dark Mode"
    >
      {theme() === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
