import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addProjectMember, getProject, getProjectMembers, removeProjectMember } from "../api/projects";
import { deleteTask, getProjectTasks, updateTaskStatus } from "../api/tasks";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PriorityBadge } from "../components/PriorityBadge";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { dueDateLabel, formatDate, isOverdue } from "../utils/format";

const initialFilters = {
  status: "",
  priority: "",
  assignedToId: "",
  overdue: "",
};

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProject = async () => {
    const [{ project: projectData }, { members: memberList }, { tasks: taskList }] = await Promise.all([
      getProject(projectId),
      getProjectMembers(projectId),
      getProjectTasks(projectId, Object.fromEntries(Object.entries(filters).filter(([, value]) => value))),
    ]);

    setProject(projectData);
    setMembers(memberList);
    setTasks(taskList);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await loadProject();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, filters.status, filters.priority, filters.assignedToId, filters.overdue]);

  const canManage = useMemo(() => user.role === "ADMIN" || project?.ownerId === user.id, [project, user]);

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!memberEmail.trim()) return;
    setMemberLoading(true);
    try {
      await addProjectMember(projectId, { email: memberEmail });
      showToast("Member added to project");
      setMemberEmail("");
      await loadProject();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to add project member", "error");
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeProjectMember(projectId, userId);
      showToast("Member removed from project");
      await loadProject();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to remove member", "error");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, { status });
      showToast("Task status updated");
      await loadProject();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update task status", "error");
    }
  };

  const confirmDeleteTask = async () => {
    try {
      await deleteTask(deleteTarget.id);
      showToast("Task deleted successfully");
      await loadProject();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to delete task", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading project..." />;
  }

  if (!project) {
    return <EmptyState title="Project not found" description="The project could not be loaded." />;
  }

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden p-6">
        <div className="mb-4 h-1.5 rounded-full bg-gradient-to-r from-ocean via-sky-400 to-accent" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold text-slate-950">{project.name}</h1>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{project.memberCount} members</span>
            </div>
            <p className="mt-3 max-w-3xl text-sm text-slate-500">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canManage ? (
              <>
                <Link to={`/projects/${project.id}/edit`} className="btn-secondary">
                  Edit
                </Link>
                <Link to={`/projects/${project.id}/tasks/new`} className="btn-primary">
                  Create Task
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <h2 className="font-display text-2xl font-bold text-slate-950">Team Members</h2>
            <div className="mt-5 space-y-3">
              {members.map((member) => (
                <div key={member.user.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">{member.user.name}</p>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{member.roleLabel}</span>
                    {canManage && member.roleLabel !== "Owner" ? (
                      <button type="button" onClick={() => handleRemoveMember(member.user.id)} className="text-sm font-semibold text-rose-600">
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {canManage ? (
              <form onSubmit={handleAddMember} className="mt-5 space-y-3">
                <div>
                  <label htmlFor="member-email" className="label required">
                    Add member by email
                  </label>
                  <input id="member-email" className="field" placeholder="teammate@example.com" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} />
                </div>
                <button type="submit" disabled={memberLoading} className="btn-secondary w-full">
                  {memberLoading ? "Adding member..." : "Add member"}
                </button>
              </form>
            ) : null}
          </div>

          <div className="panel p-6">
            <h2 className="font-display text-2xl font-bold text-slate-950">Filters</h2>
            <div className="mt-5 grid gap-3">
              <select aria-label="Filter tasks by status" className="field" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                <option value="">All statuses</option>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
              <select aria-label="Filter tasks by priority" className="field" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
                <option value="">All priorities</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <select aria-label="Filter tasks by assignee" className="field" value={filters.assignedToId} onChange={(event) => setFilters((current) => ({ ...current, assignedToId: event.target.value }))}>
                <option value="">All assignees</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
              <select aria-label="Filter overdue tasks" className="field" value={filters.overdue} onChange={(event) => setFilters((current) => ({ ...current, overdue: event.target.value }))}>
                <option value="">All deadlines</option>
                <option value="true">Overdue only</option>
              </select>
              <button type="button" className="btn-secondary" onClick={() => setFilters(initialFilters)}>
                Reset filters
              </button>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-950">Tasks</h2>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => {
              const overdue = isOverdue(task);
              const canEditTask = canManage;
              const canUpdateStatus = canManage || task.assignedToId === user.id;

              return (
                <div key={task.id} className={`rounded-3xl border p-5 ${overdue ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{task.title}</p>
                      <p className="mt-2 text-sm text-slate-500">{task.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>Assigned to {task.assignedTo?.name}</span>
                        <span>Due {formatDate(task.dueDate)}</span>
                        <span className={overdue ? "font-semibold text-rose-700" : ""}>{dueDateLabel(task.dueDate)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <TaskStatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {canUpdateStatus ? (
                      <select
                        className="field max-w-xs"
                        value={task.status}
                        onChange={(event) => handleStatusChange(task.id, event.target.value)}
                        aria-label={`Update status for ${task.title}`}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    ) : (
                      <p className="text-sm text-slate-500">Status can only be updated by the assignee.</p>
                    )}

                    {canEditTask ? (
                      <div className="flex gap-3">
                        <Link to={`/tasks/${task.id}/edit`} className="text-sm font-semibold text-ocean">
                          Edit
                        </Link>
                        <button type="button" onClick={() => setDeleteTarget(task)} className="text-sm font-semibold text-rose-600">
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 ? (
              <EmptyState
                title="No tasks available."
                description=""
                action={
                  canManage ? (
                    <Link to={`/projects/${project.id}/tasks/new`} className="btn-primary">
                      Create Task
                    </Link>
                  ) : null
                }
              />
            ) : null}
          </div>
        </div>
      </section>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete task"
        onConfirm={confirmDeleteTask}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
