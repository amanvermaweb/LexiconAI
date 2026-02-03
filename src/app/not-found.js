import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4 py-6 text-slate-900 dark:text-white">
  <div className="w-full max-w-lg rounded-3xl border border-(--border) surface-panel p-10 text-center">
        <div className="text-6xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
          404
        </div>
        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-2 text-md text-slate-600 dark:text-white/60">
          The page you&apos;re looking for doesn&apos;t exist anymore or may have been moved.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
