"use client";

import { StatCard } from "@/components/features/dashbord/stat-card";
import api from "@/lib/api";
import { useEffect, useState } from "react";

type DashboardSummary = {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  newThisMonth: number;
  revenueThisMonth: number;
};

export default function DashboardHomePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get("/api/dashboard");
        console.log("dashboard: ", res.status, res.data);
        setSummary(res.data);
      } catch (err: any) {
        console.log(err);

        setError(err.response?.data?.message || "failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Members" value={summary.totalMembers} />
        <StatCard label="Active Members" value={summary.activeMembers} />
        <StatCard
          label="Expiring in 7 Days"
          value={summary.expiringSoon}
          accent={summary.expiringSoon > 0 ? "warning" : "default"}
        />
        <StatCard label="New This Month" value={summary.newThisMonth} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-sm text-white/40 mb-2">Revenue This Month</p>
        <p className="text-3xl font-bold text-white">
          ₹{summary.revenueThisMonth.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
