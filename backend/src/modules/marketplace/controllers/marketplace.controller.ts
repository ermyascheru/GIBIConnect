import { Request, Response } from "express";
import { 
  getTutors, 
  getTutorById,
  createBooking,
  getBookings,
  changeBookingStatus,
} from "../services/marketplace.service";
import { marketplaceQuerySchema, tutorParamsSchema } from "../validators/marketplace.validator";

export const getTutorsController = async (req: Request, res: Response): Promise<void> => {
  const query = marketplaceQuerySchema.parse(req.query);
  const tutors = await getTutors(query);

  res.json({
    success: true,
    data: tutors,
    timestamp: new Date().toISOString(),
  });
};

export const getTutorByIdController = async (req: Request, res: Response): Promise<void> => {
  const { tutorId } = tutorParamsSchema.parse(req.params);
  const tutor = await getTutorById(tutorId);

  if (!tutor) {
    res.status(404).json({
      success: false,
      error: {
        code: "TUTOR_NOT_FOUND",
        message: "Tutor profile not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: tutor,
    timestamp: new Date().toISOString(),
  });
};

export const createBookingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      tutorId,
      tutorName,
      studentName,
      studentEmail,
      subject,
      sessionDate,
      timeSlot,
      durationHours,
      totalPriceEtb,
      notes,
    } = req.body;

    if (!tutorId || !studentName || !studentEmail || !subject || !sessionDate || !timeSlot) {
      res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Please provide tutorId, studentName, studentEmail, subject, sessionDate, and timeSlot",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const newBooking = await createBooking({
      tutorId,
      tutorName: tutorName || "Verified Peer Tutor",
      studentName,
      studentEmail: studentEmail.trim().toLowerCase(),
      subject,
      sessionDate,
      timeSlot,
      durationHours: Number(durationHours) || 1,
      totalPriceEtb: Number(totalPriceEtb) || 350,
      notes: notes || null,
      status: "REQUESTED",
    });

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Tutor booking requested successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: {
        code: "BOOKING_FAILED",
        message: err.message || "Failed to process tutor booking",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getBookingsController = async (req: Request, res: Response): Promise<void> => {
  const studentEmail = typeof req.query.email === "string" ? req.query.email : undefined;
  const bookings = await getBookings(studentEmail);

  res.json({
    success: true,
    data: bookings,
    timestamp: new Date().toISOString(),
  });
};

export const updateBookingStatusController = async (req: Request, res: Response): Promise<void> => {
  const bookingId = String(req.params.bookingId);
  const { status } = req.body;

  if (!status || !['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_STATUS",
        message: "Status must be REQUESTED, CONFIRMED, COMPLETED, or CANCELLED",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const updated = await changeBookingStatus(bookingId, status);

  if (!updated) {
    res.status(404).json({
      success: false,
      error: {
        code: "BOOKING_NOT_FOUND",
        message: "Booking record not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: updated,
    message: `Booking status updated to ${status}`,
    timestamp: new Date().toISOString(),
  });
};

