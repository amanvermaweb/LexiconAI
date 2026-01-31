"use client";
import React from "react";
import Link from "next/link";
import ModelSelector from "./ModelSelector";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = ({ onToggleSidebar }) => {
  const { data: session } = useSession();

  return (
    <nav className="w-full sticky top-0 z-30 flex h-16 items-center justify-between gap-3 px-3 sm:px-6 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-700 dark:text-white"
        >
          <Menu size={20} />
        </button>
        <ModelSelector />
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {session?.user ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center justify-center rounded-2xl px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200/80 bg-white/70 transition hover:bg-slate-100/80 dark:text-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-2xl px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200/80 bg-white/70 transition hover:bg-slate-100/80 dark:text-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
