import { ETaskPriority, ETaskStatus, TaskObject } from "@/common/models/task";
import { Badge, BadgeVariant, ColumnDef, PaginationState, Table, Typography } from "@/shared";
import { formatEnumToLabel, getTimestamp } from "@/shared/utils";
import { Calendar } from "lucide-react";
import { useMemo } from "react";
import { OwnerTasksActions } from "..";

type OwnerTasksTableProps = {
  tasks: TaskObject[];
  isLoading: boolean;
  isFetching: boolean;
  totalItems: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  onEdit: (task: TaskObject) => void;
};

export const OwnerTasksTable = ({
  tasks,
  isLoading,
  isFetching,
  totalItems,
  pagination,
  setPagination,
  onEdit,
}: OwnerTasksTableProps) => {
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
          return (
            <div>
              <Typography variant="small" color="primary" className="font-semibold">
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
        header: "Assigned To",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex items-center gap-2">
              <Typography className="bg-brand-primary flex size-8 items-center justify-center rounded-full font-bold text-white">
                {task.assignedToName[0].toUpperCase()}
              </Typography>
              <Typography variant="small" color="primary" className="font-semibold">
                {task.assignedToName}
              </Typography>
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
          return <OwnerTasksActions task={task} onEdit={onEdit} />;
        },
      },
    ],
    []
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
