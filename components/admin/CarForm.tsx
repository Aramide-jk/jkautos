"use client";

import Image from "next/image";
import { useState } from "react";

import { deleteCarAction, saveCarAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/ui/ActionButton";
import { Field } from "@/components/ui/Field";
import type { CarRecord } from "@/lib/services/cars";

import { ShareListing } from "./ShareListing";
import styles from "./admin.module.css";

export function CarForm({ car }: { car?: CarRecord }) {
  const [images, setImages] = useState<string[]>(car?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        if (response.ok) {
          const data = (await response.json()) as { url?: string };
          if (data.url) uploaded.push(data.url);
        } else {
          setUploadError("Some images failed to upload.");
        }
      } catch {
        setUploadError("Some images failed to upload.");
      }
    }
    setImages((current) => [...current, ...uploaded]);
    setUploading(false);
  }

  return (
    <form action={saveCarAction} className={styles.detailGrid}>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      {car ? <input type="hidden" name="originalSlug" value={car.slug} /> : null}

      <section className={styles.panel} aria-label="Vehicle details">
        <div className={styles.panelHead}><h2>Vehicle details</h2></div>
        <div className={styles.panelBody}>
          <div className={styles.formGrid}>
            <Field label="Name" htmlFor="car-name"><input id="car-name" name="name" defaultValue={car?.name ?? ""} required /></Field>
            <Field label="Slug" htmlFor="car-slug"><input id="car-slug" name="slug" defaultValue={car?.slug ?? ""} required /></Field>
            <Field label="Year" htmlFor="car-year"><input id="car-year" name="year" type="number" defaultValue={car?.year ?? ""} required /></Field>
            <Field label="Price" htmlFor="car-price"><input id="car-price" name="priceLabel" defaultValue={car?.priceLabel ?? ""} placeholder="₦32,500,000" required /></Field>
            <Field label="Mileage" htmlFor="car-mileage"><input id="car-mileage" name="mileage" defaultValue={car?.mileage ?? ""} required /></Field>
            <Field label="Colour" htmlFor="car-colour"><input id="car-colour" name="colour" defaultValue={car?.colour ?? ""} required /></Field>
            <Field label="Transmission" htmlFor="car-transmission">
              <select id="car-transmission" name="transmission" defaultValue={car?.transmission ?? "Automatic"}><option>Automatic</option><option>Manual</option></select>
            </Field>
            <Field label="Fuel" htmlFor="car-fuel">
              <select id="car-fuel" name="fuel" defaultValue={car?.fuel ?? "Petrol"}><option>Petrol</option><option>Diesel</option><option>Hybrid</option></select>
            </Field>
            <Field label="Condition" htmlFor="car-condition">
              <select id="car-condition" name="condition" defaultValue={car?.condition ?? "Foreign Used"}><option>Brand New</option><option>Foreign Used</option><option>Nigerian Used</option></select>
            </Field>
            <Field label="Location" htmlFor="car-location"><input id="car-location" name="location" defaultValue={car?.location ?? ""} required /></Field>
            <div className={styles.fieldFull}><Field label="Image alt text" htmlFor="car-alt"><input id="car-alt" name="alt" defaultValue={car?.alt ?? ""} placeholder="Description for screen readers" required /></Field></div>
            <div className={styles.fieldFull}><Field label="Description" htmlFor="car-description"><textarea id="car-description" name="description" defaultValue={car?.description ?? ""} required /></Field></div>
            <div className={styles.fieldFull}><Field label="Features (one per line)" htmlFor="car-features"><textarea id="car-features" name="features" defaultValue={car?.features.join("\n") ?? ""} /></Field></div>
          </div>
        </div>
      </section>

      <div className={styles.stack}>
        <section className={styles.panel} aria-label="Publishing">
          <div className={styles.panelHead}><h2>Publishing</h2></div>
          <div className={styles.panelBody}>
            <Field label="Status" htmlFor="car-status">
              <select id="car-status" name="status" defaultValue={car?.status ?? "available"}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </Field>
            <label className={styles.check}><input type="checkbox" name="featured" defaultChecked={car?.featured ?? false} /> <span>Feature on the home page</span></label>
            <div style={{ marginTop: "var(--space-5)" }}><ActionButton type="submit" fullWidth>{car ? "Save car" : "Create car"}</ActionButton></div>
          </div>
        </section>

        {car ? <ShareListing variant="panel" slug={car.slug} name={car.name} price={car.priceLabel} /> : null}

        <section className={styles.panel} aria-label="Photos">
          <div className={styles.panelHead}><h2>Photos</h2></div>
          <div className={styles.panelBody}>
            <div className={styles.uploadZone}>
              <strong>Upload images</strong>
              <p>JPG or PNG. Stored in Vercel Blob.</p>
              <input type="file" accept="image/*" multiple onChange={(event) => uploadFiles(event.target.files)} disabled={uploading} />
              {uploading ? <p>Uploading…</p> : null}
              {uploadError ? <p className={styles.pill + " " + styles.pillNew}>{uploadError}</p> : null}
            </div>
            {images.length ? (
              <div className={styles.mediaGrid} style={{ marginTop: "var(--space-4)" }}>
                {images.map((src) => (
                  <figure key={src}>
                    <Image src={src} alt="" width={200} height={150} />
                    <figcaption>{src.split("/").pop()}</figcaption>
                    <button type="button" onClick={() => setImages((current) => current.filter((item) => item !== src))} aria-label="Remove image" style={{ position: "absolute", top: "0.3rem", right: "0.3rem", border: 0, borderRadius: "var(--radius-sm)", background: "var(--color-charcoal)", color: "#fff" }}>×</button>
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {car ? (
          <section className={styles.panel} aria-label="Danger zone">
            <div className={styles.panelHead}><h2>Danger zone</h2></div>
            <div className={styles.panelBody}>
              <p className={styles.note}>Deleting removes this car from the site.</p>
              <div style={{ marginTop: "var(--space-4)" }}>
                <ActionButton type="submit" variant="secondary" fullWidth formAction={deleteCarAction}>Delete car</ActionButton>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </form>
  );
}
