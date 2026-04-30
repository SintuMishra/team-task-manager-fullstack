import { prisma } from "../config/prisma.js";
import { ApiError, asyncHandler } from "../utils/error.js";
import { addProjectMemberSchema, projectSchema } from "../utils/validators.js";

const projectInclude = {
  owner: {
    select: { id: true, name: true, email: true, role: true },
  },
  members: {
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" },
  },
  tasks: {
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { dueDate: "asc" },
  },
};

const formatProject = (project) => ({
  ...project,
  memberCount: project.members.length + 1,
  taskCount: project.tasks.length,
});

export const getProjects = asyncHandler(async (req, res) => {
  const where =
    req.user.role === "ADMIN"
      ? {}
      : {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { userId: req.user.id } } },
          ],
        };

  const projects = await prisma.project.findMany({
    where,
    include: projectInclude,
    orderBy: { updatedAt: "desc" },
  });

  res.json({ projects: projects.map(formatProject) });
});

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only admin users can create projects");
  }

  const data = projectSchema.parse(req.body);

  const project = await prisma.project.create({
    data: {
      ...data,
      ownerId: req.user.id,
    },
    include: projectInclude,
  });

  res.status(201).json({ project: formatProject(project) });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: projectInclude,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = project.ownerId === req.user.id;
  const isMember = project.members.some((member) => member.userId === req.user.id);

  if (!isAdmin && !isOwner && !isMember) {
    throw new ApiError(403, "You do not have access to this project");
  }

  res.json({ project: formatProject(project) });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const canManage = req.user.role === "ADMIN" || project.ownerId === req.user.id;
  if (!canManage) {
    throw new ApiError(403, "You do not have permission to update this project");
  }

  const data = projectSchema.parse(req.body);

  const updatedProject = await prisma.project.update({
    where: { id: req.params.id },
    data,
    include: projectInclude,
  });

  res.json({ project: formatProject(updatedProject) });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const canManage = req.user.role === "ADMIN" || project.ownerId === req.user.id;
  if (!canManage) {
    throw new ApiError(403, "You do not have permission to delete this project");
  }

  await prisma.project.delete({ where: { id: req.params.id } });

  res.json({ message: "Project deleted successfully" });
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = project.ownerId === req.user.id;
  const isMember = project.members.some((member) => member.userId === req.user.id);

  if (!isAdmin && !isOwner && !isMember) {
    throw new ApiError(403, "You do not have access to this project");
  }

  const members = [
    { id: project.owner.id, projectId: project.id, roleLabel: "Owner", user: project.owner },
    ...project.members.map((member) => ({ id: member.id, projectId: project.id, roleLabel: "Member", user: member.user })),
  ];

  res.json({ members });
});

export const addProjectMember = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      members: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const canManage = req.user.role === "ADMIN" || project.ownerId === req.user.id;
  if (!canManage) {
    throw new ApiError(403, "You do not have permission to manage project members");
  }

  const data = addProjectMemberSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

  if (!user) {
    throw new ApiError(404, "No user found with that email");
  }

  if (user.id === project.ownerId || project.members.some((member) => member.userId === user.id)) {
    throw new ApiError(409, "That user is already part of this project");
  }

  const member = await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: user.id,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  res.status(201).json({ member });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      members: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const canManage = req.user.role === "ADMIN" || project.ownerId === req.user.id;
  if (!canManage) {
    throw new ApiError(403, "You do not have permission to manage project members");
  }

  if (req.params.userId === project.ownerId) {
    throw new ApiError(400, "The project owner cannot be removed");
  }

  const membership = project.members.find((member) => member.userId === req.params.userId);

  if (!membership) {
    throw new ApiError(404, "That user is not a member of this project");
  }

  await prisma.projectMember.delete({ where: { id: membership.id } });

  await prisma.task.updateMany({
    where: {
      projectId: project.id,
      assignedToId: req.params.userId,
    },
    data: {
      assignedToId: project.ownerId,
    },
  });

  res.json({ message: "Project member removed successfully" });
});
