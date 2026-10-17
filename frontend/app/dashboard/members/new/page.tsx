"use client";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Plan = {
  id: string;
  name: string;
  durationDays: number;
  price: string;
};

type Trainer = {
  id: string;
  name: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition [&>option]:bg-[#0a0a0f]";
const labelClass = "block text-sm font-medium text-white/60 mb-1.5";

export default function NewMemberPage() {
  //member
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [planId, setPlanId] = useState("");

  //plan
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function loadOptions() {
      try {
        const [planRes, trainerRes] = await Promise.all([
          api.get("/api/membership-plan/all"),
          api.get("/api/trainer"),
        ]);
        setPlans(planRes.data.plans);
        setTrainers(trainerRes.data.trainers);
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Could not load plans or trainers",
        );
      }
    }
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, string> = { name, phone };
      if (emergencyContact) payload.emergencyContact = emergencyContact;
      if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
      if (trainerId) payload.trainerId = trainerId;

      const res = await api.post("/api/member", payload);
      const member = res.data.member;
      setCreated(true);

      if (planId) {
        try {
          await api.post(`/api/membership/${member.id}/assign`, { planId });
        } catch (error: any) {
          setError(
            `Member was created, but assignin the plan failed : ${error.response?.data?.message || "unknow error"}`,
          );
          return;
        }
      }
      router.push("/dashboard/members");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Add Member</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
          {created && (
            <Link href="/dashboard/members" className="block mt-2 underline">
              Go to members list
            </Link>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="e.g. Rahul Sharma"
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            placeholder="9876543210"
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="emergency" className={labelClass}>
            Emergency Contact (optional)
          </label>
          <input
            id="emergency"
            type="tel"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dob" className={labelClass}>
            Date of Birth (optional)
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
            Trainer (optional)
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

        <div>
          <label htmlFor="plan" className={labelClass}>
            Membership Plan (optional)
          </label>
          <select
            id="plan"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className={inputClass}
          >
            <option value="">Assign later</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · ₹{p.price} · {p.durationDays} days
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || created}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}
