import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";
import {
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/lib/auth-cookies";
import type { ApiResponse } from "@/types/api";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30s timeout accommodating Render free-tier cold starts
  withCredentials: true, // Transmit and receive httpOnly cookies (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// Single shared refresh promise to prevent stampedes on parallel 401s
let refreshPromise: Promise<string | null> | null = null;

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor: handle 401 with automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const is401 = error.response?.status === 401;
    const requestUrl = originalRequest.url || "";
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh-token") ||
      requestUrl.includes("/auth/logout");

    if (is401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            // Call backend refresh endpoint; browser sends httpOnly refreshToken cookie
            const res = await axios.post<ApiResponse<{ accessToken: string }>>(
              `${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              {},
              {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            );

            const newAccessToken = res.data?.data?.accessToken;
            if (newAccessToken) {
              setTokens({ accessToken: newAccessToken });
              return newAccessToken;
            }
            throw new Error("No access token returned from refresh");
          } catch {
            clearTokens();
            if (typeof window !== "undefined") {
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/login?expired=1";
            }
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const newToken = await refreshPromise;

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a user-friendly error message from any backend API error,
 * including Zod validation error arrays and custom AppError responses.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // 1. Timeout (code ECONNABORTED) -> Server is waking up
    if (
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout")
    ) {
      return "Server is waking up, please try again in a few seconds";
    }

    // 2. No response at all (error.request exists but error.response doesn't)
    if (error.request && !error.response) {
      return "Can't reach the server. Please check your connection or try again shortly.";
    }

    const data = error.response?.data as ApiResponse | undefined;

    // 3. 403 whose message is "Origin not allowed by CORS"
    if (
      error.response?.status === 403 &&
      (data?.message === "Origin not allowed by CORS" ||
        (typeof data?.message === "string" &&
          data.message.toLowerCase().includes("origin not allowed by cors")) ||
        error.message === "Origin not allowed by CORS")
    ) {
      return "This site isn't allowed by the server yet (CORS). Contact the admin.";
    }

    // 4. Backend response received: keep the backend's message, including zod validation messages
    if (data) {
      // Check if specific validation errors array is provided
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const firstError = data.errors[0];
        if (typeof firstError === "string") return firstError;
        if (
          typeof firstError === "object" &&
          firstError !== null &&
          "message" in firstError &&
          typeof (firstError as { message: unknown }).message === "string"
        ) {
          return (firstError as { message: string }).message;
        }
      }

      // Check if errors is an object with field arrays (e.g. { title: ["Too short"] })
      if (
        data.errors &&
        typeof data.errors === "object" &&
        !Array.isArray(data.errors)
      ) {
        const errorRecord = data.errors as Record<string, unknown>;
        const firstKey = Object.keys(errorRecord)[0];
        if (firstKey) {
          const val = errorRecord[firstKey];
          if (Array.isArray(val) && typeof val[0] === "string") {
            return val[0];
          }
          if (typeof val === "string") return val;
        }
      }

      // Keep standard backend message
      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message;
      }
    }

    // 5. Fallback HTTP status messages
    if (error.response?.status === 404) return "Requested resource was not found.";
    if (error.response?.status === 403) return "You do not have permission to perform this action.";
    if (error.response?.status === 401) return "Session expired or unauthorized. Please sign in.";
    if (error.response?.status === 429) return "Too many requests. Please try again later.";
    if (error.response?.status === 500) return "Server error. Please try again in a few moments.";

    return error.message || "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred.";
};

export default apiClient;
