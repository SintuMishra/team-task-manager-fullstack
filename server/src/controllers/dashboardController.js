import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/error.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const projectWhere =
    req.user.role === "ADMIN"
      ? {}
      : {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { userId: req.user.id } } },
          ],
        };

  const taskWhere =
    req.user.role === "ADMIN"
      ? {}
      : {
          OR: [
            { assignedToId: req.user.id },
            { project: { ownerId: req.user.id } },
            { project: { members: { some: { userId: req.user.id } } } },
          ],
        };

  const [projects, tasks, myAssignedTasks, recentTasks] = await Promise.all([
    prisma.project.findMany({
      where: projectWhere,
      include: {
        tasks: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.task.findMany({
      where: taskWhere,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.task.findMany({
      where: { assignedToId: req.user.id },
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      take: 6,
    }),
    prisma.task.findMany({
      where: taskWhere,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
  ]);

  const now = new Date();
  const totals = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    todoCount: tasks.filter((task) => task.status === "TODO").length,
    inProgressCount: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    doneCount: tasks.filter((task) => task.status === "DONE").length,
    overdueCount: tasks.filter((task) => task.status !== "DONE" && task.dueDate < now).length,
  };

  const projectProgress = projects.map((project) => {
    const total = project.tasks.length;
    const completed = project.tasks.filter((task) => task.status === "DONE").length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      id: project.id,
      name: project.name,
      totalTasks: total,
      completedTasks: completed,
      percentage,
    };
  });

  res.json({
    totalProjects: totals.totalProjects,
    totalTasks: totals.totalTasks,
    todoTasks: totals.todoCount,
    inProgressTasks: totals.inProgressCount,
    completedTasks: totals.doneCount,
    overdueTasks: totals.overdueCount,
    totals,
    myAssignedTasks,
    recentTasks,
    projectProgress,
  });
});
