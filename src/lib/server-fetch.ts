import "server-only";

import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { ACCESS_TOKEN_KEY } from "@/lib/auth-cookies";
import type { ApiResponse } from "@/types/api";

export interface ServerFetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  timeoutMs?: number;
}

/**
 * Server-side native fetch helper for Server Components.
 * - Reads access token securely from next/headers cookies().
 * - Automatically defaults public endpoints (/public/...) to 300s (5min) revalidation,
 *   aligning with the backend's Redis cache TTL.
 * - Built-in 20-second timeout to prevent build failures when Render free-tier backend is asleep.
 * - For public paths, returns null on network failures/timeouts so static builds never crash.
 */
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T | null> {
  const isPublicPath = path.includes("/public/");
  let token: string | undefined;

  if (!isPublicPath) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    } catch {
      // Cookies not accessible in build / static context
    }
  }

  const url = path.startsWith("http")
    ? path
    : `${env.NEXT_PUBLIC_API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default revalidation for public data to 5 minutes (matching backend Redis TTL)
  const fetchOptions: ServerFetchOptions = {
    ...options,
    headers,
  };

  if (!fetchOptions.cache && !fetchOptions.next) {
    if (isPublicPath) {
      fetchOptions.next = { revalidate: 300 };
    }
  }

  // 20s timeout controller to accommodate Render cold-starts without hanging builds
  const timeoutMs = options.timeoutMs ?? 20000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (isPublicPath) {
        return null;
      }
      let errorMessage = `Server fetch failed with status ${response.status}`;
      try {
        const errorJson = (await response.json()) as ApiResponse;
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Non-JSON error body fallback
      }
      throw new Error(errorMessage);
    }

    const result = (await response.json()) as ApiResponse<T>;

    if (result.success === false) {
      if (isPublicPath) return null;
      throw new Error(result.message || "Failed to fetch data");
    }

    return (result.data as T) ?? null;
  } catch (error) {
    if (isPublicPath) {
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
