"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  // 👇 declare your state and router here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", result.data.token);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.response?.data.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      {/* Glowing background blob */}
      <div className="absolute w-96 h-96 bg-purple-700 opacity-10 rounded-full blur-3xl top-1/4 left-1/2 -translate-x-1/2" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl">🏋️</span>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
            Gym Manager
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-1">
          Log in to your account
        </h2>
        <p className="text-sm text-white/40 text-center mb-8">
          Welcome back! Enter your credentials below.
        </p>

        {/* ── Error message ── */}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-sm text-white/40 text-center mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
