import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { Complaint, ComplaintListQuery } from "@/types/complaint";
import type {
  Department,
  DepartmentTechnician,
  DepartmentWithTechnicians,
} from "@/types/department";
import type { ManagerInviteTechnicianInput, User } from "@/types/user";

export const departmentService = {
  /**
   * List all departments (public summary).
   */
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get<ApiResponse<Department[]>>("/departments");
    return res.data.data || [];
  },

  /**
   * Manager queue: retrieves complaints scoped to the authenticated manager's department.
   * Note: The backend's GET /complaints automatically filters by the manager's departmentId.
   */
  async getManagerQueue(
    params?: ComplaintListQuery
  ): Promise<PaginatedData<Complaint>> {
    const res = await apiClient.get<ApiResponse<PaginatedData<Complaint>>>(
      "/complaints",
      { params }
    );
    return res.data.data!;
  },

  /**
   * List technicians for the authenticated manager's department.
   * Includes invitePending / mustChangePassword flags.
   */
  async getMyDepartmentTechnicians(): Promise<DepartmentTechnician[]> {
    const res = await apiClient.get<ApiResponse<DepartmentTechnician[]>>(
      "/departments/my/technicians"
    );
    return res.data.data || [];
  },

  /**
   * List active technicians for a department with ratings and availability (public or specific dept).
   */
  async getMyTechnicians(
    departmentId?: string
  ): Promise<DepartmentTechnician[]> {
    if (!departmentId) {
      return this.getMyDepartmentTechnicians();
    }
    const res = await apiClient.get<ApiResponse<DepartmentTechnician[]>>(
      `/public/departments/${departmentId}/technicians`
    );
    return res.data.data || [];
  },

  /**
   * Invite a new technician into manager's department.
   * Sends temporary password email via Brevo.
   */
  async inviteTechnician(
    data: ManagerInviteTechnicianInput
  ): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>(
      "/departments/my/technicians",
      data
    );
    return res.data.data!;
  },

  /**
   * Resend invitation email with new temporary password to technician.
   */
  async resendInvite(technicianId: string): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>(
      `/departments/my/technicians/${technicianId}/resend-invite`
    );
    return res.data.data!;
  },

  /**
   * Remove a technician from manager's department.
   * Blocked (409) if technician has active ASSIGNED or IN_PROGRESS complaints.
   */
  async removeTechnician(
    technicianId: string
  ): Promise<{ technicianId: string }> {
    const res = await apiClient.delete<
      ApiResponse<{ technicianId: string }>
    >(`/departments/my/technicians/${technicianId}`);
    return res.data.data!;
  },

  /**
   * Get a department by ID with active categories.
   */
  async getDepartmentById(id: string): Promise<DepartmentWithTechnicians> {
    const res = await apiClient.get<ApiResponse<DepartmentWithTechnicians>>(
      `/admin/departments/${id}`
    );
    return res.data.data!;
  },
};

