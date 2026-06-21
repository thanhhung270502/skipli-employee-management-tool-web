import type { APIDefinition, PaginationParams } from "@/common/types";
import { APIMethod, APIBaseRoutes, buildPaginationQueryString } from "@/common/types";
import type { GetMyTasksResponse } from "@/common/models/task";
import type {
  GetAllEmployeesResponse,
  GetEmployeeResponse,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./employee-model";

export const API_GET_ALL_EMPLOYEES: APIDefinition<undefined, GetAllEmployeesResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees",
  requestBody: undefined,
  responseBody: {} as GetAllEmployeesResponse,
  buildUrlPath: (params?: PaginationParams & { search?: string }) =>
    `${APIBaseRoutes.OWNER}/employees${buildPaginationQueryString(params)}`,
};

export const API_GET_EMPLOYEE: APIDefinition<{ employeeId: string }, GetEmployeeResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees/:employeeId",
  requestBody: {} as { employeeId: string },
  responseBody: {} as GetEmployeeResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.OWNER}/employees/${id}`,
};

export const API_GET_EMPLOYEE_TASKS: APIDefinition<{ employeeId: string }, GetMyTasksResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees/:employeeId/tasks",
  requestBody: {} as { employeeId: string },
  responseBody: {} as GetMyTasksResponse,
  buildUrlPath: (
    id: string,
    params?: PaginationParams & { status?: string }
  ) =>
    `${APIBaseRoutes.OWNER}/employees/${id}/tasks${buildPaginationQueryString(params)}`,
};

export const API_CREATE_EMPLOYEE: APIDefinition<CreateEmployeeRequest, CreateEmployeeResponse> = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees",
  requestBody: {} as CreateEmployeeRequest,
  responseBody: {} as CreateEmployeeResponse,
  buildUrlPath: () => `${APIBaseRoutes.OWNER}/employees`,
};

export const API_UPDATE_EMPLOYEE: APIDefinition<UpdateEmployeeRequest, UpdateEmployeeResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees/:employeeId",
  requestBody: {} as UpdateEmployeeRequest,
  responseBody: {} as UpdateEmployeeResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.OWNER}/employees/${id}`,
};

export const API_DELETE_EMPLOYEE: APIDefinition<{ employeeId: string }, DeleteEmployeeResponse> = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/employees/:employeeId",
  requestBody: {} as { employeeId: string },
  responseBody: {} as DeleteEmployeeResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.OWNER}/employees/${id}`,
};

export const API_GET_PROFILE: APIDefinition<undefined, GetProfileResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/profile",
  requestBody: undefined,
  responseBody: {} as GetProfileResponse,
  buildUrlPath: () => `${APIBaseRoutes.EMPLOYEE}/profile`,
};

export const API_UPDATE_PROFILE: APIDefinition<UpdateProfileRequest, UpdateProfileResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/profile",
  requestBody: {} as UpdateProfileRequest,
  responseBody: {} as UpdateProfileResponse,
  buildUrlPath: () => `${APIBaseRoutes.EMPLOYEE}/profile`,
};
