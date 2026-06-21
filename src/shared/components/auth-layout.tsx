import type { ReactNode } from "react";
import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

type AuthPageProps = {
  children: ReactNode;
  className?: string;
};

export function AuthPage({ children, className }: AuthPageProps) {
  return (
    <div
      className={cn(
        "bg-brand-primary-dark relative flex min-h-screen items-center justify-center overflow-hidden p-6",
        className
      )}
    >
      <div className="bg-brand-primary/20 pointer-events-none absolute -top-50 -right-50 size-[500px] rounded-full blur-[100px]" />
      <div className="bg-brand-primary-light/10 pointer-events-none absolute -bottom-38 -left-38 size-[400px] rounded-full blur-[100px]" />
      {children}
    </div>
  );
}

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "border-brand-primary bg-brand-primary-dark relative z-1 w-full max-w-[440px] rounded-3xl border p-10 shadow-2xl sm:px-6 sm:py-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuthLogo() {
  return (
    <div className="mb-8 flex items-center gap-2.5">
      <div className="bg-brand-primary flex size-[42px] items-center justify-center rounded-[10px] text-[22px]">
        ⚡
      </div>
      <Typography variant="h4" color="primary" className="font-extrabold">
        Skipli
      </Typography>
    </div>
  );
}

type AuthHeadingProps = {
  title: string;
  subtitle?: ReactNode;
};

export function AuthHeading({ title, subtitle }: AuthHeadingProps) {
  return (
    <div className="mb-8">
      <Typography variant="h3" color="primary" className="mb-2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="small" color="muted">
          {subtitle}
        </Typography>
      )}
    </div>
  );
}
