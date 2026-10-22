import { findTutors, findTutorById, createBooking, findBookings, updateBookingStatus } from "../repositories/marketplace.repository";
import { TutorQuery, BookingStatus } from "../types/marketplace.types";
export const getTutors = (q: TutorQuery) => findTutors(q);
export const getTutor = (id: string) => findTutorById(id);
export const bookTutor = (v: Parameters<typeof createBooking>[0]) => createBooking(v);
export const getBookings = (email?: string, tutorId?: string) => findBookings(email, tutorId);
export const changeBookingStatus = (id: string, status: BookingStatus) => updateBookingStatus(id, status);
