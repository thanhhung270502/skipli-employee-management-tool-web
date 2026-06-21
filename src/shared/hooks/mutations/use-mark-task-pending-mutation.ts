"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_MARK_TASK_PENDING } from "@/common/models/task";
import type { MarkTaskPendingResponse } from "@/common/models/task";
import { MY_TASKS_QUERY_KEY, ALL_TASKS_QUERY_KEY } from "@/shared/hooks";

export const useMarkTaskPendingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkTaskPendingResponse, Error, string>({
    mutationFn: async (taskId) => {
      const res = await axiosInstance.put<MarkTaskPendingResponse>(
        API_MARK_TASK_PENDING.buildUrlPath(taskId),
        {}
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
    },
  });
};
