import axios from "axios";
import type {
  Todo,
  TodoRequest,
  TodoStats,
  PagedResponse,
  TodoFetchParams,
  DeleteCompletedResponse,
} from "../types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1/todos",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

API.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    let message = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

const todoApi = {
  getAll: (params: TodoFetchParams) =>
    API.get<PagedResponse<Todo>>("", { params }),
  getById: (id: number) => API.get<Todo>(`/${id}`),
  create: (data: TodoRequest) => API.post<Todo>("", data),
  update: (id: number, data: TodoRequest) => API.put<Todo>(`/${id}`, data),
  toggleComplete: (id: number) => API.patch<Todo>(`/${id}/toggle`),
  delete: (id: number) => API.delete<void>(`/${id}`),
  deleteCompleted: () => API.delete<DeleteCompletedResponse>("/completed"),
  getStats: () => API.get<TodoStats>("/stats"),
};

export default todoApi;