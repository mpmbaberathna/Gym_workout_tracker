import { useEffect, useState } from "react";
import Button from "../components/ui/button";
import api from "../api/axios";
import { validateNotEmpty } from "../utils/validation";

const TrainerWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  // search
  const [searchTerm, setSearchTerm] = useState("");

  // modals
  const [showForm, setShowForm] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  // workout form
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [exercises, setExercises] = useState([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // assign
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [availableExercises, setAvailableExercises] = useState([]);

  /* ---------------- fetch ---------------- */

  const fetchAll = async () => {
    try {
      const [w, m, e] = await Promise.all([
        api.get("/workouts/trainer"),
        api.get("/users/members"),
        api.get("/exercises")
      ]);

      setWorkouts(w.data);
      setMembers(m.data);
      setAvailableExercises(e.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- create / edit ---------------- */

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setDuration("");
    setNotes("");
    setExercises([]);
    setExerciseInput("");
    setShowForm(true);
  };

  const openEdit = (w) => {
    setEditingId(w._id);
    setTitle(w.title);
    setDuration(w.duration || "");
    setNotes(w.notes || "");
    setExercises(w.exercises || []);
    setExerciseInput("");
    setShowForm(true);
  };

  const addExercise = () => {
    if (!exerciseInput.trim()) return;
    setExercises([...exercises, exerciseInput.trim()]);
    setExerciseInput("");
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
  setFormError("");
  const t = validateNotEmpty(title, "Title");
  if (!t.valid) return setFormError(t.message);
  if (!exercises || exercises.length === 0) return setFormError("At least one exercise is required");

  // optional duration numeric validation
  if (duration && isNaN(Number(duration))) {
    return setFormError("Duration must be a number (minutes)");
  }

  const payload = {
    title,
    duration,
    notes,
    exercises,
  };

  try {
    setSaving(true);
    console.log("Saving workout:", payload);

    if (editingId) {
      await api.put(`/workouts/${editingId}`, payload);
    } else {
      await api.post("/workouts", payload);
    }

    setShowForm(false);
    fetchAll();
  } catch (err) {
    console.error("SAVE WORKOUT FAILED:", err);
    setFormError(err?.response?.data?.message || "Failed to save workout (check backend)");
  } finally {
    setSaving(false);
  }
};

  /* ---------------- delete ---------------- */

  const deleteWorkout = async (id) => {
    if (!window.confirm("Delete workout?")) return;
    await api.delete(`/workouts/${id}`);
    fetchAll();
  };

  /* ---------------- assign ---------------- */

  const openAssign = (id) => {
    setSelectedWorkoutId(id);
    setSelectedMemberId("");
    setShowAssign(true);
  };

  const assignWorkout = async () => {
    if (!selectedMemberId) return setFormError("Select a member to assign");

    try {
      await api.post("/workouts/assign", {
        workoutId: selectedWorkoutId,
        memberId: selectedMemberId,
      });
      setShowAssign(false);
      setFormError("");
    } catch (err) {
      console.error(err);
      setFormError(err?.response?.data?.message || "Failed to assign workout");
    }
  };

  if (loading) return <p className="text-slate-300">Loading…</p>;
  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Trainer</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Workouts</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Create, edit and assign workouts to members.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search workouts by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-card px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none shadow-sm transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>
            {workouts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 p-8 text-center">
                <p className="text-sm font-bold text-brand-dark">No workouts yet</p>
                <p className="mt-2 text-sm text-brand-gray">Create your first workout to assign it to members.</p>
                <div className="mt-6 flex justify-center">
                  <button onClick={openCreate} className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary-text shadow-sm hover:bg-black/90 transition">
                    Create Workout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {workouts
                  .filter((w) => w.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((w) => (
                  <article key={w._id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
                    <div className="mb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-bold text-brand-dark">{w.title}</p>
                        {w.exercises && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {w.exercises.map((ex, i) => (
                              <span key={i} className="inline-flex items-center rounded-full bg-brand-light border border-brand-border px-3 py-1 text-xs font-bold text-brand-dark">
                                {ex}
                              </span>
                            ))}
                          </div>
                        )}
                        {w.notes && <p className="mt-4 text-sm text-brand-gray leading-relaxed">{w.notes}</p>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:self-start shrink-0">
                        <button onClick={() => openAssign(w._id)} className="rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Assign</button>
                        <button onClick={() => { openEdit(w); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-full bg-brand-card border border-brand-border px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light">Edit</button>
                        <button onClick={() => deleteWorkout(w._id)} className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100">Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8 space-y-6 self-start sticky top-28">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">Quick Actions</h3>
              <p className="mt-1 text-sm text-brand-gray">Create or assign workouts quickly.</p>

              <div className="mt-6 flex flex-col gap-4">
                <button onClick={() => { openCreate(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-primary-text shadow-sm hover:bg-black/90 transition">
                  Create Workout
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* create / edit modal overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-brand-card p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-extrabold text-brand-dark mb-6">{editingId ? 'Edit Workout' : 'Create Workout'}</h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Title</label>
                  <input className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="Workout title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Duration (minutes)</label>
                  <input className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="e.g. 45" value={duration} onChange={(e)=>setDuration(e.target.value)} />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Notes</label>
                  <textarea className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="Optional notes" value={notes} onChange={(e)=>setNotes(e.target.value)} rows={3} />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Exercises</label>
                  <div className="flex items-center gap-3 mb-3">
                    <input 
                      list="exercise-library"
                      className="flex-1 rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" 
                      placeholder="Select or type exercise name" 
                      value={exerciseInput} 
                      onChange={(e)=>setExerciseInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && addExercise()} 
                    />
                    <datalist id="exercise-library">
                      {availableExercises.map(ex => (
                        <option key={ex._id} value={ex.name} />
                      ))}
                    </datalist>
                    <button onClick={addExercise} className="rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Add</button>
                  </div>

                  <ul className="space-y-2">
                    {exercises.map((e,i)=> (
                      <li key={i} className="flex items-center justify-between rounded-2xl bg-brand-light border border-brand-border px-4 py-2">
                        <span className="text-sm font-medium text-brand-dark">{e}</span>
                        <button onClick={()=>removeExercise(i)} className="text-xs font-bold text-red-600 hover:text-red-700">Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-brand-border">
                  {formError && <p className="text-sm font-medium text-red-600 mr-auto">{formError}</p>}
                  <button onClick={()=>setShowForm(false)} className="rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light">Cancel</button>
                  <button onClick={saveWorkout} disabled={saving} className="rounded-full bg-brand-primary px-8 py-2.5 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90 disabled:opacity-60">{saving ? 'Saving…' : 'Save Workout'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* assign modal overlay */}
        {showAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-brand-card p-8 shadow-2xl">
              <h3 className="text-2xl font-extrabold text-brand-dark mb-6">Assign Workout</h3>
              
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Select Member</label>
              <select className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" value={selectedMemberId} onChange={(e)=>setSelectedMemberId(e.target.value)}>
                <option value="">Choose a member...</option>
                {members.map((m)=> <option key={m._id} value={m._id}>{m.name || m.email}</option>)}
              </select>

              <div className="mt-8 pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                {formError && <p className="text-sm font-medium text-red-600 mr-auto">{formError}</p>}
                <button onClick={()=>setShowAssign(false)} className="rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light">Cancel</button>
                <button onClick={assignWorkout} className="rounded-full bg-brand-primary px-8 py-2.5 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Assign</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerWorkouts;