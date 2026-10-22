export interface Tutor {
  id: string; userId: string; name: string; email: string;
  universityName: string | null; specialtySubjects: string[];
  ratingAverage: number; reviewsCount: number; hourlyRateEtb: number;
  isVerified: boolean; bio: string | null; avatarUrl: string | null;
}
export type BookingStatus = "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export interface TutorBooking {
  id: string; tutorId: string; tutorName: string; studentName: string;
  studentEmail: string; subject: string; sessionDate: string; timeSlot: string;
  durationHours: number; totalPriceEtb: number; notes: string | null;
  status: BookingStatus; createdAt: string; updatedAt: string;
}
export interface TutorQuery {
  universityId?: string; specialty?: string; verified?: boolean;
  maxHourlyRate?: number; minRating?: number; search?: string;
}
