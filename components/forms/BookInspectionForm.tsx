"use client";

import { useState, type FormEvent } from "react";

import { ActionButton } from "@/components/ui/ActionButton";
import { Field } from "@/components/ui/Field";
import { submitLead } from "@/lib/leads/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidPhone } from "@/lib/validation";
import type { Car } from "@/types";

import styles from "./BookInspectionForm.module.css";

type Values = { name: string; phone: string; date: string; time: string; location: string; note: string };
type Errors = Partial<Record<keyof Values, string>>;
const EMPTY_VALUES: Values = { name: "", phone: "", date: "", time: "", location: "", note: "" };

export function BookInspectionForm({ car }: { car: Car }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});

  function update(name: keyof Values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your full name.";
    if (!values.phone.trim()) next.phone = "Enter your phone number.";
    else if (!isValidPhone(values.phone)) next.phone = "Enter a valid phone number.";
    if (!values.date) next.date = "Choose your preferred date.";
    if (!values.time) next.time = "Choose your preferred time.";
    if (!values.location.trim()) next.location = "Enter your location.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    await submitLead({
      type: "inspection",
      name: values.name.trim(),
      phone: values.phone.trim(),
      carSlug: car.slug,
      carName: car.name,
      date: values.date,
      time: values.time,
      location: values.location.trim(),
      note: values.note.trim(),
    });
    const message = [
      "Hello JK_AUTOS, I would like to book an inspection.", "", `Car: ${car.name}`, `Price: ${car.priceLabel}`,
      `Name: ${values.name.trim()}`, `Phone: ${values.phone.trim()}`, `Preferred date: ${values.date}`,
      `Preferred time: ${values.time}`, `Location: ${values.location.trim()}`, `Note: ${values.note.trim() || "None"}`,
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className="eyebrow">{car.name}</p>
          <h1 className="displayTitle">Book an inspection</h1>
          <p className="sectionCopy">Choose a convenient date and time. We’ll prepare your details for a direct WhatsApp conversation with JK_AUTOS.</p>
        </div>
      </section>
      <section className={`section ${styles.section}`}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.panel}>
            <h2>Your inspection details</h2>
            <p>Fields marked <span aria-hidden="true">*</span> are required. Your details are saved so JK_AUTOS can follow up.</p>
            <form noValidate onSubmit={submit}>
              <div className={styles.grid}>
                <Field label="Full name" htmlFor="inspection-name" required error={errors.name}><input id="inspection-name" name="name" type="text" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "inspection-name-error" : undefined} /></Field>
                <Field label="Phone number" htmlFor="inspection-phone" required error={errors.phone}><input id="inspection-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "inspection-phone-error" : undefined} /></Field>
                <Field label="Preferred date" htmlFor="inspection-date" required error={errors.date}><input id="inspection-date" name="date" type="date" value={values.date} onChange={(event) => update("date", event.target.value)} required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "inspection-date-error" : undefined} /></Field>
                <Field label="Preferred time" htmlFor="inspection-time" required error={errors.time}><input id="inspection-time" name="time" type="time" value={values.time} onChange={(event) => update("time", event.target.value)} required aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? "inspection-time-error" : undefined} /></Field>
                <div className={styles.full}><Field label="Your location" htmlFor="inspection-location" required error={errors.location}><input id="inspection-location" name="location" type="text" autoComplete="address-level2" placeholder="e.g. Barnawa, Kaduna" value={values.location} onChange={(event) => update("location", event.target.value)} required aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "inspection-location-error" : undefined} /></Field></div>
                <div className={styles.full}><Field label="Additional note" htmlFor="inspection-note" optional><textarea id="inspection-note" name="note" placeholder="Anything you would like us to know?" value={values.note} onChange={(event) => update("note", event.target.value)} /></Field></div>
              </div>
              <div className={styles.actions}><p>Submitting opens WhatsApp with your details. You choose whether to send the message.</p><ActionButton type="submit">Continue on WhatsApp</ActionButton></div>
            </form>
          </div>
          <aside className={styles.aside} aria-labelledby="inspection-process-title">
            <p className="eyebrow">Simple and direct</p>
            <h2 id="inspection-process-title">What happens next</h2>
            <ol><li><span>Enter your preferred inspection details.</span></li><li><span>Continue to WhatsApp with a prepared message.</span></li><li><span>JK_AUTOS confirms the appointment with you.</span></li></ol>
            <div className={styles.carSummary}><span>Vehicle</span><strong>{car.name}</strong><span>{car.priceLabel} · {car.location}</span></div>
          </aside>
        </div>
      </section>
    </>
  );
}
