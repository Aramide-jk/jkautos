import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main id="main-content" className="section" aria-busy="true" aria-label="Loading page">
      <div className="containerNarrow">
        <SkeletonBlock className={styles.eyebrow} />
        <SkeletonBlock className={styles.title} />
        <SkeletonBlock className={styles.line} />
        <SkeletonBlock className={styles.lineShort} />
        <SkeletonBlock className={styles.block} />
      </div>
    </main>
  );
}
