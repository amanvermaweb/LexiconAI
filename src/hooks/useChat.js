import { useCallback, useEffect, useState } from "react";
import { requestJson } from "@/utils/apiClient";

const EMPTY_CHATS = [];
const LOAD_CHATS_ERROR = "Unable to load chats.";

async function fetchChatList() {
  const payload = await requestJson("/api/chats/list", {
    defaultErrorMessage: LOAD_CHATS_ERROR,
  });

  return payload?.chats ?? EMPTY_CHATS;
}

const useChat = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setChats(await fetchChatList());
    } catch (err) {
      setError(err?.message || LOAD_CHATS_ERROR);
      setChats(EMPTY_CHATS);
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
