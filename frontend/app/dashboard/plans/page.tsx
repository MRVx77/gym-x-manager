"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

type Plan = {
  id: string;
  name: string;
  durationDays: number;
  price: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition";
const labelClass = "block text-sm font-medium text-white/60 mb-1.5";

export default function PlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadPlans() {
    try {
      const res = await api.get("/api/membership-plan/all");
      setPlans(res.data.plan ?? res.data.plans ?? []);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function openAdd() {
    setEditingId(null);
    setName("");
    setDurationDays("");
    setPrice("");
    setError("");
    setShowForm(true);
  }

  function openEdit(plan: Plan) {
    setEditingId(plan.id);
    setName(plan.name);
    setDurationDays(String(plan.durationDays));
    setPrice(String(Number(plan.price)));
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name,
      durationDays: Number(durationDays),
      price: Number(price),
    };

    try {
      if (editingId) {
        await api.patch(`/api/membership-plan/${editingId}`, payload);
      } else {
        await api.post("/api/membership-plan", payload);
      }
      closeForm();
      await loadPlans();
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(plan: Plan) {
    if (!window.confirm(`Delete the plan "${plan.name}"?`)) return;
    setError("");
    try {
      await api.delete(`/api/membership-plan/${plan.id}`);
      await loadPlans();
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
        {!showForm && (
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition"
          >
            + Add Plan
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
            {editingId ? "Edit plan" : "New plan"}
          </h2>

          <div>
            <label htmlFor="name" className={labelClass}>
              Plan Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="e.g. 3 Months"
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="days" className={labelClass}>
                Duration (days)
              </label>
              <input
                id="days"
                type="number"
                min="1"
                value={durationDays}
                placeholder="90"
                onChange={(e) => setDurationDays(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                min="1"
                value={price}
                placeholder="2200"
                onChange={(e) => setPrice(e.target.value)}
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
                  : "Create plan"}
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
        <p className="text-white/40">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-white/40">No plans yet. Add your first one above.</p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 text-white">{p.name}</td>
                  <td className="px-6 py-4 text-white/60">
                    {p.durationDays} days
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    ₹{Number(p.price).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
