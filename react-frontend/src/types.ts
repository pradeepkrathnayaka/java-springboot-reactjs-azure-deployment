export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TodoFetchParams {
  page: number;
  size: number;
  sortBy: string;
  direction: string;
  completed?: boolean;
  priority?: Priority;
  search?: string;
}

export interface DeleteCompletedResponse {
  deletedCount: number;
}

export interface AppNotification {
  type: "success" | "error";
  message: string;
}
