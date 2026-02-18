import { Component, createSignal, JSX } from "solid-js";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

  return (
    <div class="min-h-screen mesh-bg text-slate-900 dark:text-slate-200 transition-colors duration-500">
      <Header
        isSidebarOpen={isSidebarOpen()}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen())}
      />

      <div class="flex pt-16 h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen()}
          closeMobileMenu={() => setIsSidebarOpen(false)}
        />

        <main class="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-12 relative">
          <div class="max-w-4xl mx-auto prose prose-slate dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-h1:text-gradient-primary prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:glass-card prose-pre:premium-shadow transition-all duration-300">
            {props.children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen() && (
        <div
          class="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
