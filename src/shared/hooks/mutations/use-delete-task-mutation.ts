"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_DELETE_TASK } from "@/common/models/task";
import type { DeleteTaskResponse } from "@/common/models/task";
import { ALL_TASKS_QUERY_KEY, MY_TASKS_QUERY_KEY } from "@/shared/hooks";

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteTaskResponse, Error, string>({
    mutationFn: async (taskId) => {
      const res = await axiosInstance.delete<DeleteTaskResponse>(
        API_DELETE_TASK.buildUrlPath(taskId)
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TASKS_QUERY_KEY });
    },
  });
};
