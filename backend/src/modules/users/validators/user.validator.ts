import { z } from "zod";

export const userQuerySchema = z.object({
  role: z.enum(["guest", "user", "moderator", "admin"]).optional(),
  status: z.enum(["active", "suspended", "deleted"]).optional(),
  search: z.string().trim().optional(),
});

export const userParamsSchema = z.object({
  userId: z.string().trim().uuid(),
});
