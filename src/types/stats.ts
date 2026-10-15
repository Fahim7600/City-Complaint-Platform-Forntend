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
  platform?: {
    name: string;
    tagline: string;
    summary: string;
  };
  highlights?: Array<{ title: string; description: string }>;
  howItWorks?: Array<{ step: number; title: string; description: string }>;
  roles?: {
    citizen: string[];
    technician: string[];
    manager: string[];
    admin: string[];
  };
  plans?: {
    free: {
      monthlyComplaintLimit: number;
      priority: string;
      price: number;
      benefits: string[];
    };
    premium: {
      monthlyComplaintLimit: number;
      priority: string;
      price: {
        amount: number;
        currency: string;
        interval: string | null;
      } | null;
      benefits: string[];
    };
    comparison: Array<{
      feature: string;
      free: string;
      premium: string;
    }>;
  };
  faqs?: Array<{ question: string; answer: string }>;
  callsToAction?: {
    register: string;
    login: string;
    upgrade: string;
  };
  stats: PublicStats | null;
  departments: Department[];
  categories: Category[];
  premiumInfo?: PublicPremiumInfo;
  [key: string]: unknown;
}

export interface DepartmentDashboardBreakdown {
  departmentId: string;
  departmentName: string;
  technicianCount: number;
  complaintsByStatus: Record<string, number>;
  totalComplaints: number;
  overdueCount: number;
}

export interface DashboardStats {
  users: {
    byRole: Array<{ role: string; _count: number | { _all: number } }> | Record<string, number>;
    deactivated: number;
  };
  complaints: {
    byStatus: Array<{ status: string; _count: number | { _all: number } }> | Record<string, number>;
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
