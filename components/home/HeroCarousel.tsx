"use client";

import { useEffect, useRef, useState } from "react";

import { ActionLink } from "@/components/ui/ActionLink";

import styles from "./HeroCarousel.module.css";

type Slide = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  position: string;
};

const slides: readonly Slide[] = [
  {
    eyebrow: "Premium car brokerage",
    title: "Find Your Next Car",
    accent: "with Confidence",
    intro:
      "Quality vehicles, straightforward inspections, and direct WhatsApp support.",
    image: "/assets/hero-suv.png",
    position: "68% center",
  },
  {
    eyebrow: "Inspect before you buy",
    title: "See It in Person",
    accent: "Decide with Clarity",
    intro:
      "Book an inspection and review the vehicle and its documents before you commit.",
    image: "/assets/hero-sedan-dusk.png",
    position: "70% center",
  },
  {
    eyebrow: "Sourcing & selling",
    title: "Can't Find It?",
    accent: "We'll Source It",
    intro:
      "Tell us the car you want — or sell yours — through a direct WhatsApp conversation.",
    image: "/assets/car-gle.png",
    position: "center",
  },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const paused = engaged || !inView || hidden;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const element = sectionRef.current;
    let observer: IntersectionObserver | undefined;
    if (element && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) setInView(entry.isIntersecting);
        },
        { threshold: 0.2 },
      );
      observer.observe(element);
    }
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const slide = slides[index];

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      role="region"
      aria-roledescription="carousel"
      aria-label="JK_AUTOS highlights"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setEngaged(false);
      }}
    >
      <div className={styles.images} aria-hidden="true">
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((item) => (
            <div
              key={item.image}
              className={styles.image}
              style={{
                backgroundImage: `url("${item.image}")`,
                backgroundPosition: item.position,
              }}
            />
          ))}
        </div>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div key={index} className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>{slide.eyebrow}</p>
          <h1 className={`displayTitle ${styles.title}`} id="hero-title">
            {slide.title} <span>{slide.accent}</span>
          </h1>
          <p className={styles.intro}>{slide.intro}</p>
          <div className={styles.actions}>
            <ActionLink href="/cars">
              Browse Cars <span aria-hidden="true">→</span>
            </ActionLink>
            <ActionLink href="/request-car" variant="light">
              Request a Car
            </ActionLink>
          </div>
        </div>
        <div
          className={styles.indicators}
          role="group"
          aria-label="Hero slides"
        >
          {slides.map((item, i) => (
            <button
              key={item.image}
              type="button"
              className={
                i === index
                  ? `${styles.indicator} ${styles.indicatorActive}`
                  : styles.indicator
              }
              aria-label={`Show slide ${i + 1} of ${slides.length}: ${item.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
