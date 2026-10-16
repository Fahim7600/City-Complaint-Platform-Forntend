import "server-only";

import { serverFetch } from "@/lib/server-fetch";
import type { Category } from "@/types/category";
import type { Department, DepartmentTechnician } from "@/types/department";
import type { PublicPremiumInfo } from "@/types/payment";
import type { PublicOverview, PublicStats } from "@/types/stats";

/**
 * Server Component equivalents of public service methods,
 * utilizing Next.js native fetch with 5-minute cache revalidation.
 * Automatically handles unreachable backend by returning safe fallback data/null.
 */
export const publicServerService = {
  async getDepartments(): Promise<Department[]> {
    const data = await serverFetch<Department[]>("/public/departments");
    return data ?? [];
  },

  async getDepartmentTechnicians(
    departmentId: string
  ): Promise<DepartmentTechnician[]> {
    const data = await serverFetch<DepartmentTechnician[]>(
      `/public/departments/${departmentId}/technicians`
    );
    return data ?? [];
  },

  async getCategories(): Promise<Category[]> {
    const data = await serverFetch<Category[]>("/public/categories");
    return data ?? [];
  },

  async getStats(): Promise<PublicStats | null> {
    return serverFetch<PublicStats>("/public/stats");
  },

  async getPremiumInfo(): Promise<PublicPremiumInfo | null> {
    return serverFetch<PublicPremiumInfo>("/public/premium-info");
  },

  async getOverview(): Promise<PublicOverview | null> {
    return serverFetch<PublicOverview>("/public/overview");
  },
};
