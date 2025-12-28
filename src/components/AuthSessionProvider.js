"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function AuthSessionProvider({ children }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
