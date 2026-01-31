"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/chat");
    }
  }, [router, session]);

  const handleSignIn = async () => {
    await signIn("github", { callbackUrl: "/chat" });
  };
  return (
    <div className="relative min-h-dvh flex items-center justify-center bg-transparent text-slate-900 dark:text-white overflow-hidden px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            LexiconAI
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            Welcome back — sign in to continue.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full mt-2 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold shadow-sm transition"
          >
            Continue with GitHub
          </button>
          <p className="text-center text-xs text-slate-500 dark:text-white/50">
            We use GitHub OAuth via NextAuth to keep your account secure.
          </p>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5 dark:text-white/55">
          Don’t have an account?
          <a href="/signup" className="text-slate-900 font-semibold ml-1 hover:underline dark:text-white">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
