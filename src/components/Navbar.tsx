"use client";

import { Plus, MessageSquare } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";

interface NavbarProps {
  postCount: number;
  onNewPost: () => void;
}

export default function Navbar({ postCount, onNewPost }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                Forum
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                {postCount} {postCount === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <button
              onClick={onNewPost}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Post</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
