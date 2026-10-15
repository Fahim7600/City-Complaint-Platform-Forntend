import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  departmentId: z
    .string()
    .min(1, "Please select an assigned department"),
  slaHours: z
    .number()
    .int("SLA hours must be a whole number")
    .positive("SLA hours must be greater than zero"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
