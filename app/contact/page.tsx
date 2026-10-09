import type { Metadata } from "next";

import { ContactContent } from "@/components/info/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact JK_AUTOS in Kaduna by WhatsApp or phone.",
};

export default function ContactPage() {
  return <ContactContent />;
}
