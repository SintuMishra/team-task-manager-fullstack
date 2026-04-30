import { prisma } from "../config/prisma.js";
import { ApiError, asyncHandler } from "../utils/error.js";
import { taskSchema, taskStatusSchema } from "../utils/validators.js";

const taskInclude = {
  project: {
    select: { id: true, name: true, ownerId: true },
  },
  assignedTo: {
    select: { id: true, name: true, email: true, role: true },
  },
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
};

const canManageProject = (user, project) => user.role === "ADMIN" || project.ownerId === user.id;

export const getProjectTasks = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.projectId },
    include: { members: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = project.ownerId === req.user.id;
  const isMember = project.members.some((member) => member.userId === req.user.id);

  if (!isAdmin && !isOwner && !isMember) {
    throw new ApiError(403, "You do not have access to this project's tasks");
  }

  const where = {
    projectId: project.id,
    ...(req.query.status ? { status: req.query.status } : {}),
    ...(req.query.priority ? { priority: req.query.priority } : {}),
    ...(req.query.assignedToId ? { assignedToId: req.query.assignedToId } : {}),
    ...(req.query.overdue === "true"
      ? { dueDate: { lt: new Date() }, status: { not: "DONE" } }
      : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.projectId },
    include: { members: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (!canManageProject(req.user, project)) {
    throw new ApiError(403, "You do not have permission to create tasks for this project");
  }

  const data = taskSchema.parse(req.body);
  const isValidAssignee =
    data.assignedToId === project.ownerId ||
    project.members.some((member) => member.userId === data.assignedToId);

  if (!isValidAssignee) {
    throw new ApiError(400, "Assigned user must be part of this project");
  }

  const task = await prisma.task.create({
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
      projectId: project.id,
      createdById: req.user.id,
    },
    include: taskInclude,
  });

  res.status(201).json({ task });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: {
      ...taskInclude,
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const isAdmin = req.user.role === "ADMIN";
  const isOwner = task.project.ownerId === req.user.id;
  const isMember = task.project.members.some((member) => member.userId === req.user.id);
  const isAssignee = task.assignedToId === req.user.id;

  if (!isAdmin && !isOwner && !isMember && !isAssignee) {
    throw new ApiError(403, "You do not have access to this task");
  }

  res.json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const existingTask = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: {
      project: {
        include: { members: true },
      },
    },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  if (!canManageProject(req.user, existingTask.project)) {
    throw new ApiError(403, "You do not have permission to update this task");
  }

  const data = taskSchema.parse(req.body);
  const isValidAssignee =
    data.assignedToId === existingTask.project.ownerId ||
    existingTask.project.members.some((member) => member.userId === data.assignedToId);

  if (!isValidAssignee) {
    throw new ApiError(400, "Assigned user must be part of this project");
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
    },
    include: taskInclude,
  });

  res.json({ task });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: { project: true },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const data = taskStatusSchema.parse(req.body);
  const canManage = canManageProject(req.user, task.project);
  const isAssignee = task.assignedToId === req.user.id;

  if (!canManage && !isAssignee) {
    throw new ApiError(403, "You do not have permission to update this task status");
  }

  const updatedTask = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: data.status },
    include: taskInclude,
  });

  res.json({ task: updatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: { project: true },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!canManageProject(req.user, task.project)) {
    throw new ApiError(403, "You do not have permission to delete this task");
  }

  await prisma.task.delete({ where: { id: req.params.id } });

  res.json({ message: "Task deleted successfully" });
});
