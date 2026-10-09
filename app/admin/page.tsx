import Link from "next/link";

import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { featuredPill, statusPill, typePill } from "@/components/admin/pills";
import { formatLeadDate } from "@/components/admin/format";
import styles from "@/components/admin/admin.module.css";
import { getDb } from "@/db";
import { listCarRows } from "@/lib/services/cars";
import { leadStatusCounts, listLeads } from "@/lib/services/leads";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = getDb();
  const [counts, recent, carRows] = await Promise.all([
    leadStatusCounts(db),
    listLeads(db, { limit: 5 }),
    listCarRows(db),
  ]);
  const total = (status: string) => counts.find((row) => row.status === status)?.total ?? 0;
  const featured = carRows.filter((car) => car.featured).length;

  return (
    <>
      <AdminTopbar title="Dashboard">
        <AdminSearch placeholder="Search leads, cars…" label="Search" />
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <section className={styles.statGrid} aria-label="Overview">
          <article className={`${styles.stat} ${styles.statAlert}`}><p className={styles.statLabel}>New enquiries</p><p className={styles.statValue}>{total("new")}</p><p className={styles.statMeta}>Awaiting first contact</p></article>
          <article className={styles.stat}><p className={styles.statLabel}>In progress</p><p className={styles.statValue}>{total("contacted")}</p><p className={styles.statMeta}>Contacted, not closed</p></article>
          <article className={styles.stat}><p className={styles.statLabel}>Cars available</p><p className={styles.statValue}>{carRows.length}</p><p className={styles.statMeta}>{featured} featured</p></article>
          <article className={styles.stat}><p className={styles.statLabel}>Closed (won)</p><p className={styles.statValue}>{total("won")}</p><p className={styles.statMeta}>Enquiries marked won</p></article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2>Recent enquiries</h2>
            <Link className={styles.linkLike} href="/admin/leads">View all leads →</Link>
          </div>
          <div className={`${styles.panelBody} ${styles.panelBodyFlush}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>When</th><th>Type</th><th>Name</th><th>Phone</th><th>Car</th><th>Status</th></tr></thead>
                <tbody>
                  {recent.map((lead) => (
                    <tr key={lead.id}>
                      <td className={styles.num}>{formatLeadDate(lead.createdAt)}</td>
                      <td><span className={typePill()}>{lead.type}</span></td>
                      <td className={styles.cellStrong}><Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link></td>
                      <td className={styles.num}>{lead.phone}</td>
                      <td>{lead.carSlug ?? <span className={styles.cellMuted}>—</span>}</td>
                      <td><span className={statusPill(lead.status)}>{lead.status}</span></td>
                    </tr>
                  ))}
                  {recent.length === 0 ? <tr><td colSpan={6} className={styles.cellMuted}>No enquiries yet.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2>Inventory snapshot</h2>
            <Link className={styles.linkLike} href="/admin/cars">Manage inventory →</Link>
          </div>
          <div className={`${styles.panelBody} ${styles.panelBodyFlush}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Car</th><th>Price</th><th>Year</th><th>Status</th><th>Flags</th></tr></thead>
                <tbody>
                  {carRows.slice(0, 4).map((car) => (
                    <tr key={car.slug}>
                      <td className={styles.cellStrong}>{car.name}</td>
                      <td className={styles.num}>{car.priceLabel}</td>
                      <td className={styles.num}>{car.year}</td>
                      <td><span className={statusPill(car.status)}>{car.status}</span></td>
                      <td>{car.featured ? <span className={featuredPill()}>featured</span> : null}</td>
                    </tr>
                  ))}
                  {carRows.length === 0 ? <tr><td colSpan={5} className={styles.cellMuted}>No cars yet.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
