import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "static",
    baseURL: process.env.GITHUB_ACTIONS || process.env.NODE_ENV === "production" ? "/kurigram-addons/" : "/",
    prerender: {
      routes: [
        "/",
        "/pyrogram-patch",
        "/pyrogram-patch/tutorial",
        "/pyrogram-patch/configuration",
        "/pyrogram-patch/middlewares",
        "/pyrogram-patch/routers",
        "/pyrogram-patch/fsm",
        "/pykeyboard",
        "/pykeyboard/installation",
        "/pykeyboard/quickstart",
        "/pykeyboard/inline",
        "/pykeyboard/reply",
        "/pykeyboard/pagination",
        "/api",
        "/api/patch-manager",
        "/api/router",
        "/api/middleware-manager",
        "/api/fsm",
        "/api/patch-data-pool",
        "/api/inline-keyboard",
        "/api/reply-keyboard",
        "/api/builder",
        "/api/factory",
        "/api/hooks",
      ],
      crawlLinks: true
    }
  }
});
