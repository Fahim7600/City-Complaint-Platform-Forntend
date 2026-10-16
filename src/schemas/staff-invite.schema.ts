import { z } from "zod";

export const managerInviteTechnicianSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s\-()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type ManagerInviteTechnicianFormData = z.infer<
  typeof managerInviteTechnicianSchema
>;

export const adminInviteStaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s\-()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  role: z.enum(["TECHNICIAN", "MANAGER"], {
    message: "Role must be TECHNICIAN or MANAGER",
  }),
  departmentId: z.string().uuid("Please select a department"),
});

export type AdminInviteStaffFormData = z.infer<typeof adminInviteStaffSchema>;
