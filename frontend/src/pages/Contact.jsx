import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ name: letters and spaces only
  const isValidName = (name) => {
    return /^[A-Za-z ]+$/.test(name.trim());
  };

  // ✅ email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!cleanedForm.name) {
      setError("Name is required.");
      return;
    }

    if (!isValidName(cleanedForm.name)) {
      setError("Name can only contain letters and spaces.");
      return;
    }

    if (!isValidEmail(cleanedForm.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!cleanedForm.message) {
      setError("Message cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/messages", cleanedForm);
      setSuccess("Your message has been sent successfully.");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12">
          
          <div className="space-y-6 lg:col-span-5 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl tracking-tight text-brand-dark">
              Get in touch.<br/>We'll keep it simple.
            </h1>
            <p className="text-base md:text-lg text-brand-gray max-w-md leading-relaxed">
              Questions about memberships, schedules, or your training plan?
              Reach out and we’ll point you to the right place.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full bg-brand-card border border-brand-border px-8 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light hover:shadow-md"
              >
                Back to home
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-brand-border bg-brand-card p-8 sm:p-10 shadow-sm">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">
                  Send a message
                </p>
                <h2 className="text-2xl font-extrabold sm:text-3xl text-brand-dark">
                  Tell us what you need.
                </h2>
              </div>

              <form className="grid gap-6" onSubmit={submitHandler}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                      Name
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    />
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                      Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                    Message
                  </span>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us what you're looking for…"
                    className="w-full resize-none rounded-2xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 outline-none transition focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  />
                </label>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {success}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-brand-primary-text shadow-sm transition hover:bg-black/90 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;