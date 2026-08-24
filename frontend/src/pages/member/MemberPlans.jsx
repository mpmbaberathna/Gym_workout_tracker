import { useEffect, useState } from "react";
import api from "../../api/axios";

const MemberPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans/member");
      setPlans(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <p className="text-slate-300">Loading plans...</p>;

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Plans</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">My Plans</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Plans assigned to you by your trainer.</p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 p-8 text-center text-sm font-medium text-brand-gray">
            No workout plans assigned yet.
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <li key={plan._id} className="flex flex-col rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm transition hover:shadow-md hover:border-brand-dark/20">
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

                <div className="mt-4 flex-grow bg-brand-light rounded-2xl p-6 border border-brand-border shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gray mb-3">Exercises</p>
                  <ul className="space-y-2">
                    {plan.exercises.map((e, i) => {
                      const label = e && typeof e === 'object' ? (e.name || e.title) : e;
                      return (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-brand-dark">
                          <span className="inline-block h-2 w-2 rounded-full bg-brand-dark shrink-0" />
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberPlans;