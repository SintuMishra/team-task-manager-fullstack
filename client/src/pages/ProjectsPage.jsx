import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject, getProjects } from "../api/projects";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProjectCard } from "../components/ProjectCard";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export function ProjectsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { projects: projectList } = await getProjects();
      setProjects(projectList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()) || project.description.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const confirmDelete = async () => {
    try {
      await deleteProject(pendingDelete.id);
      showToast("Project deleted successfully");
      await loadProjects();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to delete project", "error");
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading projects..." />;
  }

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-[28px] font-bold text-slate-950">Projects</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage projects, teams, and tasks.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <label htmlFor="project-search" className="sr-only">
                Search projects
              </label>
              <input id="project-search" className="field min-w-[240px]" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            {user.role === "ADMIN" ? (
              <Link to="/projects/new" className="btn-primary">
                Create Project
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found."
          description=""
          action={
            user.role === "ADMIN" ? (
              <Link to="/projects/new" className="btn-primary">
                Create Project
              </Link>
            ) : null
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const canManage = user.role === "ADMIN" || project.ownerId === user.id;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                canManage={canManage}
                onDelete={canManage ? () => setPendingDelete(project) : undefined}
              />
            );
          })}
        </section>
      )}

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete project"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This also removes its tasks and project membership.`}
        confirmText="Delete project"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
