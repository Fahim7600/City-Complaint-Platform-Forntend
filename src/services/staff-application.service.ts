import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type {
  ApprovalStatus,
  Department,
  Role,
  StaffApplication,
  StaffApplicationDecisionInput,
  User,
} from "@/types";

interface RawStaffApplicationItem {
  id: string;
  name: string;
  email: string;
  requestedRole?: Role | null;
  role?: Role;
  departmentId?: string | null;
  department?: Department | null;
  experience?: string | null;
  qualification?: string | null;
  createdAt: string;
  approvalStatus?: ApprovalStatus | null;
  avatarUrl?: string | null;
  decidedAt?: string | null;
  decidedById?: string | null;
}

function normalizeStaffApplication(
  raw: RawStaffApplicationItem
): StaffApplication {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    requestedRole: (raw.requestedRole || raw.role || "TECHNICIAN") as Role,
    departmentId: raw.departmentId ?? raw.department?.id ?? null,
    experience: raw.experience ?? null,
    qualification: raw.qualification ?? null,
    createdAt: raw.createdAt,
    approvalStatus: raw.approvalStatus || "PENDING",
    role: raw.role || raw.requestedRole || null,
    avatarUrl: raw.avatarUrl ?? null,
    department: raw.department ?? null,
    decidedAt: raw.decidedAt ?? null,
    decidedById: raw.decidedById ?? null,
  };
}

export const staffApplicationService = {
  /**
   * List staff applications scoped to the authenticated user's role and department.
   * For MANAGER: automatically filtered by backend to technician applications in their department.
   */
  async getApplications(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedData<StaffApplication>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedData<RawStaffApplicationItem> | RawStaffApplicationItem[]>
    >("/staff-applications", { params });

    const raw = res.data.data;
    if (
      raw &&
      typeof raw === "object" &&
      "items" in raw &&
      Array.isArray(raw.items)
    ) {
      return {
        ...raw,
        items: raw.items.map(normalizeStaffApplication),
      };
    }

    const rawList = Array.isArray(raw) ? raw : [];
    const items = rawList.map(normalizeStaffApplication);
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
    const payload = {
      decision: data.decision || data.status,
      ...(data.reason ? { reason: data.reason } : {}),
    };

    const res = await apiClient.patch<ApiResponse<User>>(
      `/staff-applications/${id}`,
      payload
    );
    return res.data.data!;
  },
};
