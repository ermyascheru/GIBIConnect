import { z } from "zod";

export const marketplaceQuerySchema = z.object({
  university: z.string().trim().min(1).optional(),
  specialty: z.string().trim().min(1).optional(),
  isVerified: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  maxHourlyRate: z.coerce.number().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  search: z.string().trim().min(1).optional(),
});

export const tutorParamsSchema = z.object({
  tutorId: z.string().min(1),
});
