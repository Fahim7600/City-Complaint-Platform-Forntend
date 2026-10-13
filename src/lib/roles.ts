import type { Role } from "@/types/user";

export const ROLE_HOME: Record<Role, string> = {
  CITIZEN: "/dashboard",
  TECHNICIAN: "/technician",
  MANAGER: "/manager",
  ADMIN: "/admin",
} as const;

export const ROLE_LABEL: Record<Role, string> = {
  CITIZEN: "Citizen",
  TECHNICIAN: "Technician",
  MANAGER: "Manager",
  ADMIN: "Admin",
} as const;

export const ROLE_ROUTE_PREFIX: Record<string, Role> = {
  "/dashboard": "CITIZEN",
  "/technician": "TECHNICIAN",
  "/manager": "MANAGER",
  "/admin": "ADMIN",
};

export const isAllowedPathForRole = (path: string, role: Role): boolean => {
  // Common protected paths
  if (path.startsWith("/notifications")) return true;

  for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTE_PREFIX)) {
    if (path.startsWith(prefix)) {
      return role === requiredRole;
    }
  }

  return true;
};
