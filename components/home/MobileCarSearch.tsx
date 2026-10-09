"use client";

import { useRef } from "react";

import styles from "./HomePage.module.css";

const priceRanges = [
  ["Under ₦15m", "under-15m"],
  ["₦15m – ₦30m", "15m-30m"],
  ["₦30m – ₦50m", "30m-50m"],
  ["Above ₦50m", "over-50m"],
] as const;

export function MobileCarSearch() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openFilters() {
    dialogRef.current?.showModal();
  }

  function closeFilters() {
    dialogRef.current?.close();
  }

  return (
    <div className={styles.mobileSearch}>
      <button className={styles.mobileSearchTrigger} type="button" onClick={openFilters} aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M7 14v6" />
        </svg>
        <span><strong>Search Cars</strong><small>Make, Model, Budget, Location</small></span>
        <span className={styles.triggerArrow} aria-hidden="true">›</span>
      </button>

      <dialog
        className={styles.searchDialog}
        ref={dialogRef}
        aria-labelledby="mobile-search-title"
        onClick={(event) => { if (event.target === event.currentTarget) closeFilters(); }}
      >
        <div className={styles.searchSheet}>
          <div className={styles.sheetHandle} aria-hidden="true" />
          <header className={styles.sheetHeader}>
            <h2 id="mobile-search-title">Search Cars</h2>
            <button type="button" onClick={closeFilters} aria-label="Close car filters">×</button>
          </header>
          <form className={styles.mobileFilterForm} action="/cars" method="get">
            <div className={styles.field}>
              <label htmlFor="mobile-search-make">Make</label>
              <select id="mobile-search-make" name="make" defaultValue=""><option value="">Any make</option><option value="Toyota">Toyota</option><option value="Lexus">Lexus</option><option value="Mercedes-Benz">Mercedes-Benz</option><option value="Honda">Honda</option><option value="Ford">Ford</option><option value="Hyundai">Hyundai</option></select>
            </div>
            <div className={styles.field}>
              <label htmlFor="mobile-search-model">Model</label>
              <input id="mobile-search-model" name="model" type="search" placeholder="e.g. Camry" />
            </div>
            <div className={styles.field}>
              <label htmlFor="mobile-search-budget">Budget</label>
              <select id="mobile-search-budget" name="budget" defaultValue=""><option value="">Any budget</option>{priceRanges.map(([label, value]) => <option value={value} key={value}>{label}</option>)}</select>
            </div>
            <div className={styles.field}>
              <label htmlFor="mobile-search-location">Location</label>
              <select id="mobile-search-location" name="location" defaultValue="Kaduna"><option value="">Any location</option><option value="Kaduna">Kaduna</option><option value="Abuja">Abuja</option><option value="Lagos">Lagos</option></select>
            </div>
            <button className={styles.sheetSubmit} type="submit">Search Cars <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
