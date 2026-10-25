"use client";

import { motion } from "framer-motion";
import { useCountUp } from "./use-count-up";

interface RevenueTargetCardProps {
  current: number;
  /**
   * Monthly revenue goal.
   * TODO: goal should come from gym settings once that exists.
   * Hardcoded as current * 1.5 for now.
   */
  goal?: number;
  variants?: object;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function RevenueTargetCard({
  current,
  goal,
  variants,
}: RevenueTargetCardProps) {
  // TODO: goal should come from gym settings once that exists.
  const resolvedGoal = (goal ?? Math.round(current * 1.5)) || 100000;
  const pct = Math.min(current / resolvedGoal, 1);

  const animatedCurrent = useCountUp(current, 1400);
  const animatedGoal = useCountUp(resolvedGoal, 1400);

  // Arc: from -135° to +135° (270° sweep)
  const START_ANGLE = -135;
  const SWEEP = 270;
  const endAngle = START_ANGLE + SWEEP * pct;

  const CX = 80;
  const CY = 80;
  const R = 58;
  const STROKE = 10;

  const trackPath = arcPath(CX, CY, R, START_ANGLE, START_ANGLE + SWEEP);
  const fillPath = pct > 0 ? arcPath(CX, CY, R, START_ANGLE, endAngle) : "";

  // Dot position at the tip of the fill arc
  const tip = polarToCartesian(CX, CY, R, pct > 0 ? endAngle : START_ANGLE);

  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative bg-gradient-to-br from-[#0f0f1a] to-[#16103a] border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden cursor-default"
      style={{
        boxShadow:
          "0 0 0 1px rgba(139,92,246,0.08), 0 8px 32px rgba(139,92,246,0.12)",
      }}
    >
      {/* Gradient halo */}
      <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
          Revenue Target
        </p>
        <p className="text-xs text-white/30 mt-0.5">vs monthly goal</p>
      </div>

      {/* Gauge + labels */}
      <div className="relative z-10 flex items-center gap-6">
        {/* SVG arc gauge */}
        <div className="shrink-0">
          <svg width={160} height={120} viewBox="0 0 160 140">
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
            {/* Fill */}
            {pct > 0 && (
              <path
                d={fillPath}
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
            )}
            {/* Tip dot */}
            {pct > 0 && (
              <circle
                cx={tip.x}
                cy={tip.y}
                r={6}
                fill="#8b5cf6"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Center text */}
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              fill="white"
              fontSize={13}
              fontWeight={700}
            >
              {Math.round(pct * 100)}%
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize={9}
            >
              of target
            </text>
          </svg>
        </div>

        {/* Numeric breakdown */}
        <div className="flex flex-col gap-3 flex-1">
          <div>
            <p className="text-xs text-white/40 mb-0.5">Current</p>
            <p className="text-xl font-bold text-white">
              ₹{animatedCurrent.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div>
            <p className="text-xs text-white/40 mb-0.5">Goal</p>
            <p className="text-lg font-semibold text-white/60">
              ₹{animatedGoal.toLocaleString("en-IN")}
            </p>
            {/* TODO: goal should come from gym settings once that exists */}
          </div>
          <div className="w-full rounded-full bg-white/5 h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-[1400ms] ease-out"
              style={{ width: `${Math.round(pct * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
