import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type {
  Attachment,
  AttachmentType,
  ClearEscalationInput,
  Complaint,
  ComplaintListQuery,
  ComplaintUsage,
  CreateComplaintInput,
  EscalateComplaintInput,
  ReTriageInput,
  ReopenComplaintInput,
  UpdateComplaintInput,
  UpdateComplaintStatusInput,
} from "@/types/complaint";
import type { CreateReviewInput, Review } from "@/types/review";

export const complaintService = {
  /**
   * Submit a new citizen complaint.
   */
  async create(data: CreateComplaintInput): Promise<Complaint> {
    const res = await apiClient.post<ApiResponse<Complaint>>("/complaints", data);
    return res.data.data!;
  },

  /**
   * List complaints visible to the current user with pagination and filters.
   * - Citizen: complaints filed by them
   * - Technician: complaints assigned to them
   * - Manager: complaints in their department
   * - Admin: all complaints
   */
  async getMy(params?: ComplaintListQuery): Promise<PaginatedData<Complaint>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Complaint>>>(
      "/complaints",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Search complaints using query term `q`.
   */
  async search(params: {
    q: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedData<Complaint>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Complaint>>>(
      "/complaints/search",
      { params }
    );
    return res.data.data!;
  },

  /**
   * Get full details of a complaint by ID.
   */
  async getById(id: string): Promise<Complaint> {
    const res = await apiClient.get<ApiResponse<Complaint>>(`/complaints/${id}`);
    return res.data.data!;
  },

  /**
   * Update complaint content (citizen) or re-triage priority (manager/admin).
   */
  async update(
    id: string,
    data: UpdateComplaintInput | ReTriageInput
  ): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/complaints/${id}`,
      data
    );
    return res.data.data!;
  },

  /**
   * Assign a technician to a complaint (Manager or Admin).
   */
  async assign(id: string, technicianId: string): Promise<Complaint> {
    const res = await apiClient.post<ApiResponse<Complaint>>(
      `/complaints/${id}/assign`,
      { technicianId }
    );
    return res.data.data!;
  },

  /**
   * Transition complaint lifecycle status.
   */
  async updateStatus(
    id: string,
    data: UpdateComplaintStatusInput
  ): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/complaints/${id}/status`,
      data
    );
    return res.data.data!;
  },

  /**
   * Cancel a pending complaint (Citizen only).
   */
  async cancel(id: string): Promise<Complaint> {
    const res = await apiClient.post<ApiResponse<Complaint>>(
      `/complaints/${id}/cancel`
    );
    return res.data.data!;
  },

  /**
   * Reopen a resolved complaint within the reopen window (Citizen only).
   */
  async reopen(id: string, data: ReopenComplaintInput): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/complaints/${id}/reopen`,
      data
    );
    return res.data.data!;
  },

  /**
   * Escalate complaint to admin queue (Manager only).
   */
  async escalate(
    id: string,
    data: EscalateComplaintInput
  ): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/complaints/${id}/escalate`,
      data
    );
    return res.data.data!;
  },

  /**
   * Clear escalation on a complaint (Admin only).
   */
  async clearEscalation(
    id: string,
    data?: ClearEscalationInput
  ): Promise<Complaint> {
    const res = await apiClient.patch<ApiResponse<Complaint>>(
      `/admin/complaints/${id}/clear-escalation`,
      data || {}
    );
    return res.data.data!;
  },

  /**
   * Submit an immutable citizen review for a resolved/closed complaint.
   */
  async review(complaintId: string, data: CreateReviewInput): Promise<Review> {
    const res = await apiClient.post<ApiResponse<Review>>(
      `/complaints/${complaintId}/review`,
      data
    );
    return res.data.data!;
  },

  /**
   * Get review associated with a complaint.
   */
  async getReview(complaintId: string): Promise<Review> {
    const res = await apiClient.get<ApiResponse<Review>>(
      `/complaints/${complaintId}/review`
    );
    return res.data.data!;
  },

  /**
   * Get citizen's monthly complaint quota usage.
   */
  async getUsage(): Promise<ComplaintUsage> {
    const res = await apiClient.get<ApiResponse<ComplaintUsage>>(
      "/complaints/usage"
    );
    return res.data.data!;
  },

  /**
   * Upload image/document attachments to a complaint using multipart form-data.
   */
  async uploadAttachments(
    complaintId: string,
    files: File[],
    type: AttachmentType,
    onUploadProgress?: (progress: number) => void
  ): Promise<Attachment[]> {
    const formData = new FormData();
    formData.append("type", type);
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await apiClient.post<ApiResponse<Attachment[]>>(
      `/complaints/${complaintId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      }
    );
    return res.data.data || [];
  },

  /**
   * List attachments for a complaint.
   */
  async listAttachments(complaintId: string): Promise<Attachment[]> {
    const res = await apiClient.get<ApiResponse<Attachment[]>>(
      `/complaints/${complaintId}/attachments`
    );
    return res.data.data || [];
  },

  /**
   * Delete an attachment by ID.
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/attachments/${attachmentId}`);
  },
};
