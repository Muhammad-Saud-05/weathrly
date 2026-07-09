import { useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import { setToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // DEBUG
      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data?.access_token;

      if (!token) {
        throw new Error("No access token returned from backend");
      }

      setToken(token);

      // redirect to dashboard
      window.location.href = "/";

    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err);

      setError(
        err?.response?.data?.detail ||
        err.message ||
        "Login failed"
      );
    }
  };

 return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7FAFC]">

      <style>{`
        @keyframes drift {
          0%   { transform: translateX(0px) translateY(0px); }
          50%  { transform: translateX(18px) translateY(-6px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes drift-slow {
          0%   { transform: translateX(0px); }
          50%  { transform: translateX(-24px); }
          100% { transform: translateX(0px); }
        }
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.06); }
        }
        @keyframes float-chip {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        .anim-drift { animation: drift 9s ease-in-out infinite; }
        .anim-drift-slow { animation: drift-slow 14s ease-in-out infinite; }
        .anim-sun { animation: sun-pulse 5s ease-in-out infinite; }
        .anim-chip-1 { animation: float-chip 6s ease-in-out infinite; }
        .anim-chip-2 { animation: float-chip 7s ease-in-out infinite 1.2s; }
        .anim-chip-3 { animation: float-chip 5.5s ease-in-out infinite 0.6s; }
        .anim-rise { animation: rise 0.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .anim-drift, .anim-drift-slow, .anim-sun, .anim-chip-1, .anim-chip-2, .anim-chip-3, .anim-rise {
            animation: none !important;
          }
        }
      `}</style>
 
      {/* LEFT: Sky / brand panel */}
      <div className="relative w-full lg:w-[46%] h-56 sm:h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#173463] to-[#2E6FE0]">
        {/* Sun glow */}
        <div className="anim-sun absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#F5A945] blur-3xl" />
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD98A] to-[#F5A945] shadow-[0_0_60px_20px_rgba(245,169,69,0.35)]" />
 
        {/* Drifting cloud shapes */}
        <svg
          className="anim-drift absolute top-16 left-6 w-40 opacity-90 lg:top-24 lg:left-10 lg:w-56"
          viewBox="0 0 200 100"
          fill="none"
        >
          <ellipse cx="60" cy="60" rx="55" ry="28" fill="#F7FAFC" fillOpacity="0.9" />
          <ellipse cx="110" cy="45" rx="45" ry="32" fill="#F7FAFC" fillOpacity="0.9" />
          <ellipse cx="150" cy="65" rx="35" ry="22" fill="#F7FAFC" fillOpacity="0.9" />
        </svg>
        <svg
          className="anim-drift-slow absolute bottom-24 left-1/3 w-32 opacity-60 lg:bottom-40 lg:w-48"
          viewBox="0 0 200 100"
          fill="none"
        >
          <ellipse cx="60" cy="60" rx="50" ry="26" fill="#A8B8CC" fillOpacity="0.5" />
          <ellipse cx="120" cy="50" rx="40" ry="28" fill="#A8B8CC" fillOpacity="0.5" />
        </svg>
 
        {/* Floating live-data chips */}
        <div className="anim-chip-1 hidden lg:flex absolute top-1/3 left-10 items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 shadow-lg">
          <span className="text-2xl">☀️</span>
          <div className="font-mono leading-tight">
            <p className="text-white text-sm font-semibold">24°C</p>
            <p className="text-white/60 text-[11px]">Muscat</p>
          </div>
        </div>
        <div className="anim-chip-2 hidden lg:flex absolute bottom-1/3 left-24 items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 shadow-lg">
          <span className="text-2xl">🌧️</span>
          <div className="font-mono leading-tight">
            <p className="text-white text-sm font-semibold">62%</p>
            <p className="text-white/60 text-[11px]">Humidity</p>
          </div>
        </div>
        <div className="anim-chip-3 hidden lg:flex absolute bottom-16 right-12 items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 shadow-lg">
          <span className="text-2xl">💨</span>
          <div className="font-mono leading-tight">
            <p className="text-white text-sm font-semibold">14 km/h</p>
            <p className="text-white/60 text-[11px]">Wind</p>
          </div>
        </div>
 
        {/* Brand + tagline */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16">
          <div className="flex items-center gap-2.5 translate-x-8 translate-y-5">
            <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
              <span className="text-2xl">⛅</span>
            </div>
            <span
              className="text-white text-3xl font-semibold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Weathrly
            </span>
          </div>
 
          <div className="hidden lg:block max-w-sm translate-x-8 -translate-y-8">
            <h1
              className="text-white text-3xl font-semibold leading-tight tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Know the sky before you step outside.
            </h1>
            <p className="text-white/60 mt-4 text-sm leading-relaxed">
              Real-time forecasts, sharper predictions, and a dashboard built
              for people who plan around the weather.
            </p>
          </div>
        </div>
      </div>
 
      {/* RIGHT: Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 lg:px-20">
        <div className="w-full max-w-sm anim-rise translate-y-6">
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#2E6FE0] mb-2">
              Sign in
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-[#0B1F3A] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome back
            </h2>
            <p className="text-sm text-[#5C6B85] mt-2">
              Enter your details to access your forecast dashboard.
            </p>
          </div>
 
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#0B1F3A] mb-1.5"
              >
                Email
              </label>
              <div className="flex items-center gap-1">
                <div className="mr-3 flex items-center text-[#A8B8CC]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M4 6.5l8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="flex-1 rounded-lg border border-[#E2E8F0] bg-white py-2.5 px-3 text-sm text-[#0B1F3A] placeholder:text-[#A8B8CC] outline-none transition focus:border-[#2E6FE0] focus:ring-4 focus:ring-[#2E6FE0]/10"
                />
              </div>
            </div>
 
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#0B1F3A]"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#2E6FE0] hover:text-[#173463] transition"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center gap-1">
                <span className="mr-3 flex items-center text-[#A8B8CC]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="5"
                      y="10.5"
                      width="14"
                      height="9"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 10.5V7.5a4 4 0 018 0v3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="flex-1 rounded-lg border border-[#E2E8F0] bg-white py-2.5 pr-3 text-sm text-[#0B1F3A] placeholder:text-[#A8B8CC] outline-none transition focus:border-[#2E6FE0] focus:ring-4 focus:ring-[#2E6FE0]/10"
                />
              </div>
            </div>
 
            {error && (
              <div className="rounded-lg border border-[#F5A945]/30 bg-[#F5A945]/10 px-3 py-2.5">
                <p className="text-xs text-[#B5680E]">{error}</p>
              </div>
            )}
 
            <div className="pt-6">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#0B1F3A] py-2.5 text-sm font-medium text-white transition hover:bg-[#173463] focus:outline-none focus:ring-4 focus:ring-[#2E6FE0]/20"
              >
                Sign in
              </button>
            </div>
          </form>
 
          <p className="mt-8 text-center text-sm text-[#5C6B85]">
            New to Weathrly?{" "}
            <Link
              to="/register"
              className="font-medium text-[#2E6FE0] hover:text-[#173463] transition"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
