import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react"; // We'll need to install lucide-react or use SVGs

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const features = [
    "Powered by Caffeine & Confidence.",
    "Born to Lift, Forced to Work.",
    "Consistency Builds Kings."
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full flex-col md:flex-row items-center justify-between overflow-hidden bg-brand-light px-8 md:px-16 pt-24 md:pt-10">
      
      {/* Left Content Area */}
      <div className="z-10 flex w-full md:w-[55%] flex-col items-start justify-center pr-4">
        <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-brand-dark mb-6">
          Less Noise.<br />
          <span className="text-brand-gray">More Power</span>
        </h1>
        
        <p className="text-base md:text-lg text-brand-gray mb-10 max-w-lg leading-relaxed">
          We believe in effort over ego, progress over perfection, and movement over excuses matters offside.
        </p>
        
        <div className="flex gap-4 mb-16">
          <button
            onClick={() => navigate(isLoggedIn ? "/member" : "/register")}
            className="rounded-full bg-brand-primary px-8 py-4 text-sm font-semibold text-brand-primary-text shadow-lg transition-transform hover:scale-105 hover:bg-black/90"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </button>
        </div>

        <div className="w-full">
          <p className="text-xl font-bold text-brand-dark mb-6 max-w-sm">
            Built for those who turn sweat into strength.
          </p>
          
          <div className="flex flex-col gap-3">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group flex w-fit items-center gap-4 rounded-full border border-brand-border bg-brand-card px-6 py-3 shadow-sm transition hover:border-brand-dark hover:shadow-md cursor-default"
              >
                <span className="text-sm font-semibold text-brand-dark">{feature}</span>
                <ArrowUpRight className="h-4 w-4 text-brand-gray group-hover:text-brand-dark transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Image Area */}
      <div className="absolute right-0 bottom-0 top-0 hidden md:block w-[45%] lg:w-[50%] z-0">
         <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand-light/20 to-brand-light z-10"></div>
         <img 
            src="/hero-image.jpg" 
            alt="Athlete drinking from yellow bottle" 
            className="h-full w-full object-cover object-left-top"
         />
      </div>

    </div>
  );
}

export default Home;
