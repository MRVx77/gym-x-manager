"use client";
import { OnboardingGuard } from "@/components/onboarding-guard";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

function GymDetailsForm() {
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || "Image upload failed");
        }
        imageUrls.push(data.secure_url);
      }

      await api.put("/api/gym/update", { location, images: imageUrls });

      router.push("/dashboard");
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
          <div className="h-1.5 flex-1 rounded-full bg-purple-500" />
        </div>
        <p className="text-xs text-white/40 mb-6">Step 2 of 2</p>

        <h2 className="text-xl font-semibold text-white mb-1">Gym details</h2>
        <p className="text-sm text-white/40 mb-8">Where is your gym located?</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="City, area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Gym Photos (optional)
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish Setup"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function GymDetailsPage() {
  return (
    <OnboardingGuard>
      <GymDetailsForm />
    </OnboardingGuard>
  );
}
