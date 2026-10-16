import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  staffApplication?: {
    requestedRole: "TECHNICIAN" | "MANAGER";
    departmentId: string;
    experience?: string;
    qualification?: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export const authService = {
  /**
   * Register a new citizen account (or staff applicant).
   * Backend issues an accessToken and sets the httpOnly refreshToken cookie.
   */
  async register(data: RegisterInput): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/register",
      data
    );
    return res.data.data!;
  },

  /**
   * Log in with email and password.
   */
  async login(data: LoginInput): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      data
    );
    return res.data.data!;
  },

  /**
   * Authenticate with Google OAuth credential.
   * Note: The backend expects `{ idToken: credential }`.
   */
  async googleLogin(credential: string): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/google",
      { idToken: credential }
    );
    return res.data.data!;
  },

  /**
   * Refresh the access token using the backend's httpOnly refreshToken cookie.
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh-token"
    );
    return res.data.data!;
  },

  /**
   * Log out, revoking DB refresh token and clearing cookies.
   */
  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<void>>("/auth/logout");
  },

  /**
   * Request a 6-digit password reset code sent via email.
   * Returns cooldownSeconds (default 60s).
   */
  async forgotPassword(email: string): Promise<{ cooldownSeconds: number }> {
    const res = await apiClient.post<
      ApiResponse<{ cooldownSeconds: number }>
    >("/auth/forgot-password", { email });
    return res.data.data || { cooldownSeconds: 60 };
  },

  /**
   * Verify the 6-digit password reset code.
   * Returns a 32-byte hex resetToken and expiresInSeconds (900s / 15m).
   */
  async verifyResetCode(
    email: string,
    code: string
  ): Promise<{ resetToken: string; expiresInSeconds: number }> {
    const res = await apiClient.post<
      ApiResponse<{ resetToken: string; expiresInSeconds: number }>
    >("/auth/verify-reset-code", { email, code });
    return res.data.data!;
  },

  /**
   * Reset account password using the verified resetToken.
   */
  async resetPassword(
    resetToken: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post<ApiResponse<void>>("/auth/reset-password", {
      resetToken,
      newPassword,
    });
  },
};

