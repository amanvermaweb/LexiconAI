"use client";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";

const GeneralPage = () => {

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          General
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          Customize the way LexiconAI looks and behaves.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl space-y-4 dark:border-white/10 dark:bg-white/5">
        <ThemeToggle />
        <LanguageSelector />
      </section>
    </div>
  );
};

export default GeneralPage;
