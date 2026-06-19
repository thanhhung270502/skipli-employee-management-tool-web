"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { TaskObject } from "@/common/models/task";
import { useDeleteTaskMutation } from "@/shared/hooks";
import { getTimestamp, cn } from "@/shared/utils";
import { Badge, Button, Card, Typography } from "@/shared/components";

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

  const statusDotClass = cn(
    "mt-1 size-3 shrink-0 rounded-full",
    task.status === "done" && "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    task.status === "in_progress" && "bg-blue shadow-[0_0_8px_rgba(59,130,246,0.4)]",
    task.status === "pending" && "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="flex items-center gap-4">
        <div className={statusDotClass} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Typography variant="small" color="primary" className="font-semibold">
              {task.title}
            </Typography>
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
            <Typography variant="small" color="muted" className="mt-1">
              {task.description}
            </Typography>
          )}
          <div className="mt-2 flex flex-wrap gap-4">
            <Typography variant="caption" color="muted" className="flex items-center gap-1">
              👤 {task.assignedToName}
            </Typography>
            {dueDate && (
              <Typography variant="caption" color="muted" className="flex items-center gap-1">
                <Calendar size={11} />
                {dueDate.toLocaleDateString()}
              </Typography>
            )}
          </div>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <Button variant="ghost" iconOnly className="size-8" onClick={onEdit} title="Edit Task">
            <Edit2 size={13} />
          </Button>
          <Button
            variant="danger"
            iconOnly
            className="size-8"
            onClick={handleDelete}
            loading={isDeleting}
            title="Delete Task"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
