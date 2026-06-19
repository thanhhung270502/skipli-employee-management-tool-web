"use client";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

export type StatIconColor = "purple" | "green" | "yellow" | "blue";

const iconColorClasses: Record<StatIconColor, string> = {
  purple: "bg-purple-25/10 text-brand-primary-light",
  green: "bg-success-25/10 text-success",
  yellow: "bg-warning-25/10 text-warning",
  blue: "bg-blue-25/10 text-info-alt",
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
      className="border-brand-primary bg-brand-primary-dark hover:border-brand-primary-light/30 flex items-center gap-4 rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
