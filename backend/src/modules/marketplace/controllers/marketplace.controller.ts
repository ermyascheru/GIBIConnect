import { Request, Response } from "express";
import { tutorParamsSchema, tutorQuerySchema, createBookingSchema, bookingsQuerySchema, bookingParamsSchema, updateBookingSchema } from "../validators/marketplace.validator";
import { getTutors, getTutor, bookTutor, getBookings, changeBookingStatus } from "../services/marketplace.service";
const send = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data, timestamp: new Date().toISOString() });
export const getTutorsController = async (req: Request, res: Response): Promise<void> => {
  const p = tutorQuerySchema.parse(req.query);
  send(res, await getTutors({ ...p, verified: p.verified === undefined ? undefined : p.verified === "true" }));
};
export const getTutorController = async (req: Request, res: Response): Promise<void> => {
  const { tutorId } = tutorParamsSchema.parse(req.params); const tutor = await getTutor(tutorId);
  if (!tutor) { res.status(404).json({ success:false, error:{code:"TUTOR_NOT_FOUND",message:"Tutor not found"}, timestamp:new Date().toISOString() }); return; }
  send(res, tutor);
};
export const createBookingController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const booking = await bookTutor(createBookingSchema.parse(req.body));
  res.status(201).json({
    success: true,
    data: booking,
    timestamp: new Date().toISOString(),
  });
};
export const getBookingsController = async (req: Request, res: Response): Promise<void> => {
  const q = bookingsQuerySchema.parse(req.query); send(res, await getBookings(q.studentEmail, q.tutorId));
};
export const updateBookingController = async (req: Request, res: Response): Promise<void> => {
  const { bookingId } = bookingParamsSchema.parse(req.params); const { status } = updateBookingSchema.parse(req.body);
  const booking = await changeBookingStatus(bookingId, status);
  if (!booking) { res.status(404).json({success:false,error:{code:"BOOKING_NOT_FOUND",message:"Booking not found"},timestamp:new Date().toISOString()}); return; }
  send(res, booking);
};
