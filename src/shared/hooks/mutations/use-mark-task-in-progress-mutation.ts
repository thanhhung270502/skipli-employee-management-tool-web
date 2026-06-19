"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_MARK_TASK_IN_PROGRESS } from "@/common/models/task";
import type { MarkTaskInProgressResponse } from "@/common/models/task";
import { MY_TASKS_QUERY_KEY, ALL_TASKS_QUERY_KEY } from "@/shared/hooks";

export const useMarkTaskInProgressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkTaskInProgressResponse, Error, string>({
    mutationFn: async (taskId) => {
      const res = await axiosInstance.put<MarkTaskInProgressResponse>(
        API_MARK_TASK_IN_PROGRESS.buildUrlPath(taskId),
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
