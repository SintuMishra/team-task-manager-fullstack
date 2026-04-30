import { Link } from "react-router-dom";
import { percentage } from "../utils/format";

export function ProjectCard({ project, canManage, onDelete }) {
  const doneCount = project.tasks.filter((task) => task.status === "DONE").length;
  const progress = percentage(doneCount, project.tasks.length);

  return (
    <div className="panel flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-slate-950">{project.name}</p>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">{project.description}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Members</p>
          <p className="mt-1 font-semibold text-slate-950">{project.memberCount}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Tasks</p>
          <p className="mt-1 font-semibold text-slate-950">{project.taskCount}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-900">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={`/projects/${project.id}`} className="btn-primary">
          Open
        </Link>
        {canManage ? (
          <>
            <Link to={`/projects/${project.id}/edit`} className="btn-secondary">
              Edit
            </Link>
            <button type="button" onClick={onDelete} className="btn-danger-outline" aria-label={`Delete ${project.name}`}>
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
