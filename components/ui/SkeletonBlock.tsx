import type { HTMLAttributes } from "react";

import styles from "./SkeletonBlock.module.css";

type SkeletonBlockProps = HTMLAttributes<HTMLDivElement> & { rounded?: boolean };

export function SkeletonBlock({ className, rounded = false, ...props }: SkeletonBlockProps) {
  return (
    <div
      className={[styles.skeleton, rounded ? styles.rounded : "", className ?? ""].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...props}
    />
  );
}
