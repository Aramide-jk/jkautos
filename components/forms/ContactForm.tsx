"use client";

import { useState, type FormEvent } from "react";

import { ActionButton } from "@/components/ui/ActionButton";
import { Field } from "@/components/ui/Field";
import { submitLead } from "@/lib/leads/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidPhone } from "@/lib/validation";

import styles from "./ContactForm.module.css";

type ContactField = "fullName" | "phone" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: ContactErrors = {};
    for (const field of ["fullName", "phone", "message"] as const) {
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
    setStatus("Opening WhatsApp with your enquiry…");
    await submitLead({
      type: "contact",
      name: String(data.get("fullName") ?? "").trim(),
      phone: phone.trim(),
      message: String(data.get("message") ?? "").trim(),
    });
    const message = [
      "Hello JK_AUTOS, I would like to make an enquiry.", "",
      `Name: ${data.get("fullName")}`,
      `Phone: ${data.get("phone")}`,
      `Message: ${data.get("message")}`,
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  const fieldProps = (name: ContactField) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onChange: () => setErrors((current) => ({ ...current, [name]: undefined })),
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2>Send an enquiry on WhatsApp</h2>
      <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className={styles.stack}>
        <Field label="Full Name" htmlFor="contact-fullName" required error={errors.fullName}>
          <input id="contact-fullName" name="fullName" autoComplete="name" required {...fieldProps("fullName")} />
        </Field>
        <Field label="Phone Number" htmlFor="contact-phone" required error={errors.phone}>
          <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps("phone")} />
        </Field>
        <Field label="Message" htmlFor="contact-message" required error={errors.message}>
          <textarea id="contact-message" name="message" placeholder="How can JK_AUTOS help?" required {...fieldProps("message")} />
        </Field>
        <ActionButton type="submit" fullWidth>Continue on WhatsApp</ActionButton>
        <p className={styles.note}>Your details are saved so JK_AUTOS can follow up, then WhatsApp opens with your message.</p>
        <p className={styles.status} role="status" aria-live="polite">{status}</p>
      </div>
    </form>
  );
}
