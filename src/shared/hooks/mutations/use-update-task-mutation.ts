"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_UPDATE_TASK } from "@/common/models/task";
import type { UpdateTaskRequest, UpdateTaskResponse } from "@/common/models/task";
import { ALL_TASKS_QUERY_KEY, MY_TASKS_QUERY_KEY } from "@/shared/hooks";

interface UpdateTaskVariables {
  taskId: string;
  data: UpdateTaskRequest;
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateTaskResponse, Error, UpdateTaskVariables>({
    mutationFn: async ({ taskId, data }) => {
      const res = await axiosInstance.put<UpdateTaskResponse>(
        API_UPDATE_TASK.buildUrlPath(taskId),
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_TASKS_QUERY_KEY });
    },
  });
};
