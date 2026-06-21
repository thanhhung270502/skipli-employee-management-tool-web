"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUser, connectSocket } from "@/common/lib";
import { ALL_TASKS_QUERY_KEY, MY_TASKS_QUERY_KEY } from "./queries/use-query-tasks";

export const useTaskSocketSync = () => {
  const queryClient = useQueryClient();
  const user = getUser();

  useEffect(() => {
    if (!user || !user.token) return;

    const socket = connectSocket(user.token);

    if (user.role === "owner") {
      socket.emit("join_tasks", { role: "owner" });

      socket.on("task_updated", () => {
        queryClient.invalidateQueries({ queryKey: ALL_TASKS_QUERY_KEY });
      });
    } else if (user.role === "employee" && user.employee?.id) {
      socket.emit("join_tasks", { role: "employee", employeeId: user.employee.id });

      socket.on("task_updated", () => {
        queryClient.invalidateQueries({ queryKey: MY_TASKS_QUERY_KEY });
      });
    }

    return () => {
      socket.off("task_updated");
    };
  }, [user, queryClient]);
};
