"use client";

import { useState } from "react";

import styles from "./admin.module.css";

export function FilterChips({ items, label = "Filter" }: { items: readonly string[]; label?: string }) {
  const [active, setActive] = useState(items[0]);
  return (
    <div className={styles.toolbar} role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item} type="button" className={styles.chip} aria-current={item === active ? "true" : undefined} onClick={() => setActive(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}
