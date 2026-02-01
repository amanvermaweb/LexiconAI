"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageCircle, Settings, User } from "./Icons";
import useChat from "@/hooks/useChat";
import { useSession } from "next-auth/react";

const ChatSidebar = ({ open, setOpen }) => {
  const params = useParams();
  const chatId = params?.chatId;
  const { chats, isLoading, error } = useChat();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest";
  return (
    <aside
      className={`
    fixed md:static
    top-0 left-0
    h-dvh w-full md:w-72 lg:w-80
    border-r border-slate-200/70 bg-white/80 backdrop-blur-xl text-slate-900
  dark:border-white/10 dark:bg-white/5 dark:text-white
    transition-all duration-300 ease-in-out
    flex flex-col
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    z-50
  `}
    >
      <button
        onClick={() => setOpen(false)}
        className="md:hidden absolute top-4 right-4 text-slate-500 dark:text-white/70"
      >
        ✕
      </button>

      <div className="px-4 pt-5 pb-4 border-b border-slate-200/70 dark:border-white/10">
        <Link href="/" className="flex w-max items-center gap-3">
          <Image
            src="/icons/logo.svg"
            alt="LexiconAI Logo"
            width={38}
            height={38}
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              LexiconAI
            </h1>
            <span className="text-xs text-slate-500 dark:text-white/60">
              Your AI workspace
            </span>
          </div>
        </Link>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-2">
        <Link
          href="/chat"
          className="rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-3 py-2.5 transition cursor-pointer text-sm font-semibold flex gap-2 items-center hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
        >
          <MessageCircle />
          New Chat
        </Link>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-3 overflow-x-hidden">
        <h2 className="mb-2 px-1 text-sm font-semibold tracking-wide text-slate-500 dark:text-white/70">
          History
        </h2>

        <div className="flex flex-col gap-2 text-sm">
          {isLoading && (
            <div className="rounded-2xl px-3 py-2.5 text-slate-500 dark:text-white/60">
              Loading chats...
            </div>
          )}


          {!isLoading && chats.length === 0 && (
            <div className="rounded-2xl px-3 py-2.5 text-slate-500 dark:text-white/60">
              No chats yet. Start a new one.
            </div>
          )}

          {!isLoading &&
            chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={`truncate rounded-2xl px-3 py-2.5 transition hover:bg-slate-100/80 text-slate-700 border border-transparent dark:hover:bg-white/10 dark:text-white/90 ${
                  chatId === chat.id ? "bg-slate-100/80 dark:bg-white/10" : ""
                }`}
              >
                {chat.title || "Untitled chat"}
              </Link>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200/70 dark:border-white/10">
        <Link
          href="/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        >
          <Settings />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <Link href="/settings/account" className="mt-3 flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/5">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-200 to-slate-300 border border-slate-200 overflow-hidden flex items-center justify-center dark:from-zinc-700 dark:to-zinc-600 dark:border-white/10">
            <User />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-md font-medium truncate text-slate-900 dark:text-white">{userName}</div>
            <div className="text-xs text-slate-500 truncate dark:text-white/50">
              Free plan
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default ChatSidebar;
