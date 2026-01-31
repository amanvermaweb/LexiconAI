"use client";
import { ArrowLeftIcon } from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const SettingsSidebar = ({ open, setOpen }) => {
  const router = useRouter();
  const linkclass =
    "w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200";
  const links = ["general", "models", "account"];
  const pathname = usePathname();
  const active = pathname.split("/").pop();
  return (
    <aside
      className={`
    fixed md:static
    top-0 left-0
  min-h-dvh w-full md:w-72 lg:w-80
  border-r border-slate-200/70 bg-white/80 backdrop-blur-xl text-slate-900
  dark:border-white/10 dark:bg-white/5 dark:text-white
    transition-all duration-300 ease-in-out
    flex flex-col
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    z-50
  `}
    >
  <div className="w-full min-h-dvh border-r border-slate-200/70 bg-white/80 backdrop-blur-xl p-5 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="px-2 py-2 rounded-xl hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 transition-all duration-200 cursor-pointer dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 flex"
          >
            <ArrowLeftIcon />
            <p className="md:hidden">Back</p>
          </button>
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Settings
            </h2>
            <span className="text-xs text-slate-500 dark:text-white/50">
              Personalize LexiconAI
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden top-4 right-4 text-slate-500 dark:text-white/70 h-4"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {links.map((a) => (
            <Link
              href={`/settings/${a}`}
              key={a}
              className={`${linkclass} capitalize
          ${
            active === a
              ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
          }`}
            >
              {a}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
