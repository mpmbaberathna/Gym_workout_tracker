import { useEffect, useState } from "react";
import { validateName, validatePassword, validatePasswordMatch, validateEmail } from "../utils/validation";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Shield, Trash2, Save, UserCog } from 'lucide-react';

export default function ProfileSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/users/me");
        setData({ name: res.data.name || "", email: res.data.email || "" });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (password) {
        const p = validatePassword(password);
        if (!p.valid) {
          alert(p.message);
          setSaving(false);
          return;
        }
        const m = validatePasswordMatch(password, confirmPassword);
        if (!m.valid) {
          alert(m.message);
          setSaving(false);
          return;
        }
      }

      const nameCheck = validateName(data.name);
      if (!nameCheck.valid) {
        alert(nameCheck.message);
        setSaving(false);
        return;
      }

      const emailCheck = validateEmail(data.email);
      if (!emailCheck.valid) {
        alert(emailCheck.message);
        setSaving(false);
        return;
      }

      const payload = { name: data.name, email: data.email };
      if (password) payload.password = password;
      const res = await api.put("/users/me", payload);
      setData({ name: res.data.name, email: res.data.email });
      setPassword("");
      setConfirmPassword("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) return;
    try {
      await api.delete("/users/me");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-blue-500"></div>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md max-w-2xl mx-auto">
      <div className="absolute -right-10 -top-10 rounded-full bg-blue-500/5 p-16 pointer-events-none">
        <UserCog size={80} className="text-blue-500/10" />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-800 shadow-inner">
             <User size={32} />
          </div>
          <h3 className="text-2xl font-black text-brand-dark">Account Settings</h3>
          <p className="mt-2 text-sm font-medium text-brand-gray">Manage your personal details and secure your account.</p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-1.5">
                <User size={14} /> Full Name
              </label>
              <input
                value={data.name}
                onChange={(e) => setData((s) => ({ ...s, name: e.target.value }))}
                placeholder="Full name"
                className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-1.5">
                <Mail size={14} /> Email Address
              </label>
              <input
                value={data.email}
                onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
                placeholder="Email address"
                className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-brand-border/50">
            <h4 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Shield size={16} className="text-indigo-500" /> Security
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-1.5">
                  <Lock size={14} /> New Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  type="password"
                  className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray flex items-center gap-1.5">
                  <Lock size={14} /> Confirm Password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  type="password"
                  className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {error && (
             <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-bold text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-brand-border/50">
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-3.5 text-sm font-bold text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <Trash2 size={16} /> Delete Account
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 disabled:opacity-60 disabled:hover:scale-100"
            >
              <Save size={16} className="transition-transform group-hover:scale-110" />
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
