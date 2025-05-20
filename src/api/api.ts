import axios from "axios";


export const api = axios.create({

  baseURL: "http://localhost:8080",
});


// === Typer ===
export interface Task {
  id?: string;
  taskName: string;
  taskStory?: string;
  taskDuration?: number;
  assignedUserId?: string;
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


// === Task-anrop ===
export const getTasks = () => api.get<Task[]>("/api/tasks");
export const getTaskById = (id: string) => api.get<Task>(`/api/task/${id}`);
export const createTask = (task: Task) => api.post<Task>("/api/task", task);

// === User-anrop ===
export const getUsers = () => api.get<User[]>("/api/users");
export const getUserById = (id: string) => api.get<User>(`/api/user/${id}`);
export const createUser = (user: Omit<User, 'id'>) =>
  api.post<User>("/api/user/register", user);
export const loginUser = (data: LoginRequest) =>
  api.post<User>("/api/user/login", data);

// === TaskEstimate-anrop ===
export const getTaskEstimates = () => api.get<TaskEstimate[]>("/api/taskEstimates");
export const getTaskEstimateById = (id: string) =>
  api.get<TaskEstimate>(`/api/taskEstimate/${id}`);
export const createTaskEstimate = (taskEstimate: Omit<TaskEstimate, 'id'>) =>
  api.post<TaskEstimate>("/api/taskEstimate", taskEstimate);

// === Statistik-anrop ===
export const getStatsByTaskId = (id: string) => api.get<TaskStatsDTO>(`/api/stats/${id}`);