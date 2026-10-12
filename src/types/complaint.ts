import type { Category } from "./category";
import type { Department } from "./department";
import type { Review } from "./review";
import type { User } from "./user";

export const ComplaintStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type ComplaintStatus =
  (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const AttachmentType = {
  EVIDENCE: "EVIDENCE",
  BEFORE_WORK: "BEFORE_WORK",
  AFTER_WORK: "AFTER_WORK",
} as const;

export type AttachmentType =
  (typeof AttachmentType)[keyof typeof AttachmentType];

export interface Attachment {
  id: string;
  complaintId: string;
  url: string;
  publicId: string;
  type: AttachmentType;
  uploadedById: string;
  createdAt: string;
  uploadedBy?: User;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  citizenId: string;
  categoryId: string;
  departmentId: string;
  location: string;
  status: ComplaintStatus;
  priority: Priority;
  assignedTechnicianId: string | null;
  slaDueAt: string | null;
  overdueNotifiedAt: string | null;
  resolvedAt: string | null;
  isEscalated: boolean;
  escalatedAt: string | null;
  escalationReason: string | null;
  reopenedAt: string | null;
  reopenCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  citizen?: User;
  category?: Category;
  department?: Department;
  assignedTechnician?: User | null;
  attachments?: Attachment[];
  review?: Review | null;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  priority?: Priority;
}

export interface UpdateComplaintInput {
  title?: string;
  description?: string;
  categoryId?: string;
  location?: string;
  priority?: Priority;
}

export interface ReTriageInput {
  priority: Priority;
}

export interface AssignTechnicianInput {
  technicianId: string;
}

export interface UpdateComplaintStatusInput {
  status: ComplaintStatus;
  note?: string;
}

export interface ReopenComplaintInput {
  reason: string;
}

export interface EscalateComplaintInput {
  reason: string;
}

export interface ClearEscalationInput {
  note?: string;
}

export interface ComplaintListQuery {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  priority?: Priority;
  categoryId?: string;
  overdue?: boolean;
  sortBy?: "createdAt" | "slaDueAt" | "priority";
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface ComplaintUsage {
  used: number;
  limit: number | string;
  isPremium: boolean;
  resetsAt: string;
}
