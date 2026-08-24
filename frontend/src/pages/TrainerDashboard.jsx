import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  PlusCircle, Search, Dumbbell, Edit2, Trash2, 
  Settings, Activity, CalendarDays, ClipboardList, Target, Check
} from 'lucide-react';

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [exerciseSearch, setExerciseSearch] = useState("");

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMuscleGroup, setEditMuscleGroup] = useState("");
  const [editEquipment, setEditEquipment] = useState("");

  const fetchExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setExercises(res.data);
    } catch {
      setError("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreateExercise = async () => {
    if (!name || !muscleGroup) {
      alert("Name and muscle group are required");
      return;
    }

    try {
      await api.post("/exercises", {
        name,
        muscleGroup,
        equipment,
      });

      setName("");
      setMuscleGroup("");
      setEquipment("");
      fetchExercises();
    } catch {
      alert("Failed to create exercise");
    }
  };

  const startEdit = (exercise) => {
    setEditingId(exercise._id);
    setEditName(exercise.name);
    setEditMuscleGroup(exercise.muscleGroup);
    setEditEquipment(exercise.equipment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMuscleGroup("");
    setEditEquipment("");
  };

  const saveEdit = async (id) => {
    if (!editName || !editMuscleGroup) {
      alert("Name and muscle group are required");
      return;
    }

    try {
      await api.put(`/exercises/${id}`, {
        name: editName,
        muscleGroup: editMuscleGroup,
        equipment: editEquipment,
      });

      cancelEdit();
      fetchExercises();
    } catch {
      alert("Failed to update exercise");
    }
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;

    try {
      await api.delete(`/exercises/${id}`);
      fetchExercises();
    } catch {
      alert("Failed to delete exercise");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-brand-light bg-gradient-to-br from-brand-light/50 to-blue-50/20 dark:from-brand-light dark:to-brand-light/90 text-brand-dark px-6 md:px-12 pt-28 pb-20 font-sans transition-colors duration-300 selection:bg-blue-500/30 overflow-hidden">
      
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 dark:bg-purple-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-brand-card/40 backdrop-blur-xl border border-brand-border/60 p-8 rounded-[2rem] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200 dark:border-blue-500/30">
              <Settings size={14} /> Trainer Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-gray">
              Dashboard
            </h1>
            <p className="mt-3 text-base text-brand-gray max-w-xl leading-relaxed font-medium">
              Create exercises, build programs, and manage your library.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Create exercise */}
            <section className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark">Create Exercise</h2>
                  <p className="text-sm font-medium text-brand-gray mt-1">Add to your personal library</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

                <input
                  type="text"
                  placeholder="Muscle group (e.g. Chest)"
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

                <input
                  type="text"
                  placeholder="Equipment (optional)"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-5 py-4 text-sm font-medium text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCreateExercise}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
                >
                  <PlusCircle size={16} className="transition-transform group-hover:rotate-90" />
                  <span>Add Exercise</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
                </button>
              </div>
            </section>

            {/* Exercise library */}
            <section className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/50 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    <Dumbbell size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">Library</h2>
                    <p className="text-sm font-medium text-brand-gray mt-1">Manage your exercises</p>
                  </div>
                </div>
              </div>
              
              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search exercises by name..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full rounded-2xl border border-brand-border bg-white/80 dark:bg-slate-800/80 pl-11 pr-5 py-4 text-sm font-bold text-brand-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 shadow-sm"
                />
              </div>
              
              {loading && <p className="text-sm text-brand-gray font-medium text-center py-8 animate-pulse">Loading exercises...</p>}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-bold text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <ul className="space-y-4">
                {exercises
                  .filter((exercise) => exercise.name?.toLowerCase().includes(exerciseSearch.toLowerCase()))
                  .map((exercise) => (
                  <li key={exercise._id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[1.5rem] border border-brand-border/60 bg-brand-card p-5 shadow-sm transition-all hover:shadow-md hover:border-purple-500/30">
                    
                    <div className="flex-1 w-full">
                      {editingId === exercise._id ? (
                        <div className="grid gap-3 sm:grid-cols-3 w-full">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-3 py-2.5 text-sm font-medium text-brand-dark outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            placeholder="Exercise name"
                          />
                          <input
                            value={editMuscleGroup}
                            onChange={(e) => setEditMuscleGroup(e.target.value)}
                            className="w-full rounded-xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-3 py-2.5 text-sm font-medium text-brand-dark outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            placeholder="Muscle group"
                          />
                          <input
                            value={editEquipment}
                            onChange={(e) => setEditEquipment(e.target.value)}
                            className="w-full rounded-xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-3 py-2.5 text-sm font-medium text-brand-dark outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            placeholder="Equipment (optional)"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-black text-brand-dark group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {exercise.name}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-brand-gray uppercase tracking-wider">
                            <span className="bg-brand-light/80 px-2 py-1 rounded border border-brand-border/50">{exercise.muscleGroup}</span>
                            {exercise.equipment && (
                              <span className="bg-brand-light/80 px-2 py-1 rounded border border-brand-border/50">{exercise.equipment}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      {editingId === exercise._id ? (
                        <>
                          <button onClick={() => saveEdit(exercise._id)} className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-1">
                            <Check size={14} /> Save
                          </button>
                          <button onClick={cancelEdit} className="rounded-xl bg-brand-light border border-brand-border px-4 py-2 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-border transition-colors">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(exercise)} className="p-2 rounded-xl text-brand-gray hover:bg-brand-light hover:text-purple-500 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteExercise(exercise._id)} className="p-2 rounded-xl text-brand-gray hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {exercises.length === 0 && !loading && (
                   <div className="text-center py-8 text-sm font-bold text-brand-gray">
                     No exercises found. Add one above!
                   </div>
                )}
              </ul>
            </section>
          </div>

          {/* Quick actions */}
          <aside className="lg:col-span-1 h-fit sticky top-28 rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Target size={20} />
                </div>
              <h3 className="text-xl font-black text-brand-dark">Quick Actions</h3>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/trainer/workouts')}
                className="group relative flex items-center gap-3 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-left shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/40"
              >
                <div className="bg-white/20 p-2 rounded-xl text-white">
                  <Activity size={20} />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Manage Workouts</div>
                  <div className="text-xs font-medium text-white/80 mt-0.5">Build isolated sessions</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/trainer/plans')}
                className="group relative flex items-center gap-3 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 text-left shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-purple-500/40"
              >
                <div className="bg-white/20 p-2 rounded-xl text-white">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Manage Plans</div>
                  <div className="text-xs font-medium text-white/80 mt-0.5">Create structured programs</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/trainer/schedule')}
                className="group relative flex items-center gap-3 w-full rounded-2xl border border-brand-border/60 bg-brand-light/80 p-4 text-left shadow-sm transition-all hover:border-indigo-500/30 hover:bg-brand-card hover:shadow-md"
              >
                <div className="bg-brand-card border border-brand-border/50 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-dark">Manage Schedule</div>
                  <div className="text-xs font-medium text-brand-gray mt-0.5">Assign programs to members</div>
                </div>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;