import { createSignal, Show, onMount, onCleanup, JSX } from "solid-js";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

export default function Layout(props: { children: JSX.Element }) {
  const [mobileOpen, setMobileOpen] = createSignal(false);

  // Close mobile menu on escape
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  };

  onMount(() => document.addEventListener("keydown", handleKeydown));
  onCleanup(() => document.removeEventListener("keydown", handleKeydown));

  return (
    <div class="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside class="hidden lg:block w-64 fixed top-0 left-0 h-screen glass z-30 border-r border-white/10">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      <Show when={mobileOpen()}>
        <div class="fixed inset-0 z-40 lg:hidden animate-fade-in">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside class="absolute left-0 top-0 h-full w-72 glass animate-slide-in-left">
            <div class="flex items-center justify-end p-3">
              <button onClick={() => setMobileOpen(false)} class="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      </Show>

      {/* Main content area */}
      <div class="flex-1 lg:ml-64">
        {/* Top bar */}
        <header class="sticky top-0 z-20 glass border-b border-white/10">
          <div class="flex items-center justify-between px-4 sm:px-6 h-14">
            <div class="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                class="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400"
                onClick={() => setMobileOpen(true)}
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span class="text-sm font-medium text-slate-400 hidden sm:inline">
                kurigram-addons
              </span>
            </div>

            <div class="flex items-center gap-2">
              <a
                href="https://github.com/johnnie-610/kurigram-addons"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                title="GitHub"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {props.children}
        </main>
      </div>
    </div>
  );
}
