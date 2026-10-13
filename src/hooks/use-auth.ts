"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearTokens, setTokens } from "@/lib/auth-cookies";
import { apiClient, getErrorMessage } from "@/lib/axios";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { queryKeys } from "@/lib/query-keys";
import { ROLE_HOME, isAllowedPathForRole } from "@/lib/roles";
import { authService, type LoginInput } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import type { Role, User } from "@/types/user";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading, setUser, clearUser, setLoading } = useAuthStore();

  const handleAuthSuccess = (
    authenticatedUser: User,
    accessToken: string,
    redirectUrl?: string
  ) => {
    // 1. Store access token & role in 7-day cookies
    setTokens({
      accessToken,
      role: authenticatedUser.role,
      expiresInDays: 7,
    });

    // 2. Set user in store
    setUser(authenticatedUser);

    // 3. Invalidate/set query cache for auth me
    queryClient.setQueryData(queryKeys.auth.me(), authenticatedUser);

    // 4. Welcome toast
    const firstName = authenticatedUser.name.split(" ")[0] || authenticatedUser.name;
    toast.success(`Welcome back, ${firstName}!`);

    // 5. Determine destination
    const defaultHome = ROLE_HOME[authenticatedUser.role] || "/dashboard";

    let destination = defaultHome;
    if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("/login") && !redirectUrl.startsWith("/register")) {
      if (isAllowedPathForRole(redirectUrl, authenticatedUser.role)) {
        destination = redirectUrl;
      }
    }

    router.replace(destination);
  };

  const login = async (data: LoginInput, redirectUrl?: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      handleAuthSuccess(response.user, response.accessToken, redirectUrl);
      return response.user;
    } catch (err) {
      setLoading(false);
      const message = getErrorMessage(err);
      toast.error(message);
      throw err;
    }
  };

  const loginWithGoogle = async (
    credential: string,
    redirectUrl?: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const response = await authService.googleLogin(credential);
      handleAuthSuccess(response.user, response.accessToken, redirectUrl);
      return response.user;
    } catch (err) {
      setLoading(false);
      const message = getErrorMessage(err);
      toast.error(message);
      throw err;
    }
  };

  const demoLogin = async (role: Role, redirectUrl?: string): Promise<User> => {
    setLoading(true);
    const demo = DEMO_ACCOUNTS[role];

    if (!demo || !demo.email || !demo.password) {
      setLoading(false);
      toast.error("Demo account not configured");
      throw new Error("Demo account not configured");
    }

    try {
      // First attempt standard login with seeded credentials
      let response;
      try {
        response = await authService.login({
          email: demo.email,
          password: demo.password,
        });
      } catch (loginErr) {
        // If it's a citizen and not yet registered, register on demand
        if (role === "CITIZEN") {
          try {
            response = await authService.register({
              name: demo.name,
              email: demo.email,
              password: demo.password,
            });
          } catch {
            throw loginErr;
          }
        } else {
          throw loginErr;
        }
      }

      handleAuthSuccess(response.user, response.accessToken, redirectUrl);
      return response.user;
    } catch (err) {
      setLoading(false);
      const message = getErrorMessage(err);
      toast.error(`Demo login failed: ${message}`);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // 1. Call backend to revoke refresh token and clear httpOnly cookie
      await authService.logout().catch(() => {});
    } finally {
      // 2. Clear client-side cookies
      clearTokens();

      // 3. Clear TanStack query cache completely
      queryClient.clear();

      // 4. Clear auth store
      clearUser();

      // 5. Remove auth header on axios client
      delete apiClient.defaults.headers.common.Authorization;

      // 6. User feedback & redirection
      toast.success("Signed out successfully");
      router.replace("/login");
    }
  };

  return {
    user,
    role: user?.role,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    loginWithGoogle,
    demoLogin,
    logout,
  };
}
