import type { Role } from "@/types/user";

export interface DemoAccount {
  role: Role;
  name: string;
  email: string;
  password: string;
  department?: string;
  description: string;
  iconName: "User" | "Wrench" | "Briefcase" | "Shield";
  glowColor: string;
  badgeColor: string;
}

/**
 * Seeded credentials matching the backend repository:
 * - prisma/seed.ts & prisma/seed-data.ts
 * - README.md Demo Credentials section
 * - .env.example default seed passwords
 */
export const DEMO_ACCOUNTS: Record<Role, DemoAccount> = {
  CITIZEN: {
    role: "CITIZEN",
    name: "Demo Citizen",
    email: "citizen@example.com",
    password: "Password123!",
    description: "File issues, upload evidence, track status & review service",
    iconName: "User",
    glowColor: "hover:shadow-[0_0_25px_rgba(50,124,105,0.45)] hover:border-[#327c69]",
    badgeColor: "bg-[#327c69]/15 text-[#327c69] dark:text-[#77b7a8] border-[#327c69]/30",
  },
  TECHNICIAN: {
    role: "TECHNICIAN",
    name: "John Tech (Roads)",
    email: "tech1.roads@citycomplaints.com",
    password: "ChangeMeInLocalEnv456!",
    department: "Roads & Infrastructure",
    description: "Inspect assignments, toggle availability & resolve complaints",
    iconName: "Wrench",
    glowColor: "hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:border-[#a855f7]",
    badgeColor: "bg-[#a855f7]/15 text-[#a855f7] dark:text-[#c084fc] border-[#a855f7]/30",
  },
  MANAGER: {
    role: "MANAGER",
    name: "Sarah Connor (Roads Mgr)",
    email: "manager.roads@citycomplaints.com",
    password: "ChangeMeInLocalEnv456!",
    department: "Roads & Infrastructure",
    description: "Triage complaints, assign technicians & escalate emergencies",
    iconName: "Briefcase",
    glowColor: "hover:shadow-[0_0_25px_rgba(192,132,252,0.45)] hover:border-[#c084fc]",
    badgeColor: "bg-[#c084fc]/15 text-[#9333ea] dark:text-[#c084fc] border-[#c084fc]/30",
  },
  ADMIN: {
    role: "ADMIN",
    name: "System Administrator",
    email: "admin@citycomplaints.com",
    password: "ChangeMeInLocalEnv123!",
    description: "Executive dashboards, audit logs, staff apps & platform control",
    iconName: "Shield",
    glowColor: "hover:shadow-[0_0_25px_rgba(239,68,68,0.45)] hover:border-[#ef4444]",
    badgeColor: "bg-[#ef4444]/15 text-[#ef4444] dark:text-[#f87171] border-[#ef4444]/30",
  },
};
