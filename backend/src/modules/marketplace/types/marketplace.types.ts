export interface TutorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  universityName: string;
  specialtySubjects: string[];
  ratingAverage: number;
  reviewsCount: number;
  hourlyRateEtb: number;
  isVerified: boolean;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceQuery {
  university?: string;
  specialty?: string;
  isVerified?: boolean;
  maxHourlyRate?: number;
  minRating?: number;
  search?: string;
}

export interface TutorBooking {
  id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  sessionDate: string;
  timeSlot: string;
  durationHours: number;
  totalPriceEtb: number;
  notes?: string | null;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
