import { A } from "@solidjs/router";
import { Menu, X } from "lucide-solid";
import { Component } from "solid-js";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";
import Logo from "./Logo";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="glass-header h-20 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            onClick={props.toggleSidebar}
            class="p-2 -ml-2 rounded-md lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {props.isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <A href="/" class="flex items-center gap-4 group">
            <Logo class="h-16 w-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            <span class="text-2xl font-black tracking-tighter text-gradient-primary">
              Kurigram Addons
            </span>
          </A>
        </div>

        <nav class="hidden md:flex items-center gap-8 ml-10 flex-1">
          <A 
            href="/pyrogram-patch" 
            class="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            Docs
          </A>
          <A 
            href="/api" 
            class="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            API
          </A>
        </nav>

        <div class="flex items-center gap-6">
          <a
            href="https://github.com/johnnie-610/kurigram-addons"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
