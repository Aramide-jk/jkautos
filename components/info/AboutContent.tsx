import { ActionLink } from "@/components/ui/ActionLink";

import styles from "./InfoPages.module.css";

export function AboutContent() {
  return (
    <main id="main-content">
      <section className={styles.hero}>
        <div className="containerNarrow">
          <p className="eyebrow">About JK_AUTOS</p>
          <h1 className="displayTitle">A clearer way to find your next car.</h1>
          <p className="sectionCopy">JK_AUTOS is an independent car brokerage and sourcing service based in Kaduna, serving buyers and sellers across Nigeria.</p>
        </div>
      </section>

      <section className="section">
        <div className={`containerNarrow ${styles.infoGrid}`}>
          <div><p className="eyebrow">What we do</p><h2>Practical support, from search to inspection.</h2></div>
          <div className={styles.copy}>
            <p>We present available vehicles clearly, connect interested buyers with inspection opportunities, and keep enquiries direct through WhatsApp.</p>
            <p>Our brokerage approach is personal: we help you understand an available car, arrange the next step, and make space for your own checks before you decide. If the right vehicle is not listed, our sourcing service starts with your make, model, budget, condition, and location.</p>
            <p>Trust is earned through clear information and realistic expectations. JK_AUTOS does not ask you to make a decision without inspection. We encourage buyers to inspect, verify, and ask questions.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.paper} section`} aria-labelledby="process-title">
        <div className="containerNarrow">
          <p className="eyebrow">Our process</p>
          <h2 className="sectionTitle" id="process-title">Confidence comes from the right steps.</h2>
          <div className={styles.process}>
            <article><h3>Discover</h3><p>Browse available cars or tell us the exact vehicle you want sourced.</p></article>
            <article><h3>Inspect</h3><p>Book an inspection and examine the vehicle before making a commitment.</p></article>
            <article><h3>Decide</h3><p>Ask questions, review the details, and move forward when you are satisfied.</p></article>
          </div>
        </div>
      </section>

      <section className="section sectionDark">
        <div className={`containerNarrow ${styles.infoGrid}`}>
          <div><p className="eyebrow">Our promise</p><h2 className="sectionTitle">Buy Smart. Drive Safe.</h2></div>
          <div>
            <p className="sectionCopy">Whether you are buying, sourcing, or selling, JK_AUTOS gives you a direct point of contact and a straightforward path forward in Kaduna and across Nigeria.</p>
            <div className={styles.actions}><ActionLink href="/cars">Browse Cars</ActionLink><ActionLink href="/request-car" variant="light">Request a Car</ActionLink></div>
          </div>
        </div>
      </section>
    </main>
  );
}
