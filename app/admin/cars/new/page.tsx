import Link from "next/link";

import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { CarForm } from "@/components/admin/CarForm";
import styles from "@/components/admin/admin.module.css";

export default function AdminNewCarPage() {
  return (
    <>
      <AdminTopbar title="Add car">
        <AdminSearch placeholder="Search cars…" label="Search cars" />
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <Link className={styles.back} href="/admin/cars">← Inventory</Link>
        <CarForm />
      </main>
    </>
  );
}
