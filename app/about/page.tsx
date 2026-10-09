import type { Metadata } from "next";

import { AboutContent } from "@/components/info/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how JK_AUTOS helps car buyers and sellers in Kaduna, Nigeria.",
};

export default function AboutPage() {
  return <AboutContent />;
}
