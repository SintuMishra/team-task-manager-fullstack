const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH: "bg-rose-100 text-rose-700",
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[priority] || "bg-slate-100 text-slate-700"}`}>
      {priority}
    </span>
  );
}
