"use client";

import { OnboardingGuard } from "@/components/onboarding-guard";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateGymForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.post("/api/gym/create", { name });
      const { token } = result.data;

      localStorage.setItem("token", token);
      refreshUser();

      router.push("/onboarding/details");
    } catch (error: any) {
      setError(error.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="w-full max-w-md mx-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="mb-2 flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-purple-500" />
          <div className="h-1.5 flex-1 rounded-full bg-white/10" />
        </div>
        <p className="text-xs text-white/40 mb-6">Step 1 of 2</p>

        <h2 className="text-xl font-semibold text-white mb-1">Name your gym</h2>
        <p className="text-sm text-white/40 mb-8">
          You can add location and photos in the next step.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Gym Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Iron Paradise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function CreateGymPage() {
  return (
    <OnboardingGuard>
      <CreateGymForm />
    </OnboardingGuard>
  );
}
