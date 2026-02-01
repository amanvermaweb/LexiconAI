export default function Loading() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4 py-6 text-slate-900 dark:text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700 dark:border-white/20 dark:border-t-white" />
        <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
          Loading
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          Getting things ready for you…
        </p>
      </div>
    </div>
  );
}
