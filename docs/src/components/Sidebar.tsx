import { createSignal, createEffect, JSX, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";

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
      { title: "Lifecycle Hooks", href: "/kurigram-addons/lifecycle-hooks" },
      {
        title: "Keyboards",
        children: [
          { title: "Inline Keyboard", href: "/pykeyboard/inline-keyboard" },
          { title: "Reply Keyboard", href: "/pykeyboard/reply-keyboard" },
          { title: "CallbackData", href: "/pykeyboard/callback-data" },
          { title: "Pagination", href: "/pykeyboard/pagination" },
          { title: "Language Selection", href: "/pykeyboard/languages" },
          { title: "Builder API", href: "/pykeyboard/builder" },
          { title: "Factory Presets", href: "/pykeyboard/factory" },
          { title: "Validation & Hooks", href: "/pykeyboard/hooks" },
          { title: "Utilities", href: "/pykeyboard/utilities" },
        ],
      },
      {
        title: "Routing & FSM",
        children: [
          { title: "Router", href: "/pyrogram-patch/router" },
          { title: "States & Transitions", href: "/pyrogram-patch/fsm/states" },
          { title: "Filters", href: "/pyrogram-patch/fsm/filters" },
          { title: "History", href: "/pyrogram-patch/fsm/history" },
          { title: "Conversation Handler", href: "/kurigram-addons/conversation" },
        ],
      },
      {
        title: "Middleware",
        children: [
          { title: "Overview", href: "/pyrogram-patch/middleware" },
          { title: "Writing Middleware", href: "/pyrogram-patch/middleware/writing" },
          { title: "Per-Handler Guards", href: "/pyrogram-patch/middleware/per-handler" },
          { title: "Rate Limiting (middleware)", href: "/pyrogram-patch/middleware/rate-limit" },
          { title: "FSM Injection", href: "/pyrogram-patch/middleware/fsm-inject" },
        ],
      },
      {
        title: "Storage",
        children: [
          { title: "Overview", href: "/pyrogram-patch/storage" },
          { title: "Memory Storage", href: "/pyrogram-patch/storage/memory" },
          { title: "SQLite Storage", href: "/pyrogram-patch/storage/sqlite" },
          { title: "Redis Storage", href: "/pyrogram-patch/storage/redis" },
          { title: "Custom Backends", href: "/pyrogram-patch/storage/custom" },
        ],
      },
      {
        title: "Utilities",
        children: [
          { title: "Menu System", href: "/kurigram-addons/menu" },
          { title: "Dependency Injection", href: "/kurigram-addons/depends" },
          { title: "Broadcast", href: "/kurigram-addons/broadcast" },
          { title: "i18n Middleware", href: "/kurigram-addons/i18n" },
          { title: "Health Check", href: "/kurigram-addons/health" },
          { title: "Testing", href: "/kurigram-addons/testing" },
          { title: "Command Parser", href: "/kurigram-addons/command-parser" },
          { title: "Rate Limiting", href: "/kurigram-addons/rate-limit" },
          { title: "Auto FloodWait", href: "/kurigram-addons/flood-wait" },
          { title: "Circuit Breaker", href: "/pyrogram-patch/circuit-breaker" },
        ],
      },
      { title: "Configuration", href: "/pyrogram-patch/configuration" },
      { title: "Error Handling", href: "/pyrogram-patch/errors" },
    ],
  },
  { title: "Migration Guide", href: "/migration" },
  {
    title: "API Reference",
    children: [
      { title: "PyKeyboard", href: "/api/pykeyboard" },
      { title: "Pyrogram Patch", href: "/api/pyrogram-patch" },
    ],
  },
];

/** Strip the Vite base URL so NAV hrefs (e.g. "/pyrogram-patch/router") match */
function stripBase(pathname: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return base && pathname.startsWith(base)
    ? pathname.slice(base.length) || "/"
    : pathname;
}

/** Check if any child (recursively) matches the current path */
function hasActiveChild(items: NavItem[], pathname: string): boolean {
  const p = stripBase(pathname);
  return items.some(
    (c) => c.href === p || (c.children && hasActiveChild(c.children, pathname))
  );
}

function NavLink(props: { item: NavItem; depth: number }) {
  const location = useLocation();
  const isActive = () => stripBase(location.pathname) === props.item.href;

  return (
    <a
      href={props.item.href!}
      target="_self"
      class="block py-1.5 px-3 rounded-md text-sm transition-all duration-200 hover:translate-x-0.5"
      classList={{
        "text-amber-400 bg-amber-500/10 font-medium": isActive(),
        "text-slate-300 hover:text-amber-300 hover:bg-white/5": !isActive(),
      }}
      style={{ "padding-left": `${props.depth * 0.75 + 0.75}rem` }}
    >
      {props.item.title}
    </a>
  );
}

