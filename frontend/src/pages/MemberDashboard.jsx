import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Activity, Calendar, CheckCircle2, Clock, FileText, 
  MessageSquare, Star, Trash2, Edit2, TrendingUp,
  ImagePlus, Send, Target, ChevronRight, MessageCircle
} from 'lucide-react';

function MemberDashboard() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser && localStorage.getItem('token');
  const [myReviews, setMyReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [editingFiles, setEditingFiles] = useState(null);
  const [editingRemove, setEditingRemove] = useState([]);
  
  // Helper to get backend base URL
  const backendBase = (() => {
    try {
      let b = api.defaults.baseURL || '';
      if (b.endsWith('/api')) b = b.slice(0, -4);
      return b.replace(/\/$/, '');
    } catch (e) { return ''; }
  })();
  
  const makeImageUrl = (imgPath) => {
    if (!imgPath) return imgPath;
    if (/^https?:\/\//.test(imgPath)) return imgPath;
    return `${backendBase}${imgPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsRes = await api.get("/workouts/member");
        const plansRes = await api.get("/plans/member");
        const schedulesRes = await api.get("/schedules/member");

        if (Array.isArray(schedulesRes.data)) setSchedules(schedulesRes.data);
        if (Array.isArray(workoutsRes.data)) setWorkouts(workoutsRes.data);
        if (Array.isArray(plansRes.data)) setPlans(plansRes.data);
        
        try {
          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          const reviewsRes = await api.get('/reviews/me', { headers });
          setMyReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        } catch (err) {
          console.warn('GET /reviews/me failed, falling back to filtering', err?.response?.status);
          try {
            const profileRes = await api.get('/users/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const userId = profileRes?.data?._id || profileRes?.data?.id;
            const allRes = await api.get('/reviews');
            const arr = Array.isArray(allRes.data) ? allRes.data : [];
            const mine = arr.filter(r => r.author && (r.author._id === userId || r.author === userId));
            setMyReviews(mine);
          } catch (e) {
            setReviewsError(err?.response?.data?.message || err.message || 'Failed to load your reviews');
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load member data");
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="relative min-h-screen w-full bg-brand-light bg-gradient-to-br from-brand-light/50 to-blue-50/20 dark:from-brand-light dark:to-brand-light/90 text-brand-dark px-6 md:px-12 pt-28 pb-20 font-sans transition-colors duration-300 selection:bg-blue-500/30 overflow-hidden">
      
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-brand-card/40 backdrop-blur-xl border border-brand-border/60 p-8 rounded-[2rem] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200 dark:border-blue-500/30">
              <Target size={14} /> Member Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-gray">
              My Dashboard
            </h1>
            <p className="mt-3 text-base text-brand-gray max-w-xl leading-relaxed font-medium">
              View your assigned plans, complete workouts, and track your fitness journey.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={() => navigate("/member/progress")}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
              >
                <TrendingUp size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span>Track Progress</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Workout plans */}
            <section className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/50 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">Workout Plans</h2>
                    <p className="text-sm font-medium text-brand-gray mt-1">Your structured routines</p>
                  </div>
                </div>
                <span className="mt-4 sm:mt-0 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                  {plans.length} Assigned
                </span>
              </div>

              {plans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-border/60 bg-brand-light/50 p-12 text-center">
                  <FileText size={40} className="mx-auto text-brand-gray/30 mb-3" />
                  <p className="text-sm font-bold text-brand-gray">No workout plans assigned yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {plans.map((plan) => (
                    <article key={plan._id} className="group relative flex flex-col rounded-[1.5rem] border border-brand-border/60 bg-brand-card shadow-sm transition-all hover:shadow-lg hover:border-blue-500/30 p-6 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-[100px] pointer-events-none"></div>
                      
                      <div className="mb-4 flex items-start justify-between gap-3 relative z-10">
                        <div>
                          <h3 className="text-lg font-black text-brand-dark group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {plan.title}
                          </h3>
                          {plan.description && (
                            <p className="mt-1 text-sm font-medium text-brand-gray line-clamp-2">
                              {plan.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {plan.durationWeeks && (
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-gray border border-brand-border/50 self-start">
                          <Calendar size={12} /> {plan.durationWeeks} week{plan.durationWeeks === 1 ? "" : "s"}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-brand-border/50 relative z-10">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-gray">
                          Exercises included
                        </p>
                        {Array.isArray(plan.exercises) && plan.exercises.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {plan.exercises.map((exercise, index) => {
                              const label = exercise && typeof exercise === 'object' ? (exercise.name || exercise.title) : exercise;
                              return (
                                <span key={index} className="inline-flex items-center rounded-lg bg-brand-light/80 border border-brand-border/50 px-2.5 py-1 text-xs font-bold text-brand-dark">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs font-medium italic text-brand-gray">No exercises specified.</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* My workouts */}
            <section className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/50 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">My Workouts</h2>
                    <p className="text-sm font-medium text-brand-gray mt-1">Your isolated sessions</p>
                  </div>
                </div>
                <span className="mt-4 sm:mt-0 inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {workouts.length} Available
                </span>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-4 text-sm font-bold text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {!error && workouts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-brand-border/60 bg-brand-light/50 p-12 text-center">
                  <Activity size={40} className="mx-auto text-brand-gray/30 mb-3" />
                  <p className="text-sm font-bold text-brand-gray">No isolated workouts assigned yet.</p>
                </div>
              )}

              {workouts.length > 0 && (
                <ul className="grid gap-6 md:grid-cols-2">
                  {workouts.map((w) => (
                    <li key={w._id} className="group relative flex flex-col rounded-[1.5rem] border border-brand-border/60 bg-brand-card shadow-sm transition-all hover:shadow-lg hover:border-emerald-500/30 p-6 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-[100px] pointer-events-none"></div>
                      
                      <div className="mb-4 flex items-start justify-between gap-3 relative z-10">
                        <p className="text-lg font-black text-brand-dark group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {w.title}
                        </p>
                        {w.duration && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand-gray border border-brand-border/50">
                            <Clock size={12} /> {w.duration}m
                          </span>
                        )}
                      </div>

                      {w.notes && (
                        <div className="mt-auto text-sm font-medium text-brand-gray/90 bg-brand-light/50 rounded-xl p-4 border border-brand-border/30 relative z-10">
                          <span className="font-bold text-brand-dark block mb-1 text-xs uppercase tracking-wider">Coach Notes</span>
                          <span className="italic">"{w.notes}"</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            
            {/* My schedule */}
            <aside className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-black text-brand-dark">Schedule</h3>
              </div>

              {schedules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-border/60 bg-brand-light/50 p-8 text-center">
                  <Calendar size={32} className="mx-auto text-brand-gray/30 mb-2" />
                  <p className="text-sm font-bold text-brand-gray">No sessions lined up.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {schedules.slice(0, 5).map((s) => (
                    <article key={s._id} className={`group relative rounded-2xl border bg-brand-card p-4 transition-all ${s.status === 'completed' ? 'border-brand-border/30 opacity-70' : 'border-brand-border/60 shadow-sm hover:shadow-md hover:border-indigo-500/30'}`}>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-base font-bold text-brand-dark leading-tight ${s.status === 'completed' ? 'line-through text-brand-gray' : ''}`}>
                            {(s.workout && (s.workout.title || s.workout.name)) || s.workout || 'Untitled session'}
                          </h4>
                          {s.status === 'completed' && (
                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-gray">
                            <Clock size={12} />
                            {isNaN(new Date(s.scheduledDate).getTime()) ? 'TBD' : new Date(s.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          
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
                              className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark border border-brand-border/50 shadow-sm hover:bg-brand-primary hover:text-brand-primary-text hover:border-brand-primary transition-all"
                            >
                              <CheckCircle2 size={12} /> Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                  
                  {schedules.length > 5 && (
                    <button onClick={() => navigate("/member/schedule")} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-light/50 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                      View all schedule <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </aside>

            {/* My reviews */}
            <aside className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-6 md:p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark">My Reviews</h3>
                </div>
              </div>

              {reviewsError && (
                <p className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-bold text-red-700 dark:text-red-400">{reviewsError}</p>
              )}

              {myReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-border/60 bg-brand-light/50 p-8 text-center">
                  <MessageCircle size={32} className="mx-auto text-brand-gray/30 mb-2" />
                  <p className="text-sm font-bold text-brand-gray">You haven't posted any reviews.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {myReviews.map((r) => (
                    <article key={r._id} className="relative rounded-[1.5rem] border border-brand-border/60 bg-brand-card p-5 shadow-sm transition-all hover:shadow-md">
                      
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < (r.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-transparent text-brand-border"} />
                          ))}
                        </div>
                        
                        {editingId !== r._id && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingId(r._id); setEditingText(r.text || ''); setEditingRating(r.rating || 5); setEditingFiles(null); setEditingRemove([]); }} className="p-1.5 rounded-lg text-brand-gray hover:bg-brand-light hover:text-blue-500 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={async () => { if (!confirm('Delete this review?')) return; try { await api.delete(`/reviews/${r._id}`); setMyReviews(prev => prev.filter(x => x._id !== r._id)); } catch (e) { alert(e?.response?.data?.message || 'Failed to delete'); } }} className="p-1.5 rounded-lg text-brand-gray hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === r._id ? (
                        <div className="space-y-4 pt-2">
                          <textarea 
                            value={editingText} 
                            onChange={(e) => setEditingText(e.target.value)} 
                            rows={3} 
                            className="w-full resize-none rounded-xl border border-brand-border bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" 
                          />
                          
                          <div className="flex flex-col gap-2">
                            
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-brand-gray">Rating</span>
                              <select value={editingRating} onChange={(e) => setEditingRating(Number(e.target.value))} className="rounded-lg border border-brand-border bg-white/50 dark:bg-slate-800/50 px-2 py-1 text-xs font-bold text-brand-dark outline-none focus:border-blue-500">
                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star</option>)}
                              </select>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <button onClick={() => { setEditingId(null); setEditingRemove([]); setEditingFiles(null); }} className="text-xs font-bold text-brand-gray hover:text-brand-dark">Cancel</button>
                              <button onClick={async () => {
                                try {
                                  const formData = new FormData();
                                  formData.append('text', editingText);
                                  formData.append('rating', editingRating);
                                  if (editingRemove && editingRemove.length) {
                                    formData.append('removeImages', JSON.stringify(editingRemove));
                                    for (let i = 0; i < editingRemove.length; i++) formData.append('removeImages', editingRemove[i]);
                                  }
                                  if (editingFiles && editingFiles.length) {
                                    for (let i = 0; i < editingFiles.length; i++) formData.append('images', editingFiles[i]);
                                  }
                                  const headers = {};
                                  if (token) headers.Authorization = `Bearer ${token}`;
                                  const res = await api.put(`/reviews/${r._id}`, formData, { headers });
                                  setMyReviews(prev => prev.map(p => p._id === r._id ? res.data : p));
                                  setEditingId(null);
                                  setEditingFiles(null);
                                  setEditingRemove([]);
                                } catch (e) { alert(e?.response?.data?.message || 'Failed to save'); }
                              }} className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">Save</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-brand-gray leading-relaxed mb-3 line-clamp-4">"{r.text}"</p>
                          {Array.isArray(r.images) && r.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                              {r.images.map((img, idx) => (
                                <img key={idx} src={makeImageUrl(img)} alt={`review-${idx}`} className="h-12 w-12 rounded-lg object-cover border border-brand-border shadow-sm flex-shrink-0" />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;