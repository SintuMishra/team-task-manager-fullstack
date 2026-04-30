export function EmptyState({ title, description, action }) {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-14 text-center">
      <h3 className="font-display text-2xl font-bold tracking-tight text-slate-950">{title}</h3>
      {description ? <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
