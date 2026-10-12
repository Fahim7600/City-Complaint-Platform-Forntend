/**
 * Backend Token Architecture Analysis:
 * 1. POST /auth/login, /auth/register, and /auth/google:
 *    - The backend returns `accessToken` in the JSON response body (`data.accessToken`).
 *    - The backend sets `refreshToken` directly as an `httpOnly` cookie:
 *      name: "refreshToken", path: "/api/v1/auth", secure in production, sameSite: "none" (prod) / "strict" (dev).
 * 2. POST /auth/refresh-token:
 *    - Reads the `refreshToken` cookie from `req.cookies?.refreshToken`.
 *    - Automatically sets a rotated `refreshToken` cookie via `res.cookie()`.
 *    - Returns the new `accessToken` in the JSON response body (`data.accessToken`).
 * 3. Client Cookie Strategy:
 *    - We store `accessToken` in an accessible cookie (`cityfix_access_token`) so both client-side
 *      Axios interceptors and Next.js Server Components (via `next/headers` `cookies()`) can attach
 *      the `Authorization: Bearer <token>` header to backend requests.
 *    - We also store `userRole` in `cityfix_user_role` for fast UI role-gating.
 *    - The `withCredentials: true` setting on Axios ensures the browser automatically transmits
 *      the backend's httpOnly `refreshToken` cookie to `/api/v1/auth` endpoints.
 */

import Cookies from "js-cookie";
import type { Role } from "@/types/user";

export const ACCESS_TOKEN_KEY = "cityfix_access_token";
export const REFRESH_TOKEN_KEY = "refreshToken"; // Name matching backend httpOnly cookie
export const USER_ROLE_KEY = "cityfix_user_role";

const isProduction = process.env.NODE_ENV === "production";

const cookieConfig: Cookies.CookieAttributes = {
  sameSite: "lax",
  secure: isProduction,
  path: "/",
};

export const getAccessToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getUserRole = (): Role | undefined => {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(USER_ROLE_KEY) as Role | undefined;
};

export const setTokens = (tokens: {
  accessToken: string;
  role?: Role;
  expiresInDays?: number;
}): void => {
  if (typeof window === "undefined") return;

  const expires = tokens.expiresInDays ?? 7; // Default 7 days persistence

  Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
    ...cookieConfig,
    expires,
  });

  if (tokens.role) {
    Cookies.set(USER_ROLE_KEY, tokens.role, {
      ...cookieConfig,
      expires,
    });
  }
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_ROLE_KEY, { path: "/" });
};
