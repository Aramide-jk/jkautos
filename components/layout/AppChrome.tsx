"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteShell } from "./SiteShell";

/** Public pages get the marketing header/footer; the admin area does not. */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/sign-in") return <>{children}</>;
  return <SiteShell>{children}</SiteShell>;
}
