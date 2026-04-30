import { http } from "./http";

export const getProjects = async () => (await http.get("/projects")).data;
export const getProject = async (id) => (await http.get(`/projects/${id}`)).data;
export const createProject = async (payload) => (await http.post("/projects", payload)).data;
export const updateProject = async (id, payload) => (await http.put(`/projects/${id}`, payload)).data;
export const deleteProject = async (id) => (await http.delete(`/projects/${id}`)).data;
export const getProjectMembers = async (id) => (await http.get(`/projects/${id}/members`)).data;
export const addProjectMember = async (id, payload) => (await http.post(`/projects/${id}/members`, payload)).data;
export const removeProjectMember = async (id, userId) => (await http.delete(`/projects/${id}/members/${userId}`)).data;
