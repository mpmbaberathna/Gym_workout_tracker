import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../../components/ui/button";

const TrainerPlans = () => {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // edit state
  const [editingPlanId, setEditingPlanId] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [exercises, setExercises] = useState([]);

  // assign
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const fetchPlans = async () => {
    const res = await api.get("/plans/trainer");
    setPlans(res.data || []);
  };

  const fetchMembers = async () => {
    const res = await api.get("/users/members");
    setMembers(res.data || []);
  };

  const fetchAvailableExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setAvailableExercises(res.data || []);
    } catch (err) {
      console.error("Failed to load exercises", err);
      setAvailableExercises([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchPlans(), fetchMembers(), fetchAvailableExercises()]);
      setLoading(false);
    };
    load();
  }, []);

  const openCreateModal = () => {
    setEditingPlanId(null);
    setTitle("");
    setDescription("");
    setDurationWeeks("");
    setExercises([]);
    setExerciseInput("");
    setShowFormModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlanId(plan._id);
    setTitle(plan.title);
    setDescription(plan.description || "");
    setDurationWeeks(plan.durationWeeks || "");
    // plans now return populated exercises; store their ids for editing
    setExercises((plan.exercises || []).map((e) => (e && e._id) || e));
    setExerciseInput("");
    setShowFormModal(true);
  };

  const addExercise = () => {
    if (!exerciseInput.trim()) return;
    // exerciseInput is now the exercise id from select (or a free-text string)
    setExercises([...exercises, exerciseInput.trim()]);
    setExerciseInput("");
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSavePlan = async () => {
    if (!title || !durationWeeks || exercises.length === 0) {
      alert("Title, duration and at least one exercise are required");
      return;
    }

    const payload = {
      title,
      description,
      durationWeeks,
      exercises,
    };

    try {
      if (editingPlanId) {
        await api.put(`/plans/${editingPlanId}`, payload);
      } else {
        await api.post("/plans", payload);
      }

      setShowFormModal(false);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to save plan");
    }
  };

  const openAssignModal = (planId) => {
    setSelectedPlanId(planId);
    setSelectedMemberId("");
    setShowAssignModal(true);
  };

  const handleAssignPlan = async () => {
    if (!selectedMemberId) return;

    try {
      await api.post("/plans/assign", {
        planId: selectedPlanId,
        memberId: selectedMemberId,
      });
      setShowAssignModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to assign plan");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api.delete(`/plans/${planId}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan");
    }
  };

  if (loading) return <p className="text-slate-300">Loading…</p>;

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Trainer</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Plans</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Create and manage workout plans for your members.</p>
        </div>

        <div className="flex justify-end mb-6">
          <button onClick={() => { openCreateModal(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-brand-primary-text shadow-sm hover:bg-black/90 transition">
            Create Plan
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 p-12 text-center">
            <p className="text-sm font-bold text-brand-dark">No plans created yet.</p>
            <p className="mt-2 text-sm text-brand-gray">Click "Create Plan" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan._id} className="flex flex-col rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark">{plan.title}</h2>
                    {plan.description && <p className="mt-2 text-sm text-brand-gray leading-relaxed">{plan.description}</p>}
                  </div>
                  {plan.durationWeeks && (
                    <span className="shrink-0 inline-flex items-center rounded-full bg-brand-light border border-brand-border px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-sm">
                      {plan.durationWeeks} week{plan.durationWeeks === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex-grow bg-brand-light rounded-2xl p-6 border border-brand-border shadow-sm mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gray mb-3">Exercises</p>
                  <ul className="space-y-2">
                    {plan.exercises.map((e, i) => {
                      const found = availableExercises.find(a => a._id === e || a._id === (e && e._id) || a.name === e);
                      const label = found ? (found.name || found.title) : (e && e.name) || e;
                      return (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                          <span className="inline-block h-2 w-2 rounded-full bg-brand-dark shrink-0" />
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <button onClick={() => openAssignModal(plan._id)} className="rounded-full bg-brand-primary px-5 py-2 text-xs font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Assign</button>
                  <button onClick={() => { openEditModal(plan); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-full bg-brand-card border border-brand-border px-5 py-2 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light">Edit</button>
                  <button onClick={() => handleDeletePlan(plan._id)} className="rounded-full bg-red-50 border border-red-200 px-5 py-2 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* form modal */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-brand-card p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-extrabold text-brand-dark mb-6">{editingPlanId ? 'Edit Plan' : 'Create Plan'}</h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Title</label>
                  <input className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="Plan title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Description</label>
                  <textarea className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} rows={3} />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Duration (weeks)</label>
                  <input className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" type="number" placeholder="e.g. 4" value={durationWeeks} onChange={(e)=>setDurationWeeks(e.target.value)} />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Exercises</label>
                  <div className="flex items-center gap-3 mb-3">
                    {availableExercises.length > 0 ? (
                      <select
                        className="flex-1 rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                        value={exerciseInput}
                        onChange={(e) => setExerciseInput(e.target.value)}
                      >
                        <option value="">Select exercise</option>
                        {availableExercises.map((ex) => (
                          <option key={ex._id} value={ex._id}>{ex.name || ex.title}</option>
                        ))}
                      </select>
                    ) : (
                      <input className="flex-1 rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" placeholder="Enter exercise" value={exerciseInput} onChange={(e)=>setExerciseInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExercise()} />
                    )}
                    <button onClick={addExercise} className="rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Add</button>
                  </div>

                  <ul className="space-y-2">
                    {exercises.map((e,i)=> {
                      const found = availableExercises.find(a => a._id === e || a._id === (e && e._id));
                      const label = found ? (found.name || found.title) : (e && e.name) || e;
                      return (
                        <li key={i} className="flex items-center justify-between rounded-2xl bg-brand-light border border-brand-border px-4 py-2">
                          <span className="text-sm font-medium text-brand-dark">{label}</span>
                          <button onClick={()=>removeExercise(i)} className="text-xs font-bold text-red-600 hover:text-red-700">Remove</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-brand-border">
                  <button onClick={()=>setShowFormModal(false)} className="rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light">Cancel</button>
                  <button onClick={handleSavePlan} className="rounded-full bg-brand-primary px-8 py-2.5 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Save Plan</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* assign modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-brand-card p-8 shadow-2xl">
              <h3 className="text-2xl font-extrabold text-brand-dark mb-6">Assign Plan</h3>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Select Member</label>
              <select className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" value={selectedMemberId} onChange={(e)=>setSelectedMemberId(e.target.value)}>
                <option value="">Choose a member...</option>
                {members.map((m)=> <option key={m._id} value={m._id}>{m.name || m.email}</option>)}
              </select>

              <div className="mt-8 pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button onClick={()=>setShowAssignModal(false)} className="rounded-full border border-brand-border bg-brand-card px-6 py-2.5 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light">Cancel</button>
                <button onClick={handleAssignPlan} className="rounded-full bg-brand-primary px-8 py-2.5 text-sm font-bold text-brand-primary-text shadow-sm hover:bg-black/90">Assign</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerPlans;