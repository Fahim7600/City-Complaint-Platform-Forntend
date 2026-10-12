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
}

/**
 * Server-side native fetch helper for Server Components.
 * - Reads access token securely from next/headers cookies().
 * - Automatically defaults public endpoints (/public/...) to 300s (5min) revalidation,
 *   aligning with the backend's Redis cache TTL.
 */
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

  const url = path.startsWith("http")
    ? path
    : `${env.NEXT_PUBLIC_API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default revalidation for public data to 5 minutes (matching backend Redis TTL)
  const isPublicPath = path.includes("/public/");
  const fetchOptions: ServerFetchOptions = {
    ...options,
    headers,
  };

  if (!fetchOptions.cache && !fetchOptions.next) {
    if (isPublicPath) {
      fetchOptions.next = { revalidate: 300 };
    }
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
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
    throw new Error(result.message || "Failed to fetch data");
  }

  return result.data as T;
}
