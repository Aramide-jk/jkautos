import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import styles from "./CarCard.module.css";
import skeleton from "./CarCardSkeleton.module.css";

export function CarCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.image}>
        <SkeletonBlock className={skeleton.media} />
      </div>
      <div className={styles.body}>
        <SkeletonBlock className={skeleton.title} />
        <SkeletonBlock className={skeleton.meta} />
        <SkeletonBlock className={skeleton.price} />
        <div className={skeleton.actions}>
          <SkeletonBlock className={skeleton.button} />
          <SkeletonBlock className={skeleton.button} />
        </div>
      </div>
    </article>
  );
}
