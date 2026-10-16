"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { clearTokens, getAccessToken } from "@/lib/auth-cookies";
import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";

const emptySubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, clearUser, setLoading } = useAuthStore();

  // Hydration-safe external token check without cascading setState in effect
  const hasToken = React.useSyncExternalStore(
    emptySubscribe,
    () => Boolean(getAccessToken()),
    () => false
  );

  const { data: user, isSuccess, isError, isLoading } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => userService.getMe(),
    enabled: hasToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (!hasToken) {
      clearUser();
      setLoading(false);
      return;
    }

    if (isSuccess && user) {
      setUser(user);
      if (user.mustChangePassword) {
        const pathname =
          typeof window !== "undefined" ? window.location.pathname : "";
        if (!pathname.startsWith("/set-password")) {
          toast.info("Please set a new password to continue");
          router.replace("/set-password");
        }
      }
    } else if (isError) {
      clearTokens();
      clearUser();
    } else if (isLoading) {
      setLoading(true);
    }
  }, [hasToken, isSuccess, user, isError, isLoading, setUser, clearUser, setLoading, router]);

  return <>{children}</>;
}
