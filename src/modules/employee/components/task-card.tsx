"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { TaskObject } from "@/common/models/task";
import { Badge, Button, Card, Typography } from "@/shared/components";
import { cn } from "@/shared/utils";

interface EmployeeTaskCardProps {
  task: TaskObject;
  index: number;
  isUpdating: boolean;
  onStartTask: (id: string) => void;
  onMarkDone: (id: string) => void;
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

export function EmployeeTaskCard({
  task,
  index,
  isUpdating,
  onStartTask,
  onMarkDone,
}: EmployeeTaskCardProps) {
  const dueDate = getDate(task.dueDate);
  const completedAt = getDate(task.completedAt);

  if (task.status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.04 }}
      >
        <Card className="flex items-start gap-4 opacity-70">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success">
            <CheckCircle size={12} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2.5">
              <Typography variant="small" color="muted" className="font-semibold line-through">
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
                className="capitalize opacity-70"
              >
                {task.priority || "medium"}
              </Badge>
            </div>
            {completedAt && (
              <Typography variant="caption" color="success">
                ✓ Completed {format(completedAt, "MMM d, yyyy")}
              </Typography>
            )}
          </div>
          <Badge variant="success">Done</Badge>
        </Card>
      </motion.div>
    );
  }

  const isInProgress = task.status === "in_progress";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="flex items-start gap-4">
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-transparent",
            isInProgress ? "border-blue" : "border-warning"
          )}
        >
          <Clock size={10} className={isInProgress ? "text-blue" : "text-warning"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <Typography variant="small" color="primary" className="font-semibold">
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
              className="capitalize"
            >
              {task.priority || "medium"}
            </Badge>
            {isInProgress && <Badge variant="info">In Progress</Badge>}
          </div>

          {task.description && (
            <Typography variant="small" color="muted" className="mb-2">
              {task.description}
            </Typography>
          )}
          {dueDate && (
            <Typography variant="caption" color="muted" className="flex items-center gap-1">
              <Calendar size={11} />
              Due {format(dueDate, "MMM d, yyyy")}
            </Typography>
          )}
        </div>
        {isInProgress ? (
          <Button
            variant="success"
            size="sm"
            className="w-auto shrink-0"
            onClick={() => onMarkDone(task.id)}
            loading={isUpdating}
            loadingText="Updating..."
          >
            <CheckCircle size={14} /> Complete
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="w-auto shrink-0"
            onClick={() => onStartTask(task.id)}
            loading={isUpdating}
            loadingText="Updating..."
          >
            Start Task
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
