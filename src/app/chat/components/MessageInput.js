import { useState } from "react";
import { useModel } from "@/context/ModelContext";

const MessageInput = ({ onKeyDown, onSend, disabled = false }) => {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { model } = useModel();

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending || disabled) return;

    setIsSending(true);
    let sent = false;
    try {
      sent = await onSend?.(trimmed);
    } finally {
      setIsSending(false);
    }

    if (!sent) return;

    setValue("");
  };

  const isDisabled = disabled || isSending;

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="flex w-full max-w-2xl items-center gap-2 rounded-3xl border border-slate-200/70 bg-white/80 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <input
          type="text"
          name="message"
          id="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
            onKeyDown?.(e);
          }}
          disabled={isDisabled}
          placeholder={
            model ? `Ask ${model} anything...` : "Select a model to get started..."
          }
          className="w-full bg-transparent px-2 sm:px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none dark:text-white/90 dark:placeholder:text-white/40"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={isDisabled}
          className="shrink-0 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98]"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
