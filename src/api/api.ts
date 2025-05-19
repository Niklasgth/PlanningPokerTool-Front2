import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

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

export interface TaskEstimate {
    id: string;
    taskId: string;
    userId: string;
    estimatedDuration: number;
}

export const getTasks = () => api.get<Task[]>("/api/tasks");
export const getTaskById = (id: string) => api.get<Task>(`/api/task/${id}`);
export const createTask = (task: Task) => api.post<Task>("/api/task", task);

export const getUsers = () => api.get<User[]>("/api/users");
export const getUserById = (id: string) => api.get<User>(`/api/user/${id}`);
// export const createUser = (user: User) => api.post<User>("/api/user", user);

// i do not need to create a new id cuase backend do it already so I skipping creating new id . so Omit skipping creating Id
export const createUser = (user: Omit<User, 'id'>) => api.post<User>("/api/user/register", user);
  

export const getTaskEstimates = () => api.get<TaskEstimate[]>("/api/taskEstimates");
export const getTaskEstimateById = (id: string) => api.get<TaskEstimate>(`/api/taskEstimate/${id}`);
export const createTaskEstimate = (taskEstimate: TaskEstimate) => api.post<TaskEstimate>("/api/taskEstimate", taskEstimate);