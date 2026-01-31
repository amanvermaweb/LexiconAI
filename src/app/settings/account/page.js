"use client";
import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { User } from "@/components/Icons";
import SecondaryBtn from "@/components/SecondaryBtn";

const AccountPage = () => {
  const { data: session, status } = useSession();
  const [usage, setUsage] = useState({ chats: 0, messages: 0 });
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);

  const user = useMemo(() => {
    return {
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "Sign in to view your account",
      plan: "Free Plan",
    };
  }, [session]);

  useEffect(() => {
    let isMounted = true;

    const loadUsage = async () => {
      setUsageLoading(true);
      setUsageError(null);

      try {
        const response = await fetch("/api/usage");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load usage.");
        }

        if (isMounted) {
          setUsage({
            chats: payload?.chatsCount ?? 0,
            messages: payload?.messagesCount ?? 0,
          });
        }
      } catch (error) {
        if (isMounted) {
          setUsageError(error?.message || "Unable to load usage.");
        }
      } finally {
        if (isMounted) {
          setUsageLoading(false);
        }
      }
    };

    if (session?.user) {
      loadUsage();
    } else {
      setUsageLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session]);
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Account
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          Manage your profile, security, and personal data.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
            <User color="white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-slate-900 font-semibold truncate dark:text-white">
              {user.name}
            </h4>
            <p className="text-slate-600 text-sm truncate dark:text-white/55">
              {user.email}
            </p>
            <p className="text-slate-500 text-xs mt-0.5 dark:text-white/45">
              {user.plan}
            </p>
          </div>
        </div>
      </section>

      {status !== "loading" && !session?.user && (
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-slate-600 dark:text-white/60">
            Sign in to manage your account details and view your usage.
          </p>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/settings/account" })}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700"
          >
            Continue with GitHub
          </button>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {usageLoading ? "—" : usage.messages}
          </div>
          <div className="text-sm text-slate-600 dark:text-white/55">
            Messages sent
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {usageLoading ? "—" : usage.chats}
          </div>
          <div className="text-sm text-slate-600 dark:text-white/55">
            Conversations
          </div>
        </section>
      </div>

      {usageError && (
        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
          {usageError}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="space-y-3">
          <SecondaryBtn content="Change Password" className="w-full" />
          <SecondaryBtn content="Export Data" className="w-full" />
          <button className="w-full rounded-2xl bg-red-500/10 hover:bg-red-500/15 border border-red-400/25 px-4 py-3 text-red-600 text-sm font-semibold transition-all duration-200 whitespace-nowrap dark:text-red-200/90 hover:cursor-pointer">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
