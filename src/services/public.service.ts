import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/category";
import type { Department, DepartmentTechnician } from "@/types/department";
import type { PublicPremiumInfo } from "@/types/payment";
import type { PublicOverview, PublicStats } from "@/types/stats";

export const publicService = {
  /**
   * List all active municipal departments.
   */
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get<ApiResponse<Department[]>>(
      "/public/departments"
    );
    return res.data.data || [];
  },

  /**
   * List active technicians for a department with ratings and availability.
   */
  async getDepartmentTechnicians(
    departmentId: string
  ): Promise<DepartmentTechnician[]> {
    const res = await apiClient.get<ApiResponse<DepartmentTechnician[]>>(
      `/public/departments/${departmentId}/technicians`
    );
    return res.data.data || [];
  },

  /**
   * List active civic complaint categories with SLA hours.
   */
  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<ApiResponse<Category[]>>(
      "/public/categories"
    );
    return res.data.data || [];
  },

  /**
   * Get overall public complaint resolution statistics.
   */
  async getStats(): Promise<PublicStats> {
    const res = await apiClient.get<ApiResponse<PublicStats>>("/public/stats");
    return res.data.data!;
  },

  /**
   * Get citizen premium subscription benefits and live Stripe pricing.
   */
  async getPremiumInfo(): Promise<PublicPremiumInfo> {
    const res = await apiClient.get<ApiResponse<PublicPremiumInfo>>(
      "/public/premium-info"
    );
    return res.data.data!;
  },

  /**
   * Get complete public landing page overview content and statistics.
   */
  async getOverview(): Promise<PublicOverview> {
    const res = await apiClient.get<ApiResponse<PublicOverview>>(
      "/public/overview"
    );
    return res.data.data!;
  },
};
