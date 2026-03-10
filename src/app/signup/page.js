"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Chrome, Github } from "@/components/Icons";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { useLocale } from "@/context/LocaleContext";

const SignUp = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { locale, t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [providers, setProviders] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.replace("/chat");
    }
  }, [router, session]);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      try {
        const availableProviders = await getProviders();

        if (isMounted) {
          setProviders(availableProviders || {});
        }
      } catch {
        if (isMounted) {
          setProviders({});
        }
      }
    };

    loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProviderSignUp = async (provider) => {
    setStatus(null);
    await signIn(provider, { callbackUrl: "/chat" });
  };

  const handleCredentialsSignUp = async (event) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || t("auth.createAccountError"));
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/chat",
      });

      const callbackError = result?.url
        ? new URL(result.url, window.location.origin).searchParams.get("error")
        : null;

      if (result?.error || callbackError) {
        throw new Error(getAuthErrorMessage(result?.error || callbackError, locale));
      }

      router.replace(result?.url || "/chat");
    } catch (error) {
      setStatus(getAuthErrorMessage(error, locale) || t("auth.createAccountError"));
    } finally {
      setLoading(false);
    }
  };

  const showGitHub = Boolean(providers?.github);
  const showGoogle = Boolean(providers?.google);

  return (
    <div className="relative min-h-dvh flex items-center justify-center bg-transparent text-slate-900 dark:text-white overflow-hidden px-4 py-6">
  <div className="w-full max-w-md rounded-3xl border border-(--border) surface-panel p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            LexiconAI
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            {t("auth.createAccount")}
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleCredentialsSignUp}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-(--surface-1) dark:text-white/90 dark:placeholder:text-white/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("auth.createPasswordPlaceholder")}
              className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-(--surface-1) dark:text-white/90 dark:placeholder:text-white/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              {t("auth.confirmPassword")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t("auth.confirmPasswordPlaceholder")}
              className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-(--surface-1) dark:text-white/90 dark:placeholder:text-white/40"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full mt-2 py-3 rounded-2xl bg-linear-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.creatingAccount") : t("auth.createAccountButton")}
          </button>
        </form>

        {(showGitHub || showGoogle) && (
          <div className="mt-6 space-y-3">
            {showGitHub && (
              <button
                type="button"
                onClick={() => handleProviderSignUp("github")}
                className="cursor-pointer w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
              >
                <Github size={18} />
                {t("auth.continueWithGithub")}
              </button>
            )}
            {showGoogle && (
              <button
                type="button"
                onClick={() => handleProviderSignUp("google")}
                className="w-full py-3 rounded-2xl border border-(--border) surface-soft hover:bg-(--surface-1) text-slate-800 text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 dark:text-white"
              >
                <Chrome size={18} />
                {t("auth.continueWithGoogle")}
              </button>
            )}
            <p className="text-center text-xs text-slate-500 dark:text-white/50">
              {t("auth.oauthSignUpHelp")}
            </p>
          </div>
        )}

        {status && (
          <div className="mt-4 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
            {status}
          </div>
        )}

        <p className="text-center text-sm text-slate-600 mt-5 dark:text-white/55">
          {t("auth.hasAccount")}
          <Link href="/signin" className="text-slate-900 font-semibold ml-1 hover:underline dark:text-white">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
