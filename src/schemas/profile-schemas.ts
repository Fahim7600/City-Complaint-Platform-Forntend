import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\+\-\s\(\)]*$/, "Invalid phone number format")
    .refine((val) => val === "" || val.length >= 7, {
      message: "Phone number must be at least 7 characters long",
    })
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .url("Invalid avatar URL format")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    (data) =>
      !(data.currentPassword && data.currentPassword === data.newPassword),
    {
      message: "New password cannot be identical to current password",
      path: ["newPassword"],
    }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
