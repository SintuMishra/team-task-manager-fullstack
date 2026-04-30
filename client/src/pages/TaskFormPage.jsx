import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProjectMembers, getProject } from "../api/projects";
import { createTask, getTask, updateTask } from "../api/tasks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { formatDateTime, formatDateTimeLocal } from "../utils/format";
import { validateTaskForm } from "../utils/forms";

const defaultForm = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assignedToId: "",
};

export function TaskFormPage({ mode }) {
  const navigate = useNavigate();
  const { taskId, projectId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(defaultForm);
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (mode === "create") {
          const [{ project: projectData }, { members: memberList }] = await Promise.all([getProject(projectId), getProjectMembers(projectId)]);
          setProject(projectData);
          setMembers(memberList.map((member) => member.user));
          setForm((current) => ({
            ...current,
            assignedToId: memberList[0]?.user.id || "",
          }));
        } else {
          const { task } = await getTask(taskId);
          const [{ project: projectData }, { members: memberList }] = await Promise.all([
            getProject(task.project.id),
            getProjectMembers(task.project.id),
          ]);
          setProject(projectData);
          setMembers(memberList.map((member) => member.user));
          setForm({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: formatDateTimeLocal(task.dueDate),
            assignedToId: task.assignedToId,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mode, projectId, taskId]);

  const canManage = useMemo(() => user.role === "ADMIN" || project?.ownerId === user.id, [project, user]);

  useEffect(() => {
    if (!loading && project && !canManage) {
      navigate(`/projects/${project.id}`, { replace: true });
    }
  }, [canManage, loading, navigate, project]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateTaskForm(form);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = { ...form, dueDate: new Date(form.dueDate).toISOString() };
      if (mode === "create") {
        await createTask(project.id, payload);
        showToast("Task created successfully");
      } else {
        await updateTask(taskId, payload);
        showToast("Task updated successfully");
      }
      navigate(`/projects/${project.id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading task form..." />;
  }

  if (!canManage) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="panel p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">{mode === "create" ? "New task" : "Task settings"}</span>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-950">{mode === "create" ? "Create task" : "Edit task"}</h1>
            <p className="mt-2 text-sm text-slate-500">Keep scope, ownership, and deadlines crystal clear.</p>
          </div>
          <Link to={`/projects/${project.id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="task-title" className="label required">
              Task title
            </label>
            <input id="task-title" className="field" placeholder="Finalize landing page copy" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div>
            <label htmlFor="task-description" className="label required">
              Task description
            </label>
            <textarea id="task-description" className="field min-h-36 resize-none" placeholder="Describe the expected outcome and any notes." value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-status" className="label required">
                Status
              </label>
              <select id="task-status" className="field" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="label required">
                Priority
              </label>
              <select id="task-priority" className="field" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-due-date" className="label required">
                Due date
              </label>
              <input id="task-due-date" className="field" type="datetime-local" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
              {mode === "edit" && form.dueDate ? <p className="helper-text mt-2">Current deadline: {formatDateTime(form.dueDate)}</p> : null}
            </div>
            <div>
              <label htmlFor="task-assignee" className="label required">
                Assign to
              </label>
              <select id="task-assignee" className="field" value={form.assignedToId} onChange={(event) => setForm((current) => ({ ...current, assignedToId: event.target.value }))}>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              <p className="helper-text mt-2">Only project members or the project owner can be assigned to this task.</p>
            </div>
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : mode === "create" ? "Create task" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
