import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "static",
    baseURL: process.env.NODE_ENV === "production" ? "/kurigram-addons/" : "/",
    prerender: {
      routes: [
        "/",
        "/pyrogram-patch",
        "/pyrogram-patch/middlewares",
        "/pyrogram-patch/routers",
        "/pyrogram-patch/fsm",
        "/pykeyboard",
        "/pykeyboard/inline",
        "/pykeyboard/reply",
        "/pykeyboard/pagination",
      ],
      crawlLinks: true
    }
  }
});
