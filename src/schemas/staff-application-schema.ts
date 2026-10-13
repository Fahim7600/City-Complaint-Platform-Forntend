import { z } from "zod";

export const staffApplicationFormSchema = z
  .object({
    requestedRole: z.enum(["TECHNICIAN", "MANAGER"], {
      message: "Please select whether you are applying as a Technician or Manager",
    }),
    departmentId: z.string().uuid("Please select a municipal department"),
    experience: z.string().optional(),
    qualification: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.requestedRole === "MANAGER") {
      if (!data.experience?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["experience"],
          message: "Experience is required for Manager applications",
        });
      }
      if (!data.qualification?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["qualification"],
          message: "Qualification is required for Manager applications",
        });
      }
    }
  });

export type StaffApplicationFormData = z.infer<
  typeof staffApplicationFormSchema
>;
