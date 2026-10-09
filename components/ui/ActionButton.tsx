import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Action.module.css";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  fullWidth?: boolean;
};

export function ActionButton({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ActionButtonProps) {
  const classes = [
    styles.action,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
