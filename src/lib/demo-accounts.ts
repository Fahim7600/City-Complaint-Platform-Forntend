import { env } from "@/lib/env";
import type { Role } from "@/types/user";

export interface DemoAccount {
  role: Role;
  name: string;
  email: string;
  password: string;
  isConfigured: boolean;
  department?: string;
  description: string;
  iconName: "User" | "Wrench" | "Briefcase" | "Shield";
  glowColor: string;
  badgeColor: string;
}

export const getDemoAccounts = (): Record<Role, DemoAccount> => {
  const adminEmail = env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "";
  const adminPassword = env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "";

  const managerEmail = env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || "";
  const managerPassword =
    env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD ||
    env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD ||
    "";

  const technicianEmail = env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL || "";
  const technicianPassword =
    env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD ||
    env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD ||
    "";

  const citizenEmail = env.NEXT_PUBLIC_DEMO_CITIZEN_EMAIL || "";
  const citizenPassword = env.NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD || "";

  return {
    CITIZEN: {
      role: "CITIZEN",
      name: "Demo Citizen",
      email: citizenEmail,
      password: citizenPassword,
      isConfigured: Boolean(citizenEmail && citizenPassword),
      description: "File issues, upload evidence, track status & review service",
      iconName: "User",
      glowColor: "hover:shadow-[0_0_25px_rgba(50,124,105,0.45)] hover:border-[#327c69]",
      badgeColor: "bg-[#327c69]/15 text-[#327c69] dark:text-[#77b7a8] border-[#327c69]/30",
    },
    TECHNICIAN: {
      role: "TECHNICIAN",
      name: "John Tech (Roads)",
      email: technicianEmail,
      password: technicianPassword,
      isConfigured: Boolean(technicianEmail && technicianPassword),
      department: "Roads & Infrastructure",
      description: "Inspect assignments, toggle availability & resolve complaints",
      iconName: "Wrench",
      glowColor: "hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:border-[#a855f7]",
      badgeColor: "bg-[#a855f7]/15 text-[#a855f7] dark:text-[#c084fc] border-[#a855f7]/30",
    },
    MANAGER: {
      role: "MANAGER",
      name: "Sarah Connor (Roads Mgr)",
      email: managerEmail,
      password: managerPassword,
      isConfigured: Boolean(managerEmail && managerPassword),
      department: "Roads & Infrastructure",
      description: "Triage complaints, assign technicians & escalate emergencies",
      iconName: "Briefcase",
      glowColor: "hover:shadow-[0_0_25px_rgba(192,132,252,0.45)] hover:border-[#c084fc]",
      badgeColor: "bg-[#c084fc]/15 text-[#9333ea] dark:text-[#c084fc] border-[#c084fc]/30",
    },
    ADMIN: {
      role: "ADMIN",
      name: "System Administrator",
      email: adminEmail,
      password: adminPassword,
      isConfigured: Boolean(adminEmail && adminPassword),
      description: "Executive dashboards, audit logs, staff apps & platform control",
      iconName: "Shield",
      glowColor: "hover:shadow-[0_0_25px_rgba(239,68,68,0.45)] hover:border-[#ef4444]",
      badgeColor: "bg-[#ef4444]/15 text-[#ef4444] dark:text-[#f87171] border-[#ef4444]/30",
    },
  };
};

export const DEMO_ACCOUNTS: Record<Role, DemoAccount> = getDemoAccounts();
