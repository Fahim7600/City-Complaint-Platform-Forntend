import { z } from "zod";
import { Priority } from "@/types/complaint";

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const FREE_TIER_MAX_FILES = 5;
export const PREMIUM_TIER_MAX_FILES = 10;

export const step1CategorySchema = z.object({
  categoryId: z.string().uuid("Please select a category to continue"),
});

export type Step1CategoryInput = z.infer<typeof step1CategorySchema>;

export const step2DetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description cannot exceed 1000 characters"),
  priority: z
    .enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH])
    .default(Priority.MEDIUM),
});

export type Step2DetailsInput = z.infer<typeof step2DetailsSchema>;

export const step3LocationSchema = z.object({
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(255, "Location cannot exceed 255 characters"),
});

export type Step3LocationInput = z.infer<typeof step3LocationSchema>;
