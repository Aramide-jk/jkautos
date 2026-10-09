"use client";

import { useState, type FormEvent } from "react";

import { ActionButton } from "@/components/ui/ActionButton";
import { Field } from "@/components/ui/Field";
import { submitLead } from "@/lib/leads/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidPhone } from "@/lib/validation";

import styles from "./RequestCarForm.module.css";

type RequestErrors = Partial<Record<"fullName" | "phone" | "carMake" | "carModel" | "preferredYear" | "budget" | "preferredColor" | "condition" | "location", string>>;

const requiredFields = ["fullName", "phone", "carMake", "carModel", "preferredYear", "budget", "preferredColor", "condition", "location"] as const;

export function RequestCarForm() {
  const [errors, setErrors] = useState<RequestErrors>({});
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: RequestErrors = {};

    for (const field of requiredFields) {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = "Please complete this field.";
    }
    const phone = String(data.get("phone") ?? "");
    if (phone.trim() && !isValidPhone(phone)) nextErrors.phone = "Enter a valid phone number.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("Please complete the required fields before continuing.");
      const firstInvalid = form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`);
      firstInvalid?.focus();
      return;
    }

    setErrors({});
    setStatus("Opening WhatsApp with your car request…");
    await submitLead({
      type: "request",
      name: String(data.get("fullName") ?? "").trim(),
      phone: phone.trim(),
      carMake: String(data.get("carMake") ?? "").trim(),
      carModel: String(data.get("carModel") ?? "").trim(),
      preferredYear: String(data.get("preferredYear") ?? "").trim(),
      budget: String(data.get("budget") ?? "").trim(),
      preferredColor: String(data.get("preferredColor") ?? "").trim(),
      condition: String(data.get("condition") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
      additionalRequirements: String(data.get("additionalRequirements") ?? "").trim(),
    });
    const message = [
      "Hello JK_AUTOS, I would like to request a car.",
      "",
      `Name: ${data.get("fullName")}`,
      `Phone: ${data.get("phone")}`,
      `Car: ${data.get("carMake")} ${data.get("carModel")}`,
      `Preferred year: ${data.get("preferredYear")}`,
      `Budget: ${data.get("budget")}`,
      `Preferred colour: ${data.get("preferredColor")}`,
      `Condition: ${data.get("condition")}`,
      `Location: ${data.get("location")}`,
      `Additional requirements: ${data.get("additionalRequirements") || "None"}`,
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  const fieldProps = (name: keyof RequestErrors) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `request-${name}-error` : undefined,
    onChange: () => setErrors((current) => ({ ...current, [name]: undefined })),
  });

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate>
      <h2>Your car request</h2>
      <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className={styles.grid}>
        <Field label="Full Name" htmlFor="request-fullName" required error={errors.fullName}>
          <input id="request-fullName" name="fullName" autoComplete="name" required {...fieldProps("fullName")} />
        </Field>
        <Field label="Phone Number" htmlFor="request-phone" required error={errors.phone}>
          <input id="request-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps("phone")} />
        </Field>
        <Field label="Car Make" htmlFor="request-carMake" required error={errors.carMake}>
          <input id="request-carMake" name="carMake" placeholder="e.g. Toyota" required {...fieldProps("carMake")} />
        </Field>
        <Field label="Car Model" htmlFor="request-carModel" required error={errors.carModel}>
          <input id="request-carModel" name="carModel" placeholder="e.g. Camry" required {...fieldProps("carModel")} />
        </Field>
        <Field label="Preferred Year / Year Range" htmlFor="request-preferredYear" required error={errors.preferredYear}>
          <input id="request-preferredYear" name="preferredYear" placeholder="e.g. 2019–2022" required {...fieldProps("preferredYear")} />
        </Field>
        <Field label="Budget" htmlFor="request-budget" required error={errors.budget}>
          <input id="request-budget" name="budget" placeholder="e.g. ₦25,000,000" required {...fieldProps("budget")} />
        </Field>
        <Field label="Preferred Color" htmlFor="request-preferredColor" required error={errors.preferredColor}>
          <input id="request-preferredColor" name="preferredColor" placeholder="e.g. Black" required {...fieldProps("preferredColor")} />
        </Field>
        <Field label="Condition" htmlFor="request-condition" required error={errors.condition}>
          <select id="request-condition" name="condition" defaultValue="" required {...fieldProps("condition")}>
            <option value="">Select condition</option>
            <option>Brand New</option><option>Foreign Used</option><option>Nigerian Used</option><option>Open to options</option>
          </select>
        </Field>
        <div className={styles.full}>
          <Field label="Location" htmlFor="request-location" required error={errors.location}>
            <input id="request-location" name="location" autoComplete="address-level2" placeholder="e.g. Kaduna" required {...fieldProps("location")} />
          </Field>
        </div>
        <div className={styles.full}>
          <Field label="Additional Requirements" htmlFor="request-additionalRequirements" optional>
            <textarea id="request-additionalRequirements" name="additionalRequirements" placeholder="Trim, features, mileage, or anything else that matters" />
          </Field>
        </div>
      </div>
      <div className={styles.actions}>
        <ActionButton type="submit" fullWidth>Submit Request on WhatsApp</ActionButton>
        <p className={styles.note}>Your details are saved so JK_AUTOS can follow up, then WhatsApp opens with your request.</p>
      </div>
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </form>
  );
}
