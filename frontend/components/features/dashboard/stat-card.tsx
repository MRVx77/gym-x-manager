"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { useCountUp } from "./use-count-up";

export type StatCardAccent = "default" | "success" | "warning" | "danger";

export interface StatCardProps {
  label: string;
  value: number;
  /** Optional icon from lucide-react */
  icon?: LucideIcon;
  /** Optional prefix like "₹" */
  prefix?: string;
  /** Optional suffix like "%" */
  suffix?: string;
  /** Percentage change vs last period, e.g. 12 or -5 */
  trend?: number;
  /** Trendline comparison label, e.g. "vs last month" */
  trendLabel?: string;
  /** Color accent for the value */
  accent?: StatCardAccent;
  /** Framer-motion item variant (used by parent stagger) */
  variants?: object;
}

const accentValueColor: Record<StatCardAccent, string> = {
  default: "text-white",
  success: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
};

const accentDotColor: Record<StatCardAccent, string> = {
  default: "bg-white/20",
  success: "bg-green-500",
  warning: "bg-yellow-400",
  danger: "bg-red-500",
};

const accentIconBg: Record<StatCardAccent, string> = {
  default: "bg-white/10",
  success: "bg-green-500/15",
  warning: "bg-yellow-400/15",
  danger: "bg-red-500/15",
};

const accentIconColor: Record<StatCardAccent, string> = {
  default: "text-white/60",
  success: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
  trend,
  trendLabel = "vs last month",
  accent = "default",
  variants,
}: StatCardProps) {
  const animatedValue = useCountUp(value);

  const hasTrend = trend !== undefined;
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div
      variants={variants}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
    >
      {/* Subtle top-left glow accent */}
      <div
        className={`absolute -top-6 -left-6 w-20 h-20 rounded-full blur-2xl opacity-20 ${accentDotColor[accent]}`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1">
            {label}
          </p>
          <p
            className={`text-3xl font-bold tracking-tight ${accentValueColor[accent]}`}
          >
            {prefix}
            {animatedValue.toLocaleString("en-IN")}
            {suffix}
          </p>
        </div>

        {Icon && (
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accentIconBg[accent]}`}
          >
            <Icon size={18} className={accentIconColor[accent]} />
          </div>
        )}
      </div>

      {hasTrend && (
        <div className="flex items-center gap-1.5 relative z-10">
          {isPositive ? (
            <TrendingUp size={13} className="text-green-400 shrink-0" />
          ) : (
            <TrendingDown size={13} className="text-red-400 shrink-0" />
          )}
          <span
            className={`text-xs font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-white/40">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
