import "server-only";

import { serverFetch } from "@/lib/server-fetch";
import type { Category } from "@/types/category";
import type { Department, DepartmentTechnician } from "@/types/department";
import type { PublicPremiumInfo } from "@/types/payment";
import type { PublicOverview, PublicStats } from "@/types/stats";

/**
 * Server Component equivalents of public service methods,
 * utilizing Next.js native fetch with 5-minute cache revalidation.
 */
export const publicServerService = {
  async getDepartments(): Promise<Department[]> {
    return serverFetch<Department[]>("/public/departments");
  },

  async getDepartmentTechnicians(
    departmentId: string
  ): Promise<DepartmentTechnician[]> {
    return serverFetch<DepartmentTechnician[]>(
      `/public/departments/${departmentId}/technicians`
    );
  },

  async getCategories(): Promise<Category[]> {
    return serverFetch<Category[]>("/public/categories");
  },

  async getStats(): Promise<PublicStats> {
    return serverFetch<PublicStats>("/public/stats");
  },

  async getPremiumInfo(): Promise<PublicPremiumInfo> {
    return serverFetch<PublicPremiumInfo>("/public/premium-info");
  },

  async getOverview(): Promise<PublicOverview> {
    return serverFetch<PublicOverview>("/public/overview");
  },
};
