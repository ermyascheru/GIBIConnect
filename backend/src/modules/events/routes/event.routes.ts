import { Router } from "express";
import { getEventsController, getEventByIdController } from "../controllers/event.controller";

const router = Router();

router.get("/", getEventsController);
router.get("/:eventId", getEventByIdController);

export default router;
