import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/profile", label: "Account" },
];

export function Navbar({ user, onLogout }) {
  const location = useLocation();
  const titles = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/profile": "Account",
  };
  const pageTitle =
    titles[location.pathname] ||
    (location.pathname.includes("/projects/") ? "Project Details" : location.pathname.includes("/tasks/") ? "Task" : "Team Task Manager");
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="panel mb-4 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-display text-xl font-bold text-slate-950">{pageTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{currentDate}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="btn-secondary" aria-label="Logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
