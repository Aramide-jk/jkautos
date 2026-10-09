import { FadeImage } from "@/components/ui/FadeImage";

import { ActionLink } from "@/components/ui/ActionLink";
import type { Car } from "@/types";

import styles from "./CarCard.module.css";

type CarCardProps = {
  car: Car;
  priority?: boolean;
  imageNote?: string;
};

export function CarCard({ car, priority = false, imageNote = car.imageNote }: CarCardProps) {
  const detailsUrl = `/cars/${car.slug}`;

  return (
    <article className={styles.card}>
      <a className={styles.image} href={detailsUrl} aria-label={`View ${car.name} details`}>
        <FadeImage src={car.image} alt={car.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1248px) 50vw, 400px" priority={priority} />
        {imageNote ? <span className={styles.imageNote}>{imageNote}</span> : null}
      </a>
      <div className={styles.body}>
        <h2 className={styles.title}><a href={detailsUrl}>{car.name}</a></h2>
        <p className={styles.summary}>
          <span>{car.year}</span><span className={styles.divider} aria-hidden="true">|</span><span>{car.mileage}</span>
        </p>
        <p className={styles.price}>{car.priceLabel}</p>
        <ul className={styles.specs} aria-label={`${car.name} specifications`}>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M5 21h12M8 7h6v4H8zM16 8h2l2 2v7a2 2 0 0 1-4 0v-3" /></svg>
            <span>{car.fuel}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v7M12 15v7M2 12h7M15 12h7" /></svg>
            <span>{car.transmission}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <span>{car.location}</span>
          </li>
        </ul>
        <div className={styles.actions}>
          <ActionLink href={detailsUrl}>View Details</ActionLink>
          <ActionLink className={styles.book} href={`${detailsUrl}/book-inspection`} variant="secondary">Book Inspection</ActionLink>
        </div>
      </div>
    </article>
  );
}
