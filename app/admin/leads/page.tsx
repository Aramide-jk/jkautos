import Link from "next/link";

import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { FilterChips } from "@/components/admin/FilterChips";
import { statusPill, typePill } from "@/components/admin/pills";
import { formatLeadDate } from "@/components/admin/format";
import { ActionButton } from "@/components/ui/ActionButton";
import styles from "@/components/admin/admin.module.css";
import { getDb } from "@/db";
import { listLeads } from "@/lib/services/leads";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await listLeads(getDb());

  return (
    <>
      <AdminTopbar title="Leads">
        <AdminSearch placeholder="Search by name or phone…" label="Search leads" />
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <FilterChips items={["All", "Contact", "Request", "Inspection", "Sell"]} label="Filter by type" />
            <div className={styles.toolbar}>
              <label>
                <span className="visuallyHidden">Status</span>
                <select className={styles.select} defaultValue="">
                  <option value="">All statuses</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </label>
              <ActionButton variant="secondary" type="button">Export CSV</ActionButton>
            </div>
          </div>
          <div className={`${styles.panelBody} ${styles.panelBodyFlush}`}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>When</th><th>Type</th><th>Name</th><th>Phone</th><th>Car</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className={styles.num}>{formatLeadDate(lead.createdAt)}</td>
                      <td><span className={typePill()}>{lead.type}</span></td>
                      <td className={styles.cellStrong}><Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link></td>
                      <td className={styles.num}>{lead.phone}</td>
                      <td>{lead.carSlug ?? <span className={styles.cellMuted}>—</span>}</td>
                      <td><span className={statusPill(lead.status)}>{lead.status}</span></td>
                      <td><Link className={styles.linkLike} href={`/admin/leads/${lead.id}`}>View</Link></td>
                    </tr>
                  ))}
                  {leads.length === 0 ? (
                    <tr><td colSpan={7} className={styles.cellMuted}>No enquiries yet.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <span>Showing {leads.length} {leads.length === 1 ? "lead" : "leads"}</span>
              <div className={styles.paginationPages}><a href="#" aria-current="true">1</a></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
