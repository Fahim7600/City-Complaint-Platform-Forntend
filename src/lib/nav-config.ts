import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bell,
  Building2,
  ClipboardCheck,
  CreditCard,
  Crown,
  FileText,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  ScrollText,
  Tag,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import type { Role } from "@/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  CITIZEN: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "My Complaints", href: "/dashboard/complaints", icon: FileText },
    { label: "New Complaint", href: "/dashboard/complaints/new", icon: PlusCircle },
    { label: "Premium Tier", href: "/dashboard/subscription", icon: Crown },
    { label: "Apply as Staff", href: "/dashboard/apply-staff", icon: UserPlus },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  TECHNICIAN: [
    { label: "My Jobs", href: "/technician", icon: Wrench, exact: true },
    { label: "Performance", href: "/technician/performance", icon: TrendingUp },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile & Availability", href: "/technician/profile", icon: UserCheck },
  ],
  MANAGER: [
    { label: "Department Queue", href: "/manager", icon: Inbox, exact: true },
    { label: "My Team", href: "/manager/technicians", icon: Users },
    { label: "Staff Applications", href: "/manager/applications", icon: ClipboardCheck },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/manager/profile", icon: User },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Complaints & Escalations", href: "/admin/complaints", icon: AlertTriangle },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Staff Applications", href: "/admin/applications", icon: ClipboardCheck },
    { label: "Premium Pricing", href: "/admin/pricing", icon: CreditCard },
    { label: "Payments", href: "/admin/payments", icon: Receipt },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ],
};
