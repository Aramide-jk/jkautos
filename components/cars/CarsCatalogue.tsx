"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { CarCard } from "@/components/cars/CarCard";
import { ActionButton } from "@/components/ui/ActionButton";
import { ActionLink } from "@/components/ui/ActionLink";
import type { Car } from "@/types";

import styles from "./CarsCatalogue.module.css";

type CarsCatalogueProps = {
  cars: readonly Car[];
  initialQuery?: Readonly<Record<string, string>>;
};
type Filters = {
  search: string;
  make: string;
  model: string;
  year: string;
  price: string;
  condition: string;
  transmission: string;
  location: string;
};

const EMPTY_FILTERS: Filters = {
  search: "",
  make: "",
  model: "",
  year: "",
  price: "",
  condition: "",
  transmission: "",
  location: "",
};

const INITIAL_COUNT = 3;

function carMake(car: Car) {
  return car.name.replace(/^\d{4}\s+/, "").split(" ")[0];
}

function matchesPrice(car: Car, price: string) {
  if (!price) return true;
  if (price === "under-15m") return car.price < 15_000_000;
  if (price === "15m-30m")
    return car.price >= 15_000_000 && car.price <= 30_000_000;
  if (price === "30m-50m")
    return car.price > 30_000_000 && car.price <= 50_000_000;
  return car.price > 50_000_000;
}

