import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_URL is required")
    .default("https://city-complaint-platform-1.onrender.com/api/v1"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional().default(""),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_APP_URL is required")
    .default("http://localhost:3000"),

  // Demo Login Credentials
  NEXT_PUBLIC_DEMO_ADMIN_EMAIL: z.string().optional(),
  NEXT_PUBLIC_DEMO_ADMIN_PASSWORD: z.string().optional(),
  NEXT_PUBLIC_DEMO_MANAGER_EMAIL: z.string().optional(),
  NEXT_PUBLIC_DEMO_MANAGER_PASSWORD: z.string().optional(),
  NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL: z.string().optional(),
  NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD: z.string().optional(),
  NEXT_PUBLIC_DEMO_STAFF_PASSWORD: z.string().optional(),
  NEXT_PUBLIC_DEMO_CITIZEN_EMAIL: z.string().optional(),
  NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD: z.string().optional(),
});

const processEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  NEXT_PUBLIC_DEMO_ADMIN_EMAIL: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
  NEXT_PUBLIC_DEMO_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
  NEXT_PUBLIC_DEMO_MANAGER_EMAIL: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL,
  NEXT_PUBLIC_DEMO_MANAGER_PASSWORD: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD,
  NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL,
  NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD,
  NEXT_PUBLIC_DEMO_STAFF_PASSWORD: process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD,
  NEXT_PUBLIC_DEMO_CITIZEN_EMAIL: process.env.NEXT_PUBLIC_DEMO_CITIZEN_EMAIL,
  NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD: process.env.NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(
      parsed.error.flatten().fieldErrors
    )}`
  );
}

export const env = parsed.data;
