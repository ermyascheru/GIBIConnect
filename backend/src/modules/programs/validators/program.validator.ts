import { z } from "zod";

export const programQuerySchema = z.object({
  institutionId: z.string().trim().uuid().optional(),
  departmentId: z.string().trim().uuid().optional(),
  degreeLevel: z.enum(["certificate", "diploma", "bachelor", "master", "phd"]).optional(),
  studyMode: z.enum(["full_time", "part_time", "online", "hybrid"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  search: z.string().trim().optional(),
});

export const programParamsSchema = z.object({
  programId: z.string().trim().uuid(),
});
