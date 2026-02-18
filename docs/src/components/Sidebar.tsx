import { A, useLocation } from "@solidjs/router";
import { Component, For } from "solid-js";

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
  const location = useLocation();

  const isApiSection = () => location.pathname.startsWith("/api");

  const guideLinks = [
    {
      title: "Pyrogram Patch",
      items: [
        { href: "/pyrogram-patch", label: "Overview" },
        { href: "/pyrogram-patch/tutorial", label: "Stateful Tutorial" },
        { href: "/pyrogram-patch/middlewares", label: "Middlewares" },
        { href: "/pyrogram-patch/routers", label: "Routers" },
        { href: "/pyrogram-patch/fsm", label: "FSM Engine" },
        { href: "/pyrogram-patch/configuration", label: "Configuration" },
      ],
    },
    {
      title: "PyKeyboard",
      items: [
        { href: "/pykeyboard", label: "Overview" },
        { href: "/pykeyboard/installation", label: "Installation" },
        { href: "/pykeyboard/quickstart", label: "Quick Start" },
        { href: "/pykeyboard/inline", label: "Inline Keyboards" },
        { href: "/pykeyboard/pagination", label: "Pagination" },
        { href: "/pykeyboard/reply", label: "Reply Keyboards" },
      ],
    },
  ];

  const apiLinks = [
    {
      title: "Core API",
      items: [
        { href: "/api/patch-manager", label: "PatchManager" },
        { href: "/api/router", label: "Router" },
        { href: "/api/middleware-manager", label: "MiddlewareManager" },
        { href: "/api/fsm", label: "FSM Context" },
        { href: "/api/patch-data-pool", label: "PatchDataPool" },
      ],
    },
    {
      title: "Keyboard API",
      items: [
        { href: "/api/inline-keyboard", label: "InlineKeyboard" },
        { href: "/api/reply-keyboard", label: "ReplyKeyboard" },
        { href: "/api/builder", label: "KeyboardBuilder" },
        { href: "/api/factory", label: "KeyboardFactory" },
        { href: "/api/hooks", label: "Hooks & Validation" },
      ],
    },
  ];

  const links = () => isApiSection() ? apiLinks : guideLinks;

  return (
    <aside
      class={`fixed inset-y-0 left-0 z-40 w-64 transform glass-sidebar transition-transform duration-300 ease-in-out ${
        props.isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:block pt-24 pb-10 overflow-y-auto`}
    >
      <div class="px-6 space-y-8">
        <For each={links()}>
          {(section) => (
            <div>
              <h3 class="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4 px-3">
                {section.title}
              </h3>
              <ul class="space-y-1">
                <For each={section.items}>
                  {(item) => (
                    <li>
                      <A
                        href={item.href}
                        class={`block px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                          location.pathname === item.href
                            ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold border-l-2 border-primary-500 rounded-l-none"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-l-2 border-transparent"
                        }`}
                        onClick={props.closeMobileMenu}
                      >
                        {item.label}
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>
      </div>
    </aside>
  );
};

export default Sidebar;
