"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useQueryMyTasks,
  useMarkTaskDoneMutation,
  useMarkTaskInProgressMutation,
} from "@/shared/hooks";
import { TaskListSkeleton } from "@/shared/components";
import { EmployeeTaskCard } from "../components";

export function EmployeeTasksPage() {
  const { data, isLoading } = useQueryMyTasks();
  const markDoneMutation = useMarkTaskDoneMutation();
  const markInProgressMutation = useMarkTaskInProgressMutation();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const tasks = data?.tasks ?? [];
  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  const handleStartTask = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    try {
      await markInProgressMutation.mutateAsync(taskId);
      toast.success("Task started! Let's get to work! 💪");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Failed to start task");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleMarkDone = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    try {
      await markDoneMutation.mutateAsync(taskId);
      toast.success("Task marked as done! 🎉");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Failed to complete task");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <div className="skeleton w-[140px] h-8 mb-2" />
            <div className="skeleton w-[200px] h-4" />
          </div>
        </div>
        <TaskListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">
            {pending.length} pending · {inProgress.length} in progress · {done.length} completed
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <p className="empty-state-title">No tasks yet</p>
          <p className="empty-state-desc">Your manager will assign tasks to you soon</p>
        </div>
      ) : (
        <div>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4"
              >
                Pending ({pending.length})
              </h2>
              <div className="flex flex-col gap-3">
                {pending.map((task, i) => (
                  <EmployeeTaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    isUpdating={updatingTaskId === task.id}
                    onStartTask={handleStartTask}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </div>
            </div>
          )}

          {inProgress.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-sm font-bold text-[var(--info)] uppercase tracking-wider mb-4"
              >
                In Progress ({inProgress.length})
              </h2>
              <div className="flex flex-col gap-3">
                {inProgress.map((task, i) => (
                  <EmployeeTaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    isUpdating={updatingTaskId === task.id}
                    onStartTask={handleStartTask}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div>
              <h2
                className="text-sm font-bold text-[var(--success)] uppercase tracking-wider mb-4"
              >
                Completed ({done.length})
              </h2>
              <div className="flex flex-col gap-3">
                {done.map((task, i) => (
                  <EmployeeTaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    isUpdating={false}
                    onStartTask={handleStartTask}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

