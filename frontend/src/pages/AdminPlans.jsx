import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/plans/admin');
        setPlans(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load plans');
      }
    };
    fetch();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Admin</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">All Plans</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Browse workout plans created across the platform.</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-end border-b border-brand-border pb-4">
            <button onClick={() => navigate('/admin')} className="rounded-full border border-brand-border bg-brand-card px-5 py-2 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light transition">
              Back to Admin Dashboard
            </button>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-6">
              <p className="text-sm font-bold text-red-600 text-center">{error}</p>
            </div>
          )}

          {plans.length === 0 && !error ? (
            <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 px-8 py-12 text-center text-sm font-bold text-brand-dark">
              No plans found.
            </div>
          ) : (
            <div className="grid gap-6">
              {plans.map((plan) => (
                <div key={plan._id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-brand-dark">{plan.title}</p>
                      {plan.createdBy && (
                        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-gray">
                          Owner: {plan.createdBy.name || plan.createdBy.email} {plan.createdAt ? `• ${new Date(plan.createdAt).toLocaleString()}` : ''}
                        </p>
                      )}
                      {plan.description && <p className="mt-4 text-sm text-brand-gray leading-relaxed">{plan.description}</p>}
                    </div>

                    {plan.exercises && plan.exercises.length > 0 && (
                      <div className="md:w-1/3 bg-brand-light rounded-2xl p-4 border border-brand-border shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-gray mb-2">Exercises</p>
                        <ul className="space-y-1">
                          {plan.exercises.map((e, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm font-medium text-brand-dark">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-dark shrink-0" />
                              {e.name || e.title || e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
