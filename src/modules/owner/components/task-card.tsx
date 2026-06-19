"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { TaskObject } from "@/common/models/task";
import { useDeleteTaskMutation } from "@/shared/hooks";
import { getTimestamp } from "@/shared/utils";
import { Badge } from "@/shared/components";

interface TaskCardProps {
  task: TaskObject;
  index: number;
  onEdit?: () => void;
}
export function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const dueDate = getTimestamp(task.dueDate);
  const deleteMutation = useDeleteTaskMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(task.id);
        toast.success("Task deleted successfully! 🗑️");
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message ?? "Failed to delete task");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusClasses = () => {
    switch (task.status) {
      case "done":
        return "bg-[var(--success)] shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      case "in_progress":
        return "bg-[var(--info)] shadow-[0_0_8px_rgba(59,130,246,0.4)]";
      default:
        return "bg-[var(--warning)] shadow-[0_0_8px_rgba(245,158,11,0.4)]";
    }
  };

  return (
    <motion.div
      className="card flex items-start gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${getStatusClasses()}`} />
      <div className="flex-1 min-w-0">
        <div
          className="flex items-center gap-2.5 flex-wrap"
        >
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
            {task.title}
          </h3>
          <Badge
            variant={
              task.status === "done"
                ? "success"
                : task.status === "in_progress"
                ? "info"
                : "warning"
            }
            className="capitalize"
          >
            {task.status === "in_progress" ? "In Progress" : task.status}
          </Badge>
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
        </div>
        {task.description && (
          <p
            className="text-[13px] text-[var(--text-secondary)] mt-1"
          >
            {task.description}
          </p>
        )}
        <div
          className="flex gap-4 mt-2 flex-wrap"
        >
          <span
            className="text-xs text-[var(--text-muted)] flex items-center gap-1"
          >
            👤 {task.assignedToName}
          </span>
          {dueDate && (
            <span
              className="text-xs text-[var(--text-muted)] flex items-center gap-1"
            >
              <Calendar size={11} />
              {dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-auto shrink-0">
        <button
          className="btn btn-icon btn-ghost w-8 h-8"
          onClick={onEdit}
          title="Edit Task"
        >
          <Edit2 size={13} />
        </button>
        <button
          className="btn btn-icon btn-danger w-8 h-8"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Task"
        >
          {isDeleting ? (
            <span className="spinner w-3 h-3 border-2" />
          ) : (
            <Trash2 size={13} />
          )}
        </button>
      </div>
    </motion.div>
  );
}

