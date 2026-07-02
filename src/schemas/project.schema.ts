import { z } from "zod";

export const createProjectSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be under 100 characters")
    .trim(),
  domain: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      // Simple domain regex
      const pattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      return pattern.test(val);
    }, "Please provide a valid domain name (e.g. example.com)"),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
