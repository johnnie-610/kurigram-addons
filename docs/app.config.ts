import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const base = process.env.BASE_URL || "";

export default defineConfig({
  ssr: false,
  server: {
    baseURL: base,
    static: true,
    prerender: {
      failOnError: false,
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    base: base ? `${base}/` : "/",
  },
});
