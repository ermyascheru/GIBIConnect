import type { Request, Response } from "express";
import {
  getEventById,
  getEvents,
} from "../services/event.service";
import {
  eventParamsSchema,
  eventQuerySchema,
} from "../validators/event.validator";

export const getEventsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = eventQuerySchema.parse(req.query);
  const events = await getEvents(query);

  res.json({
    success: true,
    data: events,
    timestamp: new Date().toISOString(),
  });
};

export const getEventByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eventId } = eventParamsSchema.parse(req.params);
  const event = await getEventById(eventId);

  if (!event) {
    res.status(404).json({
      success: false,
      error: {
        code: "EVENT_NOT_FOUND",
        message: "Event not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: event,
    timestamp: new Date().toISOString(),
  });
};
