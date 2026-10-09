"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ActionLink } from "@/components/ui/ActionLink";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import styles from "./SiteHeader.module.css";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/request-car", label: "Request a Car" },
  { href: "/sell-car", label: "Sell Your Car" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`${styles.header} ${pathname === "/" ? styles.homeHeader : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label="JK_AUTOS home">
          <Image src="/assets/jkautos-logo.png" alt="JK_AUTOS" width={190} height={107} priority />
        </Link>
        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="visuallyHidden">{open ? "Close navigation" : "Open navigation"}</span>
          <span className={styles.toggleLines} aria-hidden="true" />
        </button>
        <nav
          className={`${styles.nav} ${open ? styles.open : ""}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          <div className={styles.links}>
            {navigation.map((item, index) => (
              <Link
                className={styles.navLink}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={() => setOpen(false)}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <ActionLink
            className={styles.whatsapp}
            href={buildWhatsAppUrl("Hello JK_AUTOS, I would like to enquire about your available cars.")}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l5.3-1.4A9.5 9.5 0 1 0 12 2Zm0 17.2a7.7 7.7 0 0 1-3.9-1.1l-.4-.2-3.1.8.8-3-.2-.4A7.7 7.7 0 1 1 12 19.2Zm4.2-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6.2 6.2 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.5.2-1 .2-1.1-.1-.1-.2-.2-.4-.3Z" />
            </svg>
            Chat on WhatsApp
          </ActionLink>
        </nav>
      </div>
    </header>
  );
}
