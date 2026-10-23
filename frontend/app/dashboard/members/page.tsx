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
  profilePhotoUrl: string | null;
  deletedAt: string | null;
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function MembershipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);

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
          params: {
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            includeDeleted: showDeleted,
          },
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
  }, [debouncedSearch, refreshKey, showDeleted]);

  async function handlePhotoChange(memberId: string, file: File | undefined) {
    if (!file) return;
    setError("");
    setUploadingId(memberId);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      await api.patch(`/api/member/img/${memberId}`, formData);
      setRefreshKey((k) => k + 1); // reload the list to show the new photo
    } catch (error: any) {
      setError(error.response?.data?.message || "Photo upload failed");
    } finally {
      setUploadingId(null);
    }
  }

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

      <label className="flex items-center gap-2 text-sm text-white/60 mb-6">
        <input
          type="checkbox"
          checked={showDeleted}
          onChange={(e) => setShowDeleted(e.target.checked)}
        />
        Show deleted members
      </label>

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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar: click → detail page; camera overlay → upload */}
                      <div className={`relative shrink-0 group ${uploadingId === m.id ? "opacity-50" : ""}`}>
                        <Link href={`/dashboard/members/${m.id}`} title="View profile">
                          {m.profilePhotoUrl ? (
                            <img
                              src={m.profilePhotoUrl}
                              alt={m.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-purple-600/30 text-purple-200 flex items-center justify-center text-xs font-semibold">
                              {initials(m.name)}
                            </div>
                          )}
                        </Link>
                        {/* Camera overlay — visible on hover */}
                        <label
                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Change photo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={uploadingId === m.id}
                            onChange={(e) => {
                              handlePhotoChange(m.id, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                      <Link href={`/dashboard/members/${m.id}`} className="text-white hover:text-purple-300 transition">
                        {m.name}
                      </Link>
                    </div>
                  </td>
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
