"use client";

import { useRef, useState } from "react";

import { ActionButton } from "@/components/ui/ActionButton";
import { ActionLink } from "@/components/ui/ActionLink";

import styles from "./admin.module.css";

const PUBLIC_ORIGIN = "https://jkautos.com.ng";

export function ShareListing({ slug, name, price, variant = "button" }: { slug: string; name: string; price: string; variant?: "button" | "panel" }) {
  const url = `${PUBLIC_ORIGIN}/cars/${slug}`;
  const label = `${name} — ${price} from JK_AUTOS.`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");

  async function copyLink(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied to clipboard.");
      return true;
    } catch {
      setStatus("Couldn't copy automatically — select the link and copy it.");
      return false;
    }
  }

  async function shareInstagram() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "JK_AUTOS", text: label, url });
        setStatus("Shared.");
        return;
      } catch {
        return; // user cancelled
      }
    }
    if (await copyLink()) setStatus("Link copied — paste it into your Instagram story or DM.");
  }

  const controls = (
    <>
      <ActionButton variant="secondary" fullWidth onClick={copyLink}>Copy link</ActionButton>
      <ActionLink href={`https://wa.me/?text=${encodeURIComponent(`${label}\n${url}`)}`} target="_blank" rel="noreferrer" fullWidth>Share to WhatsApp</ActionLink>
      <ActionButton variant="secondary" fullWidth onClick={shareInstagram}>Share to Instagram</ActionButton>
      <ActionLink href={url} target="_blank" rel="noreferrer" variant="secondary" fullWidth>Open on site</ActionLink>
    </>
  );

  if (variant === "panel") {
    return (
      <section className={styles.panel} aria-label="Share listing">
        <div className={styles.panelHead}><h2>Share listing</h2></div>
        <div className={styles.panelBody}>
          <p className={styles.note}>After saving, anyone with this link opens the car on the website.</p>
          <label className={styles.shareField} style={{ marginTop: "var(--space-3)" }}>
            <span>Public link</span>
            <input type="text" readOnly value={url} />
          </label>
          <div className={styles.shareActions}>{controls}</div>
          <p className={styles.shareStatus} role="status" aria-live="polite">{status}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <button
        className={styles.linkLike}
        type="button"
        onClick={() => {
          setStatus("");
          dialogRef.current?.showModal();
        }}
      >
        Share
      </button>
      <dialog
        ref={dialogRef}
        className={styles.shareDialog}
        aria-label="Share this listing"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className={styles.shareCard}>
          <header className={styles.shareHead}>
            <h2>Share this listing</h2>
            <button className={styles.shareClose} type="button" onClick={() => dialogRef.current?.close()} aria-label="Close">&times;</button>
          </header>
          <p className={styles.shareSub}>{name} · {price}</p>
          <label className={styles.shareField}>
            <span>Public link</span>
            <input type="text" readOnly value={url} />
          </label>
          <div className={styles.shareActions}>{controls}</div>
          <p className={styles.shareStatus} role="status" aria-live="polite">{status}</p>
        </div>
      </dialog>
    </>
  );
}
