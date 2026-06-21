"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/common/lib";
import { API_GET_ALL_EMPLOYEES } from "@/common/models/employee";
import type { GetAllEmployeesResponse } from "@/common/models/employee";
import type { PaginationParams } from "@/common/types";

export const EMPLOYEES_QUERY_KEY = ["employees"] as const;

export type EmployeeListParams = PaginationParams & {
  search?: string;
};

export const useQueryEmployees = (params?: EmployeeListParams) =>
  useQuery<GetAllEmployeesResponse>({
    queryKey: [...EMPLOYEES_QUERY_KEY, params],
    queryFn: async () => {
      const res = await axiosInstance.get<GetAllEmployeesResponse>(
        API_GET_ALL_EMPLOYEES.buildUrlPath(params)
      );
      return res.data ?? { employees: [], total_record: 0 };
    },
    placeholderData: params ? keepPreviousData : undefined,
  });
