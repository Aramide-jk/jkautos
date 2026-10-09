"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { ActionButton } from "@/components/ui/ActionButton";
import { Field } from "@/components/ui/Field";
import { submitLead } from "@/lib/leads/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidPhone } from "@/lib/validation";

import styles from "./SellCarForm.module.css";

type SellField = "fullName" | "phone" | "location" | "make" | "model" | "year" | "mileage" | "askingPrice" | "condition";
type SellErrors = Partial<Record<SellField, string>>;
type Preview = { id: string; name: string; src: string };

const requiredFields: readonly SellField[] = ["fullName", "phone", "location", "make", "model", "year", "mileage", "askingPrice", "condition"];

export function SellCarForm() {
  const [errors, setErrors] = useState<SellErrors>({});
  const [status, setStatus] = useState("");
  const [previews, setPreviews] = useState<Preview[]>([]);

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    Promise.all(files.map((file, index) => new Promise<Preview>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: `${file.name}-${file.lastModified}-${index}`, name: file.name, src: String(reader.result) });
      reader.readAsDataURL(file);
    }))).then(setPreviews);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: SellErrors = {};
    for (const field of requiredFields) {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = "Please complete this field.";
    }
    const phone = String(data.get("phone") ?? "");
    if (phone.trim() && !isValidPhone(phone)) nextErrors.phone = "Enter a valid phone number.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("Please complete the required fields before continuing.");
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("Opening WhatsApp with your vehicle details…");
    await submitLead({
      type: "sell",
      name: String(data.get("fullName") ?? "").trim(),
      phone: phone.trim(),
      location: String(data.get("location") ?? "").trim(),
      make: String(data.get("make") ?? "").trim(),
      model: String(data.get("model") ?? "").trim(),
      year: String(data.get("year") ?? "").trim(),
      trim: String(data.get("trim") ?? "").trim(),
      mileage: String(data.get("mileage") ?? "").trim(),
      askingPrice: String(data.get("askingPrice") ?? "").trim(),
      condition: String(data.get("condition") ?? "").trim(),
      registrationStatus: String(data.get("registrationStatus") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      photoCount: previews.length,
    });
    const message = [
      "Hello JK_AUTOS, I would like to sell my car.", "",
      `Name: ${data.get("fullName")}`, `Phone: ${data.get("phone")}`, `Location: ${data.get("location")}`,
      `Vehicle: ${data.get("year")} ${data.get("make")} ${data.get("model")}`,
      `Trim: ${data.get("trim") || "Not specified"}`, `Mileage: ${data.get("mileage")}`,
      `Asking price: ${data.get("askingPrice")}`, `Condition: ${data.get("condition")}`,
      `Registration: ${data.get("registrationStatus") || "Not specified"}`,
      `Description: ${data.get("description") || "None"}`,
      `Photos selected: ${previews.length}. I will attach them in this chat.`,
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  const fieldProps = (name: SellField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `sell-${name}-error` : undefined,
    onChange: () => setErrors((current) => ({ ...current, [name]: undefined })),
  });

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate>
      <h2>Vehicle details</h2>
      <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className={styles.grid}>
        <Field label="Full Name" htmlFor="sell-fullName" required error={errors.fullName}>
          <input id="sell-fullName" name="fullName" autoComplete="name" required {...fieldProps("fullName")} />
        </Field>
        <Field label="Phone Number" htmlFor="sell-phone" required error={errors.phone}>
          <input id="sell-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps("phone")} />
        </Field>
        <div className={styles.full}><Field label="Location" htmlFor="sell-location" required error={errors.location}>
          <input id="sell-location" name="location" autoComplete="address-level2" required {...fieldProps("location")} />
        </Field></div>
        <Field label="Make" htmlFor="sell-make" required error={errors.make}>
          <input id="sell-make" name="make" required {...fieldProps("make")} />
        </Field>
        <Field label="Model" htmlFor="sell-model" required error={errors.model}>
          <input id="sell-model" name="model" required {...fieldProps("model")} />
        </Field>
        <Field label="Year" htmlFor="sell-year" required error={errors.year}>
          <input id="sell-year" name="year" inputMode="numeric" required {...fieldProps("year")} />
        </Field>
        <Field label="Trim" htmlFor="sell-trim" optional><input id="sell-trim" name="trim" placeholder="e.g. XLE" /></Field>
        <Field label="Mileage" htmlFor="sell-mileage" required error={errors.mileage}>
          <input id="sell-mileage" name="mileage" placeholder="e.g. 84,000 km" required {...fieldProps("mileage")} />
        </Field>
        <Field label="Asking Price" htmlFor="sell-askingPrice" required error={errors.askingPrice}>
          <input id="sell-askingPrice" name="askingPrice" placeholder="e.g. ₦18,500,000" required {...fieldProps("askingPrice")} />
        </Field>
        <Field label="Condition" htmlFor="sell-condition" required error={errors.condition}>
          <select id="sell-condition" name="condition" defaultValue="" required {...fieldProps("condition")}>
            <option value="">Select condition</option><option>Brand New</option><option>Foreign Used</option><option>Nigerian Used</option>
          </select>
        </Field>
        <Field label="Registration Status" htmlFor="sell-registrationStatus" optional>
          <select id="sell-registrationStatus" name="registrationStatus" defaultValue=""><option value="">Select status</option><option>Registered</option><option>Unregistered</option></select>
        </Field>
        <div className={styles.full}><Field label="Description" htmlFor="sell-description" optional>
          <textarea id="sell-description" name="description" placeholder="Condition, service history, notable features, or known issues" />
        </Field></div>
        <div className={styles.full}>
          <div className={styles.uploadZone}>
            <label htmlFor="sell-photos"><strong>Car Photos <span>(optional)</span></strong></label>
            <p id="photo-help">Choose multiple images to preview them here. They remain on your device; attach them manually after WhatsApp opens.</p>
            <input id="sell-photos" name="carPhotos" type="file" accept="image/*" multiple onChange={handlePhotos} aria-describedby="photo-help" />
          </div>
          <p className="visuallyHidden" role="status" aria-live="polite">{previews.length ? `${previews.length} car ${previews.length === 1 ? "photo" : "photos"} selected.` : "No car photos selected."}</p>
          <div className={styles.previews}>
            {previews.map((preview) => (
              <figure className={styles.preview} key={preview.id}>
                {/* Local user-selected previews intentionally use a data URL. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.src} alt={`Preview of ${preview.name}`} />
                <figcaption>{preview.name}</figcaption>
                <button type="button" onClick={() => setPreviews((items) => items.filter((item) => item.id !== preview.id))} aria-label={`Remove ${preview.name}`}>×</button>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <ActionButton type="submit" fullWidth>Submit &amp; Continue on WhatsApp</ActionButton>
        <p className={styles.note}>Your details are saved so JK_AUTOS can follow up. Selected photos stay on your device — attach them in the chat after WhatsApp opens.</p>
      </div>
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </form>
  );
}
