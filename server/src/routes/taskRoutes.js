import { Router } from "express";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const taskRoutes = Router();

taskRoutes.use(requireAuth);

taskRoutes.get("/projects/:projectId/tasks", getProjectTasks);
taskRoutes.post("/projects/:projectId/tasks", createTask);
taskRoutes.get("/tasks/:id", getTaskById);
taskRoutes.put("/tasks/:id", updateTask);
taskRoutes.patch("/tasks/:id/status", updateTaskStatus);
taskRoutes.delete("/tasks/:id", deleteTask);
