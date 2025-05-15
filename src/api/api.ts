import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

export interface Task {
    id: string;
    taskName: string;
    taskStory: string;
    taskDuration: number;
    assignedUserId: string;
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

export const getTasks = () => api.get<Task[]>("/tasks");
export const getTaskById = (id: string) => api.get<Task>(`/task/${id}`);
export const createTask = (task: Task) => api.post<Task>("/task", task);

export const getUsers = () => api.get<User[]>("/users");
export const getUserById = (id: string) => api.get<User>(`/user/${id}`);
export const createUser = (user: User) => api.post<User>("/user", user);

export const getTaskEstimates = () => api.get<TaskEstimate[]>("/taskEstimates");
export const getTaskEstimateById = (id: string) => api.get<TaskEstimate>(`/taskEstimate/${id}`);
export const createTaskEstimate = (taskEstimate: TaskEstimate) => api.post<TaskEstimate>("/taskEstimate", taskEstimate);