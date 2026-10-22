import { TutorProfile, MarketplaceQuery, TutorBooking } from "../types/marketplace.types";
import { 
  findTutors, 
  findTutorById,
  createBookingRecord,
  listBookings,
  updateBookingStatus,
} from "../repositories/marketplace.repository";

export const getTutors = async (query: MarketplaceQuery): Promise<TutorProfile[]> => {
  return findTutors(query);
};

export const getTutorById = async (id: string): Promise<TutorProfile | null> => {
  return findTutorById(id);
};

export const createBooking = async (
  booking: Omit<TutorBooking, "id" | "createdAt" | "updatedAt">
): Promise<TutorBooking> => {
  return createBookingRecord(booking);
};

export const getBookings = async (studentEmail?: string): Promise<TutorBooking[]> => {
  return listBookings(studentEmail);
};

export const changeBookingStatus = async (
  id: string,
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
): Promise<TutorBooking | null> => {
  return updateBookingStatus(id, status);
};
