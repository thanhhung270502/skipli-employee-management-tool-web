import type { APIDefinition } from "@/common/types";
import { APIMethod, APIBaseRoutes } from "@/common/types";
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
  GetMyTasksResponse,
  MarkTaskInProgressResponse,
  MarkTaskDoneResponse,
  MarkTaskPendingResponse,
} from "./task-model";

export const API_GET_ALL_TASKS: APIDefinition<undefined, GetAllTasksResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/tasks",
  requestBody: undefined,
  responseBody: {} as GetAllTasksResponse,
  buildUrlPath: () => `${APIBaseRoutes.OWNER}/tasks`,
};

export const API_CREATE_TASK: APIDefinition<CreateTaskRequest, CreateTaskResponse> = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/tasks",
  requestBody: {} as CreateTaskRequest,
  responseBody: {} as CreateTaskResponse,
  buildUrlPath: () => `${APIBaseRoutes.OWNER}/tasks`,
};

export const API_UPDATE_TASK: APIDefinition<UpdateTaskRequest, UpdateTaskResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/tasks/:taskId",
  requestBody: {} as UpdateTaskRequest,
  responseBody: {} as UpdateTaskResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.OWNER}/tasks/${id}`,
};

export const API_DELETE_TASK: APIDefinition<undefined, DeleteTaskResponse> = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.OWNER,
  subUrl: "/tasks/:taskId",
  requestBody: undefined,
  responseBody: {} as DeleteTaskResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.OWNER}/tasks/${id}`,
};

export const API_GET_MY_TASKS: APIDefinition<undefined, GetMyTasksResponse> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/tasks",
  requestBody: undefined,
  responseBody: {} as GetMyTasksResponse,
  buildUrlPath: () => `${APIBaseRoutes.EMPLOYEE}/tasks`,
};

export const API_MARK_TASK_IN_PROGRESS: APIDefinition<undefined, MarkTaskInProgressResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/tasks/:taskId/in-progress",
  requestBody: undefined,
  responseBody: {} as MarkTaskInProgressResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.EMPLOYEE}/tasks/${id}/in-progress`,
};

export const API_MARK_TASK_DONE: APIDefinition<undefined, MarkTaskDoneResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/tasks/:taskId/done",
  requestBody: undefined,
  responseBody: {} as MarkTaskDoneResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.EMPLOYEE}/tasks/${id}/done`,
};

export const API_MARK_TASK_PENDING: APIDefinition<undefined, MarkTaskPendingResponse> = {
  method: APIMethod.PUT,
  baseUrl: APIBaseRoutes.EMPLOYEE,
  subUrl: "/tasks/:taskId/pending",
  requestBody: undefined,
  responseBody: {} as MarkTaskPendingResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.EMPLOYEE}/tasks/${id}/pending`,
};
