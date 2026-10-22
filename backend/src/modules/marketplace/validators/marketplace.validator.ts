import { z } from "zod";
export const tutorParamsSchema = z.object({ tutorId: z.string().trim().uuid() });
export const tutorQuerySchema = z.object({
  universityId: z.string().trim().uuid().optional(),
  specialty: z.string().trim().min(1).optional(),
  verified: z.enum(["true","false"]).optional(),
  maxHourlyRate: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  search: z.string().trim().max(100).optional(),
});
export const createBookingSchema = z.object({
  tutorId: z.string().trim().uuid(),
  studentName: z.string().trim().min(2).max(120),
  studentEmail: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(120),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().trim().min(1).max(80),
  durationHours: z.coerce.number().positive().max(8),
  notes: z.string().trim().max(1000).optional(),
});
export const bookingsQuerySchema = z.object({
  studentEmail: z.string().trim().email().optional(),
  tutorId: z.string().trim().uuid().optional(),
}).refine(v => Boolean(v.studentEmail || v.tutorId), {
  message: "Provide studentEmail or tutorId to look up bookings",
});
export const bookingParamsSchema = z.object({ bookingId: z.string().trim().uuid() });
export const updateBookingSchema = z.object({
  status: z.enum(["REQUESTED","CONFIRMED","COMPLETED","CANCELLED"]),
});
