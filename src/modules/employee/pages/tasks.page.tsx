"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useQueryMyTasks,
  useMarkTaskDoneMutation,
  useMarkTaskInProgressMutation,
  useMarkTaskPendingMutation,
  useTaskSocketSync,
  useTablePagination,
} from "@/shared/hooks";
import {
  Button,
  EmptyState,
  PageHeader,
  Skeleton,
  TaskListSkeleton,
} from "@/shared/components";
import { EmployeeTasksTable } from "../components";
import { ETaskStatus } from "@/common/models/task";

type TaskFilter = "all" | "pending" | "in_progress" | "done";

export function EmployeeTasksPage() {
  useTaskSocketSync();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const { pagination, setPagination } = useTablePagination();

  const {
    data,
    isLoading,
    isFetching,
  } = useQueryMyTasks({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    ...(filter !== "all" ? { status: filter } : {}),
  });

  const markDoneMutation = useMarkTaskDoneMutation();
  const markInProgressMutation = useMarkTaskInProgressMutation();
  const markPendingMutation = useMarkTaskPendingMutation();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const tasks = data?.tasks ?? [];
  const totalTasks = data?.total_record ?? 0;

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

  const filterLabel =
    filter === "all" ? "tasks" : filter === "in_progress" ? "in progress tasks" : `${filter} tasks`;

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
        subtitle={`${totalTasks} total ${filterLabel}`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "pending", "in_progress", "done"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "ghost"}
            size="sm"
            className="w-auto capitalize"
            onClick={() => setFilter(f)}
          >
            {f === "in_progress" ? "In Progress" : f}
          </Button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="🎯"
          title={`No ${filter !== "all" ? (filter === "in_progress" ? "in progress" : filter) : ""} tasks`}
          description="Your manager will assign tasks to you soon"
        />
      ) : (
        <EmployeeTasksTable
          tasks={tasks}
          isLoading={isLoading}
          isFetching={isFetching}
          totalItems={totalTasks}
          pagination={pagination}
          setPagination={setPagination}
          updatingTaskId={updatingTaskId}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
