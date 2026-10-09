import type { Metadata } from "next";

import { SignInForm } from "./SignInForm";
import styles from "./signin.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>JK_AUTOS Admin</p>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.hint}>Use your staff account to manage leads and inventory.</p>
        <SignInForm />
      </div>
    </main>
  );
}
