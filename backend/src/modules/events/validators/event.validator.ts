import { z } from "zod";
import { EVENT_CATEGORIES } from "../types/event.types";

const eventCategorySchema = z.enum([
  ...EVENT_CATEGORIES,
  "ALL",
]);

export const eventQuerySchema = z.object({
  category: eventCategorySchema.optional(),
  institutionId: z.string().trim().min(1).optional(),
  isVirtual: z.enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  search: z.string().trim().max(200).optional(),
});

export const eventParamsSchema = z.object({
  eventId: z.string().trim().min(1),
});
