"use client";

import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Membership = {
  id: string;
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
  membership: Membership | null;
};

const DOT_COLOR = {
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400",
  RED: "bg-red-500",
};

function expiryLabel(m: Membership | null) {
  if (!m) return "No plan";
  if (m.remainingDays < 0) return "Expired";
  if (m.remainingDays === 0) return "Expired today";
  return `${m.remainingDays} days left`;
}

export default function MembershipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //load balancing
  // Wait 300ms after the owner stops typing before calling the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    async function loadMembers() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/member/all-members", {
          params: debouncedSearch ? { search: debouncedSearch } : {},
        });
        if (!cancelled) setMembers(res.data.members);
      } catch (error: any) {
        if (!cancelled) {
          setError(
            error.response?.data?.message || "Failed to load all members",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMembers();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <Link
          href="/dashboard/members/new"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition"
        >
          + Add Member
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name, phone or ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-white/40">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-white/40">
          {debouncedSearch
            ? "No members match your search."
            : "No members yet."}
        </p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Membership</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{m.name}</td>
                  <td className="px-6 py-4 text-white/60">{m.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/80">
                      {m.membership && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${DOT_COLOR[m.membership.color]}`}
                        />
                      )}
                      {expiryLabel(m.membership)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60">{m.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
