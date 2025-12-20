import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <ChatSidebar />
      <main className="flex flex-1 items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome to LexiconAI
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Select a chat from the sidebar or start a new conversation to get
            started.
          </p>
        </div>
        <ChatWindow />
      </main>
    </div>
  );
}
