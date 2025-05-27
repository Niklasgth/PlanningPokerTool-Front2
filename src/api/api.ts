import axios from "axios";


export const api = axios.create({

  baseURL: "http://localhost:8080",
});

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('jwtToken');

//   if (token) {
//     // Make sure headers exist
//     if (!config.headers) {
//       config.headers = {};
//     }

//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Optionally add a response interceptor to handle 401 globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // e.g. redirect to login page or clear stored user
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
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
  // assignedUserId?: string;
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
  id: string;
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


// === Task-anrop ===
export const getTasks = () => api.get<Task[]>("/api/tasks");
export const getTaskById = (id: string) => api.get<Task>(`/api/task/${id}`);
export const createTask = (task: CreateTaskDTO) => api.post<Task>("/api/task", task);
export const updateTask = (id: string, updatedFields: Partial<Task>) =>
  api.patch<Task>(`/api/task/${id}`, updatedFields);

// === User-anrop ===
export const getUsers = () => api.get<User[]>("/api/users");
export const getUserById = (id: string) => api.get<User>(`/api/user/${id}`);
export const createUser = (user: Omit<User, 'id'>) =>
  api.post<User>("/api/user/register", user);
export const loginUser = (data: LoginRequest) =>
  api.post<LoginResponse>("/api/user/login", data);

// export const loginUser = (data: LoginRequest) =>
//   api.post<User>("/api/user/login", data);

// === TaskEstimate-anrop ===
export const getTaskEstimates = () => api.get<TaskEstimate[]>("/api/taskEstimates");
export const getTaskEstimateById = (id: string) =>
  api.get<TaskEstimate>(`/api/taskEstimate/${id}`);
export const createTaskEstimate = (taskEstimate: Omit<TaskEstimate, 'id'>) =>
  api.post<TaskEstimate>("/api/taskEstimate", taskEstimate);

// === Statistik-anrop ===
export const getStatsByTaskId = (id: string) => api.get<TaskStatsDTO>(`/api/stats/${id}`);
export const getAllStats = () => api.get<StatsDTO>(`/api/stats`);

// To export assignUsersToTask
export const assignUsersToTask = async (taskId: string, userIds: string[]) => {
  return api.put(`/api/${taskId}/assign-users`, userIds); // matches your backend @PutMapping("/{id}/assign-users")
};