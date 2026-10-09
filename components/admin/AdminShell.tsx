"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

import { signOutAction } from "@/app/admin/actions";

import styles from "./admin.module.css";

type ShellContextValue = { open: boolean; toggle: () => void; close: () => void };
const ShellContext = createContext<ShellContextValue | null>(null);

export function useAdminShell() {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useAdminShell must be used inside AdminShell");
  return context;
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/leads", label: "Leads", icon: "inbox" },
  { href: "/admin/cars", label: "Inventory", icon: "car" },
] as const;

function NavIcon({ name }: { name: string }) {
  if (name === "grid") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>;
  }
  if (name === "inbox") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" /><path d="M4 13h4l2 2h4l2-2h4" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16v-2l1.5-4.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 14v2" /><circle cx="8" cy="16.5" r="1.5" /><circle cx="16" cy="16.5" r="1.5" /><path d="M5 14h14" /></svg>;
}

export function AdminShell({ children, newLeads = 0 }: { children: ReactNode; newLeads?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const value: ShellContextValue = { open, toggle: () => setOpen((current) => !current), close: () => setOpen(false) };

  return (
    <ShellContext.Provider value={value}>
      <a className="skipLink" href="#admin-content">Skip to content</a>
      <div className={styles.shell}>
        <aside id="admin-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`} aria-label="Admin">
          <Link className={styles.brand} href="/admin" aria-label="JK_AUTOS admin home">
            <Image src="/assets/jkautos-logo.png" alt="JK_AUTOS" width={144} height={81} />
          </Link>
          <nav aria-label="Admin sections">
            <ul className={styles.nav}>
              {NAV.map((item) => {
                const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
                const badge = item.href === "/admin/leads" && newLeads > 0 ? newLeads : null;
                return (
                  <li key={item.href}>
                    <Link className={styles.navLink} href={item.href} aria-current={active ? "page" : undefined} onClick={value.close}>
                      <NavIcon name={item.icon} />
                      {item.label}
                      {badge ? <span className={styles.navCount}>{badge}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={styles.sidebarFoot}>
            <Link className={styles.navLink} href="/" onClick={value.close}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5" /><path d="M19 5l-7 7" /><path d="M18 14v5H5V6h5" /></svg>
              View site
            </Link>
            <div className={styles.user}><span className={styles.avatar}>S</span>admin@jkautos.com.ng</div>
            <form action={signOutAction}>
              <button className={styles.navButton} type="submit">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6v14h4" /><path d="M15 12H9" /><path d="m18 9 3 3-3 3" /></svg>
                Sign out
              </button>
            </form>
          </div>
        </aside>
        {open ? <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" /> : null}
        <div className={styles.arena}>{children}</div>
      </div>
    </ShellContext.Provider>
  );
}
