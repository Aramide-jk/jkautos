import styles from "./admin.module.css";

export function statusPill(status: string): string {
  const map: Record<string, string> = {
    new: styles.pillNew,
    contacted: styles.pillContacted,
    won: styles.pillWon,
    lost: styles.pillLost,
    available: styles.pillAvailable,
    reserved: styles.pillReserved,
    sold: styles.pillSold,
  };
  return `${styles.pill} ${map[status] ?? styles.pillContacted}`;
}

export function typePill(): string {
  return `${styles.pill} ${styles.pillType}`;
}

export function featuredPill(): string {
  return `${styles.pill} ${styles.pillFeatured}`;
}
