"use client";

import { Calendar } from "lucide-react";
import { useMemo } from "react";
import { ETaskPriority, ETaskStatus, TaskObject } from "@/common/models/task";
import { Badge, BadgeVariant, ColumnDef, PaginationState, Table, Typography } from "@/shared";
import { formatEnumToLabel, getTimestamp } from "@/shared/utils";
import { EmployeeTasksStatusSelect } from "./employee-tasks-status-select";

type EmployeeTasksTableProps = {
  tasks: TaskObject[];
  isLoading: boolean;
  isFetching: boolean;
  totalItems: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  updatingTaskId: string | null;
  onStatusChange: (id: string, status: ETaskStatus) => void;
};

export const EmployeeTasksTable = ({
  tasks,
  isLoading,
  isFetching,
  totalItems,
  pagination,
  setPagination,
  updatingTaskId,
  onStatusChange,
}: EmployeeTasksTableProps) => {
  const statusBadgeVariants: Record<ETaskStatus, BadgeVariant> = {
    [ETaskStatus.PENDING]: "warning",
    [ETaskStatus.IN_PROGRESS]: "info",
    [ETaskStatus.DONE]: "success",
  };
  const priorityBadgeVariants: Record<ETaskPriority, BadgeVariant> = {
    [ETaskPriority.LOW]: "neutral",
    [ETaskPriority.MEDIUM]: "purple",
    [ETaskPriority.HIGH]: "danger",
  };

  const columns = useMemo<ColumnDef<TaskObject>[]>(
    () => [
      {
        header: "Task",
        id: "task",
        cell: ({ row }) => {
          const task = row.original;
          const isDone = task.status === ETaskStatus.DONE;
          return (
            <div>
              <Typography
                variant="small"
                color={isDone ? "muted" : "primary"}
                className={isDone ? "font-semibold line-through" : "font-semibold"}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="small" color="muted" className="mt-1">
                  {task.description}
                </Typography>
              )}
            </div>
          );
        },
      },
      {
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <Badge variant={statusBadgeVariants[task.status]} className="capitalize">
              {formatEnumToLabel(task.status)}
            </Badge>
          );
        },
      },
      {
        header: "Priority",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <Badge variant={priorityBadgeVariants[task.priority]} className="capitalize">
              {formatEnumToLabel(task.priority)}
            </Badge>
          );
        },
      },
      {
        header: "Due Date",
        cell: ({ row }) => {
          const dueDate = getTimestamp(row.original.dueDate);
          if (!dueDate) return "--";
          return (
            <Typography variant="caption" color="muted" className="flex items-center gap-2 text-sm">
              <Calendar size={16} />
              {dueDate.toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <EmployeeTasksStatusSelect
              task={task}
              isUpdating={updatingTaskId === task.id}
              onStatusChange={onStatusChange}
            />
          );
        },
      },
    ],
    [onStatusChange, updatingTaskId]
  );

  return (
    <Table
      isLoading={isLoading}
      isFetching={isFetching}
      columns={columns}
      data={tasks}
      pagination={pagination}
      setPagination={setPagination}
      manualPagination={true}
      rowCount={totalItems}
    />
  );
};
