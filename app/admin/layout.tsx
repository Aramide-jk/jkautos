import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { getDb } from "@/db";
import { leadStatusCounts } from "@/lib/services/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | JK_AUTOS Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let newLeads = 0;
  try {
    const counts = await leadStatusCounts(getDb());
    newLeads = counts.find((row) => row.status === "new")?.total ?? 0;
  } catch {
    newLeads = 0;
  }

  return <AdminShell newLeads={newLeads}>{children}</AdminShell>;
}
