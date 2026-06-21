"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { TaskObject } from "@/common/models/task";
import { ETaskStatus } from "@/common/models/task";
import { Badge, Card, Typography } from "@/shared/components";
import { cn } from "@/shared/utils";

interface EmployeeTaskCardProps {
  task: TaskObject;
  index: number;
  isUpdating: boolean;
  onStatusChange: (id: string, status: ETaskStatus) => void;
}

const getDate = (ts: unknown): Date | null => {
  if (!ts) return null;
  if (ts instanceof Date) {
    return isNaN(ts.getTime()) ? null : ts;
  }
  if (typeof ts === "object") {
    const t = ts as { _seconds?: number; seconds?: number; toDate?: () => Date };
    if (typeof t.toDate === "function") {
      try {
        const d = t.toDate();
        return isNaN(d.getTime()) ? null : d;
      } catch {
        return null;
      }
    }
    const secs = t._seconds ?? t.seconds;
    if (typeof secs === "number") {
      return new Date(secs * 1000);
    }
  }
  if (typeof ts === "string" || typeof ts === "number") {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const STATUS_OPTIONS: { value: ETaskStatus; label: string }[] = [
  { value: ETaskStatus.PENDING, label: "Pending" },
  { value: ETaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: ETaskStatus.DONE, label: "Done" },
];

const statusSelectStyle: Record<ETaskStatus, string> = {
  [ETaskStatus.PENDING]: "border-warning/60 bg-warning/10 text-warning focus:ring-warning/40",
  [ETaskStatus.IN_PROGRESS]: "border-info/60 bg-info/10 text-info focus:ring-info/40",
  [ETaskStatus.DONE]: "border-success/60 bg-success/10 text-success focus:ring-success/40",
};

export function EmployeeTaskCard({
  task,
  index,
  isUpdating,
  onStatusChange,
}: EmployeeTaskCardProps) {
  const dueDate = getDate(task.dueDate);
  const completedAt = getDate(task.completedAt);
  const isDone = task.status === "done";
  const isInProgress = task.status === "in_progress";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "flex items-start gap-4 transition-opacity",
          isDone && "opacity-70 hover:opacity-100"
        )}
      >
        {/* Status icon */}
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
            isDone ? "bg-success" : isInProgress ? "bg-info" : "bg-warning"
          )}
        >
          {isDone ? (
            <CheckCircle size={12} className="text-white" />
          ) : (
            <Clock size={12} className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <Typography
              variant="small"
              color={isDone ? "muted" : "primary"}
              className={cn("font-semibold", isDone && "line-through")}
            >
              {task.title}
            </Typography>
            <Badge
              variant={
                task.priority === "high"
                  ? "danger"
                  : task.priority === "medium"
                    ? "purple"
                    : "neutral"
              }
              className={cn("capitalize", isDone && "opacity-70")}
            >
              {task.priority || "medium"}
            </Badge>
          </div>

          {task.description && (
            <Typography variant="small" color="muted" className="mb-2">
              {task.description}
            </Typography>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {dueDate && (
              <Typography variant="caption" color="muted" className="flex items-center gap-1">
                <Calendar size={11} />
                Due {format(dueDate, "MMM d, yyyy")}
              </Typography>
            )}
            {completedAt && isDone && (
              <Typography variant="caption" color="success">
                ✓ Completed {format(completedAt, "MMM d, yyyy")}
              </Typography>
            )}
          </div>
        </div>

        {/* Status select */}
        <div className="relative shrink-0">
          {isUpdating ? (
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium",
                statusSelectStyle[task.status as ETaskStatus]
              )}
            >
              <Loader2 size={11} className="animate-spin" />
              Updating...
            </div>
          ) : (
            <select
              value={task.status}
              disabled={isUpdating}
              onChange={(e) => onStatusChange(task.id, e.target.value as ETaskStatus)}
              className={cn(
                "cursor-pointer appearance-none rounded-md border px-2.5 py-1.5 pr-7 text-xs font-semibold transition-all outline-none focus:ring-2",
                statusSelectStyle[task.status as ETaskStatus]
              )}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
