import type { ReactNode } from "react";

import styles from "./Field.module.css";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  required = false,
  optional = false,
  hint,
  error,
  children,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required ? <span className={styles.required} aria-hidden="true">*</span> : null}
        {optional && !required ? <span className={styles.optional}>(optional)</span> : null}
      </label>
      <div className={styles.control}>{children}</div>
      {hint && !error ? <p className={styles.help}>{hint}</p> : null}
      {error ? <p className={styles.error} id={`${htmlFor}-error`} role="alert">{error}</p> : null}
    </div>
  );
}
