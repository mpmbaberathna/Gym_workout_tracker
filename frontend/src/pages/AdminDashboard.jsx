import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socketClient from "../api/socket";
import Users from "./admin/users";
import { validateName, validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users as UsersIcon, UserCheck, Activity, Calendar, FileText, Send, UserPlus, Plus, MessageSquare, Star } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ users: 0, trainers: 0, workouts: 0 });
  const [userTimeline, setUserTimeline] = useState([]); // [{ date: '2026-01-01', count: 3, label: '01 Jan' }, ...]
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'member' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;

    const fetchCounts = async () => {
      try {
        const [usersRes, workoutsRes] = await Promise.all([
          api.get('/users'),
          api.get('/workouts'),
        ]);

        if (!mounted) return;

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const workouts = Array.isArray(workoutsRes.data) ? workoutsRes.data : [];
        const trainers = users.filter((u) => u.role === 'trainer').length;

        // compute daily counts for the last 14 days
        const days = 14;
        const today = new Date();
        const map = {};
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          map[key] = 0;
        }

        users.forEach((u) => {
          const created = u.createdAt || u.created_at || u.created || null;
          if (!created) return;
          const d = new Date(created);
          const key = d.toISOString().slice(0, 10);
          if (key in map) map[key] += 1;
        });

        const timeline = Object.keys(map).sort().map((date) => {
          const d = new Date(date);
          const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return { date, count: map[date], label };
        });

        setCounts({ users: users.length, trainers, workouts: workouts.length });
        setUserTimeline(timeline);
      } catch (err) {
        // ignore errors for counts
      }
    };

    fetchCounts();
    socketClient.on('users:changed', fetchCounts);
    const id = setInterval(fetchCounts, 5000);
    return () => {
      mounted = false;
      clearInterval(id);
      socketClient.off('users:changed', fetchCounts);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border p-4 rounded-2xl shadow-xl">
          <p className="text-brand-gray text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-brand-dark text-xl font-extrabold">
            <span className="text-blue-500 mr-2">{payload[0].value}</span> 
            <span className="text-sm font-medium text-brand-gray">New Users</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen w-full bg-brand-light bg-gradient-to-br from-brand-light/50 to-blue-50/20 dark:from-brand-light dark:to-brand-light/90 text-brand-dark px-6 md:px-12 pt-28 pb-20 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-brand-card/40 backdrop-blur-xl border border-brand-border/60 p-8 rounded-[2rem] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200 dark:border-blue-500/30">
              <Activity size={14} /> Control Panel
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-gray">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-base text-brand-gray max-w-xl leading-relaxed font-medium">
              Oversee your entire platform. Manage users, assign trainers, and track growth metrics in real-time.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={() => setShowCreateModal(true)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
              >
                <UserPlus size={18} className="transition-transform group-hover:rotate-12" />
                <span>Add New User</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
              </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Stat Card 1 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="absolute -right-6 -top-6 rounded-full bg-blue-500/10 p-8 transition-transform group-hover:scale-110">
              <UsersIcon size={48} className="text-blue-500/50" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">Total Members</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-5xl font-black text-brand-dark tracking-tight">{counts?.users ?? '—'}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-brand-gray flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span> Registered users
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="absolute -right-6 -top-6 rounded-full bg-indigo-500/10 p-8 transition-transform group-hover:scale-110">
              <UserCheck size={48} className="text-indigo-500/50" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">Active Trainers</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-5xl font-black text-brand-dark tracking-tight">{counts?.trainers ?? '—'}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-brand-gray flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span> Staff members
            </p>
          </div>

          {/* Stat Card 3 */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
             <div className="absolute -right-6 -top-6 rounded-full bg-emerald-500/10 p-8 transition-transform group-hover:scale-110">
              <Activity size={48} className="text-emerald-500/50" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">Total Workouts</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-5xl font-black text-brand-dark tracking-tight">{counts?.workouts ?? '—'}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-brand-gray flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span> Sessions logged
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          
          {/* Left Column (Chart & Users) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Chart Section */}
            <div className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/50 pb-6 mb-8 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-brand-dark flex items-center gap-2">
                    User Growth <span className="text-sm font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full ml-2 border border-blue-200 dark:border-blue-500/30">14 Days</span>
                  </h3>
                  <p className="mt-1 text-sm font-medium text-brand-gray">Daily new user registrations</p>
                </div>
              </div>

              <div className="h-[300px] w-full relative z-10">
                {userTimeline.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-brand-gray bg-brand-card/40 rounded-2xl border border-dashed border-brand-border">
                    <Activity size={32} className="opacity-20 mb-3" />
                    <span className="text-sm font-bold">Accumulating data...</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888', fontSize: 12, fontWeight: 600 }}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0px 4px 8px rgba(59, 130, 246, 0.5))' } }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Users Table Section */}
            <div className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-brand-border/50 pb-6 mb-6">
                <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3">
                  <UsersIcon size={24} className="text-blue-500" /> Member Directory
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl bg-brand-card/50 border border-brand-border/40">
                <Users />
              </div>
            </div>
          </div>
          
          {/* Right Column (Actions) */}
          <aside className="xl:col-span-1 space-y-6">
            <div className="rounded-[2rem] border border-brand-border/60 bg-brand-card/60 backdrop-blur-xl p-8 shadow-sm sticky top-28">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-brand-dark">Command Center</h3>
                <p className="text-sm font-medium text-brand-gray mt-1">Quick access tools</p>
              </div>
              
              <div className="flex flex-col gap-3">
                
                <button
                  onClick={() => navigate('/admin/plans')}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/80 p-4 transition-all hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 dark:bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold text-brand-dark">Manage Plans</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center text-brand-gray group-hover:bg-blue-100 dark:group-hover:bg-blue-500/30 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    →
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/workouts')}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/80 p-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 dark:bg-indigo-500/20 p-2 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Activity size={20} />
                    </div>
                    <span className="font-bold text-brand-dark">View Workouts</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center text-brand-gray group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    →
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/assign-trainer')}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/80 p-4 transition-all hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 dark:bg-emerald-500/20 p-2 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <UserCheck size={20} />
                    </div>
                    <span className="font-bold text-brand-dark">Assign Trainer</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center text-brand-gray group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    →
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/reviews')}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/80 p-4 transition-all hover:border-amber-300 dark:hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 dark:bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                      <Star size={20} />
                    </div>
                    <span className="font-bold text-brand-dark">Manage Reviews</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center text-brand-gray group-hover:bg-amber-100 dark:group-hover:bg-amber-500/30 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    →
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/messages')}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/80 p-4 transition-all hover:border-rose-300 dark:hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-rose-100 dark:bg-rose-500/20 p-2 text-rose-600 dark:text-rose-400 transition-colors group-hover:bg-rose-600 group-hover:text-white">
                      <MessageSquare size={20} />
                    </div>
                    <span className="font-bold text-brand-dark">Messages</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center text-brand-gray group-hover:bg-rose-100 dark:group-hover:bg-rose-500/30 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                    →
                  </div>
                </button>

              </div>
              
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h4 className="text-lg font-bold mb-2 relative z-10">Need Help?</h4>
                <p className="text-sm text-slate-300 mb-4 relative z-10 leading-relaxed">
                  Access the admin documentation for detailed guides on managing the platform.
                </p>
                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold border border-white/20 relative z-10">
                  View Documentation
                </button>
              </div>

            </div>
          </aside>
        </div>

        {/* Modal Overlay */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-[2.5rem] bg-brand-card p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-brand-border/50 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-brand-dark">Create User</h3>
                  <p className="text-sm font-medium text-brand-gray mt-1">Register a new trainer or member</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <UserPlus size={24} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Full Name</label>
                  <input
                    className="w-full rounded-2xl border border-brand-border bg-brand-light/50 px-4 py-3.5 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-brand-gray/50"
                    value={form.name}
                    placeholder="Enter full name"
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: null }); }}
                    disabled={creating}
                  />
                  {errors.name && <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500"></span>{errors.name}</div>}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Email Address</label>
                  <input
                    className="w-full rounded-2xl border border-brand-border bg-brand-light/50 px-4 py-3.5 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-brand-gray/50"
                    value={form.email}
                    placeholder="name@example.com"
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: null }); }}
                    disabled={creating}
                    type="email"
                  />
                  {errors.email && <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500"></span>{errors.email}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Password</label>
                    <input
                      className="w-full rounded-2xl border border-brand-border bg-brand-light/50 px-4 py-3.5 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-brand-gray/50"
                      value={form.password}
                      placeholder="Min. 6 chars"
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: null }); }}
                      disabled={creating}
                      type="password"
                    />
                    {errors.password && <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500"></span>{errors.password}</div>}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Confirm</label>
                    <input
                      className="w-full rounded-2xl border border-brand-border bg-brand-light/50 px-4 py-3.5 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-brand-gray/50"
                      value={form.confirmPassword}
                      placeholder="Repeat"
                      onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: null }); }}
                      disabled={creating}
                      type="password"
                    />
                    {errors.confirmPassword && <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500"></span>{errors.confirmPassword}</div>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">Account Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-2xl border border-brand-border bg-brand-light/50 px-4 py-3.5 text-sm font-medium text-brand-dark outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    disabled={creating}
                  >
                    <option value="member">Member</option>
                    <option value="trainer">Trainer</option>
                  </select>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-border/50 flex items-center justify-end gap-3">
                  <button
                    className="rounded-full px-6 py-3 text-sm font-bold text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors"
                    onClick={() => !creating && setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2"
                    onClick={async () => {
                      if (creating) return;
                      // validate
                      const e = {};
                      const n = validateName(form.name);
                      if (!n.valid) e.name = n.message;
                      const em = validateEmail(form.email);
                      if (!em.valid) e.email = em.message;
                      const pw = validatePassword(form.password, { minLength: 6 });
                      if (!pw.valid) e.password = pw.message;
                      const pm = validatePasswordMatch(form.password, form.confirmPassword);
                      if (!pm.valid) e.confirmPassword = pm.message;

                      if (Object.keys(e).length > 0) {
                        setErrors(e);
                        return;
                      }

                      try {
                        setCreating(true);
                        const payload = {
                          name: form.name.trim(),
                          email: form.email.trim(),
                          password: form.password,
                          role: form.role,
                        };
                        await api.post('/users/register', payload);
                        setCounts((c) => ({ ...c, users: (c.users || 0) + 1, trainers: c.trainers + (form.role === 'trainer' ? 1 : 0) }));
                        setShowCreateModal(false);
                        setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'member' });
                        setErrors({});
                        try { window.dispatchEvent(new Event('users:refresh')); } catch (e) { /* no-op */ }
                      } catch (err) {
                        const data = err?.response?.data;
                        const msg = data?.message || 'Failed to create user';
                        if (/email/i.test(msg)) {
                          setErrors({ email: msg });
                        } else {
                          setErrors({ general: msg });
                        }
                        setCreating(false);
                      }
                    }}
                    disabled={creating}
                  >
                    {creating ? 'Creating…' : 'Create Account'}
                  </button>
                </div>
                {errors.general && <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-sm font-bold text-red-600 dark:text-red-400 text-center">{errors.general}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;