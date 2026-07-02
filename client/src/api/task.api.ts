import api from "./axios";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedTasks {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const getTasks = async (params?: GetTasksParams): Promise<PaginatedTasks> => {
  const response = await api.get("/api/tasks", { params });
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData: Partial<Task>) => {
  const response = await api.post("/api/tasks", taskData);
  return response.data.data;
};

export const updateTask = async (id: string, taskData: Partial<Task>) => {
  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

export const suggestTaskDetails = async (title: string) => {
  const response = await api.post("/api/tasks/ai-suggest", { title });
  return response.data;
};

// --- AUTH API ---

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
}

export const login = async (data: LoginInput) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterInput) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};
