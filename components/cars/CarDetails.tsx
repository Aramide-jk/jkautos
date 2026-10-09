"use client";

import Link from "next/link";
import { useState } from "react";

import { CarCard } from "@/components/cars/CarCard";
import { CarGallery } from "@/components/cars/CarGallery";
import { ActionLink } from "@/components/ui/ActionLink";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Car } from "@/types";

import styles from "./CarDetails.module.css";

type CarDetailsProps = { car: Car; relatedCars: readonly Car[] };

export function CarDetails({ car, relatedCars }: CarDetailsProps) {
  const [shareStatus, setShareStatus] = useState("");
  const bookingUrl = `/cars/${car.slug}/book-inspection`;
  const chatUrl = buildWhatsAppUrl(
    `Hello JK_AUTOS, I’m interested in the ${car.name} listed for ${car.priceLabel}. Is it still available?`,
  );

  async function shareCar() {
    setShareStatus("");
    const shareData = {
      title: `${car.name} | JK_AUTOS`,
      text: `${car.name} — ${car.priceLabel} from JK_AUTOS.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Share options opened.");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Car link copied.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(
        "Copy the page address from your browser to share this car.",
      );
    }
  }

  const specs = [
    ["Year", String(car.year)],
    ["Mileage", car.mileage],
    ["Transmission", car.transmission],
    ["Fuel", car.fuel],
    ["Condition", car.condition],
    ["Location", car.location],
    ["Colour", car.colour],
  ];

  return (
    <main id="main-content" className={styles.page}>
      <div className={`container ${styles.breadcrumb}`}>
        <Link href="/cars">Available Cars</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{car.name}</span>
      </div>
      <section className={styles.overview} aria-labelledby="vehicle-title">
        <div className={`container ${styles.detailGrid}`}>
          <CarGallery car={car} />
          <div className={styles.summary}>
            <div className={styles.topline}>
              <span className={styles.available}>Available</span>
              <span>{car.slug.toUpperCase().slice(0, 10)}</span>
            </div>
            <h1 className="displayTitle" id="vehicle-title">
              {car.name}
            </h1>
            <p className={styles.price}>{car.priceLabel}</p>
            {car.imageNote ? (
              <p>
                <strong>{car.imageNote}:</strong> the displayed photo
                illustrates the vehicle type and is not the listed car.
              </p>
            ) : null}
            <dl className={styles.specs}>
              {specs.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.actions}>
              <ActionLink href={bookingUrl} fullWidth>
                Book Inspection
              </ActionLink>
              <ActionLink
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                fullWidth
              >
                Chat about this car
              </ActionLink>
            </div>
            <button className={styles.share} type="button" onClick={shareCar}>
              <span aria-hidden="true">↗</span> Share Car
            </button>
            <p
              className={styles.shareFeedback}
              role="status"
              aria-live="polite"
            >
              {shareStatus}
            </p>
          </div>
        </div>
      </section>

      <section
        className={`section ${styles.information}`}
        aria-label="Vehicle information"
      >
        <div className={`container ${styles.informationGrid}`}>
          <article>
            <p className="eyebrow">Overview</p>
            <h2 className="sectionTitle">
              Confident, refined and ready to inspect.
            </h2>
            <p>{car.description}</p>
            <p>
              Arrange an inspection to review the vehicle and its documentation
              in person before making your decision.
            </p>
          </article>
          <article className={styles.features}>
            <p className="eyebrow">Important features</p>
            <h2 className="sectionTitle">Vehicle highlights</h2>
            <ul>
              {car.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        className={`sectionDark ${styles.callout}`}
        aria-labelledby="inspection-callout-title"
      >
        <div className={`container ${styles.calloutInner}`}>
          <div>
            <p className="eyebrow">See it for yourself</p>
            <h2 className="sectionTitle" id="inspection-callout-title">
              Book a convenient inspection.
            </h2>
            <p>
              Share your preferred date and time, then continue the conversation
              directly with JK_AUTOS on WhatsApp.
            </p>
          </div>
          <ActionLink href={bookingUrl}>Book Inspection</ActionLink>
        </div>
      </section>

      {relatedCars.length ? (
        <section
          className={`section ${styles.related}`}
          aria-labelledby="related-title"
        >
          <div className="container">
            <div className={styles.relatedHeading}>
              <div>
                <p className="eyebrow">More to explore</p>
                <h2 className="sectionTitle" id="related-title">
                  You may also like
                </h2>
              </div>
              <Link href="/cars">
                View all cars <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {relatedCars.map((item) => (
                <CarCard key={item.slug} car={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.mobileActions} aria-label="Vehicle actions">
        <ActionLink href={bookingUrl}>Book Inspection</ActionLink>
        <ActionLink
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
        >
          WhatsApp
        </ActionLink>
      </div>
    </main>
  );
}
