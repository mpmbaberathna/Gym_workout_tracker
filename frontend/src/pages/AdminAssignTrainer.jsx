import { useEffect, useState } from "react";
import api from "../api/axios";
import { validateNotEmpty } from "../utils/validation";

function AdminAssignTrainer() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");

        const users = res.data || [];
        setMembers(users.filter((u) => u.role === "member"));
        setTrainers(users.filter((u) => u.role === "trainer"));
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const assignTrainer = async () => {
    setError("");
    const m = validateNotEmpty(selectedMember, "Member");
    const t = validateNotEmpty(selectedTrainer, "Trainer");
    if (!m.valid) return setError(m.message);
    if (!t.valid) return setError(t.message);

    setSaving(true);
    try {
      await api.post("/users/assign-trainer", {
        memberId: selectedMember,
        trainerId: selectedTrainer,
      });

      setSelectedMember("");
      setSelectedTrainer("");
      setError("Trainer assigned successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Assignment failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light">
        <p className="text-brand-gray font-bold text-lg animate-pulse">Loading users…</p>
      </div>
    );

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-4xl space-y-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Admin</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Assign Trainer</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Quickly assign a trainer to a member.</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-sm font-bold text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="rounded-3xl border border-brand-border bg-brand-card p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-brand-gray">Member</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm"
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name ? `${m.name} — ${m.email}` : m.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-brand-gray">Trainer</label>
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm"
              >
                <option value="">Select Trainer</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name ? `${t.name} — ${t.email}` : t.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-brand-border flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-medium text-brand-gray">Tip: You can search members or trainers by name in the dropdowns.</p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => { setSelectedMember(''); setSelectedTrainer(''); }}
                className="flex-1 sm:flex-none rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light transition"
              >
                Reset
              </button>
              <button
                onClick={assignTrainer}
                disabled={saving}
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-2.5 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90 transition disabled:opacity-60"
              >
                {saving ? 'Assigning…' : 'Assign Trainer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAssignTrainer;