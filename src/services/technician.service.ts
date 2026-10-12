import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { Complaint, ComplaintListQuery } from "@/types/complaint";
import type { TechnicianRating } from "@/types/review";
import type { TechnicianPerformance } from "@/types/stats";

export const technicianService = {
  /**
   * List complaints assigned to the authenticated technician.
   */
  async getMyAssignedJobs(
    params?: ComplaintListQuery
  ): Promise<PaginatedData<Complaint>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Complaint>>>(
      "/complaints/my-assigned",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Toggle technician availability for new task dispatches.
   */
  async updateAvailability(
    isAvailable: boolean
  ): Promise<{ isAvailable: boolean }> {
    const res = await apiClient.patch<
      ApiResponse<{ isAvailable: boolean }>
    >("/technicians/me/availability", { isAvailable });
    return res.data.data!;
  },

  /**
   * Get live performance metrics (assigned, resolved, overdue, ratings, resolution SLA).
   */
  async getMyPerformance(): Promise<TechnicianPerformance> {
    const res = await apiClient.get<ApiResponse<TechnicianPerformance>>(
      "/technicians/me/performance"
    );
    return res.data.data!;
  },

  /**
   * Get public rating aggregate for any technician by ID.
   */
  async getTechnicianRating(id: string): Promise<TechnicianRating> {
    const res = await apiClient.get<ApiResponse<TechnicianRating>>(
      `/technicians/${id}/rating`
    );
    return res.data.data!;
  },
};
