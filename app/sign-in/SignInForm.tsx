"use client";

import { useActionState } from "react";

import { authenticate } from "./actions";
import styles from "./signin.module.css";

export function SignInForm() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" autoFocus />
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button className={styles.button} type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
