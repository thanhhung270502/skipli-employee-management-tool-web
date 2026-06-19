import type { ReactNode } from "react";
import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

type DividerTextProps = {
  children: ReactNode;
  className?: string;
};

export function DividerText({ children, className }: DividerTextProps) {
  return (
    <div className={cn("my-5 flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-brand-primary" />
      <Typography variant="caption" color="muted">
        {children}
      </Typography>
      <span className="h-px flex-1 bg-brand-primary" />
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("my-6 border-0 border-t border-brand-primary", className)} />;
}
