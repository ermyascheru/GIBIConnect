import { z } from "zod";

export const institutionQuerySchema = z.object({
  region: z.string().optional(),
  ownership: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
});

export const institutionParamsSchema = z.object({
  institutionId: z.string().trim().uuid(),
});