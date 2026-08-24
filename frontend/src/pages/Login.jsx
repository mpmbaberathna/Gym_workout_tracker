import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const e = validateEmail(email);
    if (!e.valid) return setError(e.message);
    const p = validatePassword(password);
    if (!p.valid) return setError(p.message);

    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const token = res.data.token;
      const decoded = (function parseJwt(token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload);
        } catch (e) {
          return {};
        }
      })(token);

      // Store token for API clients and role for quick UI checks.
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);

      // Also rely on server-side session cookie (set by backend) for browser
      // authentication. Server will set `connect.sid` cookie; axios is
      // configured to send credentials.

      if (decoded.role === "admin") navigate("/admin");
      else if (decoded.role === "trainer") navigate("/trainer");
      else navigate("/member");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
      <div className="w-full max-w-md rounded-3xl bg-brand-card p-8 sm:p-10 shadow-xl border border-brand-border z-10 relative">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-brand-gray">
            Sign in to access your personalized workout dashboard.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
              Email
            </label>
            <input
              className="block w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
              Password
            </label>
            <input
              type="password"
              className="block w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-brand-gray">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-bold text-brand-dark underline hover:text-brand-accent transition-colors"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
