"use client";

import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Array<"SUPER_ADMIN" | "GYM_OWNER" | "MEMBER">;
};

export function ProtectedRoutes({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (loading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
        return;
      }

      if (user.role === "GYM_OWNER" && pathname.startsWith("/onboarding")) {
        if (!user.gymId) {
          router.push("/onboarding/gym");
          return;
        }

        try {
          const gymRes = await api.get("/api/gym/get-my-gym");
          if (gymRes.data.gym.onboardingStatus !== "ACTIVE") {
            router.push("/onbording/details");
            return;
          }
        } catch (error) {
          router.push("/onboarding/gym");
          return;
        }
      }
      setChecking(false);
    }
    checkAccess();
  }, [user, loading, pathname, router, allowedRoles]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
