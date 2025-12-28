export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-black dark:border-neutral-700 dark:border-t-white" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Loading…
        </p>
      </div>
    </div>
  );
}
