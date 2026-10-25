"use client";

import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { QuickActions } from "@/components/features/dashboard/quick-actions";
import { RecentMembersTable } from "@/components/features/dashboard/recent-members-table";
import { RevenueCard } from "@/components/features/dashboard/revenue-card";
import { RevenueTargetCard } from "@/components/features/dashboard/revenue-target-card";
import { StatCard } from "@/components/features/dashboard/stat-card";
import { TodaysBirthdaysCard } from "@/components/features/dashboard/todays-birthdays-card";

// ─── Types ───────────────────────────────────────────────────────────────────

type DashboardSummary = {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  newThisMonth: number;
  revenueThisMonth: number;
};

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Second row starts slightly after the first finishes
const secondRowContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.42 },
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

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
      } catch (err: unknown) {
        console.log(err);
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message ?? "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* ── Page header + Quick Actions ─────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>

        <QuickActions variants={itemVariants} />
      </motion.div>

      {/* ── Stat cards row ───────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Members"
          value={summary.totalMembers}
          icon={Users}
          accent="default"
          variants={itemVariants}
        />
        <StatCard
          label="Active Members"
          value={summary.activeMembers}
          icon={Activity}
          accent="success"
          variants={itemVariants}
        />
        <StatCard
          label="Expiring Soon"
          value={summary.expiringSoon}
          icon={AlertTriangle}
          accent={summary.expiringSoon > 0 ? "warning" : "default"}
          trendLabel="within 7 days"
          variants={itemVariants}
        />
        <StatCard
          label="New This Month"
          value={summary.newThisMonth}
          icon={Sparkles}
          accent="default"
          variants={itemVariants}
        />
      </motion.div>

      {/* ── Revenue row: RevenueCard + RevenueTargetCard + Birthday ─────── */}
      <motion.div
        variants={secondRowContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {/* Revenue card spans 1 col on md, but we give it more weight on xl */}
        <div className="xl:col-span-1">
          <RevenueCard
            revenueThisMonth={summary.revenueThisMonth}
            variants={itemVariants}
          />
        </div>

        <div className="xl:col-span-1">
          <RevenueTargetCard
            current={summary.revenueThisMonth}
            variants={itemVariants}
          />
        </div>

        {/* Birthday card fills the third column on xl, stacks below on smaller */}
        <div className="md:col-span-2 xl:col-span-1 flex flex-col gap-4">
          <TodaysBirthdaysCard
            count={0}
            variants={itemVariants}
            // TODO: needs a GET /api/dashboard field or separate endpoint filtering by dateOfBirth
          />

          {/* Mini insight card — fills remaining vertical space */}
          <motion.div
            variants={itemVariants}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
          >
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
              Expiring This Week
            </p>
            <div className="mt-3">
              <p className="text-3xl font-bold text-yellow-400">
                {summary.expiringSoon}
              </p>
              <p className="text-xs text-white/40 mt-1">
                memberships due in ≤7 days
              </p>
            </div>
            <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-400/60 transition-all duration-[1200ms] ease-out"
                style={{
                  width:
                    summary.totalMembers > 0
                      ? `${Math.min((summary.expiringSoon / summary.totalMembers) * 100, 100)}%`
                      : "0%",
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Recent Members Table ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <RecentMembersTable limit={8} />
      </motion.div>
    </div>
  );
}
