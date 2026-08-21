"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────
// 📌 YOUR TASK — Add logic here:
//
// 1. Import useState, useEffect from react
// 2. Import useRouter from next/navigation
// 3. Import api from "@/lib/api"
//
// 4. Create state variables:
//    - user (object or null) — to store { id, email, role }
//    - loading (boolean) — to show a loading spinner on first load
//
// 5. Create a useEffect that runs once on mount:
//    - Check if token exists: localStorage.getItem("token")
//    - If NO token → redirect to /login immediately
//    - If token exists → call api.get("/auth/me")
//    - On success: set user to result.data.user
//    - On error (token invalid/expired): clear token and redirect to /login
//    - Finally: set loading to false
//
// 6. Create a handleLogout function:
//    - Remove token: localStorage.removeItem("token")
//    - Redirect to /login
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // 👇 write your useEffect here
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // Show loading spinner while fetching user
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏋️</span>
          <span className="font-bold tracking-widest uppercase text-white">
            Gym Manager
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <p className="text-sm text-purple-400 font-medium mb-1 uppercase tracking-widest">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold text-white mb-2">
            Hello, {user?.name} 👋
          </h2>
          <p className="text-white/40 text-sm">
            Role: <span className="capitalize text-white/70">{user?.role}</span>
          </p>
        </div>

        {/* Stats placeholder grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Members", "Plans", "Revenue"].map((label) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-2"
            >
              <p className="text-white/40 text-sm">{label}</p>
              <p className="text-2xl font-bold text-white">—</p>
              <p className="text-xs text-white/20">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
