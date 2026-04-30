import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RoleGuard({ roles, children }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
