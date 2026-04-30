import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const http = axios.create({
  baseURL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("team-task-manager-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
