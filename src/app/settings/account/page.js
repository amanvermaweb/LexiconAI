"use client";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "@/components/Icons";
import SecondaryBtn from "@/components/SecondaryBtn";
import { useLocale } from "@/context/LocaleContext";
import { localizeMessage } from "@/utils/i18n";

const AccountPage = () => {
  const { data: session, status } = useSession();
  const { locale, t } = useLocale();
  const [usage, setUsage] = useState({ chats: 0, messages: 0 });
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = useMemo(() => {
    return {
      name: session?.user?.name || t("settings.guest"),
      email: session?.user?.email || t("settings.signInToViewAccount"),
      plan: t("settings.freePlan"),
    };
  }, [session, t]);

  useEffect(() => {
    let isMounted = true;

    const loadUsage = async () => {
      setUsageLoading(true);
      setUsageError(null);

      try {
        const response = await fetch("/api/usage");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            localizeMessage(payload?.error || t("settings.loadUsageError"), locale),
          );
        }

        if (isMounted) {
          setUsage({
            chats: payload?.chatsCount ?? 0,
            messages: payload?.messagesCount ?? 0,
          });
        }
      } catch (error) {
        if (isMounted) {
          setUsageError(
            localizeMessage(error?.message || t("settings.loadUsageError"), locale),
          );
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
  }, [locale, session, t]);

  const handleChangePassword = async () => {
    setActionStatus(null);
    setActionLoading(true);
    try {
      const response = await fetch("/api/account/change-password", {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.updatePasswordError"), locale),
        );
      }

      setActionStatus(
        localizeMessage(payload?.message || t("settings.passwordManagedByProvider"), locale),
      );
    } catch (error) {
      setActionStatus(
        localizeMessage(error?.message || t("settings.updatePasswordError"), locale),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportData = async () => {
    setActionStatus(null);
    setActionLoading(true);
    try {
      const response = await fetch("/api/account/export");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.exportDataError"), locale),
        );
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lexiconai-export.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setActionStatus(t("settings.exportReady"));
    } catch (error) {
      setActionStatus(
        localizeMessage(error?.message || t("settings.exportDataError"), locale),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setActionStatus(null);

    if (
      !window.confirm(
        t("settings.deleteConfirm"),
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.deleteAccountError"), locale),
        );
      }

      setActionStatus(t("settings.accountDeleted"));
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      setActionStatus(
        localizeMessage(error?.message || t("settings.deleteAccountError"), locale),
      );
    } finally {
      setActionLoading(false);
    }
  };
  return (
  <div className="space-y-8 p-4 sm:p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t("settings.account")}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          {t("settings.accountDescription")}
        </p>
      </div>

  <section className="rounded-3xl border border-(--border) surface-card p-5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <section className="rounded-3xl border border-(--border) surface-card p-5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {usageLoading ? "—" : usage.messages}
          </div>
          <div className="text-sm text-slate-600 dark:text-white/55">
            {t("settings.messagesSent")}
          </div>
        </section>
  <section className="rounded-3xl border border-(--border) surface-card p-5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {usageLoading ? "—" : usage.chats}
          </div>
          <div className="text-sm text-slate-600 dark:text-white/55">
            {t("settings.conversations")}
          </div>
        </section>
      </div>

      {usageError && (
        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
          {usageError}
        </div>
      )}

  <section className="rounded-3xl border border-(--border) surface-card p-5">
        <div className="space-y-3">
          <SecondaryBtn
            content={t("settings.changePassword")}
            className="w-full"
            onClick={handleChangePassword}
            disabled={!session?.user || actionLoading}
          />
          <SecondaryBtn
            content={t("settings.exportData")}
            className="w-full"
            onClick={handleExportData}
            disabled={!session?.user || actionLoading}
          />
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={!session?.user || actionLoading}
            className="w-full rounded-2xl bg-red-500/10 hover:bg-red-500/15 border border-red-400/25 px-4 py-3 text-red-600 text-sm font-semibold transition-all duration-200 whitespace-nowrap dark:text-red-200/90 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t("settings.deleteAccount")}
          </button>
        </div>
      </section>

      {actionStatus && (
        <div className="rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-600 shadow-sm dark:text-white/70">
          {actionStatus}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
