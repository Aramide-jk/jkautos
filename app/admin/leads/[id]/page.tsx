import Link from "next/link";
import { notFound } from "next/navigation";

import { updateLeadStatusAction } from "@/app/admin/actions";
import { AdminSearch, AdminTopbar } from "@/components/admin/AdminTopbar";
import { statusPill, typePill } from "@/components/admin/pills";
import { formatLeadDate, leadFieldLabel } from "@/components/admin/format";
import { ActionButton } from "@/components/ui/ActionButton";
import { ActionLink } from "@/components/ui/ActionLink";
import styles from "@/components/admin/admin.module.css";
import { getDb } from "@/db";
import { getLead } from "@/lib/services/leads";

export const dynamic = "force-dynamic";

type LeadPageProps = { params: Promise<{ id: string }> };

export default async function AdminLeadPage({ params }: LeadPageProps) {
  const { id } = await params;
  const leadId = Number(id);
  const lead = Number.isInteger(leadId) ? await getLead(getDb(), leadId) : undefined;
  if (!lead) notFound();

  const whatsapp = `https://wa.me/${lead.phone.replace(/[^\d]/g, "").replace(/^0/, "234")}`;
  const fields = Object.entries(lead.payload ?? {}).filter(([key]) => key !== "carSlug" && key !== "carName");

  return (
    <>
      <AdminTopbar title="Lead">
        <AdminSearch placeholder="Search leads, cars…" label="Search" />
      </AdminTopbar>

      <main id="admin-content" className={styles.content}>
        <Link className={styles.back} href="/admin/leads">← All leads</Link>

        <div>
          <h1 className={styles.leadTitle}>{lead.name}</h1>
          <p className={styles.leadMeta}>
            <span className={typePill()}>{lead.type}</span>
            <span>·</span>
            <span>{formatLeadDate(lead.createdAt)}</span>
            <span>·</span>
            <span className={statusPill(lead.status)}>{lead.status}</span>
          </p>
        </div>

        <div className={styles.detailGrid}>
          <section className={styles.panel} aria-label="Enquiry details">
            <div className={styles.panelHead}><h2>Enquiry details</h2></div>
            <div className={styles.panelBody}>
              <dl className={styles.detailList}>
                <div><dt>Phone</dt><dd className={styles.leadValue}><a href={`tel:${lead.phone}`}>{lead.phone}</a></dd></div>
                {lead.carSlug ? (
                  <div>
                    <dt>Car</dt>
                    <dd className={styles.leadValue}><Link className={styles.linkLike} href={`/cars/${lead.carSlug}`}>{lead.carSlug}</Link></dd>
                  </div>
                ) : null}
                {fields.map(([key, value]) => (
                  <div key={key}><dt>{leadFieldLabel(key)}</dt><dd className={styles.leadValue}>{String(value)}</dd></div>
                ))}
              </dl>
            </div>
          </section>

          <div className={styles.stack}>
            <section className={styles.panel} aria-label="Contact actions">
              <div className={styles.panelHead}><h2>Contact</h2></div>
              <div className={styles.panelBody}>
                <div className={styles.contactActions}>
                  <ActionLink href={`tel:${lead.phone}`} fullWidth>Call</ActionLink>
                  <ActionLink href={whatsapp} target="_blank" rel="noreferrer" variant="secondary" fullWidth>WhatsApp</ActionLink>
                </div>
              </div>
            </section>

            <section className={styles.panel} aria-label="Status">
              <div className={styles.panelHead}><h2>Status</h2></div>
              <div className={styles.panelBody}>
                <form action={updateLeadStatusAction} className={styles.stack}>
                  <input type="hidden" name="id" value={lead.id} />
                  <label className={styles.shareField}>
                    <span>Update status</span>
                    <select className={styles.select} name="status" defaultValue={lead.status}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </label>
                  <ActionButton type="submit" fullWidth>Update status</ActionButton>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
