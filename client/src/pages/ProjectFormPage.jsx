import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProject, getProject, updateProject } from "../api/projects";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateProjectForm } from "../utils/forms";

export function ProjectFormPage({ mode }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;

    const loadProject = async () => {
      try {
        const { project } = await getProject(projectId);
        setForm({ name: project.name, description: project.description });
        setOwnerId(project.ownerId);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [mode, projectId]);

  useEffect(() => {
    if (mode !== "edit" || loading) return;
    const canManage = user.role === "ADMIN" || ownerId === user.id;
    if (!canManage) {
      navigate(`/projects/${projectId}`, { replace: true });
    }
  }, [loading, mode, navigate, ownerId, projectId, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateProjectForm(form);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        const { project } = await createProject(form);
        showToast("Project created successfully");
        navigate(`/projects/${project.id}`);
      } else {
        await updateProject(projectId, form);
        showToast("Project updated successfully");
        navigate(`/projects/${projectId}`);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading project..." />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="panel p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">{mode === "create" ? "New workspace" : "Project settings"}</span>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-950">{mode === "create" ? "Create project" : "Edit project"}</h1>
            <p className="mt-2 text-sm text-slate-500">Define the project scope and collaboration context clearly.</p>
          </div>
          <Link to={mode === "create" ? "/projects" : `/projects/${projectId}`} className="btn-secondary">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="project-name" className="label required">
              Project name
            </label>
            <input id="project-name" className="field" placeholder="Website Redesign" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <label htmlFor="project-description" className="label required">
              Project description
            </label>
            <textarea
              id="project-description"
              className="field min-h-40 resize-none"
              placeholder="Describe the goal, scope, and collaboration plan."
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
            <p className="helper-text mt-2">This description appears on the dashboard and project workspace, so keep it specific and actionable.</p>
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : mode === "create" ? "Create project" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
