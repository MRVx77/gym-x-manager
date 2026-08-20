"use client";

// ─────────────────────────────────────────────
// 📌 YOUR TASK — Add logic here:
//
// 1. Import useState from react
// 2. Import useRouter from next/navigation
// 3. Import api from "@/lib/api"
//
// 4. Create state variables:
//    - email (string)
//    - password (string)
//    - error (string)
//    - loading (boolean)
//
// 5. Create a handleSubmit function:
//    - Prevent default form submission
//    - Set loading to true, clear error
//    - Call: api.post("/auth/login", { email, password })
//    - On success: save token → localStorage.setItem("token", result.data.token)
//    - Then redirect to: router.push("/dashboard")
//    - On error: set error message from err.response.data.message
//    - Finally: set loading to false
// ─────────────────────────────────────────────

export default function LoginPage() {
  // 👇 declare your state and router here

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      {/* Glowing background blob */}
      <div className="absolute w-96 h-96 bg-purple-700 opacity-10 rounded-full blur-3xl top-1/4 left-1/2 -translate-x-1/2" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl">🏋️</span>
          <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
            Gym Manager
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-1">
          Log in to your account
        </h2>
        <p className="text-sm text-white/40 text-center mb-8">
          Welcome back! Enter your credentials below.
        </p>

        {/* ── Error message ── */}
        {/* 👇 Render your error state here — show only when error is not empty */}
        {/* Example:
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        */}

        {/* ── Form ── */}
        <form
          // 👇 add onSubmit={handleSubmit} here
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              // 👇 add value={email} and onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              // 👇 add value={password} and onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            // 👇 add disabled={loading} here
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {/* 👇 Replace "Login" with: loading ? "Logging in..." : "Login" */}
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="text-sm text-white/40 text-center mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
