import { Link } from "react-router-dom";
import { formatDate, isOverdue } from "../utils/format";
import { PriorityBadge } from "./PriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";

export function TaskCard({ task, canEdit }) {
  const overdue = isOverdue(task);

  return (
    <div className={`rounded-3xl border p-5 ${overdue ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{task.title}</p>
          <p className="mt-2 text-sm text-slate-500">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <TaskStatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
        <span>Assigned to: {task.assignedTo?.name || "Unassigned"}</span>
        <span>Due: {formatDate(task.dueDate)}</span>
        <span>Project: {task.project?.name}</span>
      </div>

      {overdue ? <p className="mt-3 text-sm font-semibold text-rose-700">Overdue and still open</p> : null}

      {canEdit ? (
        <div className="mt-4">
          <Link to={`/tasks/${task.id}/edit`} className="text-sm font-semibold text-ocean">
            Edit task
          </Link>
        </div>
      ) : null}
    </div>
  );
}
