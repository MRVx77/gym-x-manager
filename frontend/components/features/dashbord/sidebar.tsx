"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { lable: "Dashbord", href: "/dashboard" },
  { label: "Members", href: "/dashboard/members" },
  { lable: "Trainers", href: "/dashboard/trainers" },
  { lable: "Plans", href: "/dashboard/plans" },
  { lable: "Notifications", href: "notifications" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-white/5 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏋️</span>
          <span className="font-bold text-white tracking-wide">
            Gym Manager
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          // exact match for the dashboard home, prefix match for nested routes
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-sm text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
