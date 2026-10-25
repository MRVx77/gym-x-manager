"use client";

import { useCountUp } from "./use-count-up";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// TODO: replace with real API data once GET /api/dashboard returns monthly history
const PLACEHOLDER_MONTHLY_REVENUE: { month: string; amount: number }[] = [
  { month: "May", amount: 42000 },
  { month: "Jun", amount: 57500 },
  { month: "Jul", amount: 51200 },
  { month: "Aug", amount: 68900 },
  { month: "Sep", amount: 74300 },
  { month: "Oct", amount: 0 }, // filled from real API prop below at runtime
];

interface RevenueCardProps {
  revenueThisMonth: number;
  /** Last 6 months of revenue data — pass real data when available.
   *  TODO: replace with real API data once GET /api/dashboard returns monthly history */
  monthlyRevenue?: { month: string; amount: number }[];
  variants?: object;
}

// Custom recharts tooltip styled to match the dark glass theme
function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#12121a] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-white/50 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function RevenueCard({
  revenueThisMonth,
  monthlyRevenue,
  variants,
}: RevenueCardProps) {
  const animatedRevenue = useCountUp(revenueThisMonth, 1400);

  // Merge placeholder with the real current month value
  const chartData = (monthlyRevenue ?? PLACEHOLDER_MONTHLY_REVENUE).map(
    (d, i, arr) =>
      i === arr.length - 1
        ? { ...d, amount: revenueThisMonth } // latest month = real value
        : d,
  );

  return (
    <motion.div
      variants={variants}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Background gradient blob */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1">
          Revenue This Month
        </p>

        <div className="flex items-end gap-3 mb-1">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            ₹{animatedRevenue.toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Trend indicator — static label for now */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-green-500/15 rounded-full px-2 py-0.5">
            <TrendingUp size={11} className="text-green-400" />
            <span className="text-xs font-semibold text-green-400">
              {/* TODO: compute real MoM % once historical data is available */}
              Live
            </span>
          </div>
          <span className="text-xs text-white/40">current month</span>
        </div>
      </div>

      {/* Mini area chart — hover tooltip is the primary interactive moment */}
      <div className="relative z-10 h-28 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              content={
                <DarkTooltip active={undefined} payload={undefined} label="" />
              }
              cursor={{ stroke: "rgba(139,92,246,0.3)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#8b5cf6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
