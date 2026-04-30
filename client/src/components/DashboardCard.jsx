export function DashboardCard({ title, value, accent = "bg-slate-950", subtitle }) {
  return (
    <div className="panel p-4">
      <div className={`mb-3 h-1 w-10 rounded-full ${accent}`} />
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      {subtitle ? <p className="mt-1.5 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
