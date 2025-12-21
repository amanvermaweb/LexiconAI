"use client";
import dynamic from "next/dynamic";
import ThemeToggle from "./components/theme-toggle";

const ApiKeyForm = dynamic(
  () => import("@/app/settings/components/api-key-form"),
  { ssr: false }
);

export default function SettingsPage() {
  return (
    <section className="mt-8 flex flex-col items-center ">
      <h2 className="text-2xl font-semibold mb-2">Settings</h2>
      <p className="text-gray-600 mb-6">
        Paste your OpenAI API key below. We will encrypt it and use it
        server-side to make requests. You pay for usage with your key.
      </p>
      <div className="max-w-2xl">
        <ApiKeyForm />
      </div>
      <div>
        <h2 className="text-xl">Theme</h2>
        <p className="text-gray-600 mb-4">Select your preferred theme:</p>
        <ThemeToggle />
      </div>
    </section>
  );
}
