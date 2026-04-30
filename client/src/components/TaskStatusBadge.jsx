const statusStyles = {
  TODO: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-emerald-100 text-emerald-800",
};

export function TaskStatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
