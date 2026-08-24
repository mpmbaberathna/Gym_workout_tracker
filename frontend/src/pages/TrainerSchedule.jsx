import { useEffect, useState } from "react";
import api from "../api/axios";
import { validateNotEmpty, validateDateNotPast } from "../utils/validation";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/ui/button";

function TrainerSchedule() {
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [selectedMember, setSelectedMember] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [date, setDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [workoutFilter, setWorkoutFilter] = useState("");
  const [saving, setSaving] = useState(false);

  /* ========================= fetch initial data ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, workoutsRes, schedulesRes] = await Promise.all([
          api.get("/users/members"),
          api.get("/workouts/trainer"),
          api.get("/schedules/trainer"),
        ]);

        setMembers(membersRes.data);
        setWorkouts(workoutsRes.data);
        setSchedules(schedulesRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // allow manual refresh of members (useful when dropdown appears empty)
  async function refreshMembers() {
    try {
      const res = await api.get("/users/members");
      console.log("refreshMembers:", res.data);
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to refresh members", err);
      alert("Failed to refresh members");
    }
  }

  // clear success message after a short delay
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  /* ========================= create schedule ========================= */
  const handleSchedule = async () => {
    setError("");
    setSuccess("");
    const m = validateNotEmpty(selectedMember, "Member");
    if (!m.valid) return setError(m.message);
    const w = validateNotEmpty(selectedWorkout, "Workout");
    if (!w.valid) return setError(w.message);
    const d = validateDateNotPast(date);
    if (!d.valid) return setError(d.message);

    const payload = {
      memberId: selectedMember,
      workoutId: selectedWorkout,
      scheduledDate: date,
    };

    setSaving(true);
    try {
      if (editingScheduleId) {
        try {
          await api.put(`/schedules/${editingScheduleId}`, payload);
        } catch (putErr) {
          const putStatus = putErr?.response?.status;
          // If schedule not found or not owned by current trainer, query the schedule
          // to determine actual ownership and show a helpful error instead of creating duplicates.
          if (putStatus === 404) {
            try {
              const resCheck = await api.get(`/schedules/${editingScheduleId}`);
              // If we can fetch it, server allowed us to view it -> but PUT still failed
              // Treat this as a permissions/ownership mismatch
              alert("Cannot edit this schedule — you likely don't have permission to update it.");
            } catch (checkErr) {
              const checkStatus = checkErr?.response?.status;
              if (checkStatus === 403) {
                alert("You don't own this schedule and cannot edit it.");
              } else if (checkStatus === 404) {
                alert("The schedule no longer exists.");
              } else {
                alert("Unable to verify schedule ownership. Edit aborted.");
              }
            }
            // Do not create a new schedule automatically — abort edit to avoid duplicates
            throw putErr;
          } else {
            throw putErr;
          }
        }
      } else {
        await api.post("/schedules", payload);
      }

      setSuccess("Workout scheduled successfully");

      // refresh schedules
      const res = await api.get("/schedules/trainer");
      setSchedules(res.data);

      // reset form
      setSelectedMember("");
      setSelectedWorkout("");
      setDate("");
      setEditingScheduleId(null);
    } catch (err) {
      // If member isn't assigned to this trainer, attempt to assign and retry
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 403 && message && message.toLowerCase().includes("member not assigned")) {
        try {
          // get current user id
          const me = await api.get("/users/me");
          const trainerId = me.data._id;

          // assign member to current trainer
          await api.post("/users/assign-trainer", { memberId: selectedMember, trainerId });

          // retry scheduling (respect edit vs create)
          if (editingScheduleId) {
            await api.put(`/schedules/${editingScheduleId}`, payload);
          } else {
            await api.post("/schedules", payload);
          }

          setSuccess("Workout scheduled successfully");
          const res2 = await api.get("/schedules/trainer");
          setSchedules(res2.data);
          setSelectedMember("");
          setSelectedWorkout("");
          setDate("");
          setEditingScheduleId(null);
        } catch (innerErr) {
          console.error("Auto-assign or retry failed", innerErr);
          const innerStatus = innerErr?.response?.status;
          const innerMsg = innerErr?.response?.data?.message;

          if (innerStatus === 400 && innerMsg && innerMsg.toLowerCase().includes("invalid trainer")) {
            setError("Auto-assign failed: you must be a trainer to auto-assign members. Assign the member manually.");
          } else if (innerStatus === 400 && innerMsg && innerMsg.toLowerCase().includes("invalid member")) {
            setError("Auto-assign failed: the selected member is invalid.");
          } else {
            setError(innerMsg || "Failed to assign member or schedule workout");
          }
        }
        return;
      }

      console.error(err);
      setError(err.response?.data?.message || "Failed to schedule workout");
    } finally {
      setSaving(false);
    }
  };

  const startEditSchedule = (s) => {
    setEditingScheduleId(s._id);
    setSelectedMember(s.member?._id || s.member);
    setSelectedWorkout(s.workout?._id || s.workout);
    // format date for input[type=date]
    const d = new Date(s.scheduledDate);
    setDate(d.toISOString().slice(0, 10));
  };

  /* ========================= delete schedule ========================= */
  const deleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete schedule");
    }
  };

  if (loading) return <p className="text-slate-300">Loading…</p>;

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Trainer</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Schedule</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Create and manage scheduled workouts for your members.</p>
        </div>

        {success && <p className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-sm font-medium text-green-700">{success}</p>}
        {error && <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <main className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-extrabold text-brand-dark">Schedule Workout</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <select className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" value={selectedMember} onChange={(e)=>setSelectedMember(e.target.value)}>
                  <option value="">Select Member</option>
                  {members.map((m)=> <option key={m._id} value={m._id}>{m.name || m.email}</option>)}
                </select>

                <select className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" value={selectedWorkout} onChange={(e)=>setSelectedWorkout(e.target.value)}>
                  <option value="">Select Workout</option>
                  {workouts.map((w)=> <option key={w._id} value={w._id}>{w.title}</option>)}
                </select>

                <input className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                {editingScheduleId && (
                  <button onClick={() => { setEditingScheduleId(null); setSelectedMember(''); setSelectedWorkout(''); setDate(''); }} className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light">Cancel</button>
                )}
                <button onClick={handleSchedule} disabled={saving} className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-2.5 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/90 disabled:opacity-60">{saving ? 'Saving…' : (editingScheduleId ? 'Save' : 'Schedule')}</button>
              </div>
            </div>

            <section className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-brand-dark">My Scheduled Workouts</h2>
                <div className="inline-flex items-center rounded-full bg-brand-light px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark">Showing {schedules.length}</div>
              </div>

              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by workout or member"
                  className="w-full md:max-w-sm rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />

                <div className="flex items-center gap-3">
                  <select
                    value={workoutFilter}
                    onChange={(e) => setWorkoutFilter(e.target.value)}
                    className="rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  >
                    <option value="">All workouts</option>
                    {workouts.map((w) => (
                      <option key={w._id} value={w._id}>{w.title}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => { setSearchTerm(''); setWorkoutFilter(''); }}
                    className="inline-flex items-center justify-center rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm hover:bg-brand-light"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* filtered list */}
              {(() => {
                const q = searchTerm.trim().toLowerCase();
                const filtered = schedules.filter((s) => {
                  if (workoutFilter && s.workout?._id !== workoutFilter) return false;
                  if (!q) return true;
                  const title = (s.workout?.title || '').toLowerCase();
                  const member = ((s.member?.name || s.member?.email) || '').toLowerCase();
                  return title.includes(q) || member.includes(q);
                });

                if (filtered.length === 0) {
                  return (
                    <div className="mt-6 rounded-3xl border border-dashed border-brand-border bg-brand-light p-8 text-center text-sm font-medium text-brand-gray">No schedules match.</div>
                  );
                }

                return (
                  <ul className="space-y-4 mt-6">
                    {filtered.map((s) => (
                      <li key={s._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-brand-border bg-brand-light p-5 shadow-sm transition hover:shadow-md hover:bg-brand-card">
                        <div>
                          <p className="text-lg font-bold text-brand-dark">{s.workout?.title}</p>
                          <p className="text-sm text-brand-gray font-medium mt-1">Member: {s.member?.name || s.member?.email}</p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-accent flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                            {new Date(s.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 sm:self-start shrink-0">
                          <button onClick={() => { startEditSchedule(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-full bg-brand-card border border-brand-border px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light">Edit</button>
                          <button onClick={() => deleteSchedule(s._id)} className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </section>
          </main>

          <aside className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8 space-y-6 self-start sticky top-28">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">Members</h3>
              <p className="mt-1 text-sm text-brand-gray">Your assigned members</p>

              <div className="mt-6">
                {members.length === 0 ? (
                  <p className="text-sm font-medium text-brand-gray">No members assigned.</p>
                ) : (
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {members.map((m) => (
                        <li key={m._id} className="flex items-center justify-between rounded-2xl border border-brand-border bg-brand-light p-3">
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="truncate text-sm font-bold text-brand-dark">{m.name || m.email}</p>
                            <p className="truncate text-xs text-brand-gray">{m.email}</p>
                          </div>
                          <button onClick={()=>{setSelectedMember(m._id); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="shrink-0 rounded-full bg-brand-card border border-brand-border px-3 py-1 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light">Select</button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between gap-3 text-xs font-bold text-brand-gray">
                      <span>Total: {members.length}</span>
                      <button onClick={refreshMembers} className="rounded-full border border-brand-border bg-brand-card px-3 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light">Refresh</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TrainerSchedule;