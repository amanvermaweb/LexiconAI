"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>

      <p className="mt-3 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
        An unexpected error occurred. Try again.
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Retry
      </button>
    </div>
  );
}
