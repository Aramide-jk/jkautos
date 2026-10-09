import Image from "next/image";
import Link from "next/link";

import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { FilterChips } from "@/components/admin/FilterChips";
import { ShareListing } from "@/components/admin/ShareListing";
import { featuredPill, statusPill } from "@/components/admin/pills";
import { ActionLink } from "@/components/ui/ActionLink";
import styles from "@/components/admin/admin.module.css";
import { getDb } from "@/db";
import { listCarRows } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  const cars = await listCarRows(getDb());
  const featured = cars.filter((car) => car.featured).length;

  return (
    <>
      <AdminTopbar title="Inventory">
        <AdminSearch placeholder="Search cars…" label="Search cars" />
        <ActionLink href="/admin/cars/new">Add car</ActionLink>
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <FilterChips
              items={[`All (${cars.length})`, `Available (${cars.filter((car) => car.status === "available").length})`, `Reserved (${cars.filter((car) => car.status === "reserved").length})`, `Sold (${cars.filter((car) => car.status === "sold").length})`, `Featured (${featured})`]}
              label="Filter inventory"
            />
          </div>
          <div className={`${styles.panelBody} ${styles.panelBodyFlush}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th></th><th>Car</th><th>Price</th><th>Year</th><th>Status</th><th>Flags</th><th></th></tr></thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.slug}>
                      <td>{car.images[0] ? <Image className={styles.thumb} src={car.images[0]} alt="" width={72} height={48} /> : null}</td>
                      <td className={styles.cellStrong}>
                        {car.name}
                        <div className={styles.cellMuted}>{car.location} · {car.transmission} · {car.fuel}</div>
                      </td>
                      <td className={styles.num}>{car.priceLabel}</td>
                      <td className={styles.num}>{car.year}</td>
                      <td><span className={statusPill(car.status)}>{car.status}</span></td>
                      <td>{car.featured ? <span className={featuredPill()}>featured</span> : null}</td>
                      <td className={styles.rowActions}>
                        <ShareListing slug={car.slug} name={car.name} price={car.priceLabel} />
                        <Link className={styles.linkLike} href={`/admin/cars/${car.slug}`}>Edit</Link>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 ? <tr><td colSpan={7} className={styles.cellMuted}>No cars yet.</td></tr> : null}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <span>Showing {cars.length} {cars.length === 1 ? "car" : "cars"}</span>
              <div className={styles.paginationPages}><a href="#" aria-current="true">1</a></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
