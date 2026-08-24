import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const whyChooseUs = [
    {
      title: "Progress you can measure",
      description:
        "Track workouts, plans, schedules, and progress with clean, consistent data — so improvements aren’t a guess.",
      accent: "text-blue-600 bg-blue-50",
    },
    {
      title: "Built for every role",
      description:
        "Admins stay organized, trainers stay focused, and members stay motivated — each with the tools they need.",
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Simple, fast workflows",
      description:
        "Less time clicking. More time training. Everything important is one or two steps away.",
      accent: "text-brand-accent bg-yellow-50",
    },
    {
      title: "Consistency-first design",
      description:
        "A calm UI, clear structure, and repeatable routines that support real gym journeys — not quick fixes.",
      accent: "text-indigo-600 bg-indigo-50",
    },
  ];

  const trainers = [
    {
      name: "Nimal Fernando",
      role: "Strength & Conditioning",
      description:
        "Focuses on safe progressive overload, technique, and repeatable weekly structure.",
      badge: "text-emerald-700 bg-emerald-100",
    },
    {
      name: "Ayesha Perera",
      role: "Body Recomposition",
      description:
        "Combines smart lifting with sustainable habits and realistic targets you can maintain.",
      badge: "text-sky-700 bg-sky-100",
    },
    {
      name: "Kavindu Silva",
      role: "Athletic Performance",
      description:
        "Improves power, speed, and conditioning with structured blocks and recovery awareness.",
      badge: "text-amber-700 bg-amber-100",
    },
    {
      name: "Dilani Jayasinghe",
      role: "Mobility & Core",
      description:
        "Helps members move better, lift stronger, and stay consistent with joint-friendly programming.",
      badge: "text-indigo-700 bg-indigo-100",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      
      {/* Header Section */}
      <div className="mx-auto w-full max-w-6xl mb-24">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="space-y-6 lg:col-span-7">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl tracking-tight text-brand-dark">
              Built for real gym journeys,<br/> not quick fixes.
            </h1>
            <p className="text-base md:text-lg text-brand-gray max-w-xl leading-relaxed">
              This platform keeps admins organized, trainers focused, and members
              motivated. Track workouts, plans, schedules, and progress in one
              clean, data-driven dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/80"
              >
                Back to home
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-3">
                  Our mission
                </p>
                <p className="text-brand-gray leading-relaxed">
                  Make training simple to plan, easy to follow, and effortless to
                  track — so consistency becomes your default.
                </p>
              </div>
              <div className="rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-3">
                  What we believe
                </p>
                <p className="text-brand-gray leading-relaxed">
                  Progress is a process. Data helps you stay honest, routines help
                  you stay consistent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="mx-auto w-full max-w-6xl mb-24">
        <div className="flex flex-col gap-3 text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            A platform that respects your time.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-brand-gray">
            Whether you manage the gym, coach the sessions, or follow the plan —
            everything stays clear and consistent.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm transition-all hover:shadow-md hover:border-brand-dark/20"
            >
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${item.accent}`}>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trainers Section */}
      <section className="mx-auto w-full max-w-6xl mb-24">
        <div className="flex flex-col gap-3 text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Coaches who keep you consistent.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-brand-gray">
            Structured plans, clear cues, and steady support — so you can train
            with confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer) => (
            <div
              key={trainer.name}
              className="rounded-3xl border border-brand-border bg-brand-card p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-brand-light text-brand-dark text-xl font-bold">
                  {trainer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">{trainer.name}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${trainer.badge}`}>
                    {trainer.role}
                  </span>
                </div>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {trainer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

export default About;
