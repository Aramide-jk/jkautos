import { ContactForm } from "@/components/forms/ContactForm";
import { ActionLink } from "@/components/ui/ActionLink";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./InfoPages.module.css";

const generalWhatsApp = buildWhatsAppUrl("Hello JK_AUTOS, I would like to make an enquiry.");

export function ContactContent() {
  return (
    <main id="main-content">
      <section className={styles.hero}>
        <div className="containerNarrow">
          <p className="eyebrow">Contact JK_AUTOS</p>
          <h1 className="displayTitle">Let’s talk about your next move.</h1>
          <p className="sectionCopy">WhatsApp is the quickest way to ask about a car, arrange an inspection, or discuss sourcing and selling.</p>
        </div>
      </section>

      <section className="section">
        <div className={`containerNarrow ${styles.contactLayout}`}>
          <aside className={styles.contactCard} aria-labelledby="direct-contact">
            <p className="eyebrow">Direct contact</p>
            <h2 id="direct-contact">Reach JK_AUTOS</h2>
            <dl>
              <div><dt>WhatsApp</dt><dd><ActionLink href={generalWhatsApp} target="_blank" rel="noreferrer" fullWidth>Chat on WhatsApp</ActionLink></dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:+${SITE_CONFIG.phoneInternational}`}>{SITE_CONFIG.phoneDisplay}</a></dd></div>
              <div><dt>Service area</dt><dd>{SITE_CONFIG.location}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><span className={styles.provisional}>Provisional email — confirm before launch</span></dd></div>
            </dl>
          </aside>
          <ContactForm />
        </div>
      </section>

      <div className={styles.mobileAction}><ActionLink href={generalWhatsApp} target="_blank" rel="noreferrer" fullWidth>Chat on WhatsApp</ActionLink></div>
    </main>
  );
}
