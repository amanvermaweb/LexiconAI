"use client";
import React from "react";
import Link from "next/link";
import ModelSelector from "./ModelSelector";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = ({ onToggleSidebar }) => {
  const { data: session } = useSession();

  return (
    <nav className="w-full sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-0 border-b border-(--border) surface-soft text-slate-900 dark:text-white">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-700 dark:text-white"
        >
          <Menu size={20} />
        </button>
        <div className="w-full min-w-40 max-w-[70vw] sm:w-auto sm:max-w-88">
          <ModelSelector />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
        {session?.user ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center justify-center rounded-2xl px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 border border-(--border) surface-soft transition hover:bg-(--surface-1) dark:text-white/90"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-2xl px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 border border-(--border) surface-soft transition hover:bg-(--surface-1) dark:text-white/90"
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
