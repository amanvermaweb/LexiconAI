"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useModel } from "@/context/ModelContext";
import { useLocale } from "@/context/LocaleContext";
import { localizeMessage } from "@/utils/i18n";

const ChatWindow = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const { model } = useModel();
  const { locale, t } = useLocale();

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
        throw new Error(
          localizeMessage(payload?.error || t("chat.loadMessagesError"), locale),
        );
      }

      setMessages(payload?.messages ?? []);
    } catch (err) {
      setError(localizeMessage(err?.message || t("chat.loadMessagesError"), locale));
    } finally {
      setIsLoading(false);
    }
  }, [chatId, locale, t]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async (content) => {
    setIsSending(true);
    setError(null);

    if (!model) {
      setError(t("chat.selectModel"));
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
        throw new Error(
          localizeMessage(payload?.error || t("chat.sendMessageError"), locale),
        );
      }

      setMessages(payload?.messages ?? []);

      if (!chatId && payload?.chatId) {
        router.push(`/chat/${payload.chatId}`);
      }

      return true;
    } catch (err) {
      setError(localizeMessage(err?.message || t("chat.sendMessageError"), locale));
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 pt-4 pb-6">
        <div className="mx-auto w-full max-w-4xl">
          {error && (
            <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          {isLoading && messages.length === 0 && (
            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-500 shadow-sm dark:text-white/60">
              {t("chat.loadingMessages")}
            </div>
          )}

          {messages.length === 0 && (
            <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-(--border) surface-panel p-6 sm:p-8 text-center">
              <h3 className=" text-lg font-semibold text-slate-900 dark:text-white">
                {t("chat.firstConversationTitle")}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
                {t("chat.firstConversationDescription")}
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