export function CarsCatalogue({ cars, initialQuery = {} }: CarsCatalogueProps) {
  const [filters, setFilters] = useState<Filters>(() => ({
    search: initialQuery.search ?? "",
    make: initialQuery.make ?? "",
    model: initialQuery.model ?? "",
    year: initialQuery.year ?? "",
    price: initialQuery.price ?? initialQuery.budget ?? "",
    condition: initialQuery.condition ?? "",
    transmission: initialQuery.transmission ?? "",
    location: initialQuery.location ?? "",
  }));
  const [sort, setSort] = useState(initialQuery.sort ?? "newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/cars?${query}` : "/cars");
  }, [filters, sort]);

  const makes = useMemo(() => [...new Set(cars.map(carMake))].sort(), [cars]);
  const years = useMemo(
    () => [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a),
    [cars],
  );
  const locations = useMemo(
    () => [...new Set(cars.map((car) => car.location))].sort(),
    [cars],
  );

  const results = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const model = filters.model.trim().toLowerCase();
    return cars
      .filter((car) => {
        const make = carMake(car);
        const modelName = car.name.replace(/^\d{4}\s+\S+\s*/, "");
        const haystack =
          `${car.name} ${car.condition} ${car.location} ${car.colour}`.toLowerCase();
        return (
          (!query || haystack.includes(query)) &&
          (!filters.make || make === filters.make) &&
          (!model || modelName.toLowerCase().includes(model)) &&
          (!filters.year || car.year === Number(filters.year)) &&
          matchesPrice(car, filters.price) &&
          (!filters.condition || car.condition === filters.condition) &&
          (!filters.transmission ||
            car.transmission === filters.transmission) &&
          (!filters.location || car.location === filters.location)
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "year-high") return b.year - a.year;
        return Date.parse(b.addedAt) - Date.parse(a.addedAt);
      });
  }, [cars, filters, sort]);

  const shown = results.slice(0, visibleCount);
  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );
  const filterFormProps = { filters, updateFilter, makes, years, locations };

  function updateFilter(name: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
    setVisibleCount(INITIAL_COUNT);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSort("newest");
    setVisibleCount(INITIAL_COUNT);
  }

  function openFilters() {
    dialogRef.current?.showModal();
  }

  function closeFilters() {
    dialogRef.current?.close();
  }

  return (
    <main id="main-content">
      <section className={styles.heading}>
        <div className={`container ${styles.headingInner}`}>
          <div>
            {/* <p className="eyebrow">Current inventory</p> */}
            <h1 className="displayTitle">Available Cars</h1>
            {/* <p>Explore quality vehicles available through JK_AUTOS in Kaduna.</p> */}
          </div>
          <p className={styles.resultCount} aria-live="polite">
            {results.length} {results.length === 1 ? "car" : "cars"} available
          </p>
        </div>
      </section>

      <section className={styles.catalogue} aria-label="Search and browse cars">
        <div className={`container ${styles.layout}`}>
          <aside className={styles.filters} aria-labelledby="filter-title">
            <div className={styles.filterHeading}>
              <h2 id="filter-title">Refine your search</h2>
              <button
                type="button"
                className={styles.clear}
                onClick={resetFilters}
              >
                Clear all
              </button>
            </div>
            <FiltersForm idPrefix="desktop-" {...filterFormProps} />
          </aside>

          <div className={styles.results}>
            <div className={styles.toolbar}>
              <button
                type="button"
                className={styles.filtersTrigger}
                onClick={openFilters}
                aria-haspopup="dialog"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M7 12h10M10 17h4" />
                </svg>
                <span>Filters</span>
                {activeFilterCount ? (
                  <span className={styles.filterBadge}>
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              <p>
                {results.length
                  ? `Showing ${shown.length} of ${results.length} available ${results.length === 1 ? "car" : "cars"}`
                  : "No matching vehicles"}
              </p>
              <FilterField label="Sort by" htmlFor="sort" inline>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="year-high">Year: newest first</option>
                </select>
              </FilterField>
            </div>
            {shown.length ? (
              <div className={styles.grid}>
                {shown.map((car, index) => (
                  <CarCard car={car} priority={index < 2} key={car.slug} />
                ))}
              </div>
            ) : (
              <div className={styles.empty} role="status">
                <h2>No cars match those filters.</h2>
                <p>
                  Try clearing a filter or send JK_AUTOS a request for the exact
                  vehicle you need.
                </p>
                <div className={styles.emptyActions}>
                  <ActionButton variant="secondary" onClick={resetFilters}>
                    Clear filters
                  </ActionButton>
                  <ActionLink href="/request-car">Request a Car</ActionLink>
                </div>
              </div>
            )}
            {results.length ? (
              <div className={styles.loadMore}>
                <ActionButton
                  variant="secondary"
                  disabled={shown.length >= results.length}
                  onClick={() =>
                    setVisibleCount((count) => count + INITIAL_COUNT)
                  }
                >
                  {shown.length >= results.length
                    ? "All Cars Shown"
                    : "Load More"}
                </ActionButton>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <div className={styles.requestStrip}>
        <div className="container">
          <p>Can’t find the exact car you need?</p>
          <Link href="/request-car">
            Request a car for sourcing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <dialog
        className={styles.searchDialog}
        ref={dialogRef}
        aria-labelledby="catalogue-filter-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeFilters();
        }}
      >
        <div className={styles.searchSheet}>
          <div className={styles.sheetHandle} aria-hidden="true" />
          <header className={styles.sheetHeader}>
            <h2 id="catalogue-filter-title">Refine your search</h2>
            <button
              type="button"
              onClick={closeFilters}
              aria-label="Close filters"
            >
              ×
            </button>
          </header>
          <FiltersForm idPrefix="mobile-" {...filterFormProps} />
          <div className={styles.sheetActions}>
            <ActionButton variant="secondary" onClick={resetFilters}>
              Clear all
            </ActionButton>
            <ActionButton
              onClick={closeFilters}
            >{`Show ${results.length} ${results.length === 1 ? "car" : "cars"}`}</ActionButton>
          </div>
        </div>
      </dialog>
    </main>
  );
}

function FiltersForm({
  idPrefix,
  filters,
  updateFilter,
  makes,
  years,
  locations,
}: {
  idPrefix: string;
  filters: Filters;
  updateFilter: (name: keyof Filters, value: string) => void;
  makes: readonly string[];
  years: readonly number[];
  locations: readonly string[];
}) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FilterField label="Search cars" htmlFor={`${idPrefix}search`}>
        <input
          id={`${idPrefix}search`}
          type="search"
          placeholder="Make, model or keyword"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </FilterField>
      <div className={styles.filterGrid}>
        <FilterField label="Make" htmlFor={`${idPrefix}make`}>
          <select
            id={`${idPrefix}make`}
            value={filters.make}
            onChange={(event) => updateFilter("make", event.target.value)}
          >
            <option value="">All makes</option>
            {makes.map((make) => (
              <option key={make}>{make}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Model" htmlFor={`${idPrefix}model`}>
          <input
            id={`${idPrefix}model`}
            type="search"
            placeholder="Any model"
            value={filters.model}
            onChange={(event) => updateFilter("model", event.target.value)}
          />
        </FilterField>
        <FilterField label="Year" htmlFor={`${idPrefix}year`}>
          <select
            id={`${idPrefix}year`}
            value={filters.year}
            onChange={(event) => updateFilter("year", event.target.value)}
          >
            <option value="">Any year</option>
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Price" htmlFor={`${idPrefix}price`}>
          <select
            id={`${idPrefix}price`}
            value={filters.price}
            onChange={(event) => updateFilter("price", event.target.value)}
          >
            <option value="">Any price</option>
            <option value="under-15m">Under ₦15m</option>
            <option value="15m-30m">₦15m – ₦30m</option>
            <option value="30m-50m">₦30m – ₦50m</option>
            <option value="over-50m">Above ₦50m</option>
          </select>
        </FilterField>
        <FilterField label="Condition" htmlFor={`${idPrefix}condition`}>
          <select
            id={`${idPrefix}condition`}
            value={filters.condition}
            onChange={(event) => updateFilter("condition", event.target.value)}
          >
            <option value="">Any condition</option>
            <option>Foreign Used</option>
            <option>Nigerian Used</option>
            <option>Brand New</option>
          </select>
        </FilterField>
        <FilterField label="Transmission" htmlFor={`${idPrefix}transmission`}>
          <select
            id={`${idPrefix}transmission`}
            value={filters.transmission}
            onChange={(event) =>
              updateFilter("transmission", event.target.value)
            }
          >
            <option value="">Any transmission</option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </FilterField>
        <FilterField label="Location" htmlFor={`${idPrefix}location`}>
          <select
            id={`${idPrefix}location`}
            value={filters.location}
            onChange={(event) => updateFilter("location", event.target.value)}
          >
            <option value="">Any location</option>
            {locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </FilterField>
      </div>
    </form>
  );
}

function FilterField({
  label,
  htmlFor,
  inline = false,
  children,
}: {
  label: string;
  htmlFor: string;
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={inline ? styles.fieldInline : styles.field}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
