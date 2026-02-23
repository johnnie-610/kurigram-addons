import { createSignal, createEffect, JSX, For, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";

/** Navigation tree data */
interface NavItem {
  title: string;
  href?: string;
  children?: NavItem[];
}

const NAV: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Getting Started", href: "/getting-started" },
  {
    title: "kurigram-addons",
    children: [
      { title: "Overview", href: "/kurigram-addons" },
      { title: "KurigramClient", href: "/kurigram-addons/client" },
      { title: "Conversation Handler", href: "/kurigram-addons/conversation" },
      { title: "Menu System", href: "/kurigram-addons/menu" },
      { title: "Dependency Injection", href: "/kurigram-addons/depends" },
      { title: "Rate Limiting", href: "/kurigram-addons/rate-limit" },
      { title: "Command Parser", href: "/kurigram-addons/command-parser" },
      { title: "Auto FloodWait", href: "/kurigram-addons/flood-wait" },
    ],
  },
  {
    title: "PyKeyboard",
    children: [
      { title: "Overview", href: "/pykeyboard" },
      { title: "Inline Keyboard", href: "/pykeyboard/inline-keyboard" },
      { title: "Reply Keyboard", href: "/pykeyboard/reply-keyboard" },
      { title: "Pagination", href: "/pykeyboard/pagination" },
      { title: "Language Selection", href: "/pykeyboard/languages" },
      { title: "Builder API", href: "/pykeyboard/builder" },
      { title: "Factory Presets", href: "/pykeyboard/factory" },
      { title: "Validation & Hooks", href: "/pykeyboard/hooks" },
      { title: "Utilities", href: "/pykeyboard/utilities" },
    ],
  },
  {
    title: "Pyrogram Patch",
    children: [
      { title: "Overview", href: "/pyrogram-patch" },
      { title: "Patching", href: "/pyrogram-patch/patching" },
      { title: "Router", href: "/pyrogram-patch/router" },
      {
        title: "FSM",
        children: [
          { title: "Overview", href: "/pyrogram-patch/fsm" },
          { title: "States & Transitions", href: "/pyrogram-patch/fsm/states" },
          { title: "Filters", href: "/pyrogram-patch/fsm/filters" },
        ],
      },
      {
        title: "Storage",
        children: [
          { title: "Overview", href: "/pyrogram-patch/storage" },
          { title: "Memory Storage", href: "/pyrogram-patch/storage/memory" },
          { title: "Redis Storage", href: "/pyrogram-patch/storage/redis" },
          { title: "Custom Backends", href: "/pyrogram-patch/storage/custom" },
        ],
      },
      {
        title: "Middleware",
        children: [
          { title: "Overview", href: "/pyrogram-patch/middleware" },
          { title: "Writing Middleware", href: "/pyrogram-patch/middleware/writing" },
          { title: "Rate Limiting", href: "/pyrogram-patch/middleware/rate-limit" },
          { title: "FSM Injection", href: "/pyrogram-patch/middleware/fsm-inject" },
        ],
      },
      { title: "Patch Helper", href: "/pyrogram-patch/patch-helper" },
      { title: "Circuit Breaker", href: "/pyrogram-patch/circuit-breaker" },
      { title: "Configuration", href: "/pyrogram-patch/configuration" },
      { title: "Errors", href: "/pyrogram-patch/errors" },
    ],
  },
  {
    title: "API Reference",
    children: [
      { title: "PyKeyboard", href: "/api/pykeyboard" },
      { title: "Pyrogram Patch", href: "/api/pyrogram-patch" },
    ],
  },
];

/** Check if any child (recursively) matches the current path */
function hasActiveChild(items: NavItem[], pathname: string): boolean {
  return items.some(
    (c) => c.href === pathname || (c.children && hasActiveChild(c.children, pathname))
  );
}

function NavLink(props: { item: NavItem; depth: number }) {
  const location = useLocation();
  const isActive = () => location.pathname === props.item.href;

  return (
    <A
      href={props.item.href!}
      class="block py-1.5 px-3 rounded-md text-sm transition-all duration-200 hover:translate-x-0.5"
      classList={{
        "text-amber-400 bg-amber-500/10 font-medium": isActive(),
        "text-slate-300 hover:text-amber-300 hover:bg-white/5": !isActive(),
      }}
      style={{ "padding-left": `${props.depth * 0.75 + 0.75}rem` }}
    >
      {props.item.title}
    </A>
  );
}

