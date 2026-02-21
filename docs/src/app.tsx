import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import Layout from "./components/Layout";
import "./app.css";
import "prismjs/themes/prism-tomorrow.css";

export default function App() {
  return (
    <Router
      base={import.meta.env.BASE_URL}
      root={props => (
      <MetaProvider>
        <Title>Kurigram Addons</Title>
        <Layout>
          <Suspense>{props.children}</Suspense>
        </Layout>
      </MetaProvider>
    )}>
      <FileRoutes />
    </Router>
  );
}
