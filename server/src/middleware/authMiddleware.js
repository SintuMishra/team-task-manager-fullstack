import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/error.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new ApiError(401, "Invalid authentication token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid authentication token"));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action"));
  }

  next();
};
