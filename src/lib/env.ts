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
});

const processEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
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
