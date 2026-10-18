"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

type Trainer = {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  profileImage: string | null;
  specialization: string | null;
  experienceYears: number | null;
  pricing: string | null;
};

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

export default function TrainerPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [pricing, setPricing] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadTrainers() {
    try {
      const res = await api.get("/api/trainer");
      setTrainers(res.data.trainers);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrainers();
  }, []);

  function openAdd() {
    setEditingId(null);
    setName("");
    setGender("");
    setSpecialization("");
    setExperienceYears("");
    setPricing("");
    setError("");
    setShowForm(true);
  }

  function openEdit(t: Trainer) {
    setEditingId(t.id);
    setName(t.name);
    setGender(t.gender ?? "");
    setSpecialization(t.specialization ?? "");
    setExperienceYears(
      t.experienceYears != null ? String(t.experienceYears) : "",
    );
    setPricing(t.pricing ? String(Number(t.pricing)) : "");
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload: Record<string, string | number> = { name, gender };
    if (specialization) payload.specialization = specialization;
    if (experienceYears) payload.experienceYears = Number(experienceYears);
    if (pricing != "") payload.pricing = Number(pricing);

    try {
      if (editingId) {
        await api.patch(`/api/trainer/${editingId}`, payload);
      } else {
        await api.post("/api/trainer", payload);
      }
      closeForm();
      await loadTrainers();
    } catch (error: any) {
      setError(error.response?.data?.message || "something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t: Trainer) {
    if (
      !window.confirm(
        `Delete ${t.name}? Their members will be left without a tainer`,
      )
    )
      return;
    setError("");

    try {
      await api.delete(`/api/trainer/${t.id}`);
      await loadTrainers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't delete this trainer");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Trainers</h1>
        {!showForm && (
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition"
          >
            + Add Trainer
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 max-w-xl space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Edit trainer" : "New trainer"}
          </h2>

          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="e.g. Amit Verma"
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="gender" className={labelClass}>
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputClass}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="spec" className={labelClass}>
              Specialization (optional)
            </label>
            <input
              id="spec"
              type="text"
              value={specialization}
              placeholder="e.g. Strength training"
              onChange={(e) => setSpecialization(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="exp" className={labelClass}>
                Experience (years)
              </label>
              <input
                id="exp"
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pricing" className={labelClass}>
                Pricing (₹)
              </label>
              <input
                id="pricing"
                type="number"
                min="1"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add trainer"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 rounded-xl font-medium text-white/60 hover:bg-white/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-white/40">Loading trainers...</p>
      ) : trainers.length === 0 ? (
        <p className="text-white/40">
          No trainers yet. Add your first one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.profileImage ? (
                  <img
                    src={t.profileImage}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-purple-600/30 text-purple-200 flex items-center justify-center font-semibold">
                    {initials(t.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{t.name}</p>
                  <p className="text-xs text-white/40">
                    {t.gender
                      ? t.gender.charAt(0) + t.gender.slice(1).toLowerCase()
                      : "—"}
                  </p>
                </div>
              </div>

              <dl className="space-y-1.5 text-sm mb-4">
                <div className="flex justify-between">
                  <dt className="text-white/40">Specialization</dt>
                  <dd className="text-white/80">{t.specialization || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/40">Experience</dt>
                  <dd className="text-white/80">
                    {t.experienceYears ?? 0} yrs
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/40">Pricing</dt>
                  <dd className="text-white/80">
                    {t.pricing
                      ? `₹${Number(t.pricing).toLocaleString("en-IN")}`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => openEdit(t)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
