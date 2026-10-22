import { Router } from "express";
import { getTutorsController, getTutorController, createBookingController, getBookingsController, updateBookingController } from "../controllers/marketplace.controller";
const router = Router();
router.get("/tutors", getTutorsController);
router.get("/tutors/:tutorId", getTutorController);
router.post("/bookings", createBookingController);
router.get("/bookings", getBookingsController);
router.patch("/bookings/:bookingId", updateBookingController);
export default router;
