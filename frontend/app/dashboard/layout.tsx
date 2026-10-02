import { Sidebar } from "@/components/features/dashbord/sidebar";
import { ProtectedRoutes } from "@/components/protected-routes";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoutes allowedRoles={["GYM_OWNER"]}>
      <div className="min-h-screen flex bg-[#0a0a0f] ">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </ProtectedRoutes>
  );
}
