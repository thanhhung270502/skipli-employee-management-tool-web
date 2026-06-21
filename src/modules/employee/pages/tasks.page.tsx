"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useQueryMyTasks,
  useMarkTaskDoneMutation,
  useMarkTaskInProgressMutation,
  useMarkTaskPendingMutation,
  useTaskSocketSync,
} from "@/shared/hooks";
import {
  EmptyState,
  PageHeader,
  Skeleton,
  TaskListSkeleton,
  Typography,
} from "@/shared/components";
import { EmployeeTaskCard } from "../components";
import type { TaskObject } from "@/common/models/task";
import { ETaskStatus } from "@/common/models/task";

export function EmployeeTasksPage() {
  useTaskSocketSync();
  const { data, isLoading } = useQueryMyTasks();
  const markDoneMutation = useMarkTaskDoneMutation();
  const markInProgressMutation = useMarkTaskInProgressMutation();
  const markPendingMutation = useMarkTaskPendingMutation();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const tasks = data?.tasks ?? [];
  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  const handleStatusChange = async (taskId: string, newStatus: ETaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      if (newStatus === ETaskStatus.IN_PROGRESS) {
        await markInProgressMutation.mutateAsync(taskId);
        toast.success("Task started! Let's get to work! 💪");
      } else if (newStatus === ETaskStatus.DONE) {
        await markDoneMutation.mutateAsync(taskId);
        toast.success("Task marked as done! 🎉");
      } else if (newStatus === ETaskStatus.PENDING) {
        await markPendingMutation.mutateAsync(taskId);
        toast.success("Task moved back to pending.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Failed to update task status");
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
            <TaskElement
              title="Pending"
              tasks={pending}
              updatingTaskId={updatingTaskId}
              onStatusChange={handleStatusChange}
            />
          )}

          {inProgress.length > 0 && (
            <TaskElement
              title="In Progress"
              tasks={inProgress}
              updatingTaskId={updatingTaskId}
              onStatusChange={handleStatusChange}
            />
          )}

          {done.length > 0 && (
            <TaskElement
              title="Completed"
              tasks={done}
              updatingTaskId={updatingTaskId}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      )}
    </div>
  );
}

type TaskElementProps = {
  title: string;
  tasks: TaskObject[];
  updatingTaskId: string | null;
  onStatusChange: (id: string, status: ETaskStatus) => void;
};
const TaskElement = ({ title, tasks, updatingTaskId, onStatusChange }: TaskElementProps) => {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <Typography variant="overline" color="default">
        {title} ({tasks.length})
      </Typography>
      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <EmployeeTaskCard
            key={task.id}
            task={task}
            index={i}
            isUpdating={updatingTaskId === task.id}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};
