import { useNavigate } from "react-router-dom";

function Membership() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-50">
      <div className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Membership
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Memberships that feel like a coach, not a card.
        </h1>
        <p className="mt-4 text-sm text-slate-300 sm:text-base">
          Connect members with the right trainers, the right plans, and a
          timeline they can actually follow. Progress isn&apos;t guessed here – it&apos;s
          measured.
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

export default Membership;
