/**
 * Standard Backend API Response Shapes
 * Matching src/utils/response.ts in City-Complaint-Platform
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface BasePaginationQuery {
  page?: number;
  limit?: number;
}

export type SortOrder = "asc" | "desc";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]> | string[] | unknown;
}
