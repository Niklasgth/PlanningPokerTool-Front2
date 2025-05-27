import axios from "axios";

// === Skapa Axios-instans ===
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// === Interceptor: Lägg till JWT-token i varje request ===
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwtToken");
  console.log("⏱ Sending request to:", config.url);
  console.log("🔐 Token present?", !!token);

  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📤 Authorization header:", config.headers.Authorization);
  }

  return config;
});

// === Typer ===
export interface Task {
  id?: string;
  taskName: string;
  taskStory?: string;
  taskDuration?: number;
  assignedUsers: User[];
}

export interface User {
  id: string;
  userName: string;
  userPassword: string;
}

export interface LoginRequest {
  userName: string;
  userPassword: string;
}

export interface LoginResponse {
  token: string;
  userId: string;      
  userName: string;
}

export interface TaskEstimate {
  id: string;
  taskId: string;
  userId: string;
  estDurationHours: number;
}

export interface TaskStatsDTO {
  taskId: string;
  totalEstimates: number;
  averageEstimate: number;
  median: number;
  stdDeviation: number;
}

export interface StatsDTO {
  totalTasks: number;
  totalCompletedTasks: number;
  avgAccuracy: number;
  avgEstimateCount: number;
  avgActualDuration: number;
  avgEstimateValue: number;
}

export interface CreateTaskDTO {
  taskName: string;
  taskStory: string;
}

// === API-anrop ===

// -- Tasks --
export const getTasks = () => api.get<Task[]>("/api/tasks");
export const getTaskById = (id: string) => api.get<Task>(`/api/task/${id}`);
export const createTask = (task: CreateTaskDTO) => api.post<Task>("/api/task", task);
export const updateTask = (id: string, updatedFields: Partial<Task>) =>
  api.patch<Task>(`/api/task/${id}`, updatedFields);

// -- Users --
export const getUsers = () => api.get<User[]>("/api/users");
export const getUserById = (id: string) => api.get<User>(`/api/user/${id}`);
export const createUser = (user: Omit<User, "id">) =>
  api.post<User>("/api/user/register", user);

// -- Login --
export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/api/user/login", data);

  const { token, userId, userName } = response.data;

  if (token) {
    localStorage.setItem("jwtToken", token);
  }


  if (userId && userName) {
    localStorage.setItem("user", JSON.stringify({ id: userId, userName }));
  }

  return response;
};

// -- Task Estimates --
export const getTaskEstimates = () => api.get<TaskEstimate[]>("/api/taskEstimates");
export const getTaskEstimateById = (id: string) =>
  api.get<TaskEstimate>(`/api/taskEstimate/${id}`);
export const createTaskEstimate = (taskEstimate: Omit<TaskEstimate, "id">) =>
  api.post<TaskEstimate>("/api/taskEstimate", taskEstimate);

// -- Statistik --
export const getStatsByTaskId = (id: string) => api.get<TaskStatsDTO>(`/api/stats/${id}`);
export const getAllStats = () => api.get<StatsDTO>("/api/stats");

// -- Assign Users --
export const assignUsersToTask = async (taskId: string, userIds: string[]) => {
  return api.put(`/api/${taskId}/assign-users`, userIds);
};
