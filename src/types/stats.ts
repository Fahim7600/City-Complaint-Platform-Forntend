import type { Category } from "./category";
import type { Department } from "./department";
import type { PublicPremiumInfo } from "./payment";

export interface PublicStats {
  totalComplaints: number;
  resolvedCount: number;
  resolutionRate: number;
  averageResolutionHours: number;
  countsByStatus: Record<string, number>;
}

export interface PublicOverview {
  platformName?: string;
  tagline?: string;
  stats: PublicStats;
  departments: Department[];
  categories: Category[];
  premiumInfo: PublicPremiumInfo;
  features?: Array<{ title: string; description: string; icon?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  [key: string]: unknown;
}

export interface DepartmentDashboardBreakdown {
  departmentId: string;
  departmentName: string;
  technicianCount: number;
  complaintsByStatus: Record<string, number>;
  totalComplaints: number;
}

export interface DashboardStats {
  users: {
    byRole: Record<string, number>;
    deactivated: number;
  };
  complaints: {
    byStatus: Record<string, number>;
    overdue: number;
  };
  revenue: {
    totalCents: number;
  };
  departments: DepartmentDashboardBreakdown[];
}

export interface TechnicianPerformance {
  totalAssigned: number;
  totalResolved: number;
  inProgress: number;
  overdueCount: number;
  averageRating: number;
  reviewCount: number;
  averageResolutionHours: number;
  reopenCount: number;
}
