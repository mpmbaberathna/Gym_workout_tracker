import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isBrowser = typeof window !== "undefined";
  const isLoggedIn = isBrowser && !!localStorage.getItem("token");
  const role = isBrowser ? localStorage.getItem("role") : null;
  const [userName, setUserName] = useState(null);
  const [avatarInitials, setAvatarInitials] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        if (!mounted) return;
        const name = (res.data.name || '').toString().trim();
        if (mounted) {
          setUserName(name || null);
          const parts = name ? name.split(/\s+/) : [];
          const initials = parts.length === 0 ? 'U' : parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
          setAvatarInitials(initials);
        }
      } catch (err) {
        // ignore - avatar stays default
      }
    };

    if (isLoggedIn) fetchProfile();

    return () => { mounted = false; };
  }, [isLoggedIn]);

  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "trainer") return "/trainer";
    if (role === "member") return "/member";
    return "/";
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between px-8 md:px-16 py-6 ${isAuthPage ? 'text-white' : 'text-brand-dark'}`}>
      <div 
        className="text-2xl font-extrabold tracking-tighter cursor-pointer select-none" 
        onClick={() => navigate("/")}
      >
        GYM TRACKER
      </div>
      
      <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
        <button onClick={() => navigate("/")} className="hover:text-brand-accent transition-colors">Home</button>
        <button onClick={() => navigate("/about")} className="hover:text-brand-accent transition-colors">About</button>
        <button onClick={() => navigate("/faq")} className="hover:text-brand-accent transition-colors">FAQ</button>
        <button onClick={() => navigate("/contact")} className="hover:text-brand-accent transition-colors">Contact</button>
        <button onClick={() => navigate("/reviews")} className="hover:text-brand-accent transition-colors">Reviews</button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="mr-2 rounded-full border border-brand-border bg-brand-card p-2 text-brand-dark shadow-sm hover:scale-105 transition-transform"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          )}
        </button>
        {!isLoggedIn ? (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary-text shadow-sm transition-all hover:bg-black/80 hover:shadow-md"
          >
            Login
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              title={userName || 'Profile'}
              className="flex items-center justify-center rounded-full border border-brand-border bg-brand-card p-0 shadow-sm hover:scale-105 transition-transform"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-brand-dark">
                {avatarInitials || 'U'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate(getDashboardPath())}
              className="rounded-full border border-brand-border bg-brand-card px-5 py-2 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
              }}
              className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-brand-primary-text shadow-sm transition-all hover:bg-red-500"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
