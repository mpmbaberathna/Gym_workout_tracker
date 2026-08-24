import { useEffect, useState } from "react";
import api from "../api/axios";

const TrainerProgress = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await api.get("/progress/trainer");
      setProgress(res.data);
    };
    fetchProgress();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-4xl space-y-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Trainer</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Member Progress</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Review notes and stats from your assigned members.</p>
        </div>

        {progress.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 p-12 text-center">
            <p className="text-sm font-bold text-brand-dark">No member progress yet.</p>
          </div>
        ) : (
          <ul className="grid gap-6">
            {progress.map((p) => (
              <li key={p._id} className="flex flex-col rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-brand-dark">{p.user?.name || p.user?.email}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-accent flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:self-start">
                    {p.weight && (
                      <span className="inline-flex items-center rounded-full bg-brand-light border border-brand-border px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm">
                        Weight: {p.weight} kg
                      </span>
                    )}
                    {p.reps && (
                      <span className="inline-flex items-center rounded-full bg-brand-light border border-brand-border px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm">
                        Reps: {p.reps}
                      </span>
                    )}
                  </div>
                </div>

                {p.notes && (
                  <div className="mt-6 rounded-2xl bg-brand-light border border-brand-border p-4 shadow-sm">
                    <p className="text-sm text-brand-gray"><span className="font-bold text-brand-dark">Notes:</span> {p.notes}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrainerProgress;