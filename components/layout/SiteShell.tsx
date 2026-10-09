import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skipLink" href="#main-content">Skip to main content</a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