function NavGroup(props: { item: NavItem; depth: number }) {
  const location = useLocation();

  // Only open by default if a child is currently active
  const childIsActive = () =>
    props.item.children ? hasActiveChild(props.item.children, location.pathname) : false;

  const [open, setOpen] = createSignal(childIsActive());
  const [userToggled, setUserToggled] = createSignal(false);

  // Reactively open when navigating TO a child, but respect user's manual close
  createEffect(() => {
    const active = childIsActive();
    if (active && !open()) {
      // A child became active — force open
      setOpen(true);
      setUserToggled(false);
    }
    // If the user explicitly closed this group and no child is active, stay closed
  });

  const toggle = () => {
    setUserToggled(true);
    setOpen(!open());
  };

  return (
    <div>
      <button
        onClick={toggle}
        class="w-full flex items-center justify-between py-1.5 px-3 text-sm font-semibold transition-colors"
        classList={{
          "text-amber-400": childIsActive(),
          "text-slate-400 hover:text-amber-300": !childIsActive(),
        }}
        style={{ "padding-left": `${props.depth * 0.75 + 0.75}rem` }}
      >
        <span>{props.item.title}</span>
        <svg
          class="w-3.5 h-3.5 transition-transform duration-200"
          classList={{ "rotate-90": open() }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <Show when={open()}>
        <div class="overflow-hidden">
          <For each={props.item.children}>
            {(child) =>
              child.children ? (
                <NavGroup item={child} depth={props.depth + 1} />
              ) : (
                <NavLink item={child} depth={props.depth + 1} />
              )
            }
          </For>
        </div>
      </Show>
    </div>
  );
}

/** Available documentation versions */
const VERSIONS = [
  { label: "v0.3.7 (latest)", value: "0.3.7", latest: true },
  { label: "v0.3.6", value: "0.3.6", latest: false },
];

export default function Sidebar(props: { mobile?: boolean; onClose?: () => void }) {
  const [versionOpen, setVersionOpen] = createSignal(false);
  const currentVersion = () => VERSIONS.find((v) => v.latest)!;

  return (
    <nav
      class="h-full overflow-y-auto py-4 space-y-0.5"
      classList={{ "px-2": !props.mobile }}
    >
      {/* Logo */}
      <div class="flex items-center gap-3 px-3 pb-2 border-b border-white/10">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="kurigram-addons" class="w-8 h-8 rounded-lg" />
        <div class="flex-1">
          <div class="font-bold text-sm text-amber-400">kurigram-addons</div>
          <div class="text-[0.65rem] text-slate-500">Documentation</div>
        </div>
      </div>

      {/* Version selector */}
      <div class="px-3 pb-3 mb-2 border-b border-white/10 relative">
        <button
          onClick={() => setVersionOpen(!versionOpen())}
          class="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md text-[0.7rem] font-mono bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors w-full justify-between"
        >
          <span>{currentVersion().label}</span>
          <svg
            class="w-3 h-3 transition-transform"
            classList={{ "rotate-180": versionOpen() }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Show when={versionOpen()}>
          <div class="absolute left-3 right-3 mt-1 rounded-lg border border-white/10 bg-[var(--bg-primary)] shadow-xl z-50 overflow-hidden">
            <For each={VERSIONS}>
              {(ver) => (
                <button
                  class="w-full text-left px-3 py-1.5 text-[0.7rem] font-mono transition-colors"
                  classList={{
                    "text-amber-400 bg-amber-500/10": ver.latest,
                    "text-slate-400 hover:text-amber-300 hover:bg-white/5": !ver.latest,
                  }}
                  onClick={() => {
                    // Future: navigate to versioned docs path
                    setVersionOpen(false);
                  }}
                >
                  {ver.label}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>

      <For each={NAV}>
        {(item) =>
          item.children ? (
            <NavGroup item={item} depth={0} />
          ) : (
            <NavLink item={item} depth={0} />
          )
        }
      </For>

      {/* Footer links */}
      <div class="mt-6 px-3 pt-4 border-t border-white/10 space-y-2">
        <a
          href="https://github.com/johnnie-610/kurigram-addons/releases"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-300 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Changelog</span>
        </a>
        <a
          href="https://github.com/johnnie-610/kurigram-addons"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-300 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>
    </nav>
  );
}

