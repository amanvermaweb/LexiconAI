"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchPopup from "./SearchPopup";
import { MessageCircle, Search, Settings, User } from "./icons";

const ChatSidebar = (params) => {
  const [open, setOpen] = useState(false);
  const { chatid } = params;
  const user = {
    name: "John Doe",
  };
  return (
    <aside className="flex h-screen w-[30%] flex-col border-r border-zinc-200 p-4 dark:border-zinc-800 md:w-80">
      <div className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex w-max items-center gap-3 pb-3">
          <Image
            src="/icons/logo.svg"
            alt="LexiconAI Logo"
            width={42}
            height={42}
          />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            LexiconAI
          </h1>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/chat"
          className="rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-3 py-2 transition cursor-pointer text-sm font-medium flex gap-2 items-center hover:from-blue-700 hover:to-purple-700 text-zinc-800 dark:text-zinc-100"
        >
          <MessageCircle />
          New Chat
        </Link>

        <button
          className="rounded-xl border border-zinc-300 px-3 py-2 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-800 transition  dark:text-zinc-100 flex cursor-pointer gap-2 items-center"
          onClick={() => setOpen(true)}
        >
          <Search />
          Search
        </button>
        <SearchPopup open={open} onClose={() => setOpen(false)} />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          History
        </h2>

        <div className="flex flex-col gap-2 text-sm">
          <Link
            href={`/chat/${chatid}`}
            className="truncate rounded-lg px-2 py-2.5 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 "
          >
            Chat about AI advancements
          </Link>

          <Link
            href="/chat/2"
            className="truncate rounded-lg px-2 py-2.5 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            Discussing climate change solutions
          </Link>

          <Link
            href="/chat/3"
            className="truncate rounded-lg px-2 py-2.5 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            Exploring space travel possibilities
          </Link>
        </div>
      </div>

      <div className="p-3 border-t border-white/5">
        <Link
          href="/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
        >
          <Settings />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <div className="mt-3 flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-600 border border-white/10 overflow-hidden flex items-center justify-center">
            <User />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-md font-medium  truncate">{`${user.name}`}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
