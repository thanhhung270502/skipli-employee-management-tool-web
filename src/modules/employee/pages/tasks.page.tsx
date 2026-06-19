"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useQueryMyTasks,
  useMarkTaskDoneMutation,
  useMarkTaskInProgressMutation,
} from "@/shared/hooks";
import {
  EmptyState,
  PageHeader,
  Skeleton,
  TaskListSkeleton,
  Typography,
} from "@/shared/components";
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
        <div className="mb-8">
          <Skeleton width={140} height={32} className="mb-2" />
          <Skeleton width={200} height={16} />
        </div>
        <TaskListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Tasks"
        subtitle={`${pending.length} pending · ${inProgress.length} in progress · ${done.length} completed`}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No tasks yet"
          description="Your manager will assign tasks to you soon"
        />
      ) : (
        <div>
          {pending.length > 0 && (
            <div className="mb-8">
              <Typography variant="overline" color="muted" className="mb-4">
                Pending ({pending.length})
              </Typography>
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
              <Typography variant="overline" color="accent" className="mb-4 text-blue">
                In Progress ({inProgress.length})
              </Typography>
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
              <Typography variant="overline" color="success" className="mb-4">
                Completed ({done.length})
              </Typography>
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
