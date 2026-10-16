import type { Category } from "./category";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories?: Category[];
}

export interface DepartmentTechnician {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  avatarUrl: string | null;
  isAvailable: boolean;
  reviewCount: number;
  averageRating: number;
  qualification: string | null;
  experience: string | null;
  invitePending?: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
}

export interface BlockingComplaintsData {
  blockingComplaintIds: string[];
}

export interface DepartmentWithTechnicians {
  department: Department;
  technicians: DepartmentTechnician[];
}

export interface CreateDepartmentInput {
  name: string;
  description?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  description?: string;
}

