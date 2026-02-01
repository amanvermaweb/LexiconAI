"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Chrome, Github } from "@/components/Icons";

const SignUp = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.replace("/chat");
    }
  }, [router, session]);

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
        throw new Error(payload?.error || "Unable to create account.");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/chat",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace("/chat");
    } catch (error) {
      setStatus(error?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-dvh flex items-center justify-center bg-transparent text-slate-900 dark:text-white overflow-hidden px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            LexiconAI
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            Create your account in seconds.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleCredentialsSignUp}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/40 dark:hover:bg-white/8"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/40 dark:hover:bg-white/8"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/40 dark:hover:bg-white/8"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-linear-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => handleProviderSignUp("github")}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Github size={18} />
            Continue with GitHub
          </button>
          <button
            type="button"
            onClick={() => handleProviderSignUp("google")}
            className="w-full py-3 rounded-2xl border border-slate-200/70 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <Chrome size={18} />
            Continue with Google
          </button>
          <p className="text-center text-xs text-slate-500 dark:text-white/50">
            OAuth sign-up is instant if you prefer Google or GitHub.
          </p>
        </div>

        {status && (
          <div className="mt-4 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
            {status}
          </div>
        )}

        <p className="text-center text-sm text-slate-600 mt-5 dark:text-white/55">
          Already have an account?
          <a href="/signin" className="text-slate-900 font-semibold ml-1 hover:underline dark:text-white">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
