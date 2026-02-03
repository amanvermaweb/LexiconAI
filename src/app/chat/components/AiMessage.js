const AiMessage = ({ message }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-blue-600 to-purple-600 shadow-sm" />
      <div className="max-w-full sm:max-w-[70%] rounded-2xl border border-(--border) surface-card px-4 py-3 text-sm leading-relaxed text-slate-900 dark:text-white">
        <p className="whitespace-pre-wrap wrap-anywhere text-slate-700 dark:text-white/90">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AiMessage;
