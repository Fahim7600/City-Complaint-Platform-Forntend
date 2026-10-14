import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { StaffApplicationDecisionInput, User } from "@/types/user";

export const staffApplicationService = {
  /**
   * List staff applications scoped to the authenticated user's role and department.
   * For MANAGER: automatically filtered by backend to technician applications in their department.
   */
  async getApplications(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedData<User>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<User> | User[]>>(
      "/staff-applications",
      { params }
    );

    const raw = res.data.data;
    if (raw && typeof raw === "object" && "items" in raw && Array.isArray(raw.items)) {
      return raw as PaginatedData<User>;
    }

    const items = Array.isArray(raw) ? raw : [];
    return {
      items,
      total: items.length,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      totalPages: Math.ceil(items.length / (params?.limit ?? 10)) || 1,
    };
  },

  /**
   * Decide on a pending staff application (Approve or Reject).
   */
  async decide(
    id: string,
    data: StaffApplicationDecisionInput
  ): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/staff-applications/${id}`,
      data
    );
    return res.data.data!;
  },
};
