import { Router } from "express";
import { 
  getTutorsController, 
  getTutorByIdController,
  createBookingController,
  getBookingsController,
  updateBookingStatusController,
} from "../controllers/marketplace.controller";

const router = Router();

router.get("/tutors", getTutorsController);
router.get("/tutors/:tutorId", getTutorByIdController);

router.post("/bookings", createBookingController);
router.get("/bookings", getBookingsController);
router.patch("/bookings/:bookingId", updateBookingStatusController);

export default router;
