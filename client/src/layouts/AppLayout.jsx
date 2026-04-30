import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1360px] gap-4 px-3 py-3 sm:px-5 lg:px-6">
        <Sidebar user={user} />

        <div className="min-w-0 flex-1">
          <Navbar user={user} onLogout={handleLogout} />

          <Outlet />
        </div>
      </div>
    </div>
  );
}
