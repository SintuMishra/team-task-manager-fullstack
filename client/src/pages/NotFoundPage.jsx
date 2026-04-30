import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel max-w-2xl overflow-hidden p-10 text-center">
        <div className="mb-5 h-1.5 rounded-full bg-gradient-to-r from-ocean via-sky-400 to-accent" />
        <p className="font-display text-6xl font-extrabold text-slate-950">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">The page you're looking for doesn't exist, may have moved, or might require a different route than the one you entered.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/dashboard" className="btn-primary">
            Back to dashboard
          </Link>
          <Link to="/projects" className="btn-secondary">
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
