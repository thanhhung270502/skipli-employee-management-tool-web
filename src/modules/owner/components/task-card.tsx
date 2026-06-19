"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { TaskObject } from "@/common/models/task";
import { useDeleteTaskMutation } from "@/shared/hooks";
import { getTimestamp } from "@/shared/utils";

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

  const getStatusColor = () => {
    switch (task.status) {
      case "done":
        return "var(--success)";
      case "in_progress":
        return "var(--info)";
      default:
        return "var(--warning)";
    }
  };

  const getStatusShadow = () => {
    switch (task.status) {
      case "done":
        return "0 0 8px rgba(16,185,129,0.4)";
      case "in_progress":
        return "0 0 8px rgba(59,130,246,0.4)";
      default:
        return "0 0 8px rgba(245,158,11,0.4)";
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          flexShrink: 0,
          marginTop: 4,
          background: getStatusColor(),
          boxShadow: getStatusShadow(),
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
            {task.title}
          </h3>
          <span
            className={`badge ${
              task.status === "done"
                ? "badge-success"
                : task.status === "in_progress"
                ? "badge-info"
                : "badge-warning"
            }`}
            style={{ textTransform: "capitalize" }}
          >
            {task.status === "in_progress" ? "In Progress" : task.status}
          </span>
          <span
            className={`badge ${
              task.priority === "high"
                ? "badge-danger"
                : task.priority === "medium"
                ? "badge-purple"
                : "badge-neutral"
            }`}
            style={{ textTransform: "capitalize" }}
          >
            {task.priority || "medium"}
          </span>
        </div>
        {task.description && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            {task.description}
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            👤 {task.assignedToName}
          </span>
          {dueDate && (
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Calendar size={11} />
              {dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
        <button
          className="btn btn-icon btn-ghost"
          onClick={onEdit}
          title="Edit Task"
          style={{ width: 32, height: 32 }}
        >
          <Edit2 size={13} />
        </button>
        <button
          className="btn btn-icon btn-danger"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Task"
          style={{ width: 32, height: 32 }}
        >
          {isDeleting ? (
            <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
          ) : (
            <Trash2 size={13} />
          )}
        </button>
      </div>
    </motion.div>
  );
}

