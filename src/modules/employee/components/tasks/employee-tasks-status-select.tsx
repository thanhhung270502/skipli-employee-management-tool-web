"use client";

import { Loader2 } from "lucide-react";
import type { TaskObject } from "@/common/models/task";
import { ETaskStatus } from "@/common/models/task";
import {
  Select,
  getOptionsValue,
  onSelectChange,
} from "@/shared/components";
import { cn } from "@/shared/utils";

const STATUS_OPTIONS: { value: ETaskStatus; label: string }[] = [
  { value: ETaskStatus.PENDING, label: "Pending" },
  { value: ETaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: ETaskStatus.DONE, label: "Done" },
];

type EmployeeTasksStatusSelectProps = {
  task: TaskObject;
  isUpdating: boolean;
  onStatusChange: (id: string, status: ETaskStatus) => void;
};

export const EmployeeTasksStatusSelect = ({
  task,
  isUpdating,
  onStatusChange,
}: EmployeeTasksStatusSelectProps) => {
  if (isUpdating) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium">
        <Loader2 size={11} className="animate-spin" />
        Updating...
      </div>
    );
  }

  return (
    <Select
      value={getOptionsValue(STATUS_OPTIONS, task.status) ?? null}
      options={STATUS_OPTIONS}
      onChange={onSelectChange((value) => onStatusChange(task.id, value as ETaskStatus))}
      disabled={isUpdating}
      size="sm"
      isSearchable={false}
      isClearable={false}
      className="w-auto min-w-32!"
      wrapperClassName="gap-0"
      controlClassName={cn("!min-h-0 !px-2.5 !py-1.5 text-xs font-semibold")}
    />
  );
};
