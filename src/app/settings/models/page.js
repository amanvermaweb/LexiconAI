"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ModelSelector from "../components/ModelSelector";

const ApiKeyForm = dynamic(
  () => import("@/app/settings/components/ApiKeyForm"),
  { ssr: false },
);

const Page = () => {
  const [defaultModel, setDefaultModel] = useState("gpt-4");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("lexicon_api_key") || "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (apiKey) {
      localStorage.setItem("lexicon_api_key", apiKey);
    } else {
      localStorage.removeItem("lexicon_api_key");
    }
    return undefined;
  }, [apiKey]);
  return (
    <div className="p-6">
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
          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <ModelSelector
              defaultModel={defaultModel}
              setDefaultModel={setDefaultModel}
            />
          </section>

          <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
