import { Router } from "express";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const projectRoutes = Router();

projectRoutes.use(requireAuth);

projectRoutes.get("/", getProjects);
projectRoutes.post("/", createProject);
projectRoutes.get("/:id", getProjectById);
projectRoutes.put("/:id", updateProject);
projectRoutes.delete("/:id", deleteProject);
projectRoutes.get("/:id/members", getProjectMembers);
projectRoutes.post("/:id/members", addProjectMember);
projectRoutes.delete("/:id/members/:userId", removeProjectMember);
