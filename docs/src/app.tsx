// @refresh reload
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  // Vite sets import.meta.env.BASE_URL from the `base` config.
  // Strip trailing slash for SolidJS Router base.
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  return (
    <Router
      base={base}
      root={(props) => (
        <MetaProvider>
          <Title>kurigram-addons — Documentation</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
