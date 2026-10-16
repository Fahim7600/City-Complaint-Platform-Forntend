import type { AuditLogQuery } from "@/types/audit-log";
import type { ComplaintListQuery } from "@/types/complaint";
import type { ListNotificationsQuery } from "@/types/notification";
import type { ListPaymentsQuery } from "@/types/payment";
import type { ListUsersQuery } from "@/types/user";

/**
 * Standardized TanStack Query Keys Factory.
 * Guarantees uniform query caching and cache invalidation across the app.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  users: {
    all: ["users"] as const,
    list: (params?: ListUsersQuery) =>
      [...queryKeys.users.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },

  complaints: {
    all: ["complaints"] as const,
    list: (params?: ComplaintListQuery) =>
      [...queryKeys.complaints.all, "list", params] as const,
    search: (params?: { q: string; page?: number; limit?: number }) =>
      [...queryKeys.complaints.all, "search", params] as const,
    detail: (id: string) =>
      [...queryKeys.complaints.all, "detail", id] as const,
    usage: () => [...queryKeys.complaints.all, "usage"] as const,
    attachments: (complaintId: string) =>
      [...queryKeys.complaints.all, "attachments", complaintId] as const,
    review: (complaintId: string) =>
      [...queryKeys.complaints.all, "review", complaintId] as const,
  },

  departments: {
    all: ["departments"] as const,
    list: (includeDeleted = false) =>
      [...queryKeys.departments.all, "list", { includeDeleted }] as const,
    detail: (id: string) =>
      [...queryKeys.departments.all, "detail", id] as const,
    technicians: (departmentId?: string) =>
      [...queryKeys.departments.all, "technicians", departmentId] as const,
    myTechnicians: () =>
      [...queryKeys.departments.all, "my-technicians"] as const,
    managerQueue: (params?: ComplaintListQuery) =>
      [...queryKeys.departments.all, "manager-queue", params] as const,
  },

  categories: {
    all: ["categories"] as const,
    publicList: () => [...queryKeys.categories.all, "public"] as const,
    byDepartment: (departmentId: string) =>
      [...queryKeys.categories.all, "department", departmentId] as const,
  },

  technicians: {
    all: ["technicians"] as const,
    assigned: (params?: ComplaintListQuery) =>
      [...queryKeys.technicians.all, "assigned", params] as const,
    performance: () =>
      [...queryKeys.technicians.all, "performance"] as const,
    rating: (id: string) =>
      [...queryKeys.technicians.all, "rating", id] as const,
  },

  payments: {
    all: ["payments"] as const,
    subscription: () =>
      [...queryKeys.payments.all, "subscription"] as const,
    detail: (id: string) =>
      [...queryKeys.payments.all, "detail", id] as const,
    list: (params?: ListPaymentsQuery) =>
      [...queryKeys.payments.all, "list", params] as const,
  },

  public: {
    all: ["public"] as const,
    stats: () => [...queryKeys.public.all, "stats"] as const,
    premiumInfo: () => [...queryKeys.public.all, "premium-info"] as const,
    overview: () => [...queryKeys.public.all, "overview"] as const,
  },

  admin: {
    all: ["admin"] as const,
    dashboardStats: () =>
      [...queryKeys.admin.all, "dashboard-stats"] as const,
    escalatedComplaints: (params?: { page?: number; limit?: number }) =>
      [...queryKeys.admin.all, "escalated-complaints", params] as const,
    auditLogs: (params?: AuditLogQuery) =>
      [...queryKeys.admin.all, "audit-logs", params] as const,
    premiumPricing: () =>
      [...queryKeys.admin.all, "premium-pricing"] as const,
    staffApplications: () =>
      [...queryKeys.admin.all, "staff-applications"] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: (params?: ListNotificationsQuery) =>
      [...queryKeys.notifications.all, "list", params] as const,
  },

  staffApplications: {
    all: ["staff-applications"] as const,
    list: (params?: { page?: number; limit?: number }) =>
      ["staff-applications", "list", params] as const,
  },
} as const;
