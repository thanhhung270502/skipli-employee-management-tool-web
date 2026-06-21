export enum ETaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum ETaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface TaskObject {
  id: string;
  title: string;
  description: string | null;
  assignedTo: string;
  assignedToName: string;
  status: ETaskStatus;
  priority: ETaskPriority;
  dueDate: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate?: string;
  priority?: ETaskPriority;
}
export interface CreateTaskResponse {
  taskId: string;
  task: TaskObject;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string | null;
  priority?: ETaskPriority;
  status?: ETaskStatus;
}
export interface UpdateTaskResponse {
  success: boolean;
  task: TaskObject;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

import type { PaginatedMeta } from "@/common/types";

export interface GetAllTasksResponse extends PaginatedMeta {
  tasks: TaskObject[];
}

export interface GetMyTasksResponse extends PaginatedMeta {
  tasks: TaskObject[];
}

export interface MarkTaskInProgressResponse {
  success: boolean;
  message: string;
}

export interface MarkTaskDoneResponse {
  success: boolean;
  message: string;
}

export interface MarkTaskPendingResponse {
  success: boolean;
  message: string;
}
