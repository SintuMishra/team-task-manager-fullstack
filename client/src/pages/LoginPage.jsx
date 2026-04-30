import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateAuthForm } from "../utils/forms";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = validateAuthForm(form);
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(form);
      showToast("Welcome back");
      navigate(location.state?.from || "/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-slate-900 px-8 py-10 text-white lg:block">
          <h1 className="font-display text-4xl font-bold leading-tight">Team Task Manager</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Manage projects, tasks, and team progress with role-based access.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Project and task management",
              "Team member assignments",
              "Admin and member access control",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center p-8 sm:p-10">
          <div className="w-full">
            <p className="font-display text-[30px] font-bold text-slate-950">Login</p>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="login-email" className="label required">
                  Email address
                </label>
                <input
                  id="login-email"
                  className="field"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="label required">
                  Password
                </label>
                <input
                  id="login-password"
                  className="field"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">Demo credentials</p>
              <p className="mt-2">Admin: admin@example.com / admin123</p>
              <p>Member: member@example.com / member123</p>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Need an account?{" "}
              <Link to="/signup" className="font-semibold text-ocean">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
