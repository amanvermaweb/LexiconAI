"use client";
import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import Navbar from "@/components/Navbar";

export default function ChatLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="relative flex h-dvh overflow-hidden bg-transparent text-slate-900 dark:text-white">
      <ChatSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main
        className={`relative flex min-w-0 flex-1 min-h-0 flex-col items-stretch w-full overflow-hidden transition-all duration-300 ease-in-out
      ${sidebarOpen ? "md:ml-72 lg:ml-80" : "md:ml-0"}`}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="relative z-10 flex-1 min-h-0 p-3 sm:p-5 w-full">
          <div className="h-full min-h-0 rounded-3xl border border-(--border) surface-panel overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
