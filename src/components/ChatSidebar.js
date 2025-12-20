"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchPopup from "./SearchPopup";
const ChatSidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <aside className="flex h-screen w-full flex-col border-r border-zinc-200 p-4 dark:border-zinc-800 md:w-80">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Image
          src="/icons/logo.svg"
          alt="LexiconAI Logo"
          width={42}
          height={42}
          className="rounded"
        />
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          LexiconAI
        </h1>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/chat"
          className="rounded-xl bg-blue-600 px-3 py-2 transition hover:bg-blue-700 cursor-pointer text-sm font-medium"
        >
          <Image
            src="icons/chat-svgrepo-com.svg"
            alt="New Chat Icon"
            width={24}
            height={24}
            className="inline-block mr-2"
          />
          New Chat
        </Link>

        <button
          className="rounded-xl border border-zinc-300 px-3 py-2 hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-800 transition  dark:text-zinc-100 flex cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/icons/search-svgrepo-com.svg"
            alt="Search Icon"
            width={24}
            height={24}
            className="inline-block mr-2"
          />
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
            href="/chat/1"
            className="truncate rounded-lg px-2 py-1 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Chat about AI advancements
          </Link>

          <Link
            href="/chat/2"
            className="truncate rounded-lg px-2 py-1 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Discussing climate change solutions
          </Link>

          <Link
            href="/chat/3"
            className="truncate rounded-lg px-2 py-1 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Exploring space travel possibilities
          </Link>
        </div>
      </div>

      <div className="">
        <Link
          href="/settings"
          className="text-sm font-medium text-zinc-700 underline dark:text-zinc-300"
        >
          <Image
            src="/icons/setting-svgrepo-com.svg"
            alt="Setting Icon"
            width={24}
            height={24}
            className="inline-block mr-2"
          />
          Settings
        </Link>

        <Image
          src="/illustration.png"
          alt="Illustration"
          width={300}
          height={200}
          className="mt-6 mx-auto opacity-90"
        />
      </div>
    </aside>
  );
};

export default ChatSidebar;
