import { z } from "zod";

export const admissionQuerySchema = z.object({
  institutionId: z.string().trim().uuid().optional(),
  programId: z.string().trim().uuid().optional(),
  degreeLevel: z.enum(["certificate", "diploma", "bachelor", "master", "phd"]).optional(),
  search: z.string().trim().optional(),
});

export const admissionParamsSchema = z.object({
  admissionId: z.string().trim().uuid(),
});
