import { z } from "zod";

export const financeQuerySchema = z.object({
  institutionId: z.string().trim().uuid().optional(),
  programId: z.string().trim().uuid().optional(),
  currency: z.string().trim().min(1).optional(),
  search: z.string().trim().optional(),
});

export const financeParamsSchema = z.object({
  tuitionFeeId: z.string().trim().uuid(),
});
