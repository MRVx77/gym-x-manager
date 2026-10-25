"use client";

import { motion } from "framer-motion";
import { Cake } from "lucide-react";

interface TodaysBirthdaysCardProps {
  /**
   * Number of members with a birthday today.
   * TODO: needs a GET /api/dashboard field or separate endpoint
   * filtering members by dateOfBirth matching today's month/day.
   */
  count: number;
  variants?: object;
}

export function TodaysBirthdaysCard({
  count,
  variants,
}: TodaysBirthdaysCardProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
    >
      {/* Subtle pink glow */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="shrink-0 w-11 h-11 rounded-xl bg-pink-500/15 flex items-center justify-center relative z-10">
        <Cake size={20} className="text-pink-400" />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-0.5">
          Today's Birthdays
        </p>
        <p className="text-2xl font-bold text-white leading-none">
          {count}
          <span className="text-sm font-normal text-white/40 ml-1.5">
            member{count !== 1 ? "s" : ""}
          </span>
        </p>
        {/* TODO: needs a GET /api/dashboard field or separate endpoint filtering by dateOfBirth */}
        <p className="text-xs text-white/30 mt-0.5">
          {count === 0 ? "No birthdays today" : "🎂 Send them a wish!"}
        </p>
      </div>
    </motion.div>
  );
}
