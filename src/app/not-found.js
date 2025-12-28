import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Page not found.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Go home
      </Link>
    </div>
  );
}
