import type { Department } from "./department";

export interface Category {
  id: string;
  name: string;
  departmentId: string;
  slaHours: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  department?: Department;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  slaHours?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  slaHours?: number;
}
