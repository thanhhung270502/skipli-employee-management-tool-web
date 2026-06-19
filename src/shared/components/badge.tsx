import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Badge({
  variant = "neutral",
  className = "",
  style,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx("badge", `badge-${variant}`, className)}
      style={style}
    >
      {children}
    </span>
  );
}
