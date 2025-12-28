import ChatWindow from "@/app/chat/components/ChatWindow";

export default function ChatPage({ params }) {
  return <ChatWindow chatId={params.chatId} />;
}
