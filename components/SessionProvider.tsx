"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

//this is the session provider component, it is used to provide the session to the application
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
