import Link from "next/link";

export default function NotFound() {
  return (
  <div className="min-h-dvh w-full flex items-center justify-center px-4 py-6 text-slate-900 dark:text-white">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="text-6xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
          404
        </div>
        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700"
          >
            Go home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/80 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            Open chat
          </Link>
        </div>
      </div>
    </div>
  );
}
