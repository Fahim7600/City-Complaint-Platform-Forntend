import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedData } from "@/types/api";
import type { Complaint, ComplaintListQuery } from "@/types/complaint";
import type {
  Department,
  DepartmentTechnician,
  DepartmentWithTechnicians,
} from "@/types/department";

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
   * List active technicians for a department with ratings and availability.
   */
  async getMyTechnicians(
    departmentId: string
  ): Promise<DepartmentTechnician[]> {
    const res = await apiClient.get<ApiResponse<DepartmentTechnician[]>>(
      `/public/departments/${departmentId}/technicians`
    );
    return res.data.data || [];
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
