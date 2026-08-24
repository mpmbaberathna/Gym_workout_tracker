import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function MemberSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.get("/schedules/member");

        if (Array.isArray(res.data)) {
          setSchedules(res.data);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error(err);
        // If not authenticated, redirect to login
        if (err?.response?.status === 401) {
          navigate('/login');
          return;
        }

        setError(err?.response?.data?.message || "Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <p className="text-slate-300">Loading…</p>;

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Schedule</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">My Schedule</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Your upcoming workouts and assigned sessions.</p>
        </div>

        <div className="mx-auto max-w-4xl">
          {error && (
            <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <section className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8">
            {schedules.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-brand-border bg-brand-light p-8 text-center text-sm font-medium text-brand-gray">
                No workouts scheduled yet.
              </p>
            ) : (
              <ul className="grid gap-6">
                {schedules.map((s) => (
                  <li key={s._id} className={`flex flex-col rounded-3xl border border-brand-border bg-brand-light p-6 shadow-sm transition hover:shadow-md hover:bg-brand-card ${s.status === 'completed' ? 'opacity-80' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className={`text-lg font-bold text-brand-dark ${s.status === 'completed' ? 'line-through decoration-brand-gray/50' : ''}`}>
                            {(s.workout && (s.workout.title || s.workout.name)) || s.workout || 'Untitled workout'}
                          </p>
                          {s.status === 'completed' && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 border border-green-200">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-accent flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                          </svg>
                          {isNaN(new Date(s.scheduledDate).getTime()) ? 'Unknown Date' : new Date(s.scheduledDate).toLocaleString()}
                        </p>
                      </div>
                      
                      {s.status !== 'completed' && (
                        <button 
                          onClick={async () => {
                            try {
                              const res = await api.put(`/schedules/${s._id}/complete`);
                              setSchedules(prev => prev.map(sch => sch._id === s._id ? res.data : sch));
                            } catch (e) {
                              alert(e?.response?.data?.message || 'Failed to complete schedule');
                            }
                          }}
                          className="shrink-0 rounded-full bg-brand-primary px-5 py-2 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90 transition"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                    {s.workout && (s.workout.notes || s.notes) && (
                      <div className="mt-4 text-sm text-brand-gray bg-brand-card rounded-2xl p-4 border border-brand-border shadow-sm">
                        <span className="font-bold text-brand-dark block mb-1">Notes:</span> 
                        {s.workout?.notes || s.notes}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default MemberSchedule;