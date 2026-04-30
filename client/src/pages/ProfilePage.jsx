import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { formatDate } from "../utils/format";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Valid email is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateProfile(form);
      showToast("Profile updated successfully");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="panel p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-slate-950">Account</h1>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl bg-slate-950 p-5 text-white sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Role</p>
            <p className="mt-2 text-lg font-semibold">{user.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
            <p className="mt-2 text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Created</p>
            <p className="mt-2 text-lg font-semibold">{user.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="profile-name" className="label required">
              Full name
            </label>
            <input id="profile-name" className="field" placeholder="Your full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <label htmlFor="profile-email" className="label required">
              Email address
            </label>
            <input id="profile-email" className="field" placeholder="you@example.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
