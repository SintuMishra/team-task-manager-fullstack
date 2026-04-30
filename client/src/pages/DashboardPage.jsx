import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import { DashboardCard } from "../components/DashboardCard";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriorityBadge } from "../components/PriorityBadge";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { dueDateLabel, formatDate, isOverdue } from "../utils/format";

const emptyDashboard = {
  totalProjects: 0,
  totalTasks: 0,
  todoTasks: 0,
  inProgressTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  totals: {
    totalProjects: 0,
    totalTasks: 0,
    todoCount: 0,
    inProgressCount: 0,
    doneCount: 0,
    overdueCount: 0,
  },
  myAssignedTasks: [],
  recentTasks: [],
  projectProgress: [],
};

const normalizeDashboard = (payload = {}) => ({
  ...emptyDashboard,
  ...payload,
  totals: {
    ...emptyDashboard.totals,
    ...(payload.totals || {}),
    totalProjects: payload.totalProjects ?? payload.totals?.totalProjects ?? 0,
    totalTasks: payload.totalTasks ?? payload.totals?.totalTasks ?? 0,
    todoCount: payload.todoTasks ?? payload.totals?.todoCount ?? 0,
    inProgressCount: payload.inProgressTasks ?? payload.totals?.inProgressCount ?? 0,
    doneCount: payload.completedTasks ?? payload.totals?.doneCount ?? 0,
    overdueCount: payload.overdueTasks ?? payload.totals?.overdueCount ?? 0,
  },
  myAssignedTasks: Array.isArray(payload.myAssignedTasks) ? payload.myAssignedTasks : [],
  recentTasks: Array.isArray(payload.recentTasks) ? payload.recentTasks : [],
  projectProgress: Array.isArray(payload.projectProgress) ? payload.projectProgress : [],
});

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboard();
      setDashboard(normalizeDashboard(data));
    } catch (apiError) {
      setDashboard(emptyDashboard);
      setError(apiError.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const cards = [
    { title: "Total Projects", value: dashboard.totals.totalProjects, accent: "bg-slate-950" },
    { title: "Total Tasks", value: dashboard.totals.totalTasks, accent: "bg-ocean" },
    { title: "In Progress", value: dashboard.totals.inProgressCount, accent: "bg-blue-500" },
    { title: "Completed", value: dashboard.totals.doneCount, accent: "bg-emerald-500" },
    { title: "Overdue", value: dashboard.totals.overdueCount, accent: "bg-rose-500" },
  ];

  const totalStatus = Math.max(dashboard.totals.totalTasks, 1);
  const statusData = [
    { label: "TODO", value: dashboard.totals.todoCount, color: "bg-amber-400" },
    { label: "IN_PROGRESS", value: dashboard.totals.inProgressCount, color: "bg-blue-500" },
    { label: "DONE", value: dashboard.totals.doneCount, color: "bg-emerald-500" },
  ];

  const overdueTasks = useMemo(
    () => dashboard.recentTasks.filter((task) => isOverdue(task)).slice(0, 3),
    [dashboard.recentTasks]
  );

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="section-heading">Dashboard</h1>
            <p className="section-copy">Overview of projects, tasks, and progress.</p>
          </div>
          <Link to="/projects" className="btn-secondary">
            View Projects
          </Link>
        </div>
      </section>

      {error ? (
        <section className="panel border border-rose-200 bg-rose-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-800">Dashboard could not be loaded.</p>
              <p className="mt-1 text-sm text-rose-700">{error}</p>
            </div>
            <button type="button" onClick={loadDashboard} className="btn-secondary">
              Retry
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-950">Project Progress</h2>
              <p className="text-sm text-slate-500">Current progress across projects.</p>
            </div>
            <Link to="/projects" className="text-sm font-semibold text-ocean">
              Projects
            </Link>
          </div>

          <div className="space-y-3">
            {dashboard.projectProgress.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-slate-950">{project.name}</p>
                  <p className="text-sm font-semibold text-slate-600">{project.percentage}%</p>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${project.percentage}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {project.completedTasks} of {project.totalTasks} tasks complete
                </p>
              </div>
            ))}
            {dashboard.projectProgress.length === 0 ? <EmptyState title="No projects found." description="" /> : null}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-950">Task Status</h2>
            <p className="text-sm text-slate-500">Distribution of tasks by status.</p>
          </div>
          <div className="space-y-4">
            {statusData.map((item) => {
              const width = `${Math.round((item.value / totalStatus) * 100)}%`;
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">{item.label.replace("_", " ")}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width }} />
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3.5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">Overdue</p>
                <p className="mt-2 font-display text-3xl font-bold text-rose-800">{dashboard.totals.overdueCount}</p>
              </div>
              <div className="mt-3 space-y-2">
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((task) => (
                    <div key={task.id} className="rounded-xl bg-white/80 px-3 py-2.5 text-sm text-rose-900">
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-rose-700">{task.project.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-rose-800">No overdue tasks.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-950">My Assigned Tasks</h2>
            <p className="text-sm text-slate-500">Tasks assigned to you.</p>
          </div>
          <div className="space-y-3">
            {dashboard.myAssignedTasks.map((task) => (
              <div key={task.id} className={`rounded-2xl border p-3.5 ${isOverdue(task) ? "border-rose-200 bg-rose-50" : "border-slate-100 bg-slate-50/90"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-1.5 text-sm text-slate-500">{task.project?.name}</p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <div>
                    <p>{formatDate(task.dueDate)}</p>
                    <p className={isOverdue(task) ? "text-rose-700" : "text-slate-500"}>{dueDateLabel(task.dueDate)}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            ))}
            {dashboard.myAssignedTasks.length === 0 ? <p className="text-sm text-slate-500">No tasks available.</p> : null}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-950">Recent Tasks</h2>
            <p className="text-sm text-slate-500">Recent activity across visible tasks.</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {dashboard.recentTasks.map((task) => (
              <div key={task.id} className={`rounded-2xl border p-3.5 ${isOverdue(task) ? "border-rose-200 bg-rose-50/80" : "border-slate-100 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{task.title}</p>
                  <TaskStatusBadge status={task.status} />
                </div>
                <p className="mt-1.5 text-sm text-slate-500">{task.project?.name}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>Assigned to {task.assignedTo?.name || "Unassigned"}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
