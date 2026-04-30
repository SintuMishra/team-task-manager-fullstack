import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateAuthForm } from "../utils/forms";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = validateAuthForm(form, true);
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signup(form);
      showToast("Account created successfully");
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-panel sm:p-10">
        <p className="font-display text-3xl font-extrabold text-slate-950">Sign Up</p>
        <p className="mt-2 text-sm text-slate-500">Create an account to get started.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="signup-name" className="label required">
              Full name
            </label>
            <input
              id="signup-name"
              className="field"
              placeholder="Alex Johnson"
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="label required">
              Email address
            </label>
            <input
              id="signup-email"
              className="field"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="label required">
              Password
            </label>
            <input
              id="signup-password"
              className="field"
              placeholder="Minimum 6 characters"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ocean">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
