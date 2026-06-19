import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/shared/utils";

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

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-error/10 text-error",
  info: "bg-blue/10 text-blue",
  purple: "bg-brand-primary/30 text-brand-primary-light",
  neutral: "bg-white/5 text-brand-primary-light",
};

export function Badge({
  variant = "neutral",
  className = "",
  style,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
