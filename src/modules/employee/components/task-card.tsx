"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { TaskObject } from "@/common/models/task";
import { Badge } from "@/shared/components";


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
        // ignore
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
        className="card flex items-start gap-4 opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.04 }}
      >
        <div
          className="w-5 h-5 rounded-full shrink-0 mt-0.5 bg-[var(--success)] flex items-center justify-center"
        >
          <CheckCircle size={12} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h3
              className="text-[15px] font-semibold text-[var(--text-secondary)] line-through"
            >
              {task.title}
            </h3>
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
            <span className="text-xs text-[var(--success)]">
              ✓ Completed {format(completedAt, "MMM d, yyyy")}
            </span>
          )}
        </div>
        <Badge variant="success">Done</Badge>

      </motion.div>
    );
  }

  const isInProgress = task.status === "in_progress";

  return (
    <motion.div
      className="card flex items-start gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div
        className={`w-5 h-5 rounded-full shrink-0 mt-0.5 border-2 bg-transparent flex items-center justify-center ${
          isInProgress ? "border-[var(--info)]" : "border-[var(--warning)]"
        }`}
      >
        <Clock size={10} className={isInProgress ? "text-[var(--info)]" : "text-[var(--warning)]"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap mb-1">
          <h3
            className="text-[15px] font-semibold text-[var(--text-primary)]"
          >
            {task.title}
          </h3>
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
          {isInProgress && (
            <Badge variant="info">In Progress</Badge>
          )}
        </div>

        {task.description && (
          <p className="text-[13px] text-[var(--text-secondary)] mb-2">
            {task.description}
          </p>
        )}
        {dueDate && (
          <span
            className="text-xs text-[var(--text-muted)] flex items-center gap-1"
          >
            <Calendar size={11} />
            Due {format(dueDate, "MMM d, yyyy")}
          </span>
        )}
      </div>
      {isInProgress ? (
        <button
          className="btn btn-success btn-sm w-auto shrink-0"
          onClick={() => onMarkDone(task.id)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="spinner w-3.5 h-3.5 border-2" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle size={14} /> Complete
            </>
          )}
        </button>
      ) : (
        <button
          className="btn btn-secondary btn-sm w-auto shrink-0"
          onClick={() => onStartTask(task.id)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="spinner w-3.5 h-3.5 border-2" />
              Updating...
            </>
          ) : (
            <>
              Start Task
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

