import { useNavigate } from "react-router-dom";

function Classes() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-50">
      <div className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Classes
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Strength, cardio, mobility – all in one place.
        </h1>
        <p className="mt-4 text-sm text-slate-300 sm:text-base">
          Imagine curated workout tracks: strength splits, fat-burn sessions,
          mobility flows, and recovery days. Trainers can assign, members can
          follow, and everyone stays in sync.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-indigo-500/40 transition hover:bg-indigo-400"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

export default Classes;
