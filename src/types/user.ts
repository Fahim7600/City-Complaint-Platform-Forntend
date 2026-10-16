import type { Department } from "./department";

export const Role = {
  CITIZEN: "CITIZEN",
  TECHNICIAN: "TECHNICIAN",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isPremium: boolean;
  isAvailable: boolean;
  phone: string | null;
  avatarUrl: string | null;
  googleId?: string | null;
  departmentId: string | null;
  requestedRole: Role | null;
  approvalStatus: ApprovalStatus | null;
  decidedById: string | null;
  decidedAt: string | null;
  experience: string | null;
  qualification: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  department?: Department | null;
  mustChangePassword?: boolean;
  tempPasswordExpiresAt?: string | null;
  invitedById?: string | null;
}

export interface ManagerInviteTechnicianInput {
  name: string;
  email: string;
  phone?: string;
}

export interface AdminInviteStaffInput {
  name: string;
  email: string;
  phone?: string;
  role: "TECHNICIAN" | "MANAGER";
  departmentId: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetCodeInput {
  email: string;
  code: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export interface SubmitStaffApplicationInput {
  requestedRole: "TECHNICIAN" | "MANAGER";
  departmentId: string;
  experience?: string;
  qualification?: string;
}

export interface StaffApplicationDecisionInput {
  decision: "APPROVED" | "REJECTED";
  reason?: string;
}

export interface ListUsersQuery {
  page?: number;
  limit?: number;
  role?: Role;
  departmentId?: string;
  approvalStatus?: ApprovalStatus;
  search?: string;
  includeDeleted?: boolean;
}

