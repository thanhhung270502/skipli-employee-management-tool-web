"use client";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

export type StatIconColor = "purple" | "green" | "yellow" | "blue";

const iconColorClasses: Record<StatIconColor, string> = {
  purple: "bg-brand-primary/30 text-brand-primary-light",
  green: "bg-success/10 text-success",
  yellow: "bg-warning/10 text-warning",
  blue: "bg-blue/10 text-blue",
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  colorClass: StatIconColor;
}

export function StatCard({ icon: Icon, label, value, colorClass }: StatCardProps) {
  return (
    <motion.div
      className="flex items-center gap-4 rounded-2xl border border-brand-primary bg-brand-primary-dark p-6 transition-all hover:-translate-y-0.5 hover:border-brand-primary-light/30 hover:shadow-lg"
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          iconColorClasses[colorClass]
        )}
      >
        <Icon size={22} />
      </div>
      <div>
        <Typography variant="h2" color="primary" className="leading-tight">
          {value}
        </Typography>
        <Typography variant="small" color="muted" className="mt-0.5">
          {label}
        </Typography>
      </div>
    </motion.div>
  );
}
