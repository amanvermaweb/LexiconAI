"use client";
import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import Navbar from "@/components/Navbar";

export default function ChatLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-dvh bg-transparent text-slate-900 dark:text-white">
      <ChatSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main
        className={`relative flex flex-1 flex-col items-center w-full overflow-hidden transition-all duration-300 ease-in-out
      ${sidebarOpen ? "md:ml-72 lg:ml-80" : "md:ml-0"}`}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="relative z-10 flex-1 p-3 sm:p-5 w-full">
          <div className="h-full min-h-0 rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl overflow-hidden dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
