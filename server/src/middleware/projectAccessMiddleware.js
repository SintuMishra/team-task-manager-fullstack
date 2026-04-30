import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/error.js";

export const loadProjectAccess = async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: true,
    },
  });

  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = project.ownerId === req.user.id;
  const isMember = project.members.some((member) => member.userId === req.user.id);

  req.project = project;
  req.projectAccess = {
    isAdmin,
    isOwner,
    isMember: isMember || isOwner,
    canManage: isAdmin || isOwner,
  };

  if (!req.projectAccess.isAdmin && !req.projectAccess.isMember) {
    return next(new ApiError(403, "You do not have access to this project"));
  }

  next();
};
