"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useModel } from "@/context/ModelContext";

const ChatWindow = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const { model } = useModel();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat?chatId=${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to load messages.");
      }

      setMessages(payload?.messages ?? []);
    } catch (err) {
      setError(err?.message || "Unable to load messages.");
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async (content) => {
    setIsSending(true);
    setError(null);

    if (!model) {
      setError("Select a model after saving an API key.");
      setIsSending(false);
      return false;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: content,
          model,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send message.");
      }

      setMessages(payload?.messages ?? []);

      if (!chatId && payload?.chatId) {
        router.push(`/chat/${payload.chatId}`);
      }

      return true;
    } catch (err) {
      setError(err?.message || "Unable to send message.");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col w-full overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 pt-4 pb-6">
        <div className="mx-auto w-full max-w-4xl">
          {error && (
            <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          {isLoading && messages.length === 0 && (
            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-500 shadow-sm dark:text-white/60">
              Loading messages...
            </div>
          )}

          {messages.length === 0 && (
            <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-(--border) surface-panel p-6 sm:p-8 text-center">
              <h3 className=" text-lg font-semibold text-slate-900 dark:text-white">
                Start your first conversation
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
                Ask anything — brainstorm ideas, refactor code, or get answers
                fast.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="shrink-0 border-t border-(--border) bg-transparent px-2 py-3 sm:px-6">
        <MessageInput onSend={handleSend} disabled={isSending} />
      </div>
    </div>
  );
};

export default ChatWindow;
