import type { Metadata } from "next";

import { AppChrome } from "@/components/layout/AppChrome";
import { SITE_CONFIG } from "@/lib/site-config";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jkautos.com.ng"),
  title: { default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`, template: `%s | ${SITE_CONFIG.name}` },
  description: "Discover quality vehicles in Kaduna, book an inspection, or request a car with JK_AUTOS.",
  openGraph: {
    title: `${SITE_CONFIG.name} — Find Your Next Car with Confidence`,
    description: "Quality vehicles, straightforward inspections, and direct WhatsApp support in Kaduna.",
    images: ["/assets/hero-sedan-dusk.png"],
    type: "website",
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppChrome>{children}</AppChrome></body></html>;
}
