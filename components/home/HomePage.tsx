import Link from "next/link";

import { CarCard } from "@/components/cars/CarCard";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Car } from "@/types";

import styles from "./HomePage.module.css";
import { HeroCarousel } from "./HeroCarousel";
import { MobileCarSearch } from "./MobileCarSearch";

const valuePoints = [
  [
    "Verified Listings",
    "Carefully presented vehicle information so you can shortlist with clarity.",
  ],
  [
    "Easy Inspection Booking",
    "Choose a vehicle and start arranging your inspection directly on WhatsApp.",
  ],
  [
    "Direct WhatsApp Support",
    "Speak with JK_AUTOS without accounts, inboxes, or unnecessary steps.",
  ],
  [
    "Car Sourcing Assistance",
    "Tell us what you need and we’ll help search for a suitable option.",
  ],
] as const;

const brands = [
  ["Toyota", "Reliable everyday choices"],
  ["Lexus", "Refined comfort"],
  ["Mercedes-Benz", "Modern luxury"],
  ["Honda", "Smart and practical"],
] as const;

const priceRanges = [
  ["Under ₦15m", "under-15m"],
  ["₦15m – ₦30m", "15m-30m"],
  ["₦30m – ₦50m", "30m-50m"],
  ["Above ₦50m", "over-50m"],
] as const;

export function HomePage({ featuredCars }: { featuredCars: readonly Car[] }) {
  return (
    <main id="main-content">
      <HeroCarousel />

      <section className={styles.searchSection} aria-labelledby="search-title">
        <div className={`container ${styles.searchPanel}`}>
          <div className={styles.searchIntro}>
            <p className="eyebrow">Quick search</p>
            <h2 id="search-title">Start with what matters to you.</h2>
          </div>
          <form className={styles.vehicleSearch} action="/cars" method="get">
            <div className={styles.field}>
              <label htmlFor="search-make">Make</label>
              <select id="search-make" name="make" defaultValue="">
                <option value="">Any make</option>
                <option value="Toyota">Toyota</option>
                <option value="Lexus">Lexus</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="search-model">Model</label>
              <input
                id="search-model"
                name="model"
                type="search"
                placeholder="e.g. Camry"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="search-budget">Budget</label>
              <select id="search-budget" name="budget" defaultValue="">
                <option value="">Any budget</option>
                {priceRanges.map(([label, value]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="search-location">Location</label>
              <select
                id="search-location"
                name="location"
                defaultValue="Kaduna"
              >
                <option value="">Any location</option>
                <option value="Kaduna">Kaduna</option>
                <option value="Abuja">Abuja</option>
                <option value="Lagos">Lagos</option>
              </select>
            </div>
            <button className={styles.searchSubmit} type="submit">
              Search Cars <span aria-hidden="true">→</span>
            </button>
          </form>
          <MobileCarSearch />
        </div>
      </section>

      <section className={styles.confidenceStrip} aria-label="Our approach">
        <div className={`container ${styles.confidenceGrid}`}>
          <p>
            <span>01</span> Find the right car.
          </p>
          <p>
            <span>02</span> Inspect it.
          </p>
          <p>
            <span>03</span> Make your decision confidently.
          </p>
        </div>
      </section>

      <Reveal>
        <section
          className={styles.featuredSection}
          aria-labelledby="featured-title"
        >
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Available now</p>
                <h2
                  className={`sectionTitle ${styles.featuredTitle}`}
                  id="featured-title"
                >
                  Featured Cars <span>/ Latest Arrivals</span>
                </h2>
                <p className="sectionCopy">
                  Handpicked quality vehicles, inspected for your peace of mind.
                </p>
              </div>
              <Link className={styles.editorialLink} href="/cars">
                View all cars <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.vehicleGrid}>
              {featuredCars.map((car, index) => (
                <CarCard car={car} priority={index === 0} key={car.slug} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.valueSection} aria-labelledby="value-title">
          <div className={`container ${styles.valueLayout}`}>
            <div className={styles.valueIntro}>
              <p className="eyebrow">Why JK_AUTOS</p>
              <h2 id="value-title">Buy smart. Drive safe.</h2>
            </div>
            <ol className={styles.valueList}>
              {valuePoints.map(([title, copy], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          className={styles.discoverySection}
          aria-labelledby="browse-title"
        >
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <p className="eyebrow">Explore your way</p>
                <h2 className="sectionTitle" id="browse-title">
                  Browse the collection
                </h2>
              </div>
            </div>
            <div className={styles.discoveryGrid}>
              <div>
                <h3>Browse by brand</h3>
                <div className={styles.brandLinks}>
                  {brands.map(([brand, copy]) => (
                    <Link
                      href={`/cars?make=${encodeURIComponent(brand)}`}
                      key={brand}
                    >
                      <span>{brand}</span>
                      <small>{copy}</small>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3>Browse by price range</h3>
                <div className={styles.priceLinks}>
                  {priceRanges.map(([label, value]) => (
                    <Link href={`/cars?budget=${value}`} key={value}>
                      <span>{label}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.ctaSection} aria-label="JK_AUTOS services">
          <div className={`container ${styles.ctaGrid}`}>
            <article className={`${styles.serviceCta} ${styles.requestCta}`}>
              <p className="eyebrow">Looking for a specific car?</p>
              <h2 className="sectionTitle">Request a Car</h2>
              <p>
                Can’t find the car you’re looking for? Let us source it for you
                through our trusted network.
              </p>
              <ActionLink href="/request-car">
                Request a Car <span aria-hidden="true">→</span>
              </ActionLink>
            </article>
            <article className={`${styles.serviceCta} ${styles.sellCta}`}>
              <p className="eyebrow">Want to sell your car?</p>
              <h2 className="sectionTitle">Sell Your Car</h2>
              <p>
                Get a fair offer and let us handle the process. It’s quick, easy
                and hassle-free.
              </p>
              <ActionLink href="/sell-car">
                Sell Your Car <span aria-hidden="true">→</span>
              </ActionLink>
            </article>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          className={styles.whatsappBand}
          aria-labelledby="whatsapp-title"
        >
          <div className={`container ${styles.whatsappInner}`}>
            <div>
              <p className="eyebrow">Prefer to talk?</p>
              <h2 className="sectionTitle" id="whatsapp-title">
                Your next conversation can start on WhatsApp.
              </h2>
              <p>
                Ask about an available car, arrange an inspection, or tell us
                what you’re looking for.
              </p>
            </div>
            <ActionLink
              href={buildWhatsAppUrl(
                "Hello JK_AUTOS, I would like to speak with you about buying a car.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Chat with JK_AUTOS <span aria-hidden="true">↗</span>
            </ActionLink>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
