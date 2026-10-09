import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { CarForm } from "@/components/admin/CarForm";
import styles from "@/components/admin/admin.module.css";
import { getDb } from "@/db";
import { getCarRow } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

type CarPageProps = { params: Promise<{ slug: string }> };

export default async function AdminCarPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = await getCarRow(getDb(), slug);
  if (!car) notFound();

  return (
    <>
      <AdminTopbar title="Edit car">
        <AdminSearch placeholder="Search cars…" label="Search cars" />
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <Link className={styles.back} href="/admin/cars">← Inventory</Link>
        <CarForm car={car} />
      </main>
    </>
  );
}
