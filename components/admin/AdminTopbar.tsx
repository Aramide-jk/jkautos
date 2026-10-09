"use client";

import type { ReactNode } from "react";

import { useAdminShell } from "./AdminShell";
import styles from "./admin.module.css";

export function AdminTopbar({ title, children }: { title: string; children?: ReactNode }) {
  const { open, toggle } = useAdminShell();
  return (
    <header className={styles.topbar}>
      <button className={styles.menuToggle} type="button" aria-expanded={open} aria-controls="admin-sidebar" onClick={toggle}>
        <span className="visuallyHidden">Open menu</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <h1>{title}</h1>
      <div className={styles.spacer} />
      {children}
    </header>
  );
}

export function AdminSearch({ placeholder, label }: { placeholder: string; label: string }) {
  return (
    <label className={styles.search}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>
      <input type="search" placeholder={placeholder} aria-label={label} />
    </label>
  );
}
