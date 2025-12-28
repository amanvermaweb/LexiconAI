import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

const Home = async () => {
  // const session = await getServerSession(authOptions);
  // if (!session) redirect("/login");
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <ChatSidebar />
      <main className="flex flex-1 flex-col items-center w-full">
        <Navbar />
        <div className="text-center flex flex-1 justify-center flex-col items-center px-4">
          <h2 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome to LexiconAI
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Select a chat from the sidebar or start a new conversation to get
            started.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
