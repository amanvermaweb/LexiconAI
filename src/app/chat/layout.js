import ChatSidebar from "@/components/ChatSidebar";

export default function ChatLayout({ children }) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
