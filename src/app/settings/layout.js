"use client";
import PrimaryBtn from "@/components/PrimaryBtn";
import SecondaryBtn from "@/components/SecondaryBtn";
import SettingsSidebar from "./components/SettingsSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
export default function SettingsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className={`flex min-h-dvh overflow-hidden bg-transparent text-slate-900 transition-all duration-300 ease-in-out dark:text-white
      ${sidebarOpen ? "md:ml-72 lg:ml-80" : "md:ml-0"}`}
    >
      <SettingsSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="relative flex min-h-0 flex-col w-full overflow-hidden">
        <div className="relative z-10 flex min-h-0 flex-1 px-3 py-4 sm:py-5">
          <div className="flex min-h-0 flex-1 flex-col rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl overflow-hidden dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-slate-700 absolute top-0 left-2 dark:text-white"
              >
                <Menu size={20} />
              </button>
              {children}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 sm:mt-10 pt-6 border-t border-slate-200/70 dark:border-white/10">
                <SecondaryBtn content="Cancel" />
                <PrimaryBtn content="Save Changes" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
