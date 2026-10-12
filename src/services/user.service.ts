import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  ChangePasswordInput,
  SubmitStaffApplicationInput,
  UpdateProfileInput,
  User,
} from "@/types/user";

export const userService = {
  /**
   * Get the authenticated user's profile.
   */
  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("/users/me");
    return res.data.data!;
  },

  /**
   * Update authenticated profile (name, phone, avatarUrl).
   */
  async updateMe(data: UpdateProfileInput): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>("/users/me", data);
    return res.data.data!;
  },

  /**
   * Change authenticated user password.
   */
  async changePassword(data: ChangePasswordInput): Promise<void> {
    await apiClient.patch<ApiResponse<void>>("/users/me/password", data);
  },

  /**
   * Submit an application to become a technician or department manager.
   */
  async submitStaffApplication(
    data: SubmitStaffApplicationInput
  ): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>(
      "/users/me/staff-application",
      data
    );
    return res.data.data!;
  },
};
