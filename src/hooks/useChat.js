import { useCallback, useEffect, useState } from "react";

const useChat = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/chats/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to load chats.");
      }

      const payload = await response.json();
      const nextChats = payload?.chats ?? [];
      setChats(nextChats);
    } catch (err) {
      setError(err?.message || "Unable to load chats.");
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    isLoading,
    error,
    refresh: fetchChats,
  };
};

export default useChat;
