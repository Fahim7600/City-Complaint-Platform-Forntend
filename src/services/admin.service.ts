import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { AuditLog, AuditLogQuery } from "@/types/audit-log";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category";
import type { Complaint } from "@/types/complaint";
import type {
  CreateDepartmentInput,
  Department,
  DepartmentWithTechnicians,
  UpdateDepartmentInput,
} from "@/types/department";
import type {
  AdminPremiumPricing,
  ListPaymentsQuery,
  Payment,
  Subscription,
} from "@/types/payment";
import type { DashboardStats } from "@/types/stats";
import type {
  ListUsersQuery,
  StaffApplicationDecisionInput,
  User,
} from "@/types/user";

export interface OverrideUserRoleInput {
  role: "CITIZEN" | "TECHNICIAN" | "MANAGER";
  departmentId?: string;
}

export const adminService = {
  /**
   * List platform users with role, department, and approval filters.
   */
  async getUsers(params?: ListUsersQuery): Promise<PaginatedData<User>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<User>>>(
      "/admin/users",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Override a user's role and assigned department.
   */
  async overrideUserRole(
    userId: string,
    data: OverrideUserRoleInput
  ): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/admin/users/${userId}/role`,
      data
    );
    return res.data.data!;
  },

  /**
   * Deactivate a user account.
   */
  async deactivateUser(userId: string): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/admin/users/${userId}/deactivate`
    );
    return res.data.data!;
  },

  /**
   * Reactivate a previously deactivated user account.
   */
  async reactivateUser(userId: string): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(
      `/admin/users/${userId}/reactivate`
    );
    return res.data.data!;
  },

  /**
   * Soft-delete a complaint (Admin only).
   */
  async deleteComplaint(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/complaints/${id}`);
  },

  /**
   * List escalated complaints in the admin triage queue.
   */
  async getEscalatedComplaints(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedData<Complaint>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Complaint>>>(
      "/admin/escalated-complaints",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Clear complaint escalation flag and add resolution note.
   */
  async clearEscalation(id: string, note?: string): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/admin/complaints/${id}/clear-escalation`,
      { note }
    );
    return res.data.data!;
  },

  /**
   * List all departments (including soft-deleted if requested).
   */
  async getDepartments(includeDeleted = false): Promise<Department[]> {
    const res = await apiClient.get<ApiResponse<Department[]>>(
      "/admin/departments",
      { params: { includeDeleted } }
    );
    return res.data.data || [];
  },

  /**
   * Get department details with active categories.
   */
  async getDepartmentById(id: string): Promise<DepartmentWithTechnicians> {
    const res = await apiClient.get<ApiResponse<DepartmentWithTechnicians>>(
      `/admin/departments/${id}`
    );
    return res.data.data!;
  },

  /**
   * Create a new municipal department.
   */
  async createDepartment(data: CreateDepartmentInput): Promise<Department> {
    const res = await apiClient.post<ApiResponse<Department>>(
      "/admin/departments",
      data
    );
    return res.data.data!;
  },

  /**
   * Update department name or description.
   */
  async updateDepartment(
    id: string,
    data: UpdateDepartmentInput
  ): Promise<Department> {
    const res = await apiClient.patch<ApiResponse<Department>>(
      `/admin/departments/${id}`,
      data
    );
    return res.data.data!;
  },

  /**
   * Soft-delete a department.
   */
  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/admin/departments/${id}`);
  },

  /**
   * List categories for a department.
   */
  async getCategories(departmentId: string): Promise<Category[]> {
    const res = await apiClient.get<ApiResponse<Category[]>>(
      `/admin/departments/${departmentId}/categories`
    );
    return res.data.data || [];
  },

  /**
   * Create a service category with SLA hours.
   */
  async createCategory(
    departmentId: string,
    data: CreateCategoryInput
  ): Promise<Category> {
    const res = await apiClient.post<ApiResponse<Category>>(
      `/admin/departments/${departmentId}/categories`,
      data
    );
    return res.data.data!;
  },

  /**
   * Update category name, description, or SLA hours.
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    const res = await apiClient.patch<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      data
    );
    return res.data.data!;
  },

  /**
   * Soft-delete a service category.
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`);
  },

  /**
   * Get active Stripe subscription price details.
   */
  async getPremiumPricing(): Promise<AdminPremiumPricing> {
    const res = await apiClient.get<ApiResponse<AdminPremiumPricing>>(
      "/admin/premium-pricing"
    );
    return res.data.data!;
  },

  /**
   * List subscriptions and payment records.
   */
  async getPayments(
    params?: ListPaymentsQuery
  ): Promise<PaginatedData<Subscription | Payment>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedData<Subscription | Payment>>
    >("/admin/payments", { params });
    return res.data.data!;
  },

  /**
   * Get comprehensive admin executive dashboard metrics.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard-stats"
    );
    return res.data.data!;
  },

  /**
   * Query platform audit logs with actor and entity filters.
   */
  async getAuditLogs(params?: AuditLogQuery): Promise<PaginatedData<AuditLog>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<AuditLog>>>(
      "/admin/audit-logs",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Manually trigger the background overdue SLA breach scanner.
   */
  async triggerCheckOverdueSlas(): Promise<{
    checkedCount?: number;
    overdueCount?: number;
    message?: string;
  }> {
    const res = await apiClient.post<
      ApiResponse<{
        checkedCount?: number;
        overdueCount?: number;
        message?: string;
      }>
    >("/admin/jobs/check-overdue-slas");
    return res.data.data || {};
  },

  /**
   * List pending technician and manager applications.
   */
  async getStaffApplications(): Promise<User[]> {
    const res = await apiClient.get<ApiResponse<User[]>>("/staff-applications");
    return res.data.data || [];
  },

  /**
   * Approve or reject a staff application.
   */
  async decideStaffApplication(
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
