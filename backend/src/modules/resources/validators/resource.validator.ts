import { z } from "zod";

export const resourceQuerySchema = z.object({
  institutionId: z.string().trim().uuid().optional(),
  programId: z.string().trim().uuid().optional(),
  facultyId: z.string().trim().uuid().optional(),
  departmentId: z.string().trim().uuid().optional(),
  resourceType: z.enum(["document", "spreadsheet", "presentation", "ebook", "video", "audio", "research"]).optional(),
  status: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
  visibility: z.enum(["public", "restricted", "private"]).optional(),
  search: z.string().trim().optional(),
});

export const resourceParamsSchema = z.object({
  resourceId: z.string().trim().uuid(),
});
