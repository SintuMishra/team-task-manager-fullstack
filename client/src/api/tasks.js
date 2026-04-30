import { http } from "./http";

export const getProjectTasks = async (projectId, params) =>
  (await http.get(`/projects/${projectId}/tasks`, { params })).data;
export const createTask = async (projectId, payload) => (await http.post(`/projects/${projectId}/tasks`, payload)).data;
export const getTask = async (id) => (await http.get(`/tasks/${id}`)).data;
export const updateTask = async (id, payload) => (await http.put(`/tasks/${id}`, payload)).data;
export const updateTaskStatus = async (id, payload) => (await http.patch(`/tasks/${id}/status`, payload)).data;
export const deleteTask = async (id) => (await http.delete(`/tasks/${id}`)).data;