function NavGroup(props: { item: NavItem; depth: number }) {
  const location = useLocation();

  const childIsActive = () => {
    return props.item.children ? hasActiveChild(props.item.children, location.pathname) : false;
  };

  return (
    <details class="group" open={childIsActive()}>
      <summary
        class="w-full flex items-center justify-between py-1.5 px-3 text-sm font-semibold transition-colors cursor-pointer list-none appearance-none"
        classList={{
          "text-amber-400": childIsActive(),
          "text-slate-400 hover:text-amber-300": !childIsActive(),
        }}
        style={{ "padding-left": `${props.depth * 0.75 + 0.75}rem` }}
      >
        <span>{props.item.title}</span>
        <svg
          class="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </summary>
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
    </details>
  );
}

/** Available documentation versions */
const VERSIONS = [
  { label: "v0.5.0 (final)", path: "/" },
  { label: "v0.4.x", path: "/v0.4/" },
  { label: "v0.3.x", path: "/v0.3/" },
];

/** Navigation for v0.3.x */
const NAV_V3: NavItem[] = [
  { title: "Getting Started", href: "/v0.3/" },
  {
    title: "pykeyboard",
    children: [
      { title: "Inline Keyboard", href: "/v0.3/pykeyboard/" },
      { title: "Reply Keyboard", href: "/v0.3/pykeyboard/reply-keyboard" },
      { title: "Pagination", href: "/v0.3/pykeyboard/pagination" },
      { title: "Builder API", href: "/v0.3/pykeyboard/builder" },
      { title: "Hooks & Validation", href: "/v0.3/pykeyboard/hooks" },
    ],
  },
  {
    title: "pyrogram_patch",
    children: [
      { title: "Patching Setup", href: "/v0.3/pyrogram-patch/" },
      { title: "Router", href: "/v0.3/pyrogram-patch/router" },
      { title: "FSM & States", href: "/v0.3/pyrogram-patch/fsm" },
      { title: "Storage", href: "/v0.3/pyrogram-patch/storage" },
      { title: "Middleware", href: "/v0.3/pyrogram-patch/middleware" },
      { title: "Circuit Breaker", href: "/v0.3/pyrogram-patch/circuit-breaker" },
      { title: "Configuration", href: "/v0.3/pyrogram-patch/configuration" },
    ],
  },
];

