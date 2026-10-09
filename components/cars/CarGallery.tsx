"use client";

import { useState } from "react";

import { FadeImage } from "@/components/ui/FadeImage";
import type { Car } from "@/types";

import styles from "./CarGallery.module.css";

export function CarGallery({ car }: { car: Car }) {
  const [selected, setSelected] = useState(0);
  const labels = ["front exterior view", "interior and dashboard", "rear exterior view"];
  const image = car.images[selected] ?? car.image;

  return (
    <div className={styles.gallery} aria-label="Vehicle photo gallery">
      <div className={styles.main}>
        <FadeImage src={image} alt={selected === 0 ? car.alt : `${car.name} ${labels[selected] ?? `view ${selected + 1}`}`} fill priority sizes="(max-width: 1024px) 100vw, 760px" />
        {car.imageNote ? <span className={styles.note}>{car.imageNote}</span> : null}
      </div>
      {car.images.length > 1 ? (
        <div className={styles.thumbnails} role="group" aria-label="Choose vehicle photo">
          {car.images.map((src, index) => (
            <button key={src} className={`${styles.thumbnail} ${index === selected ? styles.active : ""}`} type="button" onClick={() => setSelected(index)} aria-pressed={index === selected}>
              <FadeImage src={src} alt="" fill sizes="220px" />
              <span className="visuallyHidden">Show {labels[index] ?? `view ${index + 1}`}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
