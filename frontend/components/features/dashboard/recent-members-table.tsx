"use client";

import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Membership = {
  id?: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  remainingDays: number;
  color: "GREEN" | "YELLOW" | "RED";
};

type Member = {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  dateOfBirth?: string;
  membership: Membership | null;
  profilePhotoUrl: string | null;
  deletedAt?: string | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DOT_CLASS: Record<"GREEN" | "YELLOW" | "RED", string> = {
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400",
  RED: "bg-red-500",
};

const PILL_CLASS: Record<"GREEN" | "YELLOW" | "RED", string> = {
  GREEN: "bg-green-500/10 text-green-400",
  YELLOW: "bg-yellow-400/10 text-yellow-400",
  RED: "bg-red-500/10 text-red-400",
};

function expiryLabel(m: Membership | null): string {
  if (!m) return "No plan";
  if (m.remainingDays < 0) return "Expired";
  if (m.remainingDays === 0) return "Today";
  return `${m.remainingDays}d left`;
}

function expiryColor(m: Membership | null): "GREEN" | "YELLOW" | "RED" {
  if (!m) return "RED";
  return m.color;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

/** Sort: soonest-expiring first, then members with no membership last */
function sortByExpiry(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    if (!a.membership && !b.membership) return 0;
    if (!a.membership) return 1;
    if (!b.membership) return -1;
    return a.membership.remainingDays - b.membership.remainingDays;
  });
}

function formatJoinDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RecentMembersTableProps {
  /** How many rows to show in the dashboard preview */
  limit?: number;
  variants?: object;
}

export function RecentMembersTable({
  limit = 8,
  variants,
}: RecentMembersTableProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 300 ms debounce — same pattern as the Members page
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/member/all-members", {
          params: debouncedSearch ? { search: debouncedSearch } : {},
        });
        if (!cancelled) setMembers(res.data.members ?? []);
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to load members";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const sorted = sortByExpiry(members).slice(0, limit);

  return (
    <motion.div
      variants={variants}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Recent Members</h2>
          <span className="text-xs text-white/40 bg-white/5 rounded-full px-2 py-0.5">
            sorted by expiry
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition w-44"
            />
          </div>

          {/* View all link */}
          <Link
            href="/dashboard/members"
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition"
          >
            View all
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="px-6 py-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* ── Body ── */}
      {loading ? (
        <div className="px-6 py-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <p className="px-6 py-10 text-center text-white/30 text-sm">
          {debouncedSearch ? "No members match your search." : "No members yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-white/30 border-b border-white/5">
                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => {
                const color = expiryColor(m.membership);
                return (
                  <tr
                    key={m.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    {/* Name + avatar */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/members/${m.id}`}
                          className="shrink-0"
                        >
                          {m.profilePhotoUrl ? (
                            <img
                              src={m.profilePhotoUrl}
                              alt={m.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-200 flex items-center justify-center text-xs font-semibold ring-1 ring-white/10">
                              {initials(m.name)}
                            </div>
                          )}
                        </Link>
                        <Link
                          href={`/dashboard/members/${m.id}`}
                          className="text-white/90 hover:text-purple-300 transition font-medium truncate max-w-[140px]"
                        >
                          {m.name}
                        </Link>
                      </div>
                    </td>

                    {/* Membership status */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full shrink-0 ${DOT_CLASS[color]}`}
                        />
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${PILL_CLASS[color]}`}
                        >
                          {expiryLabel(m.membership)}
                        </span>
                      </div>
                    </td>

                    {/* Join date */}
                    <td className="px-6 py-3.5 text-white/50 text-xs">
                      {formatJoinDate(m.joinDate)}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-3.5 text-white/50 text-xs tabular-nums">
                      {m.phone}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
