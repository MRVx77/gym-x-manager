"use client";

import api from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  phone: string;
  emergencyContact: string | null;
  dateOfBirth: string | null;
  trainerId: string | null;
  profilePhotoUrl: string | null;
  joinDate: string;
  deletedAt: string | null;
};

type Trainer = { id: string; name: string };

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition [&>option]:bg-[#0a0a0f]";
const labelClass = "block text-sm font-medium text-white/60 mb-1.5";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [trainerId, setTrainerId] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function fillForm(m: Member) {
    setName(m.name);
    setPhone(m.phone);
    setEmergencyContact(m.emergencyContact ?? "");
    setDateOfBirth(m.dateOfBirth ?? "");
    setTrainerId(m.trainerId ?? "");
  }

  useEffect(() => {
    async function load() {
      try {
        const [memberRes, trainerRes] = await Promise.all([
          api.get(`/api/member/${id}`),
          api.get("/api/trainer"),
        ]);
        setMember(memberRes.data.member);
        fillForm(memberRes.data.member);
        setTrainers(trainerRes.data.trainers);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load member");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function editMember(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.patch(`/api/member/${id}`, {
        name,
        phone,
        emergencyContact,
        dateOfBirth,
        trainerId,
      });
      setMember(res.data.member);
      setSuccess("Change Saved");
    } catch (error: any) {
      setError(error.response?.data?.message || "something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(file: File | undefined) {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.patch(`/api/member/img/${id}`, formData);
      setMember(res.data.member);
    } catch (error: any) {
      setError(error.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!member) return;

    if (
      !window.confirm(
        `Delete ${member.name}? They'll be hidden from your list and stop receiving notifications, but their payment history is kept.`,
      )
    ) {
      return;
    }
    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      await api.delete(`/api/member/${id}`);
      router.push("/dashboard/members");
    } catch (error: any) {
      setError(error.response?.data?.message || "Couldn't delete this member");
      setDeleting(false);
    }
  }

  async function handleRestore() {
    setError("");
    setSuccess("");
    try {
      const res = await api.patch(`/api/member/${id}/restore`);
      setMember(res.data.member);
      setSuccess("Member restored");
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't restore this member");
    }
  }

  if (loading) return <p className="text-white/40">Loading member...</p>;

  if (!member) {
    return (
      <div>
        <p className="text-red-400 mb-4">{error || "Member not found"}</p>
        <Link
          href="/dashboard/members"
          className="text-purple-400 hover:text-purple-300"
        >
          ← Back to members
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/members"
        className="text-sm text-white/40 hover:text-white transition"
      >
        ← Back to members
      </Link>

      <div className="flex items-center gap-5 mt-4 mb-8">
        <label
          className={`cursor-pointer shrink-0 ${uploading ? "opacity-50" : ""}`}
          title={member.profilePhotoUrl ? "Change photo" : "Add photo"}
        >
          {member.profilePhotoUrl ? (
            <img
              src={member.profilePhotoUrl}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-600/30 text-purple-200 flex items-center justify-center text-xl font-semibold">
              {initials(member.name)}
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              handlePhotoChange(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <div>
          <h1
            className={`text-2xl font-bold ${member.deletedAt ? "line-through text-white/40" : "text-white"}`}
          >
            {member.name}
          </h1>
          <p className="text-sm text-white/40">
            Joined {member.joinDate} ·{" "}
            {uploading ? "Uploading photo..." : "Click the photo to change it"}
          </p>
        </div>
      </div>

      {/* NEW 4a: banner shown only for deleted members */}
      {member.deletedAt && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm flex items-center justify-between">
          <span>This member was deleted. Their history is kept.</span>
          <button
            onClick={handleRestore}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Restore
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={editMember}
        className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white">Personal details</h2>

        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="emergency" className={labelClass}>
              Emergency Contact
            </label>
            <input
              id="emergency"
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dob" className={labelClass}>
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="trainer" className={labelClass}>
              Trainer
            </label>
            <select
              id="trainer"
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className={inputClass}
            >
              <option value="">No trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          {/* NEW 4b: hide the delete button when already deleted */}
          {!member.deletedAt && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete member"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
