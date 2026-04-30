import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/profile", label: "Account" },
];

export function Sidebar({ user }) {
  return (
    <aside className="panel hidden w-60 shrink-0 flex-col justify-between p-4 lg:flex">
      <div className="space-y-6">
        <div>
          <p className="font-display text-xl font-bold tracking-tight text-slate-950">Team Task Manager</p>
        </div>

        <nav aria-label="Sidebar navigation" className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
        <div className="mt-3 inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
          {user?.role}
        </div>
      </div>
    </aside>
  );
}
