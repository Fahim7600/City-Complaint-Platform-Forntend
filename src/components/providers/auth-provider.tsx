"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { clearTokens, getAccessToken } from "@/lib/auth-cookies";
import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";

const emptySubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    } else if (isError) {
      clearTokens();
      clearUser();
    } else if (isLoading) {
      setLoading(true);
    }
  }, [hasToken, isSuccess, user, isError, isLoading, setUser, clearUser, setLoading]);

  return <>{children}</>;
}
