"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_GET_ALL_TASKS, API_GET_MY_TASKS } from "@/common/models/task";
import { API_GET_EMPLOYEE_TASKS } from "@/common/models/employee";
import type { GetAllTasksResponse, GetMyTasksResponse } from "@/common/models/task";
import type { PaginationParams } from "@/common/types";

export const ALL_TASKS_QUERY_KEY = ["tasks", "all"] as const;
export const MY_TASKS_QUERY_KEY = ["tasks", "mine"] as const;

const TASK_POLL_INTERVAL_MS = 30000;

export type TaskListParams = PaginationParams & {
  status?: string;
};

export const useQueryAllTasks = (params?: TaskListParams) =>
  useQuery<GetAllTasksResponse>({
    queryKey: [...ALL_TASKS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetAllTasksResponse>(
        API_GET_ALL_TASKS.buildUrlPath(params)
      );
      return res.data ?? { tasks: [], total_record: 0 };
    },
    refetchInterval: TASK_POLL_INTERVAL_MS,
    placeholderData: params ? keepPreviousData : undefined,
  });

export const useQueryMyTasks = (params?: TaskListParams) =>
  useQuery<GetMyTasksResponse>({
    queryKey: [...MY_TASKS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetMyTasksResponse>(
        API_GET_MY_TASKS.buildUrlPath(params)
      );
      return res.data ?? { tasks: [], total_record: 0 };
    },
    refetchInterval: TASK_POLL_INTERVAL_MS,
    placeholderData: params ? keepPreviousData : undefined,
  });

export const useQueryEmployeeTasks = (
  employeeId: string,
  enabled: boolean,
  params?: TaskListParams
) =>
  useQuery<GetMyTasksResponse>({
    queryKey: ["employees", employeeId, "tasks", params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetMyTasksResponse>(
        API_GET_EMPLOYEE_TASKS.buildUrlPath(employeeId, params)
      );
      return res.data ?? { tasks: [], total_record: 0 };
    },
    enabled: enabled && !!employeeId,
    placeholderData: params ? keepPreviousData : undefined,
  });
