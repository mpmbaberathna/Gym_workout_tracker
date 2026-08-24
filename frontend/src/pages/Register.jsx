import { useState } from "react";
import { validateName, validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const roleParam = new URLSearchParams(location.search).get("role");

  const handleRegister = async () => {
  // BASIC FRONTEND VALIDATION
  setError("");
  const nameCheck = validateName(name);
  if (!nameCheck.valid) return setError(nameCheck.message);

  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) return setError(emailCheck.message);

  const passCheck = validatePassword(password);
  if (!passCheck.valid) return setError(passCheck.message);

  const match = validatePasswordMatch(password, confirmPassword);
  if (!match.valid) return setError(match.message);

  try {
    setSaving(true);
    const payload = { name, email, password };
    if (roleParam) payload.role = roleParam.toString().trim().toLowerCase();

      console.log('REGISTER PAYLOAD:', payload);

      await api.post("/users/register", payload);

      // Auto-login after successful registration so users land on the correct dashboard
      try {
        const loginRes = await api.post("/users/login", { email, password });
        const token = loginRes.data.token;
        const role = loginRes.data.role || roleParam || "member";
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "admin") navigate("/admin");
        else if (role === "trainer") navigate("/trainer");
        else navigate("/member");
      } catch (loginErr) {
        // If auto-login fails, fall back to prompting the user to log in
        console.error("Auto-login failed:", loginErr);
        setError("");
        // show success message briefly before redirecting to login
        alert("Registration successful. Please login.");
        navigate("/login");
      }
  } catch (err) {
    console.log("FULL ERROR OBJECT:", err);
    console.log("RESPONSE:", err.response);
    console.log("RESPONSE DATA:", err.response?.data);
    const msg = err.response?.data?.message || err.message || "Registration failed";
    setError(msg);
  } finally {
    setSaving(false);
  }
};


  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 py-12 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
      <div className="w-full max-w-md rounded-3xl bg-brand-card p-8 sm:p-10 shadow-xl border border-brand-border z-10 relative">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark mb-2">
            Create your account
          </h2>
          <p className="text-sm text-brand-gray">
            Join the platform and start tracking workouts and progress.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
              Name
            </label>
            <input
              className="block w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-gray">
              Confirm Password
            </label>
            <input
              type="password"
              className="block w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/90 disabled:opacity-60"
          >
            {saving ? 'Registering…' : 'Register'}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-brand-gray">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold text-brand-dark underline hover:text-brand-accent transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
