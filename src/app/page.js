"use client";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/ChatSidebar";
import Link from "next/link";
import { useState } from "react";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
  <div className="flex min-h-dvh bg-transparent text-slate-900 dark:text-white">
      <ChatSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`relative flex flex-1 flex-col items-center w-full overflow-hidden transition-all duration-300 ease-in-out
      ${sidebarOpen ? "md:ml-72 lg:ml-80" : "md:ml-0"}`}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <section className="relative z-10 flex flex-1 w-full items-center justify-center px-4 py-6 sm:py-10">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
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
                className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-slate-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:shadow-slate-900/40"
              >
                Start a new chat
              </Link>

              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100/80 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                Sign in to start chatting
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100/80 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
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
