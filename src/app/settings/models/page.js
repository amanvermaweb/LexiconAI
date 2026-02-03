"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ModelSelector from "../components/ModelSelector";

const ApiKeyForm = dynamic(
  () => import("@/app/settings/components/ApiKeyForm"),
  { ssr: false },
);

const Page = () => {
  const [defaultModel, setDefaultModel] = useState("gpt-4");
  const [apiKey, setApiKey] = useState("");
  return (
  <div className="p-4 sm:p-6">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            AI Model Configuration
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
            Choose your default model and tune generation behavior.
          </p>
        </div>

        <div className="grid gap-4">
          <section className="rounded-3xl border border-(--border) surface-card p-5">
            <ModelSelector
              defaultModel={defaultModel}
              setDefaultModel={setDefaultModel}
            />
          </section>

          <section className="rounded-3xl border border-(--border) surface-card p-5">
            <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