/** Navigation for v0.4.x */
const NAV_V4: NavItem[] = [
  { title: "Home", href: "/v0.4/" },
  { title: "Getting Started", href: "/v0.4/getting-started" },
  {
    title: "kurigram-addons",
    children: [
      { title: "Overview", href: "/v0.4/kurigram-addons" },
      { title: "KurigramClient", href: "/v0.4/kurigram-addons/client" },
      { title: "Lifecycle Hooks", href: "/v0.4/kurigram-addons/lifecycle-hooks" },
      {
        title: "Keyboards",
        children: [
          { title: "Inline Keyboard", href: "/v0.4/pykeyboard/inline-keyboard" },
          { title: "Reply Keyboard", href: "/v0.4/pykeyboard/reply-keyboard" },
          { title: "Pagination", href: "/v0.4/pykeyboard/pagination" },
          { title: "Language Selection", href: "/v0.4/pykeyboard/languages" },
          { title: "Builder API", href: "/v0.4/pykeyboard/builder" },
          { title: "Factory Presets", href: "/v0.4/pykeyboard/factory" },
          { title: "Validation & Hooks", href: "/v0.4/pykeyboard/hooks" },
          { title: "Utilities", href: "/v0.4/pykeyboard/utilities" },
        ],
      },
      {
        title: "Routing & FSM",
        children: [
          { title: "Router", href: "/v0.4/pyrogram-patch/router" },
          { title: "States & Transitions", href: "/v0.4/pyrogram-patch/fsm/states" },
          { title: "Filters", href: "/v0.4/pyrogram-patch/fsm/filters" },
          { title: "Conversation Handler", href: "/v0.4/kurigram-addons/conversation" },
        ],
      },
      {
        title: "Middleware",
        children: [
          { title: "Overview", href: "/v0.4/pyrogram-patch/middleware" },
          { title: "Writing Middleware", href: "/v0.4/pyrogram-patch/middleware/writing" },
          { title: "Rate Limiting (middleware)", href: "/v0.4/pyrogram-patch/middleware/rate-limit" },
          { title: "FSM Injection", href: "/v0.4/pyrogram-patch/middleware/fsm-inject" },
        ],
      },
      {
        title: "Storage",
        children: [
          { title: "Overview", href: "/v0.4/pyrogram-patch/storage" },
          { title: "Memory Storage", href: "/v0.4/pyrogram-patch/storage/memory" },
          { title: "Redis Storage", href: "/v0.4/pyrogram-patch/storage/redis" },
          { title: "Custom Backends", href: "/v0.4/pyrogram-patch/storage/custom" },
        ],
      },
      {
        title: "Utilities",
        children: [
          { title: "Menu System", href: "/v0.4/kurigram-addons/menu" },
          { title: "Dependency Injection", href: "/v0.4/kurigram-addons/depends" },
          { title: "Command Parser", href: "/v0.4/kurigram-addons/command-parser" },
          { title: "Rate Limiting", href: "/v0.4/kurigram-addons/rate-limit" },
          { title: "Auto FloodWait", href: "/v0.4/kurigram-addons/flood-wait" },
          { title: "Circuit Breaker", href: "/v0.4/pyrogram-patch/circuit-breaker" },
        ],
      },
      { title: "Configuration", href: "/v0.4/pyrogram-patch/configuration" },
      { title: "Error Handling", href: "/v0.4/pyrogram-patch/errors" },
    ],
  },
  { title: "Migration from v0.3.x", href: "/v0.4/migration" },
  {
    title: "API Reference",
    children: [
      { title: "PyKeyboard", href: "/v0.4/api/pykeyboard" },
      { title: "Pyrogram Patch", href: "/v0.4/api/pyrogram-patch" },
    ],
  },
];

export default function Sidebar(props: { mobile?: boolean; onClose?: () => void }) {
  const location = useLocation();

  const currentVersion = () => {
    const path = stripBase(location.pathname);
    if (path.startsWith("/v0.3")) return VERSIONS[2];
    if (path.startsWith("/v0.4")) return VERSIONS[1];
    return VERSIONS[0];
  };

  const currentNav = () => {
    const path = stripBase(location.pathname);
    if (path.startsWith("/v0.3")) return NAV_V3;
    if (path.startsWith("/v0.4")) return NAV_V4;
    return NAV;
  };

  return (
    <nav
      class="h-full overflow-y-auto py-4 space-y-0.5"
      classList={{ "px-2": !props.mobile }}
    >
      {/* Logo */}
      <div class="flex items-center gap-3 px-3 pb-2 border-b border-white/10">
        <img 
          src={`${(import.meta.env.BASE_URL || "").replace(/\/$/, "")}/logo.png`} 
          alt="kurigram-addons" 
          class="w-8 h-8 rounded-lg shadow-lg shadow-amber-500/10" 
        />
        <div class="flex-1">
          <div class="font-bold text-sm text-amber-400">kurigram-addons</div>
          <div class="text-[0.65rem] text-slate-500">Documentation</div>
        </div>
      </div>

      {/* Version selector */}
      <div class="px-3 pb-3 mb-2 border-b border-white/10 relative">
        <details class="group relative">
          <summary
            class="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md text-[0.7rem] font-mono bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors w-full justify-between cursor-pointer list-none appearance-none"
          >
            <span>{currentVersion().label}</span>
            <svg
              class="w-3 h-3 transition-transform group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div class="absolute left-0 right-0 mt-1 rounded-lg border border-white/10 bg-[var(--bg-primary)] shadow-xl z-50 overflow-hidden">
            <For each={VERSIONS}>
              {(ver) => {
                const isCurrent = ver.path === currentVersion().path;
                return (
                  <a
                    href={ver.path}
                    target="_self"
                    class="block w-full text-left px-3 py-1.5 text-[0.7rem] font-mono transition-colors"
                    classList={{
                      "text-amber-400 bg-amber-500/10": isCurrent,
                      "text-slate-400 hover:text-amber-300 hover:bg-white/5": !isCurrent,
                    }}
                  >
                    {ver.label}
                  </a>
                );
              }}
            </For>
          </div>
        </details>
      </div>

      <For each={currentNav()}>
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
          href="https://github.com/johnnie-610/kurigram-addons/blob/main/CHANGELOG.md"
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

