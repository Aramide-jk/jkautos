import type { ReactNode } from "react";

import styles from "./FormShell.module.css";

type FormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  steps: readonly string[];
  children: ReactNode;
  mobileAction?: ReactNode;
};

export function FormShell({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  steps,
  children,
  mobileAction,
}: FormShellProps) {
  return (
    <main id="main-content">
      <section className={styles.hero}>
        <div className="containerNarrow">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="displayTitle">{title}</h1>
          <p className="sectionCopy">{description}</p>
        </div>
      </section>

      <section className="section">
        <div className={`containerNarrow ${styles.layout}`}>
          {children}
          <aside className={styles.aside} aria-labelledby="form-next-steps">
            <h2 id="form-next-steps">{asideTitle}</h2>
            <p>{asideDescription}</p>
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {mobileAction ? <div className={styles.mobileAction}>{mobileAction}</div> : null}
    </main>
  );
}
