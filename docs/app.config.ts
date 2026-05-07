import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const base = process.env.BASE_URL || "";

export default defineConfig({
  server: {
    baseURL: base,
    static: process.env.NODE_ENV === "production",
    prerender: {
      failOnError: false,
      crawlLinks: true,
      routes: [
        "/",
        "/getting-started",
        "/migration",

        // kurigram-addons
        "/kurigram-addons/",
        "/kurigram-addons/client",
        "/kurigram-addons/lifecycle-hooks",
        "/kurigram-addons/conversation",
        "/kurigram-addons/menu",
        "/kurigram-addons/depends",
        "/kurigram-addons/broadcast",
        "/kurigram-addons/i18n",
        "/kurigram-addons/health",
        "/kurigram-addons/testing",
        "/kurigram-addons/command-parser",
        "/kurigram-addons/rate-limit",
        "/kurigram-addons/flood-wait",

        // pykeyboard
        "/pykeyboard/inline-keyboard",
        "/pykeyboard/reply-keyboard",
        "/pykeyboard/callback-data",
        "/pykeyboard/pagination",
        "/pykeyboard/languages",
        "/pykeyboard/builder",
        "/pykeyboard/factory",
        "/pykeyboard/hooks",
        "/pykeyboard/utilities",

        // pyrogram-patch — routing & FSM
        "/pyrogram-patch/router",
        "/pyrogram-patch/fsm/states",
        "/pyrogram-patch/fsm/filters",
        "/pyrogram-patch/fsm/history",

        // pyrogram-patch — middleware
        "/pyrogram-patch/middleware",
        "/pyrogram-patch/middleware/writing",
        "/pyrogram-patch/middleware/per-handler",
        "/pyrogram-patch/middleware/rate-limit",
        "/pyrogram-patch/middleware/fsm-inject",

        // pyrogram-patch — storage
        "/pyrogram-patch/storage",
        "/pyrogram-patch/storage/memory",
        "/pyrogram-patch/storage/sqlite",
        "/pyrogram-patch/storage/redis",
        "/pyrogram-patch/storage/custom",

        // pyrogram-patch — other
        "/pyrogram-patch/circuit-breaker",
        "/pyrogram-patch/configuration",
        "/pyrogram-patch/errors",

        // API reference
        "/api/pykeyboard",
        "/api/pyrogram-patch",

        // Legacy versioned routes (kept for backward compat)
        "/v0.3/",
        "/v0.3/pykeyboard/",
        "/v0.3/pykeyboard/reply-keyboard",
        "/v0.3/pykeyboard/pagination",
        "/v0.3/pykeyboard/builder",
        "/v0.3/pykeyboard/hooks",
        "/v0.3/pyrogram-patch/",
        "/v0.3/pyrogram-patch/router",
        "/v0.3/pyrogram-patch/fsm",
        "/v0.3/pyrogram-patch/storage",
        "/v0.3/pyrogram-patch/middleware",
        "/v0.3/pyrogram-patch/circuit-breaker",
        "/v0.3/pyrogram-patch/configuration",
        "/v0.4/",
        "/v0.4/client",
        "/v0.4/conversation",
        "/v0.4/menu",
        "/v0.4/lifecycle-hooks",
        "/v0.4/utilities",
        "/v0.4/pykeyboard/",
        "/v0.4/pykeyboard/reply-keyboard",
        "/v0.4/pykeyboard/pagination",
        "/v0.4/pykeyboard/builder",
        "/v0.4/pyrogram-patch/router",
        "/v0.4/pyrogram-patch/fsm",
        "/v0.4/pyrogram-patch/storage",
        "/v0.4/pyrogram-patch/middleware",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    base: base ? `${base}/` : "/",
  },
});
