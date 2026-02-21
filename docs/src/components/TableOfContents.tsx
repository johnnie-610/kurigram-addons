import { Component, createSignal, onMount, For, onCleanup, Show, createEffect } from "solid-js";
import { useLocation } from "@solidjs/router";

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: Component = () => {
  const [headings, setHeadings] = createSignal<HeadingInfo[]>([]);
  const [activeId, setActiveId] = createSignal<string>("");
  const location = useLocation();

  const extractHeadings = () => {
    // Wait for the render cycle to complete and DOM to be populated
    requestAnimationFrame(() => {
      const container = document.querySelector(".prose");
      if (!container) return;

      const elements = container.querySelectorAll("h2, h3, h4");
      const newHeadings: HeadingInfo[] = [];

      elements.forEach((el) => {
        // Ensure the element has an ID
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "") || "heading";
        }

        newHeadings.push({
          id: el.id,
          text: el.textContent || "",
          level: Number(el.tagName.substring(1)),
        });
      });

      setHeadings(newHeadings);
    });
  };

  onMount(() => {
    extractHeadings();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const observeHeadings = () => {
      const elements = document.querySelectorAll(".prose h2, .prose h3, .prose h4");
      elements.forEach((el) => observer.observe(el));
    };

    setTimeout(observeHeadings, 100);

    onCleanup(() => observer.disconnect());
  });

  // Re-run when route changes
  createEffect(() => {
    location.pathname; // Track dependency
    setTimeout(extractHeadings, 100);
  });

  return (
    <div class="hidden xl:block w-64 shrink-0 px-4">
      <div class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h4 class="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4 px-3">
          On this page
        </h4>
        <Show when={headings().length > 0} fallback={<div class="px-3 text-sm text-slate-400">No headings found.</div>}>
            <ul class="space-y-2 text-sm">
            <For each={headings()}>
                {(heading) => (
                <li
                    class={`transition-all duration-200 ${
                    heading.level === 3 ? "ml-4" : heading.level === 4 ? "ml-8" : ""
                    }`}
                >
                    <a
                    href={`#${heading.id}`}
                    class={`block py-1 pl-3 border-l-2 ${
                        activeId() === heading.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-tokio-border"
                    }`}
                    >
                    {heading.text}
                    </a>
                </li>
                )}
            </For>
            </ul>
        </Show>
      </div>
    </div>
  );
};

export default TableOfContents;
