import { useEffect, useState } from "react";
import api from "../api/axios";


const MemberProgress = () => {
  const [progress, setProgress] = useState([]);
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProgress = async () => {
    const res = await api.get("/progress");
    setProgress(res.data);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const addProgress = async () => {
    await api.post("/progress", {
      notes,
      weight,
      reps,
    });

    setNotes("");
    setWeight("");
    setReps("");
    fetchProgress();
  };

  const deleteProgress = async (id) => {
    if (!window.confirm("Delete this progress entry?")) return;
    await api.delete(`/progress/${id}`);
    fetchProgress();
  };

  const updateProgress = async (id) => {
  await api.put(`/progress/${id}`, {
    notes,
    weight,
    reps,
  });

  setEditingId(null);
  setNotes("");
  setWeight("");
  setReps("");
  fetchProgress();
};

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Progress</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">My Progress</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">
            Log today's effort and watch your journey add up over time.
          </p>
        </div>

        {/* add progress form */}
        <div className="mx-auto max-w-2xl rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-dark">
            {editingId ? "Edit Progress" : "Add Progress"}
          </h2>
          <p className="mt-1 text-sm text-brand-gray">
            Keep it simple: a few notes, today's weight, and key reps.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
                Notes
              </label>
              <textarea
                rows={3}
                placeholder="How did this session feel? What did you hit?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Reps
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNotes("");
                    setWeight("");
                    setReps("");
                  }}
                  className="mr-3 inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  editingId ? updateProgress(editingId) : addProgress()
                }
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-2.5 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/90"
              >
                {editingId ? "Update entry" : "Save entry"}
              </button>
            </div>
          </div>
        </div>

        {/* progress history */}
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h2 className="text-2xl font-extrabold text-brand-dark">Progress History</h2>
            <span className="inline-flex items-center rounded-full bg-brand-card border border-brand-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-sm">
              {progress.length} entr{progress.length === 1 ? "y" : "ies"}
            </span>
          </div>

          {progress.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 p-8 text-center text-sm font-medium text-brand-gray">
              No progress logged yet. Log your first session above.
            </p>
          ) : (
            <ul className="grid gap-4">
              {progress.map((p) => (
                <li
                  key={p._id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm transition sm:flex-row sm:items-center hover:shadow-md"
                >
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-accent flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-brand-gray space-y-1">
                      {p.notes && <div><span className="font-bold text-brand-dark">Notes:</span> {p.notes}</div>}
                      {p.weight && <div><span className="font-bold text-brand-dark">Weight:</span> {p.weight} kg</div>}
                      {p.reps && <div><span className="font-bold text-brand-dark">Reps:</span> {p.reps}</div>}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(p._id);
                        setNotes(p.notes || "");
                        setWeight(p.weight || "");
                        setReps(p.reps || "");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-full bg-brand-card border border-brand-border px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProgress(p._id)}
                      className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProgress;