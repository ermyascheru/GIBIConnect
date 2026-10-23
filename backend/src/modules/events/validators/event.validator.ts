import { z } from "zod";

export const eventQuerySchema = z.object({
  category: z.string().optional(),
  institutionId: z.string().uuid().optional(),
  isVirtual: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  search: z.string().trim().min(1).optional(),
});

export const eventParamsSchema = z.object({
  eventId: z.string().min(1),
});
