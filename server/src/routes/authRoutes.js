import { Router } from "express";
import { getCurrentUser, login, signup, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, getCurrentUser);
authRoutes.put("/me", requireAuth, updateProfile);
