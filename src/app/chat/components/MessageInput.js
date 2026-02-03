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
    <div className="relative z-30 flex w-full justify-center pb-[env(safe-area-inset-bottom)]">
      <div className="flex w-full max-w-4xl flex-col gap-2 rounded-3xl border border-(--border) surface-card px-3 py-2 ring-1 ring-(--ring) dark:border-white/15 sm:flex-row sm:items-center">
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
            model
              ? `Ask ${model} anything...`
              : "Select a model to get started..."
          }
          className="w-full bg-transparent px-2 sm:px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none dark:text-white/90 dark:placeholder:text-white/40"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={isDisabled}
          className="w-full shrink-0 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98] sm:w-auto"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
