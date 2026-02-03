"use client";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/ChatSidebar";
import Link from "next/link";
import { useState } from "react";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="relative flex min-h-dvh bg-transparent text-slate-900 dark:text-white">
      <ChatSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main
        className={`relative flex min-w-0 flex-1 flex-col items-center w-full overflow-hidden transition-all duration-300 ease-in-out
      ${sidebarOpen ? "md:ml-72 lg:ml-80" : "md:ml-0"}`}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <section className="relative z-10 flex flex-1 w-full items-center justify-center px-4 py-6 sm:py-10">
          <div className="w-full max-w-3xl rounded-3xl border border-(--border) surface-panel p-6 sm:p-10">
            <h2 className="mb-3 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              Welcome to LexiconAI
            </h2>
            <p className="mx-auto max-w-2xl text-center text-sm sm:text-base text-slate-600 dark:text-slate-200/80">
              Select a chat from the sidebar or start a new conversation to get
              started. LexiconAI helps you explore ideas, refactor code, and
              ship faster with an elegant, distraction-free interface.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-(--border) surface-soft text-slate-900 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-(--surface-1) dark:text-white"
              >
                Start a new chat
              </Link>

              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full border border-(--border) surface-soft px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-(--surface-1) dark:text-white/90"
              >
                Sign in to start chatting
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center rounded-full border border-(--border) surface-soft px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-(--surface-1) dark:text-white/90"
              >
                Customize settings
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
