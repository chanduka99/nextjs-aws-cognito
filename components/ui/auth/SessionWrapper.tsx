"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

type childrenType = { children: React.ReactNode };

export default function SessionWrapper({ children }: childrenType) {
  return <SessionProvider>{children}</SessionProvider>;
}
