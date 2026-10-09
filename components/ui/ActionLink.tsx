import type { AnchorHTMLAttributes, ReactNode } from "react";

import styles from "./Action.module.css";

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  fullWidth?: boolean;
};

export function ActionLink({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: ActionLinkProps) {
  const classes = [
    styles.action,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
}
