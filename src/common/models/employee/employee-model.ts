export interface WorkSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  is_setup: boolean;
  created_at: string;
}

export interface EmployeeObject {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  isSetup: boolean;
  workSchedule?: WorkSchedule | null;
  createdAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  department: string;
  phone?: string;
  role?: string;
  workSchedule?: WorkSchedule | null;
}
export interface CreateEmployeeResponse {
  employeeId: string;
  message: string;
}

export interface UpdateEmployeeRequest {
  employeeId: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  workSchedule?: WorkSchedule | null;
}
export interface UpdateEmployeeResponse {
  message: string;
}

export interface DeleteEmployeeRequest {
  employeeId: string;
}
export interface DeleteEmployeeResponse {
  message: string;
}

import type { PaginatedMeta } from "@/common/types";

export interface GetAllEmployeesResponse extends PaginatedMeta {
  employees: EmployeeObject[];
}

export interface GetEmployeeResponse {
  employee: EmployeeObject;
}

export interface GetProfileResponse {
  employee: EmployeeObject;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  email?: string;
}
export interface UpdateProfileResponse {
  message: string;
}
