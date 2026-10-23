import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6).max(128),
});

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().trim().min(6).max(128),
  fullName: z.string().trim().min(2).max(100),
});
