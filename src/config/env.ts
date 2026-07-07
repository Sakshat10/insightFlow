import { z } from "zod";

const envSchema = z.object({
  apiBaseUrl: z.string().url().default("http://localhost:8080/api"),
  isDev: z.boolean(),
  sdkUrl: z.string().url().optional(),
});

export const env = envSchema.parse({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  isDev: process.env.NODE_ENV === "development",
  sdkUrl: process.env.NEXT_PUBLIC_INSIGHTFLOW_SDK_URL || process.env.VITE_INSIGHTFLOW_SDK_URL,
});
